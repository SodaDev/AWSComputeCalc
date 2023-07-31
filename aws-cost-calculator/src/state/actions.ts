import {LambdaRegionalPricing} from "../client/LambdaClient";
import {FargateRegionalPricing} from "../client/FargateClient";
import {EC2InstancePricing, EC2OSPricing} from "../client/Ec2Client";
import {FargateConfig} from "../logic/FargateConfig";
import {AppRunnerRegionalPricing} from "../client/AppRunnerClient";
import {LambdaInterval} from "./State";

type Action =
    { type: "SET_REGION", region: string }

    | { type: "LAMBDA_SET_REQUESTS", amount: number }
    | { type: "LAMBDA_SET_INTERVAL", interval: LambdaInterval }
    | { type: "LAMBDA_SET_SIZE", amount: number }
    | { type: "LAMBDA_SET_AVG_RESPONSE_TIME", amount: number }
    | { type: "LAMBDA_SET_PRICING", pricing: LambdaRegionalPricing }
    | { type: "LAMBDA_SET_FREE_TIER", enabled: boolean }

    | { type: "CONTAINERS_SET_SIZE", config: FargateConfig }
    | { type: "CONTAINERS_SET_TASKS", amount: number }
    | { type: "CONTAINERS_SET_APP_RUNNER_RPS", amount: number }

    | { type: "FARGATE_SET_PRICING", pricing: FargateRegionalPricing }
    | { type: "APP_RUNNER_PRICING", pricing: AppRunnerRegionalPricing }

    | { type: "EC2_SET_INSTANCES", amount: number }
    | { type: "EC2_SET_INSTANCE_TYPE", instanceType: EC2OSPricing | undefined }
    | { type: "EC2_SET_PRICING", pricing: EC2InstancePricing }


export type {Action};

export function toLambdaSetPricing(pricing: LambdaRegionalPricing): Action {
    return {
        type: "LAMBDA_SET_PRICING",
        pricing
    }
}

export function toFargateSetPricing(pricing: FargateRegionalPricing): Action {
    return {
        type: "FARGATE_SET_PRICING",
        pricing
    }
}

export function toEc2SetPricing(pricing: EC2InstancePricing): Action {
    return {
        type: "EC2_SET_PRICING",
        pricing
    }
}

export function toAppRunnerPricing(pricing: AppRunnerRegionalPricing): Action {
    return {
        type: "APP_RUNNER_PRICING",
        pricing
    }
}