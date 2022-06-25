import * as lambdaFallback from "../fallback/lambda.json";
import {paths} from "./urls";
import {api} from "./TypedFetch";

const groupsOfInterest: Map<string, Function> = new Map([
    ["AWS-Lambda-Duration", (x: LambdaPricing) => x],
    ["AWS-Lambda-Requests", (x: LambdaPricing) => x],
    ["AWS-Lambda-Duration-ARM", (x: LambdaPricing) => x],
    ["AWS-Lambda-Requests-ARM", (x: LambdaPricing) => x]
]);

type AWSLambdaPricingResponse = {
    products: Record<string, AWSLambdaProduct>
    terms: AWSLambdaTerms
}

type AWSLambdaProduct = {
    sku: string
    attributes: {
        servicecode: string
        regionCode: string
        group: string
    }
}

type AWSLambdaTerms = {
    OnDemand: Record<string, Record<string, AWSLambdaTerm>>
}

type AWSLambdaTerm = {
    sku: string
    priceDimensions: Record<string, AWSLambdaPriceDimension>
}

type AWSLambdaPriceDimension = {
    rateCode: string
    unit: string
    pricePerUnit: {
        USD: number
    }
}

type LambdaPriceDimension = {
    product: AWSLambdaProduct
    pricing: AWSLambdaPriceDimension

    group: string
    region: string
    priceUSD: number
}

type LambdaPricingResponse = {
    regionPrices: Map<String, LambdaPricing>
}

type LambdaPricing = {
    arm: LambdaPriceComponents
    x86: LambdaPriceComponents
}

type LambdaPriceComponents = {
    lambdaGbSecond?: number
    requests?: number
}

async function downloadLambdaPrice(): Promise<AWSLambdaPricingResponse> {
    return await api.get(paths.lambdaUrl)
}

function buildLambdaPricing(product: AWSLambdaProduct, onDemand: Record<string, AWSLambdaTerm>): LambdaPriceDimension | undefined {
    for (const [, value] of Object.entries(onDemand)) {
        if (value.sku === product.sku && Object.values(value.priceDimensions).length > 0) {
            const lambdaPricing = Object.values(value.priceDimensions)[0]
            return {
                product: product,
                pricing: lambdaPricing,
                group: product.attributes.group,
                region: product.attributes.regionCode,
                priceUSD: lambdaPricing.pricePerUnit.USD
            }
        }
    }
}

function getPriceDimensionsByRegion(responseBody: AWSLambdaPricingResponse) {
    const regionPrices = new Map<String, Map<String, LambdaPriceDimension>>();
    for (const [, product] of Object.entries(responseBody.products)) {
        if (groupsOfInterest.has(product.attributes.group)) {
            const region = product.attributes.regionCode
            const priceDimension = buildLambdaPricing(product, responseBody.terms.OnDemand[product.sku])
            if (!priceDimension) {
                continue
            }
            if (regionPrices.has(region)) {
                (regionPrices.get(region) || new Map()).set(priceDimension.group, priceDimension)
            } else {
                regionPrices.set(region, new Map([[priceDimension.group, priceDimension]]))
            }
        }
    }
    return regionPrices;
}

function buildLambdaPricingResponse(regionPrices: Map<String, Map<String, LambdaPriceDimension>>): LambdaPricingResponse {
    const result = new Map<String, LambdaPricing>();

    for (let [region, dimensions] of Array.from(regionPrices.entries())) {
        result.set(region, {
            x86: {
                lambdaGbSecond: dimensions.get("AWS-Lambda-Duration")?.priceUSD,
                requests: dimensions.get("AWS-Lambda-Requests")?.priceUSD
            },
            arm: {
                lambdaGbSecond: dimensions.get("AWS-Lambda-Duration-ARM")?.priceUSD,
                requests: dimensions.get("AWS-Lambda-Requests-ARM")?.priceUSD
            }
        })
    }
    return {
        regionPrices: result
    };
}

export async function getLambdaPrice() {
    try {
        const responseBody: AWSLambdaPricingResponse = await downloadLambdaPrice()
        const regionPrices = getPriceDimensionsByRegion(responseBody);
        return buildLambdaPricingResponse(regionPrices)
    } catch (e) {
        console.error(`Loading Lambda prices failed with ${e}`)
        return lambdaFallback
    }
}
