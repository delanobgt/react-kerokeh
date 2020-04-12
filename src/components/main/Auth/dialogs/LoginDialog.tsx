import _ from "lodash";
import React from "react";
import { Button, Typography, CircularProgress } from "@material-ui/core";

import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { reduxForm, InjectedFormProps, Field } from "redux-form";
import { ISignInAction, signIn } from "src/store/auth";
import { goPromise } from "src/util/helper";
import { useSnackbar } from "material-ui-snackbar-provider";
import { renderTextField } from "src/redux-form/renderers";
import { requiredValidator } from "src/redux-form/validators";
import { useDispatch } from "react-redux";

import "../style.css";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
}

interface IFormProps {
  email: string;
  password: string;
}

function LoginDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { handleSubmit } = props;
  const snackbar = useSnackbar();

  const { open, dismiss } = props;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const dispatch = useDispatch();

  const onSubmit = async (credentials: { email: string; password: string }) => {
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
    <div>
      <BasicDialog
        open={open}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose
      >
        <title>
          <Typography align="center" variant="h6">
            Login to{" "}
            <span className="kerokeh-title">
              <strong>KEROKEH</strong>
            </span>
          </Typography>
        </title>
        <section>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field
              name="email"
              type="email"
              component={renderTextField}
              label="Email"
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

            <br />
            <br />

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
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "loginForm",
})(LoginDialog);
