import {LambdaParams} from "../State";
import {LambdaPriceComponents, LambdaPricing} from "../client/LambdaClient";
import {Serie} from "@nivo/line";

const dataPoints = 25

export function generateSeries(pricing: LambdaPricing, lambdaParams: LambdaParams): Serie[] {
    const series = []
    if (pricing.arm.lambdaGbSecond && pricing.arm.requests) {
        series.push(buildLambdaSeries("Lambda ARM", pricing.arm, lambdaParams))
    }
    if (pricing.x86.lambdaGbSecond && pricing.x86.requests) {
        series.push(buildLambdaSeries("Lambda x86", pricing.x86, lambdaParams))
    }

    return series
}

function buildLambdaSeries(name: string, pricing: LambdaPriceComponents, lambdaParams: LambdaParams): Serie {
    const gbSecondCost = (lambdaParams.lambdaSize / 1024) * parseFloat(pricing.lambdaGbSecond || "")
    const invocationTime = lambdaParams.avgResponseTimeInMs / 1000
    const requestCost = gbSecondCost * invocationTime
    const invocationCost = parseFloat(pricing.requests || "");
    return {
        id: name,
        data: Array.from(Array(dataPoints).keys())
            .map(point => (point + 1) * lambdaParams.monthlyReq / dataPoints)
            .map(point => ({
                x: point,
                y: calculateLambdaPricePoint(point, requestCost, invocationCost)
            }))

    }
}

export function calculateLambdaPricePoint(requests: number, requestCost: number, invocationCost: number): number {
    return requests * requestCost + requests * invocationCost
}