import _ from "lodash";
import "date-fns";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

interface IComponentProps {
  label: string;
  value: Date;
  onChange: (date: Date) => any;
  disabled?: boolean;
  inputVariant?: "standard" | "outlined" | "filled";
}

export default function DatePicker({
  label,
  value,
  onChange,
  disabled = false,
  inputVariant = "standard"
}: IComponentProps) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
    </MuiPickersUtilsProvider>
  );
}
