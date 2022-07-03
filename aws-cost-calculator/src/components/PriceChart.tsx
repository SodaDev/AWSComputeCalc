import {ResponsiveLine} from '@nivo/line'
import React from "react";
import {AppContext} from "../state/context";
import {generateSeries} from "../logic/SeriesCalculator";
import {chartTheme} from "../Theme";

const seriesColors = [
    "#b4e8db",
    "#18dbab",
    "#ff9900",
    "#f1e15b",
    "#f47560",
    "#e8c1a1",
    "#7e582e"
]

function PriceChart() {
    const {state, dispatch} = React.useContext(AppContext);
    const chartData = generateSeries(state)
    window.dispatchEvent(new Event('resize'));
    return (
        <ResponsiveLine
            colors={seriesColors}
            data={chartData}
            animate={true}
            enableSlices={"x"}
            margin={{top: 20, right: 20, bottom: 200, left: 60}}
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
            theme={chartTheme}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 0,
                    translateY: 200,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 100,
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
