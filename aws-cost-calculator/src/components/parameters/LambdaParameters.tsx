import * as React from 'react';
import TextField from '@mui/material/TextField';
import {AppContext} from "../../state/context";
import {FormControlLabel, MenuItem, Paper, Switch, Typography} from "@mui/material";
import {getEc2Price} from "../../client/Ec2Client";
import {toEc2SetPricing} from "../../state/actions";
import _ from "lodash";

const lambdaStep = 128
const maxLambdaSize = 10240
const lambdaSizes = Array.from(Array(maxLambdaSize / lambdaStep).keys())
    .map(x => (x+1) * 128)

export default function LambdaParameters() {
    const {state, dispatch} = React.useContext(AppContext);

    return (
        <Paper variant="outlined" sx={{
            '& .MuiTextField-root': {m: 1}
        }}>
            <TextField
                label="Avg time [ms]"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {min: 0}
                }}
                value={state.lambdaParams.avgResponseTimeInMs}
                onChange={event => dispatch({
                    type: "LAMBDA_SET_AVG_RESPONSE_TIME",
                    amount: Math.max(parseInt(event.target.value), 0)
                })}
                sx={{width: '10ch'}}
                variant="standard"
            />
            <TextField
                select
                label="Lambda size"
                value={state.lambdaParams.lambdaSize}
                onChange={event => dispatch({
                    type: "LAMBDA_SET_SIZE",
                    amount: parseInt(event.target.value)
                })}
                sx={{width: '9ch'}}
                variant="standard"
            >
                {lambdaSizes.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Requests"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {min: 1}
                }}
                value={state.lambdaParams.requests}
                onChange={event => dispatch({
                    type: "LAMBDA_SET_REQUESTS",
                    amount: Math.max(parseInt(event.target.value), 0)
                })}
                sx={{width: '9ch'}}
                variant="standard"
            />
            <TextField
                select
                label="Interval"
                value={JSON.stringify(state.lambdaParams.interval)}
                onChange={event => dispatch({
                    type: "LAMBDA_SET_INTERVAL",
                    interval: JSON.parse(event.target.value)
                })}
                sx={{width: '9ch'}}
                variant="standard"
            >
                {state.lambdaIntervals.map((option) => (
                    <MenuItem key={option.label} value={JSON.stringify(option)}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <FormControlLabel
                sx={{width: '6ch'}}
                control={<Switch
                    color="secondary"
                    checked={state.lambdaParams.freeTier}
                    onChange={(_, checked) => dispatch({
                        type: "LAMBDA_SET_FREE_TIER",
                        enabled: checked
                    })}
                />}
                label={<Typography variant="body2" color="textSecondary" sx={{ marginTop: "6px", fontSize: "13px"}}>Free tier</Typography>}
                labelPlacement="top"
            />
            <TextField
                select
                label="Region"
                value={state.region}
                onChange={async event => {
                    const region = event.target.value.toString()
                    dispatch({
                        type: "SET_REGION",
                        region: region
                    });
                    await getEc2Price(region)
                        .then(response => dispatch(toEc2SetPricing(response)))
                        .catch(console.error)
                }}
                sx={{width: '12ch'}}
                variant="standard"
            >
                {_.keys(state.lambdaPricing?.regionPrices || {})
                    .sort()
                    .map((region) => (
                        <MenuItem key={region} value={region}>
                            {region}
                        </MenuItem>
                    ))}
            </TextField>
        </Paper>
    );
}
