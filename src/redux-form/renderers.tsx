import React from "react";
import {
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select
} from "@material-ui/core";

import { RenderFieldFn, RenderAutoSuggestFieldFn } from "src/util/types";
import ReactSelect from "react-select";

export const renderTextField: RenderFieldFn = ({
  input,
  label,
  type,
  meta: { touched, error },
  ...custom
}) => {
  return (
    <>
      <TextField
        label={label}
        placeholder={label}
        type={type}
        error={touched && Boolean(error)}
        helperText={touched && error}
        fullWidth
        {...input}
        {...custom}
        style={{ marginBottom: "1rem" }}
      />
    </>
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
        <Select {...input} {...custom} style={{ minWidth: "240px" }}>
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

export const renderAutoSuggestField: RenderAutoSuggestFieldFn = ({
  input,
  label,
  meta: { touched, error },
  options,
  ...rest
}) => {
  return (
    <div>
      <div>
        <ReactSelect
          value={rest.value || ""}
          {...input}
          onBlur={() => input.onBlur(rest.value)}
          placeholder={label}
          options={options}
        />
        {touched && Boolean(error) && (
          <Typography variant="caption">{error}</Typography>
        )}
        <br />
        <br />
      </div>
    </div>
  );
};
