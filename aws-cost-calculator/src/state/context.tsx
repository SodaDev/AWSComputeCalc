import React from "react";
import {State} from "./State";
import {Action} from "./actions";
import lambdaFallback from "../fallback/lambda.json";
import fargateFallback from "../fallback/fargate.json";
import {getFargateSpotFallback} from "../client/FargateSpotClient";
import {getEc2Fallback} from "../client/Ec2Client";
import {FargateConfig} from "../components/FargateParameters";

const defaultRegion = "eu-west-1"
const initialState: State = {
    region: defaultRegion,
    lambdaParams: {
        avgResponseTimeInMs: 100,
        minuteReq: 2000,
        dailyReq: 2000 * 60 * 24,
        monthlyReq: 2000 * 60 * 24 * 30,
        lambdaSize: 128
    },
    fargateParams: {
        fargateConfig: new FargateConfig(2, 4),
        numberOfTasks: 2
    },
    lambdaPricing: lambdaFallback,
    lambdaRegionalPricing: lambdaFallback.regionPrices[defaultRegion],
    fargateSpotPricing: getFargateSpotFallback(),
    fargateSpotRegionalPricing: getFargateSpotFallback().regionPrices[defaultRegion],
    fargatePricing: fargateFallback,
    fargateRegionalPricing: fargateFallback.regionPrices[defaultRegion],
    ec2Pricing: getEc2Fallback()
};

const defaultDispatch: React.Dispatch<Action> = () => initialState
const AppContext = React.createContext({
    state: initialState,
    dispatch: defaultDispatch,
});

export {
    initialState,
    AppContext
}

