import {api} from "./TypedFetch";
import {paths} from "./urls";

export type FargatePricing = {
    x86: ContainerComputePricing
    arm: ContainerComputePricing
    spot: ContainerComputePricing
    windows: ContainerComputePricing
}

export type ContainerComputePricing = {
    GBHour?: string
    vCPUHour?: string
}

export type FargateRegionalPricing = {
    regionPrices: Record<string, FargatePricing>
}

async function downloadFargatePrice(): Promise<FargateRegionalPricing> {
    return await api.get(paths.fargateUrl)
}

export async function getFargatePrice(): Promise<FargateRegionalPricing> {
    try {
        return await downloadFargatePrice()
    } catch (e) {
        console.error(`Loading Fargate prices failed with ${e}`)
        return Promise.reject(e)
    }
}
