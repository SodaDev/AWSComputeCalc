import {LambdaRegionalPricing} from "../client/LambdaClient";
import {FargateSpotRegionalPricing} from "../client/FargateSpotClient";

type Action =
    {type: "LAMBDA_SET_RPM", amount: number}
    | {type: "LAMBDA_SET_DAILY", amount: number}
    | {type: "LAMBDA_SET_MONTHLY", amount: number}
    | {type: "LAMBDA_SET_SIZE", amount: number}
    | {type: "LAMBDA_SET_AVG_RESPONSE_TIME", amount: number}
    | {type: "LAMBDA_SET_PRICING", pricing: LambdaRegionalPricing}
    | {type: "FARGATE_SPOT_SET_PRICING", pricing: FargateSpotRegionalPricing }

export type { Action };