import {State} from "./State";
import {Action} from "./actions";
import {updateUrl} from "../logic/Url";
import ReactGA from "react-ga";
import {EC2InstanceTypePricing} from "../client/Ec2Client";
import {FargateConfig, isAppRunnerEnabled} from "../logic/FargateConfig";
import * as _ from 'lodash'

const rpmToDaily = (i: number): number => Math.round(i * 60 * 24)
const rpmToMonthly = (i: number): number => Math.round(rpmToDaily(i) * 30)
const sendInputMetric = _.debounce(sendEvent, 1000)

export function reducer(oldState: State, action: Action): State {
    const newState = applyOnState(action, oldState);
    updateUrl(newState)
    return newState
}

function applyOnState(action: Action, state: State): State {
    switch (action.type) {
        case 'LAMBDA_SET_AVG_RESPONSE_TIME':
            sendInputMetric(action)
            return {
                ...state,
                lambdaParams: {
                    ...state.lambdaParams,
                    avgResponseTimeInMs: Math.min(action.amount, 900000)
                },
            }
        case 'LAMBDA_SET_RPM':
            sendInputMetric(action)
            return {
                ...state,
                lambdaParams: {
                    ...state.lambdaParams,
                    minuteReq: action.amount,
                    dailyReq: rpmToDaily(action.amount),
                    monthlyReq: rpmToMonthly(action.amount)
                },
            }
        case "LAMBDA_SET_DAILY":
            sendInputMetric(action)
            return {
                ...state,
                lambdaParams: {
                    ...state.lambdaParams,
                    minuteReq: action.amount / 60 / 24,
                    dailyReq: action.amount,
                    monthlyReq: action.amount * 30,
                },
            }
        case "LAMBDA_SET_MONTHLY":
            sendInputMetric(action)
            return {
                ...state,
                lambdaParams: {
                    ...state.lambdaParams,
                    minuteReq: action.amount / 30 / 60 / 24,
                    dailyReq: action.amount / 30,
                    monthlyReq: action.amount,
                },
            }
        case "LAMBDA_SET_SIZE":
            sendInputMetric(action)
            return {
                ...state,
                lambdaParams: {
                    ...state.lambdaParams,
                    lambdaSize: action.amount
                },
            }
        case "LAMBDA_SET_FREE_TIER":
            sendInputMetric({
                type: action.type,
                amount: action.enabled ? 1 : 0
            })
            return {
                ...state,
                lambdaParams: {
                    ...state.lambdaParams,
                    freeTier: action.enabled
                },
            }
        case "CONTAINERS_SET_SIZE":
            sendFargateConfig(action)
            return {
                ...state,
                containersParams: {
                    ...state.containersParams,
                    fargateConfig: action.config,
                    appRunnerConfig: {
                        ...state.containersParams.appRunnerConfig,
                        enabled: isAppRunnerEnabled(action.config)
                    }
                }
            }
        case "CONTAINERS_SET_TASKS":
            sendInputMetric(action)
            return {
                ...state,
                containersParams: {
                    ...state.containersParams,
                    numberOfTasks: action.amount,
                }
            }
        case "CONTAINERS_SET_APP_RUNNER_RPS":
            sendInputMetric(action)
            return {
                ...state,
                containersParams: {
                    ...state.containersParams,
                    appRunnerConfig: {
                        ...state.containersParams.appRunnerConfig,
                        rpsPerTask: action.amount
                    }
                }
            }
        case "LAMBDA_SET_PRICING":
            return {
                ...state,
                lambdaPricing: action.pricing,
                lambdaRegionalPricing: action.pricing.regionPrices[state.region]
            }
        case "FARGATE_SPOT_SET_PRICING":
            return {
                ...state,
                fargateSpotPricing: action.pricing,
                fargateSpotRegionalPricing: action.pricing.regionPrices[state.region]
            }
        case "FARGATE_SET_PRICING":
            return {
                ...state,
                fargatePricing: action.pricing,
                fargateRegionalPricing: action.pricing.regionPrices[state.region]
            }
        case "EC2_SET_INSTANCES": {
            sendInputMetric(action)
            return {
                ...state,
                ec2Params: {
                    ...state.ec2Params,
                    numberOfInstances: action.amount
                }
            }
        }
        case "EC2_SET_INSTANCE_TYPE": {
            sendEc2InstanceTypeEvent(action)
            return {
                ...state,
                ec2Params: {
                    ...state.ec2Params,
                    instanceType: action.instanceType
                }
            }
        }
        case "EC2_SET_PRICING":
            return {
                ...state,
                ec2Pricing: action.pricing
            }
        case "APP_RUNNER_PRICING":
            return {
                ...state,
                appRunnerRegionalPricing: action.pricing,
                appRunnerPricing: action.pricing.regionPrices[state.region]
            }
        default:
            throw new Error();
    }
}

async function sendEvent(action: { type: string, amount: number }) {
    ReactGA.event({
        category: action.type,
        action: action.amount.toString()
    });
}

async function sendEc2InstanceTypeEvent(action: { type: string, instanceType: EC2InstanceTypePricing }) {
    ReactGA.event({
        category: action.type,
        action: action.instanceType.InstanceType
    });
}

async function sendFargateConfig(action: { type: string, config: FargateConfig }) {
    ReactGA.event({
        category: action.type,
        action: `${action.config.vCPU}vCpu | ${action.config.memory} GB`
    });
}