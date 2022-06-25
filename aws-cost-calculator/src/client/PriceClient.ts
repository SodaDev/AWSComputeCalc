import * as fargateFallback from "../fallback/fargateSpot.json"
import * as lambdaFallback from "../fallback/lambda.json"

type FargateSpotPrice = {
    unit: string
    price: Map<string, number>
    attributes: Map<string, number>
}

type FargatePriceResponse = {
    prices: Array<FargateSpotPrice>
}

export async function getFargatePrice() {
    try {
        const responseBody: FargatePriceResponse = await fetch(`https://dftu77xade0tc.cloudfront.net/fargate-spot-prices.json?timestamp=${new Date().getTime()}`, {
            method: "GET",
            mode: "no-cors"
        }).then(response => response.json());

        return responseBody
    } catch (e) {
        console.error(`Loading Fargate spot failed with ${e}`)
        return fargateFallback
    }
}
