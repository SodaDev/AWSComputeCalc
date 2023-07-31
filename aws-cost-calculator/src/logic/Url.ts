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
        const instanceType = shareParams.ec2Params?.instanceType || state.ec2Params.instanceType
        return {
            ...state,
            lambdaParams: {
                requests: shareParams.lambdaParams?.requests || state.lambdaParams.requests,
                interval: state.lambdaIntervals.find(x => x.label === shareParams.lambdaParams?.interval) || state.lambdaParams.interval,
                lambdaSize: shareParams.lambdaParams?.lambdaSize || state.lambdaParams.lambdaSize,
                avgResponseTimeInMs: shareParams.lambdaParams?.avgResponseTimeInMs || state.lambdaParams.avgResponseTimeInMs,
                freeTier: shareParams.lambdaParams?.freeTier || state.lambdaParams.freeTier,
            },
            containersParams: {
                numberOfTasks: shareParams.fargateParams?.numberOfTasks !== undefined ? shareParams.fargateParams?.numberOfTasks : state.containersParams.numberOfTasks,
                fargateConfig: fargateConfig,
                appRunnerConfig: shareParams.fargateParams?.appRunnerConfig || state.containersParams.appRunnerConfig
            },
            ec2Params: {
                numberOfInstances: shareParams.ec2Params?.numberOfInstances !== undefined ? shareParams.ec2Params?.numberOfInstances : state.ec2Params.numberOfInstances,
                instanceType: instanceType,
                instancePricing: state.ec2Pricing.instancePrices[instanceType]
            }
        };
    } catch (e) {
        console.error("Failed to apply URL param", e)
        return state
    }
}

function stateToUrlParam(state: State): URLParams {
    return {
        lambdaParams: {
            avgResponseTimeInMs: state.lambdaParams.avgResponseTimeInMs,
            requests: state.lambdaParams.requests,
            interval: state.lambdaParams.interval.label,
            lambdaSize: state.lambdaParams.lambdaSize,
            freeTier: state.lambdaParams.freeTier
        },
        fargateParams: state.containersParams,
        ec2Params: {
            instanceType: state.ec2Params.instanceType,
            numberOfInstances: state.ec2Params.numberOfInstances
        }
    };
}

function getFargateConfig(state: State, fargateParams: FargateUrlParams) {
    for (let fargateConfig of state.fargateConfigs) {
        if (fargateConfig.memory === fargateParams.fargateConfig?.memory
            && fargateConfig.vCPU === fargateParams.fargateConfig?.vCPU) {
            return fargateConfig
        }
    }
    return state.containersParams.fargateConfig;
}