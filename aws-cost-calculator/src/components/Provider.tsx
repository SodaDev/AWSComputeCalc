import {Action, toAppRunnerPricing, toEc2SetPricing, toFargateSetPricing, toLambdaSetPricing} from "../state/actions";
import {reducer} from "../state/reducer";
import {AppContext, initialState} from "../state/context";
import {State} from "../state/State";
import {Dispatch, useEffect, useReducer} from "react";
import {getEc2Price} from "../client/Ec2Client";
import {getFargatePrice} from "../client/FargateClient";
import {getLambdaPrice} from "../client/LambdaClient";
import {getAppRunnerPrice} from "../client/AppRunnerClient";

export default function Provider(props: React.PropsWithChildren<{}>) {
    const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initialState)
    useEffect(() => {
        initData(state, dispatch);
    }, []);
    return <AppContext.Provider value={{state, dispatch}} {...props} />
}

async function initData(state: State, dispatch: Dispatch<Action>) {
    console.log("initData")
    getEc2Price("eu-west-1")
        .then(response => dispatch(toEc2SetPricing(response)))
        .catch(console.error)
    getFargatePrice()
        .then(response => dispatch(toFargateSetPricing(response)))
        .catch(console.error)
    getLambdaPrice()
        .then(response => dispatch(toLambdaSetPricing(response)))
        .catch(console.error)
    getAppRunnerPrice()
        .then(response => dispatch(toAppRunnerPricing(response)))
        .catch(console.error)
}