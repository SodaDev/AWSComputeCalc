import {LambdaPricing, LambdaRegionalPricing} from "../client/LambdaClient";
import {FargateSpotRegionalPricing} from "../client/FargateSpotClient";
import {FargatePricing, FargateComputePricing, FargateRegionalPricing} from "../client/FargateClient";
import {EC2InstancePricing} from "../client/Ec2Client";
import {FargateConfig} from "../components/FargateParameters";

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

type State = {
    region: string
    lambdaParams: LambdaParams
    fargateParams: FargateParams
    lambdaPricing: LambdaRegionalPricing
    lambdaRegionalPricing: LambdaPricing
    fargateSpotPricing: FargateSpotRegionalPricing
    fargateSpotRegionalPricing: FargateComputePricing
    fargatePricing: FargateRegionalPricing
    fargateRegionalPricing: FargatePricing
    ec2Pricing: EC2InstancePricing
}

export type {LambdaParams, State}
