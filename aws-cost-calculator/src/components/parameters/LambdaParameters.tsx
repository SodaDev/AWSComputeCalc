import * as React from 'react';
import TextField from '@mui/material/TextField';
import {AppContext} from "../../state/context";
import {MenuItem, Paper} from "@mui/material";

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
                value={state.lambdaParams.avgResponseTimeInMs}
                onChange={event => dispatch({
                    type: "LAMBDA_SET_AVG_RESPONSE_TIME",
                    amount: parseInt(event.target.value)
                })}
                sx={{ width: '10ch' }}
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
                sx={{ width: '9ch' }}
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
                value={state.lambdaParams.minuteReq}
                onChange={event => dispatch({
                    type: "LAMBDA_SET_RPM",
                    amount: parseInt(event.target.value)
                })}
                sx={{ width: '9ch' }}
                variant="standard"
            />
            <TextField
                label="Req / day"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                value={state.lambdaParams.dailyReq}
                onChange={event => dispatch({
                    type: "LAMBDA_SET_DAILY",
                    amount: parseInt(event.target.value)
                })}
                sx={{ width: '12ch' }}
                variant="standard"
            />
            <TextField
                label="Req / month"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                value={state.lambdaParams.monthlyReq}
                onChange={event => dispatch({
                    type: "LAMBDA_SET_MONTHLY",
                    amount: parseInt(event.target.value)
                })}
                sx={{ width: '12ch' }}
                variant="standard"
            />
        </Paper>
    );
}
