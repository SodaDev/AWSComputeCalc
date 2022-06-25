import {LambdaRegionalPricing} from "../client/LambdaClient";

type Action =
    {type: "LAMBDA_SET_RPM", amount: number}
    | {type: "LAMBDA_SET_DAILY", amount: number}
    | {type: "LAMBDA_SET_MONTHLY", amount: number}
    | {type: "LAMBDA_SET_SIZE", amount: number}
    | {type: "LAMBDA_SET_PRICING", pricing: LambdaRegionalPricing}

export type { Action };