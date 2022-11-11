import {LambdaPricing, LambdaRegionalPricing} from "../client/LambdaClient";
import {FargateSpotRegionalPricing} from "../client/FargateSpotClient";
import {FargatePricing, ContainerComputePricing, FargateRegionalPricing} from "../client/FargateClient";
import {EC2InstancePricing, EC2InstanceTypePricing} from "../client/Ec2Client";
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

export type ContainersParams = {
    fargateConfig: FargateConfig
    numberOfTasks: number
}

export type EC2Params = {
    instanceType: EC2InstanceTypePricing
    numberOfInstances: number
}

type State = {
    region: string

    lambdaParams: LambdaParams
    lambdaPricing: LambdaRegionalPricing
    lambdaRegionalPricing: LambdaPricing

    containersParams: ContainersParams
    fargateConfigs: FargateConfig[]
    fargateSpotPricing: FargateSpotRegionalPricing
    fargateSpotRegionalPricing: ContainerComputePricing
    fargatePricing: FargateRegionalPricing
    fargateRegionalPricing: FargatePricing
    appRunnerPricing: AppRunnerPricing
    appRunnerRegionalPricing: AppRunnerRegionalPricing

    ec2Params: EC2Params
    ec2Pricing: EC2InstancePricing
}

export type {LambdaParams, State}
