import React from "react";
import {LambdaInterval, State} from "./State";
import {Action} from "./actions";
import lambdaFallback from "../fallback/lambda.json";
import fargateFallback from "../fallback/fargate.json";
import {getEc2Fallback} from "../client/Ec2Client";
import {buildFargateConfigs, FargateConfig} from "../logic/FargateConfig";
import {initStateFromUrl} from "../logic/Url";
import {getAppRunnerFallback} from "../client/AppRunnerClient";

const defaultRegion = "eu-west-1"

const buildLambdaIntervals = () : LambdaInterval[] => {
    return [
        {
            label: "second",
            multiplier: 60 * 60 * 24 * 30
        },
        {
            label: "minute",
            multiplier: 60 * 24 * 30
        },
        {
            label: "hour",
            multiplier: 24 * 30
        },
        {
            label: "daily",
            multiplier: 30
        },
        {
            label: "monthly",
            multiplier: 1
        }
    ]
}

const initialState: State = initStateFromUrl({
    region: defaultRegion,
    lambdaParams: {
        avgResponseTimeInMs: 100,
        requests: 2000,
        interval: buildLambdaIntervals()[1],
        lambdaSize: 128,
        freeTier: false
    },
    lambdaIntervals: buildLambdaIntervals(),
    lambdaPricing: lambdaFallback,
    lambdaRegionalPricing: lambdaFallback.regionPrices[defaultRegion],

    containersParams: {
        fargateConfig: new FargateConfig(2, 4),
        numberOfTasks: 2,
        appRunnerConfig: {
            enabled: true,
            rpmPerTask: 6000
        }
    },
    fargateConfigs: buildFargateConfigs(),
    fargatePricing: fargateFallback,
    fargateRegionalPricing: fargateFallback.regionPrices[defaultRegion],

    ec2Params: {
        numberOfInstances: 2,
        instanceType: "t3.medium"
    },
    ec2Pricing: getEc2Fallback(),

    appRunnerRegionalPricing: getAppRunnerFallback().regionPrices[defaultRegion],
    appRunnerPricing: getAppRunnerFallback(),

    eventsParams: {
        avgPayloadSize: 1000,
        consumers: 1,
        events: 10e9,
        shards: 1
    }
});

const defaultDispatch: React.Dispatch<Action> = () => initialState
const AppContext = React.createContext({
    state: initialState,
    dispatch: defaultDispatch,
});

export {
    initialState,
    AppContext
}

