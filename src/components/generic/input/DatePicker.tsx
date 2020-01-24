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
  fullWidth?: boolean;
}

export default function DatePicker({
  label,
  value,
  onChange,
  disabled = false,
  inputVariant = "standard",
  fullWidth
}: IComponentProps) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        id={_.snakeCase(label)}
        label={label}
        format="dd/MM/yyyy"
        value={value}
        inputVariant={inputVariant}
        disabled={disabled}
        onChange={onChange}
        fullWidth={Boolean(fullWidth)}
      />
    </MuiPickersUtilsProvider>
  );
}
