import _ from "lodash";
import React from "react";
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  CircularProgress,
  Grid,
  Paper,
  Button,
  Typography
} from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";

import { signIn, ISignInAction } from "src/store/auth";
import { goPromise } from "src/util/helper";
import { renderTextField } from "src/redux-form/renderers";
import { requiredValidator } from "src/redux-form/validators";

interface IFormProps {
  username: string;
  password: string;
}

interface IComponentProps {}

const MyPaper = styled(Paper)`
  padding: 1.5em;
`;

const Login = (
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) => {
  const { handleSubmit } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const dispatch = useDispatch();

  const onSubmit = async (credentials: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    const [err, res] = await goPromise<ISignInAction>(signIn(credentials));
    setLoading(false);
    if (err) {
      setError(_.get(err, "response.data.errors", "Check your connection."));
    } else {
      dispatch(res);
      snackbar.showMessage("Logged In successfully.");
    }
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
              BUY & SELL
            </Typography>
            <Typography align="center" variant="subtitle1">
              Admin Panel
            </Typography>
            <br />
            <br />
            <Field
              name="username"
              type="text"
              component={renderTextField}
              label="Username"
              validate={[requiredValidator]}
              disabled={loading}
            />
            <Field
              name="password"
              type="password"
              component={renderTextField}
              label="Password"
              validate={[requiredValidator]}
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
