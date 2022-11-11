import {ContainersParams, EC2Params, LambdaParams, State} from "../state/State";
import {LambdaPriceComponents} from "../client/LambdaClient";
import {Serie} from "@nivo/line";
import {ContainerComputePricing} from "../client/FargateClient";

const dataPoints = 25

type SerieGenerator = (name: string, generator: SeriePointGenerator) => Serie[]
type SeriePointGenerator = ((a: number) => number) | undefined

export function generateSeries(state: State): Serie[] {
    const xAxis = buildXAxis(state.lambdaParams);
    const seriesGenerator = buildSerie(xAxis)
    return seriesGenerator("Lambda ARM", lambdaSeriesGenerator(state.lambdaRegionalPricing.arm, state.lambdaParams))
        .concat(seriesGenerator("Lambda x86", lambdaSeriesGenerator(state.lambdaRegionalPricing.x86, state.lambdaParams)))
        .concat(seriesGenerator("Fargate spot x86", containerSerieGenerator(state.containersParams, state.fargateSpotRegionalPricing)))
        .concat(seriesGenerator("Fargate x86", containerSerieGenerator(state.containersParams, state.fargateRegionalPricing.x86)))
        .concat(seriesGenerator("Fargate arm", containerSerieGenerator(state.containersParams, state.fargateRegionalPricing.arm)))
        .concat(seriesGenerator("EC2", ec2SerieGenerator(state.ec2Params)))
        .concat(seriesGenerator("EC2 spot", ec2SpotSerieGenerator(state.ec2Params)))
        .concat(seriesGenerator("AppRunner", appRunnerSerieGenerator(state.containersParams, state.appRunnerPricing)))
}

function buildSerie(xAxis: number[]): SerieGenerator {
    return (name: string, generator: SeriePointGenerator): Serie[] => {
        if (!generator) {
            return []
        }

        return [{
            id: name,
            data: xAxis.map(x => ({
                x: x,
                y: generator(x)
            }))
        }]
    }
}

function ec2SerieGenerator(ec2Params: EC2Params): SeriePointGenerator {
    if (!ec2Params.numberOfInstances || ec2Params.numberOfInstances < 1) {
        return undefined
    }
    return __ => calculateEc2PricePoint(ec2Params.numberOfInstances, ec2Params.instanceType.Cost)
}

function ec2SpotSerieGenerator(ec2Params: EC2Params): SeriePointGenerator {
    if (!ec2Params.instanceType.SpotPrice || ec2Params.instanceType.SpotPrice === "NA" || !ec2Params.numberOfInstances || ec2Params.numberOfInstances < 1) {
        return undefined
    }
    return __ => calculateEc2PricePoint(ec2Params.numberOfInstances, parseFloat(ec2Params.instanceType.SpotPrice))
}

function appRunnerSerieGenerator(containersParams: ContainersParams, pricing: ContainerComputePricing): SeriePointGenerator {
    if (!pricing.GBHour || !pricing.vCPUHour) {
        return undefined
    }
    if (containersParams.appRunnerConfig?.enabled && containersParams.appRunnerConfig?.rpsPerTask) {
        const gbHourPricing = parseFloat(pricing.GBHour)
        const vCpuPricing = parseFloat(pricing.vCPUHour)

        const concurrentRequests = containersParams.appRunnerConfig.rpsPerTask

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
    if (!lambdaParams.avgResponseTimeInMs || !pricing.lambdaGbSecond || !pricing.requests) {
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