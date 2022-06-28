import {ResponsiveLine, Serie} from '@nivo/line'
import React from "react";
import {AppContext} from "../state/context";
import {generateSeries} from "../logic/SeriesCalculator";

function PriceChart() {
    const {state, dispatch} = React.useContext(AppContext);
    const chartData = generateSeries(state.lambdaRegionalPricing, state.lambdaParams)
    window.dispatchEvent(new Event('resize'));
    return (
        <ResponsiveLine
            data={chartData}
            animate={true}
            enableSlices={"x"}
            margin={{top: 50, right: 110, bottom: 50, left: 60}}
            xScale={{
                type: 'linear',
                nice: true
            }}
            yScale={{
                type: 'linear',
                min: "auto",
                max: "auto",
                stacked: false,
                reverse: false,
                nice: true
            }}
            xFormat= " >-0~f"
            yFormat=" >-$.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 45,
                format: ' >-0~s',
                legend: 'invocations',
                legendOffset: 36
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Cost [$]',
                legendOffset: -40
            }}
            pointSize={5}
            pointBorderColor={{from: 'serieColor'}}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    );
}

export default PriceChart;
