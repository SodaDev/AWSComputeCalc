import {api} from "./TypedFetch";
import {paths} from "./urls";
import {getPriceDimensionsByRegion, PriceDimension} from "./AwsModel";
import fallback from "../fallback/apprunner.json"

export type AppRunnerPricing = {
    GBHour?: string
    vCPUHour?: string
    ProvisionedGBHour?: string
}

export type AppRunnerRegionalPricing = {
    regionPrices: Record<string, AppRunnerPricing>
}


const usageTypesOfInterest: Set<string> = new Set([
    "AppRunner-Provisioned-GB-hours",
    "AppRunner-vCPU-hours",
    "AppRunner-GB-hours"
]);

async function downloadAppRunnerPrice(): Promise<any> {
    return await api.get(paths.appRunnnerUrl)
}

export function getAppRunnerFallback(): AppRunnerRegionalPricing {
    return fallback
}

export async function getAppRunnerPrice(): Promise<AppRunnerRegionalPricing> {
    try {
        const response = await downloadAppRunnerPrice()
        const regionPrices = getPriceDimensionsByRegion(response, usageTypesOfInterest);

        return buildAppRunnerPricingResponse(regionPrices)
    } catch (e) {
        console.error(`Loading Fargate prices failed with ${e}`)
        return Promise.reject(e)
    }
}

function buildAppRunnerPricingResponse(regionPrices: Map<string, Map<string, PriceDimension>>): AppRunnerRegionalPricing {
    const result: Record<string, AppRunnerPricing> = {}

    for (let [region, dimensions] of Array.from(regionPrices.entries())) {
        result[region] = {
            GBHour: dimensions.get("AppRunner-GB-hours")?.priceUSD,
            vCPUHour: dimensions.get("AppRunner-vCPU-hours")?.priceUSD,
            ProvisionedGBHour: dimensions.get("AppRunner-Provisioned-GB-hours")?.priceUSD
        }
    }
    return {
        regionPrices: result
    };
}

