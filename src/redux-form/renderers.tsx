import React from "react";
import {
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select
} from "@material-ui/core";

import { RenderFieldFn } from "src/util/types";

export const renderTextField: RenderFieldFn = ({
  input,
  label,
  type,
  meta: { touched, error },
  ...custom
}) => {
  return (
    <div>
      <div>
        <TextField
          label={label}
          placeholder={label}
          type={type}
          error={touched && Boolean(error)}
          helperText={touched && error}
          fullWidth
          {...input}
          {...custom}
        />
        <br />
        <br />
      </div>
    </div>
  );
};

export const renderSelectField: RenderFieldFn = ({
  input,
  label,
  type,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <div>
    <div>
      <FormControl error={touched && Boolean(error)}>
        <InputLabel>{label}</InputLabel>
        <Select
          {...input}
          {...custom}
          style={{ minWidth: "240px" }}
          inputProps={{
            name: "role",
            id: "role"
          }}
        >
          {children}
        </Select>
        {touched && Boolean(error) && (
          <Typography variant="caption">{error}</Typography>
        )}
      </FormControl>
      <br />
      <br />
    </div>
  </div>
);
