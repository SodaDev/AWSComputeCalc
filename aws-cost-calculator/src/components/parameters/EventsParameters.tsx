import * as React from 'react';
import TextField from '@mui/material/TextField';
import {AppContext} from "../../state/context";
import {MenuItem, Paper} from "@mui/material";

export default function EventsParameters() {
    const {state, dispatch} = React.useContext(AppContext);

    return (
        <Paper variant="outlined" sx={{
            '& .MuiTextField-root': {m: 1}
        }}>
            <TextField
                label="Events"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {min: 0, step: 1e3}
                }}
                value={state.eventsParams.events}
                onChange={event => dispatch({
                    type: "EVENTS_SET_EVENTS",
                    amount: Math.max(parseInt(event.target.value), 0)
                })}
                sx={{width: '12ch'}}
                variant="standard"
            />
            <TextField
                select
                label="Interval"
                value={JSON.stringify(state.eventsParams.interval)}
                onChange={event => dispatch({
                    type: "EVENTS_SET_INTERVAL",
                    interval: JSON.parse(event.target.value)
                })}
                sx={{width: '9ch'}}
                variant="standard"
            >
                {state.intervals.map((option) => (
                    <MenuItem key={option.label} value={JSON.stringify(option)}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Consumers"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {min: 0}
                }}
                value={state.eventsParams.consumers}
                onChange={event => dispatch({
                    type: "EVENTS_SET_CONSUMERS",
                    amount: Math.max(parseInt(event.target.value), 0)
                })}
                sx={{width: '10ch'}}
                variant="standard"
            />
            <TextField
                label="Average payload size [B]"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {min: 1, max: 256000, step: 100}
                }}
                value={state.eventsParams.avgPayloadSize}
                onChange={event => dispatch({
                    type: "EVENTS_SET_AVG_PAYLOAD_SIZE",
                    amount: parseInt(event.target.value)
                })}
                sx={{width: '15ch'}}
                variant="standard"
            />
            <TextField
                label="Shards"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {min: 1}
                }}
                value={state.eventsParams.shards}
                onChange={event => dispatch({
                    type: "EVENTS_SET_SHARDS",
                    amount: Math.max(parseInt(event.target.value), 0)
                })}
                sx={{width: '9ch'}}
                variant="standard"
            />
        </Paper>
    );
}
