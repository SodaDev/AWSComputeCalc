import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {AppContext} from "../state/context";
import {MenuItem} from "@mui/material";

const lambdaStep = 128
const maxLambdaSize = 10240
const lambdaSizes = Array.from(Array(maxLambdaSize/lambdaStep).keys())
    .map(x => x * 128)

export default function LambdaParameters() {
    const {state, dispatch} = React.useContext(AppContext);

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': {m: 1, width: '25ch'},
            }}
            noValidate autoComplete="off">
            <div>
                <TextField
                    label="Average response time in ms"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={state.lambdaParams.avgResponseTimeInMs}
                    onChange={event => dispatch({
                        type: "LAMBDA_SET_AVG_RESPONSE_TIME",
                        amount: parseInt(event.target.value)
                    })}
                    variant="standard"
                />
                <TextField
                    label="Requests per minute"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={state.lambdaParams.minuteReq}
                    onChange={event => dispatch({
                        type: "LAMBDA_SET_RPM",
                        amount: parseInt(event.target.value)
                    })}
                    variant="standard"
                />
                <TextField
                    label="Requests daily"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={state.lambdaParams.dailyReq}
                    onChange={event => dispatch({
                        type: "LAMBDA_SET_DAILY",
                        amount: parseInt(event.target.value)
                    })}
                    variant="standard"
                />
                <TextField
                    label="Requests monthly"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={state.lambdaParams.monthlyReq}
                    onChange={event => dispatch({
                        type: "LAMBDA_SET_MONTHLY",
                        amount: parseInt(event.target.value)
                    })}
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
                    variant="standard"
                >
                    {lambdaSizes.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
        </Box>
    );
}
