import {LambdaPricing, LambdaRegionalPricing} from "../client/LambdaClient";
import {FargatePricing, FargateRegionalPricing} from "../client/FargateClient";
import {EC2InstancePricing, EC2OSPricing} from "../client/Ec2Client";
import {FargateConfig} from "../logic/FargateConfig";
import {AppRunnerPricing, AppRunnerRegionalPricing} from "../client/AppRunnerClient";

type LambdaParams = {
    avgResponseTimeInMs: number
    minuteReq: number
    dailyReq: number
    monthlyReq: number
    lambdaSize: number
    freeTier: boolean
}

export type AppRunnerConfig = {
    enabled: boolean
    rpmPerTask: number
}

export type ContainersParams = {
    fargateConfig: FargateConfig
    numberOfTasks: number
    appRunnerConfig: AppRunnerConfig
}

export type EC2Params = {
    instanceType: string;
    instancePricing: EC2OSPricing;
    numberOfInstances: number;
}

export function getInstanceType(input: EC2OSPricing): string {
    return input.Linux?.product?.instanceType || input.Windows?.product?.instanceType || ""
}

type State = {
    region: string

    lambdaParams: LambdaParams
    lambdaPricing: LambdaRegionalPricing
    lambdaRegionalPricing: LambdaPricing

    containersParams: ContainersParams
    fargateConfigs: FargateConfig[]
    fargatePricing: FargateRegionalPricing
    fargateRegionalPricing: FargatePricing
    appRunnerPricing: AppRunnerPricing
    appRunnerRegionalPricing: AppRunnerRegionalPricing

    ec2Params: EC2Params
    ec2Pricing: EC2InstancePricing
}

export type {LambdaParams, State}
