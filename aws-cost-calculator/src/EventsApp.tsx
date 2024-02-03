import Grid from "@mui/material/Grid";
import React from "react";
import EventsParameters from "./components/parameters/EventsParameters";
import PriceChart from "./components/chart/PriceChart";
import {generateSeries} from "./logic/EventSeriesCalculator";

function EventsApp() {
    return (
        <Grid container spacing={0.5}>
            <Grid item md={12} sm={12} xl={12} xs={12}>
                <EventsParameters/>
            </Grid>
            <Grid item md={12} sm={12} xl={12} xs={12} style={{height: "78vh", minHeight: "600px"}}>
                <PriceChart seriesGenerator={generateSeries} legendYOffset={160}/>
            </Grid>
        </Grid>
    );
}

export default EventsApp;