import {State} from "./State";
import {Action} from "./actions";

const rpmToDaily = (i: number): number => Math.round(i * 60 * 24)
const rpmToMonthly = (i: number): number => Math.round(rpmToDaily(i) * 30)

export function reducer(state: State, action: Action): State {
    console.info({
        action,
        state
    })
    switch(action.type) {
        case 'LAMBDA_SET_AVG_RESPONSE_TIME':
            return {
                ...state,
                lambdaParams: {
                    ...state.lambdaParams,
                    avgResponseTimeInMs: Math.min(action.amount, 900000)
                },
            }
        case 'LAMBDA_SET_RPM':
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
            return {
                ...state,
                lambdaParams: {
                    ...state.lambdaParams,
                    minuteReq: action.amount /30 / 60 / 24,
                    dailyReq: action.amount / 30,
                    monthlyReq: action.amount,
                },
            }
        case "LAMBDA_SET_SIZE":
            return {
                ...state,
                lambdaParams: {
                    ...state.lambdaParams,
                    lambdaSize: action.amount
                },
            }
        case "FARGATE_SET_SIZE":
            return {
                ...state,
                fargateParams: {
                    ...state.fargateParams,
                    fargateConfig: action.config,
                }
            }
        case "FARGATE_SET_TASKS":
            return {
                ...state,
                fargateParams: {
                    ...state.fargateParams,
                    numberOfTasks: action.amount,
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
        case "EC2_SET_PRICING":
            return {
                ...state,
                ec2Pricing: action.pricing
            }
        default:
            throw new Error();
    }
}