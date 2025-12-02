import * as React from "react";
import {AppContext} from "../../state/context";
import {MenuItem, Paper} from "@mui/material";
import TextField from "@mui/material/TextField";
import _ from "lodash";

function isMemoryHigherOrEqualToLambda(product: EC2InstanceConfiguration , lambdaMemorySize: number): boolean {
    if (!product.memory) {
        return false;
    }

    const memoryString = product.memory.toLowerCase().replace(" gib", "")
    const memoryInGiB = parseFloat(memoryString);
    return memoryInGiB * 1024 >= lambdaMemorySize;
}

export default function Ec2Parameters() {
    const {state, dispatch} = React.useContext(AppContext);
    const product = state.ec2Pricing?.instancePrices[state.ec2Params.instanceType]?.Linux?.product
    const isConfigValid = product ? isMemoryHigherOrEqualToLambda(product, state.lambdaParams.lambdaSize) : true
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
                error={!isConfigValid}
                helperText={!isConfigValid ? "EC2 smaller than λ" : null}
                sx={{ width: '15ch'}}
                variant="standard"
            >
                {
                    _.keys(state.ec2Pricing?.instancePrices || {})
                        .sort()
                        .map(instanceType => {
                            const product = state.ec2Pricing?.instancePrices[instanceType]?.Linux?.product
                            if (product) {
                                const label = `${instanceType.padEnd(18, '⠀')} ` + `${product.vcpu?.padStart(3, '⠀')}⠀vCPU ${product.memory.toLowerCase().replace(" gib", "").padStart(6, '⠀')} GiB`
                                return (<MenuItem key={instanceType} value={instanceType} sx={{ fontFamily: 'monospace', fontSize: '1em' }}>
                                    {label}
                                </MenuItem>)
                            }

                            return (<MenuItem key={instanceType} value={instanceType}>
                                {instanceType}
                            </MenuItem>)
                        })
                }
            </TextField>

        </Paper>
    )
}