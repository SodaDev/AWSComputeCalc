import {EventsParams, State} from "../state/State";
import {Serie} from "@nivo/line";
import _ from "lodash";

const dataPoints = 25

const monthlyHours = 720
const onDemandPerGbRate = 0.091;
const onDemandStreamHourFee = 0.045;
const onDemandGbRetrievalFee = 0.045;
const onDemandEnhancedRetrievalFee = 0.057;

type SerieGenerator = (name: string, serieColor: string, generator: SeriePointGenerator) => Serie[]
type SeriePointGenerator = ((a: number) => number) | undefined

export function generateSeries(state: State): Serie[] {
    const xAxis = [0, ...buildXAxis(state.eventsParams.events)];
    const seriesGenerator = buildSerie(xAxis)
    const eventsParams = state.eventsParams
    const series =
        seriesGenerator("Kinesis: On-Demand", "#b4e8db", onDemandPriceCalculator(eventsParams, onDemandGbRetrievalFee))
            .concat(seriesGenerator("Kinesis: Enhanced Fan-out On-Demand", "#18dbab", onDemandPriceCalculator(eventsParams, onDemandEnhancedRetrievalFee)))

    return _.sortBy(series, x => x.id).reverse()
}

function buildSerie(xAxis: number[]): SerieGenerator {
    return (name: string, serieColor: string, generator: SeriePointGenerator): Serie[] => {
        if (!generator) {
            return []
        }

        return [{
            id: name,
            color: serieColor,
            data: xAxis.map(x => ({
                x: x,
                y: generator(x)
            }))
        }]
    }
}

function onDemandPriceCalculator(eventParams: EventsParams, gbRetrievalFee: number): SeriePointGenerator {
    const baseStreamMonthlyFee = onDemandStreamHourFee * monthlyHours
    return requests => {
        const gbIngested = requests * eventParams.avgPayloadSize / 10e9
        return baseStreamMonthlyFee + (gbIngested * onDemandPerGbRate) + (gbIngested * gbRetrievalFee * eventParams.consumers)
    }
}

function buildXAxis(events: number): number[] {
    return Array.from(Array(dataPoints).keys())
        .map(point => (point + 1) * (events || 1) / dataPoints);
}
