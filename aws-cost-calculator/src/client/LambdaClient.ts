import * as lambdaFallback from "../fallback/lambda.json";
import {paths} from "./urls";
import {api} from "./TypedFetch";

export type LambdaRegionalPricing = {
    regionPrices: Record<string, LambdaPricing>
}

export type LambdaPricing = {
    arm: LambdaPriceComponents
    x86: LambdaPriceComponents
}

export type LambdaPriceComponents = {
    lambdaGbSecond?: string
    requests?: string
}

async function downloadLambdaPrice(): Promise<LambdaRegionalPricing> {
    return await api.get(paths.lambdaUrl)
}

export async function getLambdaPrice(): Promise<LambdaRegionalPricing> {
    try {
        return await downloadLambdaPrice()
    } catch (e) {
        console.error(`Loading Lambda prices failed with ${e}`)
        return Promise.resolve(lambdaFallback)
    }
}
