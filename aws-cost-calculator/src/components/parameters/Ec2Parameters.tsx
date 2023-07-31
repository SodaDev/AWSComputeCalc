import * as React from "react";
import {AppContext} from "../../state/context";
import {MenuItem, Paper} from "@mui/material";
import TextField from "@mui/material/TextField";
import _ from "lodash";

export default function Ec2Parameters() {
    const {state, dispatch} = React.useContext(AppContext);

    return (
        <Paper variant="outlined" sx={{
            '& .MuiTextField-root': {m: 1},
        }}>
            <TextField
                label="Instances"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {min: 0}
                }}
                value={state.ec2Params.numberOfInstances}
                onChange={event => dispatch({
                    type: "EC2_SET_INSTANCES",
                    amount: parseInt(event.target.value)
                })}
                sx={{ width: '9ch' }}
                variant="standard"
            />
            <TextField
                select
                label="Instance type"
                value={state.ec2Params.instanceType}
                onChange={event => dispatch({
                    type: "EC2_SET_INSTANCE_TYPE",
                    instanceType: state.ec2Pricing?.instancePrices[event.target.value]
                })}
                sx={{ width: '15ch' }}
                variant="standard"
            >
                {
                    _.keys(state.ec2Pricing?.instancePrices || {})
                        .sort()
                        .map(instanceType => (
                            <MenuItem key={instanceType} value={instanceType}>
                                {instanceType}
                            </MenuItem>
                        ))
                }
            </TextField>
        </Paper>
    )
}