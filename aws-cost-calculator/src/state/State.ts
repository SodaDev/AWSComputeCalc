import {LambdaPricing, LambdaRegionalPricing} from "../client/LambdaClient";
import {FargateSpotRegionalPricing} from "../client/FargateSpotClient";
import {FargatePricing, FargateComputePricing, FargateRegionalPricing} from "../client/FargateClient";
import {EC2InstancePricing, EC2InstanceTypePricing} from "../client/Ec2Client";
import {FargateConfig} from "../components/parameters/FargateParameters";

type LambdaParams = {
    avgResponseTimeInMs: number
    minuteReq: number
    dailyReq: number
    monthlyReq: number
    lambdaSize: number
}

export type FargateParams = {
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

    fargateParams: FargateParams
    fargateSpotPricing: FargateSpotRegionalPricing
    fargateSpotRegionalPricing: FargateComputePricing
    fargatePricing: FargateRegionalPricing
    fargateRegionalPricing: FargatePricing

    ec2Params: EC2Params
    ec2Pricing: EC2InstancePricing
}

export type {LambdaParams, State}
