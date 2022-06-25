import React from "react";
import {State} from "../State";
import {Action} from "./actions";
import * as lambdaFallback from "../fallback/lambda.json";

const defaultRegion = "eu-west-1"
const initialState: State = {
    region: defaultRegion,
    lambdaParams: {
        minuteReq: 2000,
        dailyReq: 2000 * 60 * 24,
        monthlyReq: 2000 * 60 * 24 * 30,
        lambdaSize: 128
    },
    lambdaPricing: lambdaFallback
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

