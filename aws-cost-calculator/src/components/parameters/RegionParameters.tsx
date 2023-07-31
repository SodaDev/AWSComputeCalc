import * as React from 'react';
import TextField from '@mui/material/TextField';
import {AppContext} from "../../state/context";
import {MenuItem, Paper} from "@mui/material";
import _ from "lodash";
import {getEc2Price} from "../../client/Ec2Client";
import {toEc2SetPricing} from "../../state/actions";

export default function RegionParameters() {
    const {state, dispatch} = React.useContext(AppContext);

    return (
        <Paper variant="outlined" sx={{
            '& .MuiTextField-root': {m: 1}
        }}>
            <TextField
                select
                label="Region"
                value={state.region}
                onChange={async event => {
                    const region = event.target.value.toString()
                    dispatch({
                        type: "SET_REGION",
                        region: region
                    });
                    await getEc2Price(region)
                        .then(response => dispatch(toEc2SetPricing(response)))
                        .catch(console.error)
                }}
                sx={{width: '12ch'}}
                variant="standard"
            >
                {_.keys(state.lambdaPricing?.regionPrices || {})
                    .sort()
                    .map((region) => (
                    <MenuItem key={region} value={region}>
                        {region}
                    </MenuItem>
                ))}
            </TextField>
        </Paper>
    );
}
