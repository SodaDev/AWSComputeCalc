import {ContainersParams, EC2Params, LambdaParams, State} from "../state/State";
import {LambdaPriceComponents} from "../client/LambdaClient";
import {Serie} from "@nivo/line";
import {ContainerComputePricing} from "../client/FargateClient";
import _ from "lodash";

const dataPoints = 25

type SerieGenerator = (name: string, serieColor: string, generator: SeriePointGenerator) => Serie[]
type SeriePointGenerator = ((a: number) => number) | undefined

export function generateSeries(state: State): Serie[] {
    const xAxis = buildXAxis(state.lambdaParams);
    const seriesGenerator = buildSerie(xAxis)
    const series =
        seriesGenerator("Lambda ARM", "#b4e8db", lambdaSeriesGenerator(state.lambdaRegionalPricing.arm, state.lambdaParams))
        .concat(seriesGenerator("Lambda x86", "#18dbab", lambdaSeriesGenerator(state.lambdaRegionalPricing.x86, state.lambdaParams)))
        .concat(seriesGenerator("Fargate spot x86", "#005F73", containerSerieGenerator(state.containersParams, state.fargateRegionalPricing.spot)))
        .concat(seriesGenerator("Fargate spot windows", "#E9D8A6", containerSerieGenerator(state.containersParams, state.fargateRegionalPricing.windows)))
        .concat(seriesGenerator("Fargate x86", "#EE9B00", containerSerieGenerator(state.containersParams, state.fargateRegionalPricing.x86)))
        .concat(seriesGenerator("Fargate arm", "#9B2226", containerSerieGenerator(state.containersParams, state.fargateRegionalPricing.arm)))
        .concat(seriesGenerator("EC2 Linux On-Demand", "#f47560", ec2SerieGenerator(state.ec2Params, () => state.ec2Params.instancePricing.Linux?.onDemandPricing)))
        .concat(seriesGenerator("EC2 Linux Spot", "#f1e15b", ec2SerieGenerator(state.ec2Params, () => state.ec2Params.instancePricing.Linux?.spotPricing)))
        .concat(seriesGenerator("EC2 Linux Reserved 1-year", "#DA627D", ec2SerieGenerator(state.ec2Params, () => state.ec2Params.instancePricing.Linux?.reservedPricing?.standard?.["1yr"])))
        .concat(seriesGenerator("EC2 Linux Reserved 3-year", "#450920", ec2SerieGenerator(state.ec2Params, () => state.ec2Params.instancePricing.Linux?.reservedPricing?.standard?.["3yr"])))
        .concat(seriesGenerator("EC2 Windows On-Demand", "#84A98C", ec2SerieGenerator(state.ec2Params, () => state.ec2Params.instancePricing.Windows?.onDemandPricing)))
        .concat(seriesGenerator("EC2 Windows Spot", "#354F52", ec2SerieGenerator(state.ec2Params, () => state.ec2Params.instancePricing.Windows?.spotPricing)))
        .concat(seriesGenerator("EC2 Windows Reserved 1-year", "#99582A", ec2SerieGenerator(state.ec2Params, () => state.ec2Params.instancePricing.Windows?.reservedPricing?.standard?.["1yr"])))
        .concat(seriesGenerator("EC2 Windows Reserved 3-year", "#BB9457", ec2SerieGenerator(state.ec2Params, () => state.ec2Params.instancePricing.Windows?.reservedPricing?.standard?.["3yr"])))
        .concat(seriesGenerator("AppRunner", "#8053ab", appRunnerSerieGenerator(state.containersParams, state.appRunnerPricing)))

    return _.sortBy(series, x => x.id).reverse()
}

function buildSerie(xAxis: number[]): SerieGenerator {
    return (name: string, serieColor: string, generator: SeriePointGenerator): Serie[] => {
        if (!generator) {
            return []
        }

        return [{
            id: name,
            color: serieColor,
            data: xAxis.map(x => ({
                x: x,
                y: generator(x)
            }))
        }]
    }
}

function ec2SerieGenerator(ec2Params: EC2Params, extractor: () => string | undefined): SeriePointGenerator {
    const cost = extractor()
    if (!ec2Params.numberOfInstances || ec2Params.numberOfInstances < 1 || cost === undefined) {
        return undefined
    }
    return __ => calculateEc2PricePoint(ec2Params.numberOfInstances, Number(cost))
}

function appRunnerSerieGenerator(containersParams: ContainersParams, pricing: ContainerComputePricing): SeriePointGenerator {
    if (!pricing.GBHour || !pricing.vCPUHour) {
        return undefined
    }
    if (containersParams.appRunnerConfig?.enabled && containersParams.appRunnerConfig?.rpmPerTask) {
        const gbHourPricing = parseFloat(pricing.GBHour)
        const vCpuPricing = parseFloat(pricing.vCPUHour)

        const concurrentRequests = containersParams.appRunnerConfig.rpmPerTask / 60

        return requests => {
            const rps = requests / 30 / 24 / 60 / 60
            const tasks =  Math.ceil(rps / concurrentRequests)

            return tasks * calculateFargatePricePoint(containersParams, gbHourPricing, vCpuPricing)
        }
    }
    return undefined;
}

function containerSerieGenerator(containersParams: ContainersParams, pricing: ContainerComputePricing): SeriePointGenerator {
    if (!pricing.GBHour || !pricing.vCPUHour || !containersParams.numberOfTasks || containersParams.numberOfTasks < 1) {
        return undefined
    }
    const gbHourPricing = parseFloat(pricing.GBHour)
    const vCpuPricing = parseFloat(pricing.vCPUHour)
    const fargatePricing = containersParams.numberOfTasks * calculateFargatePricePoint(containersParams, gbHourPricing, vCpuPricing)

    return __ => fargatePricing
}

function lambdaSeriesGenerator(pricing: LambdaPriceComponents, lambdaParams: LambdaParams): SeriePointGenerator {
    if (!lambdaParams.avgResponseTimeInMs || !pricing.lambdaGbSecond || !pricing.requests || !lambdaParams.monthlyReq) {
        return undefined
    }
    const gbSecondPrice = parseFloat(pricing.lambdaGbSecond || "0");
    const invocationPrice = parseFloat(pricing.requests || "0")
    const freeTierInvocations = lambdaParams.freeTier ? 1000000 : 0;
    const freeTierGbs = lambdaParams.freeTier ? 400000 : 0;

    return requests => calculateLambdaPricePointRaw(requests, lambdaParams, gbSecondPrice, invocationPrice, freeTierInvocations, freeTierGbs)
}

function buildXAxis(lambdaParams: LambdaParams): number[] {
    return Array.from(Array(dataPoints).keys())
        .map(point => (point + 1) * (lambdaParams.monthlyReq || 1) / dataPoints);
}

function calculateLambdaPricePointRaw(requests: number, lambdaParams: LambdaParams,
                                      gbSecondPrice: number, invocationPrice: number,
                                      freeTierInvocations: number, freeTierGbs: number): number {
    const totalComputeSeconds = requests * lambdaParams.avgResponseTimeInMs / 1000;
    const totalComputeGbs = (totalComputeSeconds * lambdaParams.lambdaSize / 1024) - freeTierGbs;
    const computeCost = totalComputeGbs * gbSecondPrice;
    const invocationCost = (requests - freeTierInvocations) * invocationPrice;
    return Math.max(computeCost, 0) + Math.max(invocationCost, 0)
}

function calculateFargatePricePoint(containersParams: ContainersParams, gbPrice: number, vCPUPrice: number): number {
    const taskPricePerHour = containersParams.fargateConfig.memory * gbPrice + containersParams.fargateConfig.vCPU * vCPUPrice
    return taskPricePerHour * 24 * 30;
}

function calculateEc2PricePoint(numberOfInstances: number, hourCost: number): number {
    return numberOfInstances * hourCost * 24 * 30;
}