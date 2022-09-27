import * as React from 'react';
import TextField from '@mui/material/TextField';
import {AppContext} from "../../state/context";
import {FormControlLabel, MenuItem, Paper, Switch, Typography} from "@mui/material";

const lambdaStep = 128
const maxLambdaSize = 10240
const lambdaSizes = Array.from(Array(maxLambdaSize / lambdaStep).keys())
    .map(x => x * 128)

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
                    amount: Math.max(parseInt(event.target.value) || 0, 0)
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
                label="Req / min"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {min: 1}
                }}
                value={state.lambdaParams.minuteReq}
                onChange={event => dispatch({
                    type: "LAMBDA_SET_RPM",
                    amount: Math.max(parseInt(event.target.value) || 1, 1)
                })}
                sx={{width: '9ch'}}
                variant="standard"
            />
            <TextField
                label="Req / day"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {min: 1}
                }}
                value={state.lambdaParams.dailyReq}
                onChange={event => dispatch({
                    type: "LAMBDA_SET_DAILY",
                    amount: Math.max(parseInt(event.target.value) || 1, 1)
                })}
                sx={{width: '12ch'}}
                variant="standard"
            />
            <TextField
                label="Req / month"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {min: 1}
                }}
                value={state.lambdaParams.monthlyReq}
                onChange={event => dispatch({
                    type: "LAMBDA_SET_MONTHLY",
                    amount: Math.max(parseInt(event.target.value) || 1, 1)
                })}
                sx={{width: '12ch'}}
                variant="standard"
            />
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
        </Paper>
    );
}
