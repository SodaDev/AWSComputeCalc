import React, {Dispatch, useEffect, useReducer} from 'react';
import PriceChart from "./components/chart/PriceChart";
import Provider from './components/Provider'

import Grid from '@mui/material/Grid';
import LambdaParameters from "./components/parameters/LambdaParameters";
import {State} from "./state/State";
import {
    Action,
    toEc2SetPricing,
    toFargateSetPricing,
    toFargateSpotSetPricing,
    toLambdaSetPricing
} from "./state/actions";
import {reducer} from "./state/reducer";
import {initialState} from "./state/context";
import {getLambdaPrice} from "./client/LambdaClient";
import {getFargateSpotPrice} from "./client/FargateSpotClient";
import {getFargatePrice} from "./client/FargateClient";
import {getEc2Price} from "./client/Ec2Client";
import FargateParameters from "./components/parameters/FargateParameters";
import Ec2Parameters from "./components/parameters/Ec2Parameters";
import Box from "@mui/material/Box";
import {ThemeProvider, Typography} from "@mui/material";
import {theme} from "./Theme";
import GetInTouch from "./components/contact/GetInTouch";

function App() {
    const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initialState)
    useEffect(() => {
        init(dispatch);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Provider>
                <Box sx={{flexGrow: 1, height: "100vh"}}>
                    <Typography variant="h4" component="div" align="center" color={"#18dbab"} gutterBottom>
                        AWS Cost Estimator
                    </Typography>
                    <Grid container spacing={0.5}>
                        <Grid item md={12} sm={12} xl={12} xs={12}>
                            <LambdaParameters/>
                        </Grid>
                        <Grid item md={6} sm={6} xl={6} xs={12}>
                            <FargateParameters/>
                        </Grid>
                        <Grid item md={6} sm={6} xl={6} xs={12}>
                            <Ec2Parameters/>
                        </Grid>
                        <Grid item md={12} sm={12} xl={12} xs={12} style={{height: "70vh"}}>
                            <PriceChart/>
                        </Grid>
                        <Grid item md={12} sm={12} xl={12} xs={12} marginTop={"5ex"}>
                            <GetInTouch/>
                        </Grid>
                    </Grid>
                </Box>
            </Provider>
        </ThemeProvider>
    );
}

function init(dispatch: Dispatch<Action>) {
    getEc2Price()
        .then(response => toEc2SetPricing(response))
        .catch(console.error)
    getFargatePrice()
        .then(response => dispatch(toFargateSetPricing(response)))
        .catch(console.error)
    getFargateSpotPrice()
        .then(response => dispatch(toFargateSpotSetPricing(response)))
        .catch(console.error)
    getLambdaPrice()
        .then(response => dispatch(toLambdaSetPricing(response)))
        .catch(console.error)
}

export default App;
