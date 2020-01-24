import React from "react";
import {
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch
} from "@material-ui/core";

import {
  RenderFieldFn,
  RenderAutoSuggestFieldFn,
  RenderAsyncAutoSuggestFieldFn
} from "src/util/types";
import ReactSelect from "react-select";
import AsyncReactSelect from "react-select/async";
import moment from "moment";
import DatePicker from "src/components/generic/input/DatePicker";
import ImageInput from "src/components/generic/input/ImageInput";

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
      {Boolean(console.log(custom))}
      <FormControl error={touched && Boolean(error)} style={{ width: "100%" }}>
        <InputLabel>{label}</InputLabel>
        <Select {...input} {...custom}>
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
      fullWidth
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
  disabled,
  ...rest
}) => {
  return (
    <div>
      <div>
        <Typography style={{ color: "gray" }} variant="body2">
          {label}
        </Typography>
        <ReactSelect
          {...rest}
          {...input}
          onBlur={value => input.onBlur()}
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

export const renderAsyncAutoSuggestField: RenderAsyncAutoSuggestFieldFn = ({
  input,
  label,
  meta: { touched, error },
  promiseOptions,
  disabled,
  ...rest
}) => {
  return (
    <div>
      <div>
        <Typography style={{ color: "gray" }} variant="body2">
          {label}
        </Typography>
        <AsyncReactSelect
          {...rest}
          {...input}
          isDisabled={disabled || false}
          cacheOptions
          defaultOptions
          loadOptions={promiseOptions}
          onBlur={() => input.onBlur()}
          placeholder={label}
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

export const renderSwitchField: RenderFieldFn = ({
  input,
  label,
  type,
  meta: { touched, error },
  ...custom
}) => {
  return (
    <>
      <FormControlLabel
        control={
          <Switch size="small" checked={input.value} {...input} {...custom} />
        }
        label={label}
      />
      {touched && Boolean(error) && (
        <Typography variant="caption">{error}</Typography>
      )}
    </>
  );
};
