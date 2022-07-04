import fargateFallback from "../fallback/fargateSpot.json"
import {api} from "./TypedFetch";
import {paths} from "./urls";
import {FargateComputePricing} from "./FargateClient";

const vCPUHourUnit = "vCPU-Hours"
const gbHourUnit = "GB-Hours"
const units: Set<string> = new Set([vCPUHourUnit, gbHourUnit]);

type AWSFargateSpotPrice = {
    unit: string
    price: {
        USD: string
    }
    attributes: {
        "aws:region": string
        "aws:label": string
    }
}

type AWSFargatePriceResponse = {
    prices: AWSFargateSpotPrice[]
}

type FargateSpotPriceDimension = {
    region: string
    unit: string
    priceUSD: string
}

export type FargateSpotRegionalPricing = {
    regionPrices: Record<string, FargateComputePricing>
}

async function downloadFargateSpotPrice(): Promise<AWSFargatePriceResponse> {
    return await api.get(paths.fargateSpotUrl, {
        mode: "no-cors"
    })
}

export function getFargateSpotFallback(): FargateSpotRegionalPricing {
    return buildFargateSpotPricingResponse(getPriceDimensionsByRegion(fargateFallback.prices))
}

export async function getFargateSpotPrice(): Promise<FargateSpotRegionalPricing> {
    try {
        const awsFargateSpotPricing = await downloadFargateSpotPrice();

        const priceDimensionsPerRegion = getPriceDimensionsByRegion(awsFargateSpotPricing.prices)
        return buildFargateSpotPricingResponse(priceDimensionsPerRegion)
    } catch (e) {
        console.error(`Loading Fargate spot failed with ${e}`)
        return Promise.reject(e)
    }
}

function getPriceDimensionsByRegion(prices: AWSFargateSpotPrice[]): Map<string, Map<string, FargateSpotPriceDimension>> {
    const regionPrices = new Map<string, Map<string, FargateSpotPriceDimension>>();
    for (let price of prices) {
        if (units.has(price.unit)) {
            const region = price.attributes["aws:region"];
            const priceDimension = {
                region: region,
                unit: price.unit,
                priceUSD: price.price.USD
            }
            if (regionPrices.has(region)) {
                (regionPrices.get(region) || new Map()).set(priceDimension.unit, priceDimension)
            }
            else {
                regionPrices.set(region, new Map([[priceDimension.unit, priceDimension]]))
            }
        }
    }
    return regionPrices
}

function buildFargateSpotPricingResponse(regionPrices: Map<string, Map<string, FargateSpotPriceDimension>>): FargateSpotRegionalPricing {
    const result: Record<string, FargateComputePricing> = {}
    for (let [region, dimensions] of Array.from(regionPrices)) {
        const vCpuPricing = dimensions.get(vCPUHourUnit);
        const memoryPricing = dimensions.get(gbHourUnit);
        if (vCpuPricing && memoryPricing) {
            result[region] = {
                GBHour: memoryPricing.priceUSD,
                vCPUHour: vCpuPricing.priceUSD
            }
        }
    }

    return {
        regionPrices: result
    }
}
