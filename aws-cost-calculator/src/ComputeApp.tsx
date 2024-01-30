import Grid from "@mui/material/Grid";
import LambdaParameters from "./components/parameters/LambdaParameters";
import ContainerParameters from "./components/parameters/ContainerParameters";
import Ec2Parameters from "./components/parameters/Ec2Parameters";
import PriceChart from "./components/chart/PriceChart";
import React from "react";

function ComputeApp() {
    return (
        <Grid container spacing={0.5}>
            <Grid item md={12} sm={12} xl={12} xs={12}>
                <LambdaParameters/>
            </Grid>
            <Grid item md={6} sm={6} xl={6} xs={12}>
                <ContainerParameters/>
            </Grid>
            <Grid item md={6} sm={6} xl={6} xs={12}>
                <Ec2Parameters/>
            </Grid>
            <Grid item md={12} sm={12} xl={12} xs={12} style={{height: "78vh", minHeight: "600px"}}>
                <PriceChart/>
            </Grid>
        </Grid>
    );
}

export default ComputeApp;