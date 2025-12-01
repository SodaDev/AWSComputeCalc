import Grid from "@mui/material/Grid";
import LambdaParameters from "./components/parameters/LambdaParameters";
import Ec2Parameters from "./components/parameters/Ec2Parameters";
import PriceChart from "./components/chart/PriceChart";
import React from "react";
import {generateSeries} from "./logic/SeriesCalculator";
import {Serie} from "@nivo/line";

function ManagedLambdaApp() {
    return (
        <Grid container spacing={0.5}>
            <Grid item md={8} sm={12} xl={8} xs={12}>
                <LambdaParameters/>
            </Grid>
            <Grid item md={4} sm={12} xl={4} xs={12}>
                <Ec2Parameters/>
            </Grid>
            <Grid item md={12} sm={12} xl={12} xs={12} style={{height: "78vh", minHeight: "600px"}}>
                <PriceChart seriesGenerator={generateSeries} seriesFilter={(s: Serie) => s.id.toString().includes("Lambda")} legendYOffset={130} />
            </Grid>
        </Grid>
    );
}

export default ManagedLambdaApp;