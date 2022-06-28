import React, {useEffect, useReducer} from 'react';
import './App.css';
import PriceChart from "./components/PriceChart";
import Provider from './components/Provider'

import Grid from '@mui/material/Grid';
import LambdaParameters from "./components/LambdaParameters";
import {State} from "./State";
import {Action} from "./state/actions";
import {reducer} from "./state/reducer";
import {initialState} from "./state/context";
import {getLambdaPrice} from "./client/LambdaClient";
import {getFargateSpotPrice} from "./client/FargateSpotClient";

function App() {
    const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initialState)
    useEffect(() => {
        getFargateSpotPrice()
            .then(response => dispatch({
                type: "FARGATE_SPOT_SET_PRICING",
                pricing: response
            }))
            .catch(console.error)
        getLambdaPrice()
            .then(response => dispatch({
                type: "LAMBDA_SET_PRICING",
                pricing: response
            }))
            .catch(console.error)
    }, []);

    return (
        <Provider>
            <Grid container spacing={2} style={{height: "100vh"}}>
                <Grid item xs={12}>
                    <LambdaParameters/>
                </Grid>
                <Grid item xs={12} style={{height: "100%"}}>
                    <PriceChart/>
                </Grid>
            </Grid>
        </Provider>
    );
}

export default App;
