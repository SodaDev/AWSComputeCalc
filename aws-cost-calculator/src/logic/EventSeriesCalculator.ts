import {EventsParams, State} from "../state/State";
import {Serie} from "@nivo/line";
import _ from "lodash";

const dataPoints = 25

const monthlyHours = 720

const kinesisOnDemand = {
    streamHourFee: 0.045,
    ingestionGbRate: 0.091,
    retrievalGbRate: 0.045,
    enhancedRetrievalGbRate: 0.057,
}
const kinesisProvisioned = {
    operationUnitChunk: 25000,
    shardHourFee: 0.017,
    payloadUnitsPerMillion: 0.0165,
    enhancedRetrievalGbRate: 0.0147,
    enhancedShardHourFee: 0.017,
}

interface SqsRate {
    price: number;
    from: number;
    to: number
}

const sqs = {
    operationUnitChunk: 64000,
    rates: [
        {from: 0, to: 1e6, price: 0},
        {from: 1e6, to: 100e9, price: 0.4},
        {from: 100e9, to: 200e9, price: 0.3},
        {from: 200e9, to: 1e100, price: 0.24}
    ],
    fifoRates: [
        {from: 0, to: 1e6, price: 0},
        {from: 1e6, to: 100e9, price: 0.5},
        {from: 100e9, to: 200e9, price: 0.4},
        {from: 200e9, to: 1e100, price: 0.35}
    ],
    transferRates: [
        {from: 0, to: 10e12, pricePerGB: 0.09},
        {from: 10e12, to: 50e12, pricePerGB: 0.085},
        {from: 50e12, to: 150e12, pricePerGB: 0.07},
        {from: 150e12, to: Infinity, pricePerGB: 0.05},
    ]
}

type SerieGenerator = (name: string, serieColor: string, generator: SeriePointGenerator) => Serie[]
type SeriePointGenerator = ((a: number) => number) | undefined

export function generateSeries(state: State): Serie[] {
    const xAxis = [0, ...buildXAxis(state.eventsParams.events * state.eventsParams.interval.multiplier)];
    const seriesGenerator = buildSerie(xAxis)
    const eventsParams = state.eventsParams
    const series =
        seriesGenerator("Kinesis On-Demand", "#18dbab", onDemandPriceCalculator(eventsParams, kinesisOnDemand.retrievalGbRate))
            .concat(seriesGenerator("Kinesis On-Demand: Enhanced Fan-out", "#005F73", onDemandPriceCalculator(eventsParams, kinesisOnDemand.enhancedRetrievalGbRate)))
            .concat(seriesGenerator("Kinesis Provisioned", "#E9D8A6", provisionedPriceCalculator(eventsParams, 0, 0)))
            .concat(seriesGenerator("Kinesis Provisioned: Enhanced Fan-out", "#EE9B00", provisionedPriceCalculator(eventsParams, kinesisProvisioned.enhancedRetrievalGbRate, kinesisProvisioned.enhancedShardHourFee)))
            .concat(seriesGenerator("SQS", "#DA627D", sqsPriceCalculator(eventsParams, sqs.rates)))
            .concat(seriesGenerator("SQS FIFO", "#9B2226", sqsPriceCalculator(eventsParams, sqs.fifoRates)))

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
    const baseStreamMonthlyFee = kinesisOnDemand.streamHourFee * monthlyHours
    return eventsSent => {
        const gbIngested = eventsSent * eventParams.avgPayloadSize / 10e9
        const ingestionCost = gbIngested * kinesisOnDemand.ingestionGbRate;
        const retrievalCost = gbIngested * gbRetrievalFee * eventParams.consumers;
        return baseStreamMonthlyFee + ingestionCost + retrievalCost
    }
}

function provisionedPriceCalculator(eventParams: EventsParams, gbRetrievalFee: number, enhancedShardHourFee: number): SeriePointGenerator {
    const baseShardsMonthlyFee = eventParams.shards * kinesisProvisioned.shardHourFee * monthlyHours
    const enhancedShardsMonthlyFee = eventParams.shards * enhancedShardHourFee * monthlyHours
    const operationsPerEvent = Math.ceil(eventParams.avgPayloadSize / kinesisProvisioned.operationUnitChunk)
    return eventsSent => {
        const operations = eventsSent * operationsPerEvent
        const gbIngested = eventsSent * eventParams.avgPayloadSize / 10e9
        const ingestionCost = operations * kinesisProvisioned.payloadUnitsPerMillion / 1e6
        const retrievalCost = gbIngested * gbRetrievalFee * eventParams.consumers
        return baseShardsMonthlyFee + enhancedShardsMonthlyFee + ingestionCost + retrievalCost
    }
}

function sqsPriceCalculator(eventsParams: EventsParams, rates: SqsRate[]): SeriePointGenerator {
    return eventsSent => {
        const requestsPerEvent = Math.ceil(eventsParams.avgPayloadSize / sqs.operationUnitChunk)
        const longPollingEvents = 60 * 24 * 30 * 3
        // Events for sent, receive and delete
        const requestsInLifeCycle = 3
        const totalEvents = (eventsSent * requestsInLifeCycle + longPollingEvents) * Math.max(eventsParams.consumers, 1) * requestsPerEvent

        const applicableRates = rates.filter(x => x.from <= totalEvents)
        const requestsCost = _.reduce(applicableRates, (acc, rate) => {
            let rangeEvents = 0
            if (totalEvents < rate.from) {
                rangeEvents = 0
            } else if (totalEvents >= rate.to) {
                rangeEvents = rate.to - rate.from
            } else {
                rangeEvents = totalEvents - rate.from
            }

            return acc + rangeEvents * rate.price / 1000000
        }, 0)

        const totalTransferGB = totalEvents * eventsParams.avgPayloadSize / 10e9
        const transferCost = _.reduce(sqs.transferRates, (acc, rate) => {
            let rangeTransfer = 0
            if (totalTransferGB < rate.from) {
                rangeTransfer = 0
            } else if (totalTransferGB >= rate.to) {
                rangeTransfer = rate.to - rate.from
            } else {
                rangeTransfer = totalTransferGB - rate.from
            }

            return acc + rangeTransfer * rate.pricePerGB
        }, 0)

        return requestsCost + transferCost
    }
}

function buildXAxis(events: number): number[] {
    return Array.from(Array(dataPoints).keys())
        .map(point => (point + 1) * (events || 1) / dataPoints);
}
