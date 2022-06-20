import {ResponsiveLine, Serie} from '@nivo/line'

const chartData: Serie[] = [
    {
        "id": "japan",
        "data": [
            {
                "x": "plane",
                "y": 171
            },
            {
                "x": "helicopter",
                "y": 74
            },
            {
                "x": "boat",
                "y": 278
            },
            {
                "x": "train",
                "y": 183
            },
            {
                "x": "subway",
                "y": 67
            },
            {
                "x": "bus",
                "y": 172
            },
            {
                "x": "car",
                "y": 54
            },
            {
                "x": "moto",
                "y": 84
            },
            {
                "x": "bicycle",
                "y": 125
            },
            {
                "x": "horse",
                "y": 119
            },
            {
                "x": "skateboard",
                "y": 232
            },
            {
                "x": "others",
                "y": 259
            }
        ]
    },
    {
        "id": "france",
        "data": [
            {
                "x": "plane",
                "y": 15
            },
            {
                "x": "helicopter",
                "y": 67
            },
            {
                "x": "boat",
                "y": 176
            },
            {
                "x": "train",
                "y": 295
            },
            {
                "x": "subway",
                "y": 168
            },
            {
                "x": "bus",
                "y": 30
            },
            {
                "x": "car",
                "y": 123
            },
            {
                "x": "moto",
                "y": 173
            },
            {
                "x": "bicycle",
                "y": 186
            },
            {
                "x": "horse",
                "y": 195
            },
            {
                "x": "skateboard",
                "y": 242
            },
            {
                "x": "others",
                "y": 71
            }
        ]
    },
    {
        "id": "us",
        "data": [
            {
                "x": "plane",
                "y": 207
            },
            {
                "x": "helicopter",
                "y": 58
            },
            {
                "x": "boat",
                "y": 106
            },
            {
                "x": "train",
                "y": 76
            },
            {
                "x": "subway",
                "y": 50
            },
            {
                "x": "bus",
                "y": 239
            },
            {
                "x": "car",
                "y": 35
            },
            {
                "x": "moto",
                "y": 25
            },
            {
                "x": "bicycle",
                "y": 132
            },
            {
                "x": "horse",
                "y": 232
            },
            {
                "x": "skateboard",
                "y": 88
            },
            {
                "x": "others",
                "y": 26
            }
        ]
    },
    {
        "id": "germany",
        "data": [
            {
                "x": "plane",
                "y": 131
            },
            {
                "x": "helicopter",
                "y": 72
            },
            {
                "x": "boat",
                "y": 277
            },
            {
                "x": "train",
                "y": 153
            },
            {
                "x": "subway",
                "y": 52
            },
            {
                "x": "bus",
                "y": 19
            },
            {
                "x": "car",
                "y": 119
            },
            {
                "x": "moto",
                "y": 177
            },
            {
                "x": "bicycle",
                "y": 229
            },
            {
                "x": "horse",
                "y": 173
            },
            {
                "x": "skateboard",
                "y": 264
            },
            {
                "x": "others",
                "y": 57
            }
        ]
    },
    {
        "id": "norway",
        "data": [
            {
                "x": "plane",
                "y": 257
            },
            {
                "x": "helicopter",
                "y": 145
            },
            {
                "x": "boat",
                "y": 275
            },
            {
                "x": "train",
                "y": 251
            },
            {
                "x": "subway",
                "y": 32
            },
            {
                "x": "bus",
                "y": 100
            },
            {
                "x": "car",
                "y": 119
            },
            {
                "x": "moto",
                "y": 197
            },
            {
                "x": "bicycle",
                "y": 60
            },
            {
                "x": "horse",
                "y": 220
            },
            {
                "x": "skateboard",
                "y": 224
            },
            {
                "x": "others",
                "y": 134
            }
        ]
    }
]


function PriceChart() {
    return (
        <ResponsiveLine
            data={chartData}
            margin={{top: 50, right: 110, bottom: 50, left: 60}}
            xScale={{type: 'point'}}
            yScale={{
                type: 'linear',
                min: "auto",
                max: 'auto',
                stacked: true,
                reverse: false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'transportation',
                legendOffset: 36
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'count',
                legendOffset: -40
            }}
            pointSize={10}
            pointColor={{theme: 'background'}}
            pointBorderWidth={2}
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
