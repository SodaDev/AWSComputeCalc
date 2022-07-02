import {LambdaRegionalPricing} from "../client/LambdaClient";
import {FargateSpotRegionalPricing} from "../client/FargateSpotClient";
import {FargateRegionalPricing} from "../client/FargateClient";
import {EC2InstanceTypePricing, EC2InstancePricing} from "../client/Ec2Client";
import {FargateConfig} from "../components/FargateParameters";

type Action =
    {type: "LAMBDA_SET_RPM", amount: number}
    | {type: "LAMBDA_SET_DAILY", amount: number}
    | {type: "LAMBDA_SET_MONTHLY", amount: number}
    | {type: "LAMBDA_SET_SIZE", amount: number}
    | {type: "LAMBDA_SET_AVG_RESPONSE_TIME", amount: number}
    | {type: "LAMBDA_SET_PRICING", pricing: LambdaRegionalPricing}

    | {type: "FARGATE_SET_SIZE", config: FargateConfig}
    | {type: "FARGATE_SET_TASKS", amount: number}
    | {type: "FARGATE_SPOT_SET_PRICING", pricing: FargateSpotRegionalPricing }
    | {type: "FARGATE_SET_PRICING", pricing: FargateRegionalPricing }

    | {type: "EC2_SET_INSTANCES", amount: number }
    | {type: "EC2_SET_INSTANCE_TYPE", instanceType: EC2InstanceTypePricing }
    | {type: "EC2_SET_PRICING", pricing: EC2InstancePricing }

export type { Action };