import _ from "lodash";
import "date-fns";
import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

interface Props {
  label: string;
  value: Date;
  onChange: (date: Date) => any;
  disabled: boolean;
  inputVariant: "standard" | "outlined" | "filled";
}

export default function DatePicker({
  label,
  value,
  onChange,
  disabled,
  inputVariant
}: Props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          margin="normal"
          id={_.snakeCase(label)}
          label={label}
          format="dd/MM/yyyy"
          value={value}
          inputVariant={inputVariant}
          disabled={disabled}
          onChange={onChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
