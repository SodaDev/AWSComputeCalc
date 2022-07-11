import {EC2Params, FargateParams, LambdaParams, State} from "../state/State";
import {LambdaPriceComponents} from "../client/LambdaClient";
import {Serie} from "@nivo/line";
import {FargateComputePricing} from "../client/FargateClient";

const dataPoints = 25

type SerieGenerator = (name: string, generator: SeriePointGenerator) => Serie[]
type SeriePointGenerator = ((a: number) => number) | undefined

export function generateSeries(state: State): Serie[] {
    const xAxis = buildXAxis(state.lambdaParams);
    const seriesGenerator = buildSerie(xAxis)
    return seriesGenerator( "Lambda ARM", lambdaSeriesGenerator(state.lambdaRegionalPricing.arm, state.lambdaParams))
        .concat(seriesGenerator( "Lambda x86", lambdaSeriesGenerator(state.lambdaRegionalPricing.x86, state.lambdaParams)))
        .concat(seriesGenerator( "Fargate spot x86", fargateSerieGenerator(state.fargateParams, state.fargateSpotRegionalPricing)))
        .concat(seriesGenerator("Fargate x86", fargateSerieGenerator(state.fargateParams, state.fargateRegionalPricing.x86)))
        .concat(seriesGenerator("Fargate arm", fargateSerieGenerator(state.fargateParams, state.fargateRegionalPricing.arm)))
        .concat(seriesGenerator("EC2", ec2SerieGenerator(state.ec2Params)))
        .concat(seriesGenerator("EC2 spot", ec2SpotSerieGenerator(state.ec2Params)))
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

function fargateSerieGenerator(fargateParams: FargateParams, pricing: FargateComputePricing): SeriePointGenerator {
    if (!pricing.GBHour || !pricing.vCPUHour || !fargateParams.numberOfTasks || fargateParams.numberOfTasks < 1) {
        return undefined
    }
    const gbHourPricing = parseFloat(pricing.GBHour)
    const vCpuPricing = parseFloat(pricing.vCPUHour)
    const fargatePricing = calculateFargatePricePoint(fargateParams, gbHourPricing, vCpuPricing)

    return __ => fargatePricing
}

function lambdaSeriesGenerator(pricing: LambdaPriceComponents, lambdaParams: LambdaParams): SeriePointGenerator {
    if (!pricing.lambdaGbSecond || !pricing.requests) {
        return undefined
    }
    const gbSecondCost = (lambdaParams.lambdaSize / 1024) * parseFloat(pricing.lambdaGbSecond || "")
    const invocationTime = lambdaParams.avgResponseTimeInMs / 1000
    const requestCost = gbSecondCost * invocationTime
    const invocationCost = parseFloat(pricing.requests || "");

    return requests => calculateLambdaPricePoint(requests, requestCost, invocationCost)
}

function buildXAxis(lambdaParams: LambdaParams): number[] {
    return Array.from(Array(dataPoints).keys())
        .map(point => (point + 1) * lambdaParams.monthlyReq / dataPoints);
}

function calculateLambdaPricePoint(requests: number, requestCost: number, invocationCost: number): number {
    return requests * requestCost + requests * invocationCost
}

function calculateFargatePricePoint(fargateParams: FargateParams, gbPrice: number, vCPUPrice: number): number {
    const taskPricePerHour = fargateParams.fargateConfig.memory * gbPrice + fargateParams.fargateConfig.vCPU * vCPUPrice
    return fargateParams.numberOfTasks * taskPricePerHour * 24 * 30;
}

function calculateEc2PricePoint(numberOfInstances: number, hourCost: number): number {
    return numberOfInstances * hourCost * 24 * 30;
}