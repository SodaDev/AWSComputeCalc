import React from 'react';
import Provider from './components/Provider'

import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
import {ThemeProvider, Typography} from "@mui/material";
import {theme} from "./Theme";
import GetInTouch from "./components/contact/GetInTouch";
import CookieSnackBar from "./analytics/CookieSnackbar";
import BuyMeACoffee from "./components/contact/BuyMeACoffee";
import {Route, Routes} from "react-router-dom";
import ComputeApp from "./ComputeApp";
import EventsApp from "./EventsApp";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Provider>
                <Box sx={{flexGrow: 1, height: "100vh"}}>
                    <Typography variant="h4" component="div" align="center" color={"#18dbab"} gutterBottom>
                        AWS Cost Estimator
                    </Typography>
                    <Grid container spacing={0.5}>
                        <Routes>
                            <Route path="/" element={<ComputeApp />}/>
                            <Route path="/events" element={<EventsApp />}/>
                            <Route path="*" element={<ComputeApp />} />
                        </Routes>
                        <Grid item md={12} sm={12} xl={12} xs={12} marginTop={"1ex"} marginBottom={"1ex"}>
                            <GetInTouch/>
                            <BuyMeACoffee/>
                        </Grid>
                        <CookieSnackBar/>
                    </Grid>
                </Box>
            </Provider>
        </ThemeProvider>
    );
}

export default App;
