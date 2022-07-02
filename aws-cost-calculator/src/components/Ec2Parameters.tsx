import * as React from "react";
import {AppContext} from "../state/context";
import Box from "@mui/material/Box";
import {MenuItem} from "@mui/material";
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

export default function Ec2Parameters() {
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
                    label="Number of instances"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={state.ec2Params.numberOfInstances}
                    onChange={event => dispatch({
                        type: "EC2_SET_INSTANCES",
                        amount: parseInt(event.target.value)
                    })}
                    variant="standard"
                />
                <TextField
                    select
                    label="Instance type"
                    value={JSON.stringify(state.ec2Params.instanceType)}
                    onChange={event => dispatch({
                        type: "EC2_SET_INSTANCE_TYPE",
                        instanceType: JSON.parse(event.target.value)
                    })}
                    variant="standard"
                >
                    {
                        Object.values(state.ec2Pricing.instancePrices)
                        .sort((a, b) => a.InstanceType.localeCompare(b.InstanceType))
                        .map((option) => (
                            <MenuItem key={option.InstanceType} value={JSON.stringify(option)}>
                                {option.InstanceType}
                            </MenuItem>
                        ))}
                </TextField>
            </div>

        </Box>
    )
}