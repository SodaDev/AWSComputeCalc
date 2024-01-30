import * as React from 'react';
import TextField from '@mui/material/TextField';
import {AppContext} from "../../state/context";
import {Paper} from "@mui/material";

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
                    inputProps: {min: 0, step: 1e9}
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
                    inputProps: {min: 0}
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
