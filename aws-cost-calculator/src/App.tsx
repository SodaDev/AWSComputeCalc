import React from 'react';
import './App.css';
import PriceChart from "./components/PriceChart";
import Provider from './components/Provider'

import Grid from '@mui/material/Grid';
import LambdaTraffic from "./components/LambdaTraffic";

function App() {
    return (
        <Provider>
            <Grid container spacing={2} style={{height: "100vh"}}>
                <Grid item xs={12}>
                    <LambdaTraffic/>
                </Grid>
                <Grid item xs={12} style={{height: "100%"}}>
                    <PriceChart/>
                </Grid>
            </Grid>
        </Provider>
    );
}

export default App;
