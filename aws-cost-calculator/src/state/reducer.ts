import {getInstanceType, Interval, State} from "./State";
import {Action} from "./actions";
import {updateUrl} from "../logic/Url";
import ReactGA from "react-ga4";
import {FargateConfig, isAppRunnerEnabled} from "../logic/FargateConfig";
import * as _ from 'lodash'
import {EC2OSPricing} from "../client/Ec2Client";

const sendInputMetric = _.debounce(sendEvent, 1000)

export function reducer(oldState: State, action: Action): State {
    const newState = applyOnState(action, oldState);
    updateUrl(newState)
    return newState
}

function applyOnState(action: Action, state: State): State {
    switch (action.type) {
        case 'SET_REGION':
            sendRegionEvent(action)
            return {
                ...state,
                region: action.region,
                lambdaRegionalPricing: state.lambdaPricing?.regionPrices[action.region],
                fargateRegionalPricing: state.fargatePricing?.regionPrices[action.region],
                appRunnerRegionalPricing: state.appRunnerPricing?.regionPrices[action.region]
            }
        case 'LAMBDA_SET_AVG_RESPONSE_TIME':
            sendInputMetric(action)
            return {
                ...state,
                lambdaParams: {
                    ...state.lambdaParams,
                    avgResponseTimeInMs: Math.min(action.amount, 900000)
                },
            }
        case "LAMBDA_SET_REQUESTS":
            sendInputMetric(action)
            return {
                ...state,
                lambdaParams: {
                    ...state.lambdaParams,
                    requests: action.amount
                },
            }
        case "LAMBDA_SET_INTERVAL":
            sendIntervalEvent(action)
            return {
                ...state,
                lambdaParams: {
                    ...state.lambdaParams,
                    interval: action.interval || state.lambdaParams.interval
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
                        rpmPerTask: action.amount
                    }
                }
            }
        case "LAMBDA_SET_PRICING":
            return {
                ...state,
                lambdaPricing: action.pricing,
                lambdaRegionalPricing: action.pricing.regionPrices[state.region]
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
            if (!action.instanceType) {
                return state
            }
            sendEc2InstanceTypeEvent(action)
            return {
                ...state,
                ec2Params: {
                    ...state.ec2Params,
                    instanceType: getInstanceType(action.instanceType)
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
                appRunnerPricing: action.pricing,
                appRunnerRegionalPricing: action.pricing.regionPrices[state.region]
            }
        case "EVENTS_SET_CONSUMERS":
            return {
                ...state,
                eventsParams: {
                    ...state.eventsParams,
                    consumers: action.amount,
                    suggestedShards: calculateShards(state.eventsParams.events,  state.eventsParams.avgPayloadSize,  state.eventsParams.interval, state.intervals[0], action.amount)
                }
            }
        case "EVENTS_SET_SHARDS":
            return {
                ...state,
                eventsParams: {
                    ...state.eventsParams,
                    shards: action.amount
                }
            }
        case "EVENTS_SET_AVG_PAYLOAD_SIZE":
            return {
                ...state,
                eventsParams: {
                    ...state.eventsParams,
                    avgPayloadSize: action.amount,
                    suggestedShards: calculateShards(state.eventsParams.events,  action.amount,  state.eventsParams.interval, state.intervals[0], state.eventsParams.consumers)
                }
            }
        case "EVENTS_SET_EVENTS":
            return {
                ...state,
                eventsParams: {
                    ...state.eventsParams,
                    events: action.amount,
                    suggestedShards: calculateShards(action.amount,  state.eventsParams.avgPayloadSize,  state.eventsParams.interval, state.intervals[0], state.eventsParams.consumers)
                }
            }
        case "EVENTS_SET_INTERVAL":
            return {
                ...state,
                eventsParams: {
                    ...state.eventsParams,
                    interval: action.interval,
                    suggestedShards: calculateShards(state.eventsParams.events,  state.eventsParams.avgPayloadSize,  action.interval, state.intervals[0], state.eventsParams.consumers)
                }
            }
        default:
            throw new Error();
    }
}

function calculateShards(events: number, avgPayloadSize: number, interval: Interval, secondsInterval: Interval, consumers: number): number {
    const perSecondMultiplier = interval.multiplier / secondsInterval.multiplier;
    const writeShards = Math.ceil(events * perSecondMultiplier * (avgPayloadSize / 1e6));
    const readShards = Math.ceil(events * perSecondMultiplier * (avgPayloadSize / 1e6) * consumers / 2);
    return Math.max(writeShards, readShards)
}

async function sendEvent(action: { type: string, amount: number }) {
    ReactGA.event({
        category: action.type,
        action: action.amount.toString()
    });
}

async function sendIntervalEvent(action: { type: string, interval: Interval }) {
    ReactGA.event({
        category: action.type,
        action: `${action.interval.label} | ${action.interval.multiplier}`
    });
}

async function sendRegionEvent(action: { type: string, region: string }) {
    ReactGA.event({
        category: action.type,
        action: action.region
    });
}

async function sendEc2InstanceTypeEvent(action: { type: string, instanceType: EC2OSPricing | undefined }) {
    if (!action.instanceType) {
        return
    }
    ReactGA.event({
        category: action.type,
        action: action.instanceType.Linux?.product?.instanceType || action.instanceType.Windows?.product?.instanceType || ""
    });
}

async function sendFargateConfig(action: { type: string, config: FargateConfig }) {
    ReactGA.event({
        category: action.type,
        action: `${action.config.vCPU}vCpu | ${action.config.memory} GB`
    });
}