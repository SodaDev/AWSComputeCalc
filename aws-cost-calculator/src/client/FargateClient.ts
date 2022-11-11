import {api} from "./TypedFetch";
import {paths} from "./urls";
import {AWSPricingResponse, getPriceDimensionsByRegion, PriceDimension} from "./AwsModel";

const usageTypesOfInterest: Set<string> = new Set([
    "Fargate-ARM-GB-Hours",
    "Fargate-vCPU-Hours:perCPU",
    "Fargate-GB-Hours",
    "Fargate-ARM-vCPU-Hours:perCPU"
]);

export type FargatePricing = {
    x86: FargateComputePricing
    arm: FargateComputePricing
}

export type FargateComputePricing = {
    GBHour?: string
    vCPUHour?: string
}

export type FargateRegionalPricing = {
    regionPrices: Record<string, FargatePricing>
}

async function downloadFargatePrice(): Promise<AWSPricingResponse> {
    return await api.get(paths.fargateUrl)
}

export async function getFargatePrice(): Promise<FargateRegionalPricing> {
    try {
        const response = await downloadFargatePrice()
        const regionPrices = getPriceDimensionsByRegion(response, usageTypesOfInterest);
        return buildFargatePricingResponse(regionPrices)
    } catch (e) {
        console.error(`Loading Fargate prices failed with ${e}`)
        return Promise.reject(e)
    }
}

function buildFargatePricingResponse(regionPrices: Map<string, Map<string, PriceDimension>>): FargateRegionalPricing {
    const result: Record<string, FargatePricing> = {}

    for (let [region, dimensions] of Array.from(regionPrices.entries())) {
        result[region] = {
            x86: {
                GBHour: dimensions.get("Fargate-GB-Hours")?.priceUSD,
                vCPUHour: dimensions.get("Fargate-vCPU-Hours:perCPU")?.priceUSD
            },
            arm: {
                GBHour: dimensions.get("Fargate-ARM-GB-Hours")?.priceUSD,
                vCPUHour: dimensions.get("Fargate-ARM-vCPU-Hours:perCPU")?.priceUSD
            }
        }
    }
    return {
        regionPrices: result
    };
}