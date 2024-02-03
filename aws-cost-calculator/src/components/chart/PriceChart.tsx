import {ResponsiveLine, Serie} from '@nivo/line'
import React from "react";
import {AppContext} from "../../state/context";
import {chartTheme} from "../../Theme";
import {ChartTooltip} from "./ChartTooltip";
import {State} from "../../state/State";

function PriceChart(props: {seriesGenerator: (state: State) => Serie[], legendYOffset?: number}) {
    const {state, dispatch} = React.useContext(AppContext);

    const chartData = props.seriesGenerator(state)
    const legendYOffset = props.legendYOffset ? props.legendYOffset : 280
    window.dispatchEvent(new Event('resize'));
    return (
        <ResponsiveLine
            colors={d => d.color}
            data={chartData}
            animate={true}
            enableSlices={"x"}
            sliceTooltip={ChartTooltip}
            margin={{top: 20, right: 20, bottom: legendYOffset, left: 60}}
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
            xFormat= " >-0~s"
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
                    anchor: 'bottom-left',
                    direction: 'column',
                    justify: false,
                    translateX: 0,
                    translateY: legendYOffset,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 100,
                    itemHeight: 16,
                    itemOpacity: 0.85,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    toggleSerie: true,
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
