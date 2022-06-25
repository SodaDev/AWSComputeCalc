import React from "react";
import {State} from "../State";
import {Action} from "./actions";
import lambdaFallback from "../fallback/lambda.json";

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
    lambdaPricing: lambdaFallback,
    lambdaRegionalPricing: lambdaFallback.regionPrices[defaultRegion]
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

