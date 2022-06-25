import {LambdaRegionalPricing} from "./client/LambdaClient";

type LambdaParams = {
    minuteReq: number
    dailyReq: number
    monthlyReq: number
    lambdaSize: number
}
type State = {
    region: string
    lambdaParams: LambdaParams
    lambdaPricing: LambdaRegionalPricing
}

export type {LambdaParams, State}
