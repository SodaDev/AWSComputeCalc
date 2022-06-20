import React from "react";
import {State} from "../State";
import {Action} from "./actions";

const initialState: State = {
    lambdaParams: {
        minuteReq: 2000,
        dailyReq: 2000 * 60 * 24,
        monthlyReq: 2000 * 60 * 24 * 30,
    }
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

