import {LambdaPricing, LambdaRegionalPricing} from "./client/LambdaClient";
import {FargateSpotPricing, FargateSpotRegionalPricing} from "./client/FargateSpotClient";

type LambdaParams = {
    avgResponseTimeInMs: number
    minuteReq: number
    dailyReq: number
    monthlyReq: number
    lambdaSize: number
}
type State = {
    region: string
    lambdaParams: LambdaParams
    lambdaPricing: LambdaRegionalPricing
    lambdaRegionalPricing: LambdaPricing
    fargateSpotPricing: FargateSpotRegionalPricing
    fargateSpotRegionalPricing: FargateSpotPricing
}

export type {LambdaParams, State}
