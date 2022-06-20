import {State} from "../State";
import {Action} from "./actions";

const rpmToDaily = (i: number): number => Math.round(i * 60 * 24)
const rpmToMonthly = (i: number): number => Math.round(rpmToDaily(i) * 30)

export function reducer(state: State, action: Action): State {
    switch(action.type) {
        case 'set RPM':
            return {
                ...state,
                lambdaParams: {
                    minuteReq: action.amount,
                    dailyReq: rpmToDaily(action.amount),
                    monthlyReq: rpmToMonthly(action.amount)
                },
            }
        case 'set daily':
            return {
                ...state,
                lambdaParams: {
                    minuteReq: action.amount / 60 / 24,
                    dailyReq: action.amount,
                    monthlyReq: action.amount * 30,
                },
            }
        case 'set monthly':
            return {
                ...state,
                lambdaParams: {
                    minuteReq: action.amount /30 / 60 / 24,
                    dailyReq: action.amount / 30,
                    monthlyReq: action.amount,
                },
            }
        default:
            throw new Error();
    }
}