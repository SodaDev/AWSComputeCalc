import {LambdaPricing, LambdaRegionalPricing} from "../client/LambdaClient";
import {FargatePricing, FargateRegionalPricing} from "../client/FargateClient";
import {EC2InstancePricing, EC2OSPricing} from "../client/Ec2Client";
import {FargateConfig} from "../logic/FargateConfig";
import {AppRunnerPricing, AppRunnerRegionalPricing} from "../client/AppRunnerClient";

export type LambdaInterval = {
    label: string
    multiplier: number
}

type LambdaParams = {
    avgResponseTimeInMs: number
    lambdaSize: number
    requests: number
    interval: LambdaInterval
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
    numberOfInstances: number;
}

export function getInstanceType(input: EC2OSPricing): string {
    return input.Linux?.product?.instanceType || input.Windows?.product?.instanceType || ""
}

type State = {
    region: string

    lambdaParams: LambdaParams
    lambdaPricing?: LambdaRegionalPricing
    lambdaRegionalPricing?: LambdaPricing
    lambdaIntervals: LambdaInterval[]

    containersParams: ContainersParams
    fargateConfigs: FargateConfig[]
    fargatePricing?: FargateRegionalPricing
    fargateRegionalPricing?: FargatePricing
    appRunnerPricing?: AppRunnerRegionalPricing
    appRunnerRegionalPricing?: AppRunnerPricing

    ec2Params: EC2Params
    ec2Pricing?: EC2InstancePricing
}

export type {LambdaParams, State}
