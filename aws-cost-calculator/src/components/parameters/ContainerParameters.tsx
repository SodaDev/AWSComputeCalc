import * as React from "react";
import {AppContext} from "../../state/context";
import {MenuItem, Paper} from "@mui/material";
import TextField from "@mui/material/TextField";

export default function ContainerParameters() {
    const {state, dispatch} = React.useContext(AppContext);
    const appRunnerEnabled = state.containersParams.appRunnerConfig?.enabled || false

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
                sx={{ width: '7ch' }}
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
                sx={{ width: '12ch' }}
                variant="standard"
            >
                {state.fargateConfigs.map((option) => (
                    <MenuItem key={option.label} value={JSON.stringify(option)}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="AppRunner RPM/task"
                type="number"
                hidden={true}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {min: 0}
                }}
                value={state.containersParams.appRunnerConfig?.rpmPerTask}
                onChange={event => dispatch({
                    type: "CONTAINERS_SET_APP_RUNNER_RPS",
                    amount: parseInt(event.target.value)
                })}
                sx={{ width: '12ch', display: !appRunnerEnabled ? 'none' : undefined }}
                variant="standard"
            />
        </Paper>
    )
}