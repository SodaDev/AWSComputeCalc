import * as React from "react";
import {AppContext} from "../state/context";
import {MenuItem, Paper} from "@mui/material";
import TextField from "@mui/material/TextField";

export class FargateConfig {
    vCPU: number
    memory: number

    constructor(vCPU: number, memory: number) {
        this.vCPU = vCPU;
        this.memory = memory;
    }

    get label(): string {
        return `${this.vCPU}vCpu - ${this.memory} GB`;
    }
}

const configurations: FargateConfig[] = [
    new FargateConfig(0.25, 0.5),
    new FargateConfig(0.25, 1),
    new FargateConfig(0.25, 2)
]
    .concat(generateSetup(0.5, 1, 4))
    .concat(generateSetup(1, 2, 8))
    .concat(generateSetup(2, 4, 16))
    .concat(generateSetup(4, 8, 30))

function generateSetup(vCPU: number, from: number, to: number): FargateConfig[] {
    return Array.from(Array(to - from + 1).keys())
        .map(x => new FargateConfig(vCPU, x + from))
}

export default function FargateParameters() {
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
                value={state.fargateParams.numberOfTasks}
                onChange={event => dispatch({
                    type: "FARGATE_SET_TASKS",
                    amount: parseInt(event.target.value)
                })}
                sx={{ width: '8ch' }}
                variant="standard"
            />
            <TextField
                select
                label="Fargate setup"
                value={JSON.stringify(state.fargateParams.fargateConfig)}
                onChange={event => dispatch({
                    type: "FARGATE_SET_SIZE",
                    config: JSON.parse(event.target.value)
                })}
                sx={{ width: '18ch' }}
                variant="standard"
            >
                {configurations.map((option) => (
                    <MenuItem key={option.label} value={JSON.stringify(option)}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </Paper>
    )
}