import {LambdaPricing, LambdaRegionalPricing} from "./client/LambdaClient";

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
}

export type {LambdaParams, State}
