import {State} from "../state/State";
import {Convert, FargateUrlParams, URLParams} from "./UrlParams";

export function updateUrl(state: State) {
    const hash = btoa(JSON.stringify(stateToUrlParam(state)))
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?config=${hash}`;
    window.history.pushState({path: newUrl}, '', newUrl);
}

export function initStateFromUrl(state: State): State {
    try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const config = urlParams.get('config')

        if (!config) {
            return state
        }

        const shareParams: URLParams = Convert.toURLParams(atob(config))
        const fargateConfig = getFargateConfig(state, shareParams.fargateParams || {})
        return {
            ...state,
            lambdaParams: {
                minuteReq: shareParams.lambdaParams?.minuteReq || state.lambdaParams.minuteReq,
                dailyReq: shareParams.lambdaParams?.dailyReq || state.lambdaParams.dailyReq,
                monthlyReq: shareParams.lambdaParams?.monthlyReq || state.lambdaParams.monthlyReq,
                lambdaSize: shareParams.lambdaParams?.lambdaSize || state.lambdaParams.lambdaSize,
                avgResponseTimeInMs: shareParams.lambdaParams?.avgResponseTimeInMs || state.lambdaParams.avgResponseTimeInMs,
                freeTier: shareParams.lambdaParams?.freeTier || state.lambdaParams.freeTier,
            },
            containersParams: {
                numberOfTasks: shareParams.fargateParams?.numberOfTasks || state.containersParams.numberOfTasks,
                fargateConfig: fargateConfig,
                appRunnerConfig: shareParams.fargateParams?.appRunnerConfig || state.containersParams.appRunnerConfig
            },
            ec2Params: {
                numberOfInstances: shareParams.ec2Params?.numberOfInstances || state.ec2Params.numberOfInstances,
                instanceType: shareParams.ec2Params?.instanceType ? state.ec2Pricing.instancePrices[shareParams.ec2Params.instanceType] || state.ec2Params.instanceType : state.ec2Params.instanceType
            }
        };
    } catch (e) {
        console.error("Failed to apply URL param", e)
        return state
    }
}

function stateToUrlParam(state: State): URLParams {
    return {
        lambdaParams: state.lambdaParams,
        fargateParams: state.containersParams,
        ec2Params: {
            instanceType: state.ec2Params.instanceType.InstanceType,
            numberOfInstances: state.ec2Params.numberOfInstances
        }
    };
}

function getFargateConfig(state: State, fargateParams: FargateUrlParams) {
    for (let fargateConfig of state.fargateConfigs) {
        if (fargateConfig.memory == fargateParams.fargateConfig?.memory
            && fargateConfig.vCPU == fargateParams.fargateConfig?.vCPU) {
            return fargateConfig
        }
    }
    return state.containersParams.fargateConfig;
}