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
import moment from "moment";
import DatePicker from "src/components/generic/DatePicker";
import ImageInput from "src/components/generic/ImageInput";

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

export const renderDateField: RenderFieldFn = ({
  input,
  label,
  meta: { touched, error }
}) => (
  <div>
    <DatePicker
      label={label}
      onChange={date => input.onChange(moment(date).format("YYYY-MM-DD"))}
      value={moment(input.value, "YYYY-MM-DD").toDate()}
    />
    {touched && Boolean(error) && (
      <Typography variant="caption">{error}</Typography>
    )}
    <br />
    <br />
  </div>
);

export const renderImageField: RenderFieldFn = ({
  input,
  label,
  meta: { touched, error },
  accept,
  extensions
}) => (
  <div>
    <ImageInput
      label={label}
      value={input.value}
      accept={accept}
      extensions={extensions}
      onChange={file => {
        input.onChange(file);
      }}
    />
    {touched && Boolean(error) && (
      <Typography variant="caption">{error}</Typography>
    )}
    <br />
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
