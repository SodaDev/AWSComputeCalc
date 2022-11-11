export type AWSPricingResponse = {
    products: Record<string, AWSProduct>
    terms: AWSTerms
}

export type AWSProduct = {
    sku: string
    attributes: {
        regionCode: string
        usagetype: string
    }
}

export type AWSTerm = {
    sku: string
    priceDimensions: Record<string, AWSPriceDimension>
}

export type AWSPriceDimension = {
    description: string
    unit: string
    pricePerUnit: {
        USD: string
    }
}

type AWSTerms = {
    OnDemand: Record<string, Record<string, AWSTerm>>
}

export type PriceDimension = {
    product: AWSProduct
    pricing: AWSPriceDimension

    usageType: string
    region: string
    priceUSD: string
}

export function getPriceDimensionsByRegion(responseBody: AWSPricingResponse, usageTypesOfInterest: Set<string>): Map<string, Map<string, PriceDimension>> {
    const regionPrices = new Map<string, Map<string, PriceDimension>>();
    for (const [, product] of Object.entries(responseBody.products)) {
        if (usageTypesOfInterest.has(normalizeUsageType(product.attributes.usagetype, usageTypesOfInterest))) {
            const region = product.attributes.regionCode
            const priceDimension = buildPriceDimension(product, responseBody.terms.OnDemand[product.sku], usageTypesOfInterest)
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

function normalizeUsageType(usagetype: string, usageTypesOfInterest: Set<string>) {
    for (let usageType of Array.from(usageTypesOfInterest)) {
        if (usagetype.endsWith(usageType)) {
            return usageType
        }
    }

    return "N/A"
}

function buildPriceDimension(product: AWSProduct, onDemand: Record<string, AWSTerm>, usageTypesOfInterest: Set<string>): PriceDimension | undefined {
    for (const [, value] of Object.entries(onDemand)) {
        if (value.sku === product.sku && Object.values(value.priceDimensions).length > 0) {
            const lambdaPricing = Object.values(value.priceDimensions)[0]
            return {
                product: product,
                pricing: lambdaPricing,

                usageType: normalizeUsageType(product.attributes.usagetype, usageTypesOfInterest),
                region: product.attributes.regionCode,
                priceUSD: lambdaPricing.pricePerUnit.USD
            }
        }
    }
}