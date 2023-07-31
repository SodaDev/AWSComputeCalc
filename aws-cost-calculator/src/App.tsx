import React from 'react';
import PriceChart from "./components/chart/PriceChart";
import Provider from './components/Provider'

import Grid from '@mui/material/Grid';
import LambdaParameters from "./components/parameters/LambdaParameters";
import ContainerParameters from "./components/parameters/ContainerParameters";
import Ec2Parameters from "./components/parameters/Ec2Parameters";
import Box from "@mui/material/Box";
import {ThemeProvider, Typography} from "@mui/material";
import {theme} from "./Theme";
import GetInTouch from "./components/contact/GetInTouch";
import CookieSnackBar from "./analytics/CookieSnackbar";
import RegionParameters from "./components/parameters/RegionParameters";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Provider>
                <Box sx={{flexGrow: 1, height: "100vh"}}>
                    <Typography variant="h4" component="div" align="center" color={"#18dbab"} gutterBottom>
                        AWS Cost Estimator
                    </Typography>
                    <Grid container spacing={0.5}>
                        <Grid item md={8} sm={8} xl={8} xs={8}>
                            <LambdaParameters/>
                        </Grid>
                        <Grid item md={4} sm={4} xl={4} xs={4}>
                            <RegionParameters/>
                        </Grid>
                        <Grid item md={6} sm={6} xl={6} xs={12}>
                            <ContainerParameters/>
                        </Grid>
                        <Grid item md={6} sm={6} xl={6} xs={12}>
                            <Ec2Parameters/>
                        </Grid>
                        <Grid item md={12} sm={12} xl={12} xs={12} style={{height: "70vh"}}>
                            <PriceChart/>
                        </Grid>
                        <Grid item md={12} sm={12} xl={12} xs={12} marginTop={"5ex"} marginBottom={"1ex"}>
                            <GetInTouch/>
                        </Grid>
                        <CookieSnackBar/>
                    </Grid>
                </Box>
            </Provider>
        </ThemeProvider>
    );
}

export default App;
