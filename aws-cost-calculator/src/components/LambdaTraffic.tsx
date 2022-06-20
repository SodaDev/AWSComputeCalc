import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {AppContext} from "../state/context";

export default function LambdaTraffic() {
  const {state, dispatch} = React.useContext(AppContext);

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate autoComplete="off">
      <div>
        <TextField
            label="Requests per minute"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={state.lambdaParams.minuteReq}
            onChange={event => dispatch({
                type: "set RPM",
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
                type: "set daily",
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
                type: "set monthly",
                amount: parseInt(event.target.value)
            })}
            variant="standard"
        />
      </div>
    </Box>
  );
}
