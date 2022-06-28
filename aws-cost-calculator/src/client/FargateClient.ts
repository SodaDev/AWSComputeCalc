import {api} from "./TypedFetch";
import {paths} from "./urls";

const usageTypesOfInterest: Set<string> = new Set([
    "Fargate-ARM-GB-Hours",
    "Fargate-vCPU-Hours:perCPU",
    "Fargate-GB-Hours",
    "Fargate-ARM-vCPU-Hours:perCPU"
]);

type AWSFargatePricingResponse = {
    products: Record<string, AWSFargateProduct>
    terms: AWSFargateTerms
}

type AWSFargateProduct = {
    sku: string
    attributes: {
        regionCode: string
        usagetype: string
    }
}

type AWSFargateTerms = {
    OnDemand: Record<string, Record<string, AWSFargateTerm>>
}

type AWSFargateTerm = {
    sku: string
    priceDimensions: Record<string, AWSFargatePriceDimension>
}

type AWSFargatePriceDimension = {
    description: string
    unit: string
    pricePerUnit: {
        USD: string
    }
}

type FargatePriceDimension = {
    product: AWSFargateProduct
    pricing: AWSFargatePriceDimension

    usageType: string
    region: string
    priceUSD: string
}

export type FargatePricing = {
    x86: FargatePricingComponents
    arm: FargatePricingComponents
}

export type FargatePricingComponents = {
    GBHour?: string
    vCPUHour?: string
}

export type FargateRegionalPricing = {
    regionPrices: Record<string, FargatePricing>
}

async function downloadFargatePrice(): Promise<AWSFargatePricingResponse> {
    return await api.get(paths.fargateUrl)
}

export async function getFargatePrice(): Promise<FargateRegionalPricing> {
    try {
        const response = await downloadFargatePrice()
        const regionPrices = getPriceDimensionsByRegion(response);
        return buildFargatePricingResponse(regionPrices)
    } catch (e) {
        console.error(`Loading Fargate prices failed with ${e}`)
        return Promise.reject(e)
    }
}

function normalizeUsageType(usagetype: string) {
    for (let usageType of Array.from(usageTypesOfInterest)) {
        if (usagetype.endsWith(usageType)) {
            return usageType
        }
    }

    return "N/A"
}

function getPriceDimensionsByRegion(responseBody: AWSFargatePricingResponse) {
    const regionPrices = new Map<string, Map<string, FargatePriceDimension>>();
    for (const [, product] of Object.entries(responseBody.products)) {
        if (usageTypesOfInterest.has(normalizeUsageType(product.attributes.usagetype))) {
            const region = product.attributes.regionCode
            const priceDimension = buildFargatePricing(product, responseBody.terms.OnDemand[product.sku])
            if (!priceDimension) {
                continue
            }
            if (regionPrices.has(region)) {
                (regionPrices.get(region) || new Map()).set(priceDimension.usageType, priceDimension)
            } else {
                regionPrices.set(region, new Map([[priceDimension.usageType, priceDimension]]))
            }
        }
    }
    return regionPrices;
}

function buildFargatePricing(product: AWSFargateProduct, onDemand: Record<string, AWSFargateTerm>): FargatePriceDimension | undefined {
    for (const [, value] of Object.entries(onDemand)) {
        if (value.sku === product.sku && Object.values(value.priceDimensions).length > 0) {
            const lambdaPricing = Object.values(value.priceDimensions)[0]
            return {
                product: product,
                pricing: lambdaPricing,

                usageType: normalizeUsageType(product.attributes.usagetype),
                region: product.attributes.regionCode,
                priceUSD: lambdaPricing.pricePerUnit.USD
            }
        }
    }
}

function buildFargatePricingResponse(regionPrices: Map<string, Map<string, FargatePriceDimension>>): FargateRegionalPricing {
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