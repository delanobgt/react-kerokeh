import React from "react";
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import _ from "lodash";
import {
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Button,
  Typography
} from "@material-ui/core";

import { signIn, ISignInAction } from "src/store/auth";
import { RenderFieldFn } from "src/util/types";
import { goPromise } from "src/util/helper";

const required = (value: any): any =>
  value || typeof value === "number" ? undefined : "Required";

interface IFormProps {
  username: string;
  password: string;
}

interface IComponentProps {}

const renderField: RenderFieldFn = ({
  input,
  label,
  type,
  meta: { touched, error },
  ...custom
}) => (
  <div>
    <div>
      <TextField
        variant="outlined"
        label={label}
        placeholder={label}
        error={touched && error}
        helperText={touched && error}
        {...input}
        {...custom}
        type={type}
        fullWidth
      />
      <br />
      <br />
    </div>
  </div>
);

const MyPaper = styled(Paper)`
  padding: 1.5em;
`;

const Login = (
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) => {
  const { handleSubmit } = props;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const dispatch = useDispatch();

  const onSubmit = async (credentials: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    const [err, res] = await goPromise<ISignInAction>(signIn(credentials));
    if (err) {
      setError(err.response.data.errors);
    } else {
      dispatch(res);
    }
    setLoading(false);
  };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Grid item xs={11} sm={8} md={6} lg={4}>
        <MyPaper elevation={3}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography align="center" variant="h4">
              WARDITE
            </Typography>
            <Typography align="center" variant="subtitle1">
              ADMIN PANEL
            </Typography>
            <br />
            <br />
            <Field
              name="username"
              type="text"
              component={renderField}
              label="Username"
              validate={[required]}
              disabled={loading}
            />
            <Field
              name="password"
              type="password"
              component={renderField}
              label="Password"
              validate={[required]}
              disabled={loading}
            />
            {error && (
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "LOGIN"}
            </Button>
          </form>
        </MyPaper>
      </Grid>
    </Grid>
  );
};

export default reduxForm<IFormProps, IComponentProps>({
  form: "loginForm"
})(Login);
