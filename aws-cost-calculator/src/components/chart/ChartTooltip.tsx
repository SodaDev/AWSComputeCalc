import {CompleteTheme, useTheme} from "@nivo/core";
import {Point} from "@nivo/line";
import {Chip, TableTooltip} from '@nivo/tooltip'
import React from "react";
import {SliceTooltipProps} from "@nivo/line";

function buildXSeriePoint(sliceProps: SliceTooltipProps): Point[] {
    return [{
        id: "-1",
        serieId: "Requests",
        x: 1,
        y: 1,
        index: -1,
        color: "#000000",
        serieColor: "#000000",
        borderColor: "#000000",
        data: {
            x: sliceProps.slice.points[0].data['xFormatted'],
            y: sliceProps.slice.points[0].data['xFormatted'],
            xFormatted: sliceProps.slice.points[0].data['xFormatted'],
            yFormatted: sliceProps.slice.points[0].data['xFormatted']
        }
    }];
}

function buildPointLine(theme: CompleteTheme, point: Point) {
    return [
        <Chip key="chip" color={point.serieColor} style={theme.tooltip.chip}/>,
        point.serieId,
        <span key="value" style={theme.tooltip.tableCellValue}>
                    {point.data[`yFormatted`]}
                </span>,
    ]
}

export function ChartTooltip(sliceProps: SliceTooltipProps) {
    const theme = useTheme()

    return (
        <TableTooltip
            rows={
                buildXSeriePoint(sliceProps)
                    .concat(sliceProps.slice.points)
                    .map(point => buildPointLine(theme, point))
            }
        />
    )
}
