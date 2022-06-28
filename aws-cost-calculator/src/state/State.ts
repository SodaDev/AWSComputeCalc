import {LambdaPricing, LambdaRegionalPricing} from "../client/LambdaClient";
import {FargateSpotPricing, FargateSpotRegionalPricing} from "../client/FargateSpotClient";
import {FargatePricing, FargateRegionalPricing} from "../client/FargateClient";
import {EC2InstancePricing} from "../client/Ec2Client";

type LambdaParams = {
    avgResponseTimeInMs: number
    minuteReq: number
    dailyReq: number
    monthlyReq: number
    lambdaSize: number
}
type State = {
    region: string
    lambdaParams: LambdaParams
    lambdaPricing: LambdaRegionalPricing
    lambdaRegionalPricing: LambdaPricing
    fargateSpotPricing: FargateSpotRegionalPricing
    fargateSpotRegionalPricing: FargateSpotPricing
    fargatePricing: FargateRegionalPricing
    fargateRegionalPricing: FargatePricing
    ec2Pricing: EC2InstancePricing
}

export type {LambdaParams, State}