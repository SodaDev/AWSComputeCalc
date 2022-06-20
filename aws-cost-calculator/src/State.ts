type LambdaParams = {
    minuteReq: number
    dailyReq?: number
    monthlyReq?: number
}
type State = {
    lambdaParams: LambdaParams
}

export type {LambdaParams, State}
