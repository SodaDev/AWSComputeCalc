import * as React from "react";
import {AppContext} from "../../state/context";
import {MenuItem, Paper} from "@mui/material";
import TextField from "@mui/material/TextField";

export default function ContainerParameters() {
    const {state, dispatch} = React.useContext(AppContext);

    return (
        <Paper variant="outlined" sx={{
            '& .MuiTextField-root': {m: 1},
        }}>
            <TextField
                label="Tasks"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {min: 0}
                }}
                value={state.containersParams.numberOfTasks}
                onChange={event => dispatch({
                    type: "CONTAINERS_SET_TASKS",
                    amount: parseInt(event.target.value)
                })}
                sx={{ width: '8ch' }}
                variant="standard"
            />
            <TextField
                select
                label="Task setup"
                value={JSON.stringify(state.containersParams.fargateConfig)}
                onChange={event => dispatch({
                    type: "CONTAINERS_SET_SIZE",
                    config: JSON.parse(event.target.value)
                })}
                sx={{ width: '18ch' }}
                variant="standard"
            >
                {state.fargateConfigs.map((option) => (
                    <MenuItem key={option.label} value={JSON.stringify(option)}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </Paper>
    )
}