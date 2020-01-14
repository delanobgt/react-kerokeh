import _ from "lodash";
import React from "react";
import {
  Button,
  CircularProgress,
  Typography,
  MenuItem
} from "@material-ui/core";
import {
  Field,
  reduxForm,
  InjectedFormProps,
  SubmissionError
} from "redux-form";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import { createAdminUser } from "src/store/adminUser";
import BasicDialog from "src/components/generic/BasicDialog";
import { requiredValidator } from "src/redux-form/validators";
import { renderTextField, renderSelectField } from "src/redux-form/renderers";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

interface IFormProps {
  username: string;
  password: string;
  role_id: number;
}

function CreateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { open, dismiss, handleSubmit, restartIntervalRun } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const { username, password, role_id } = formValues;
      const [err] = await goPromise(
        createAdminUser({
          username,
          password,
          role_id
        })
      );
      setLoading(false);
      if (err) {
        if (_.has(err, "response.data.errors")) {
          throw new SubmissionError(err.response.data.errors);
        } else {
          setError("error");
        }
      } else {
        restartIntervalRun();
        dismiss();
        snackbar.showMessage("Admin User created.");
      }
    },
    [restartIntervalRun, dismiss, snackbar]
  );

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  return (
    <div>
      <BasicDialog
        open={open}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose
      >
        <title>Create Admin User</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <Field
              name="username"
              type="text"
              label="Username"
              component={renderTextField}
              validate={[requiredValidator]}
              disabled={loading}
            />
            <Field
              name="password"
              type="password"
              label="Password"
              component={renderTextField}
              validate={[requiredValidator]}
              disabled={loading}
            />
            <Field
              name="role_id"
              label="Role"
              component={renderSelectField}
              validate={[requiredValidator]}
              disabled={loading}
            >
              <MenuItem value={1}>Admin</MenuItem>
              <MenuItem value={2}>Staff</MenuItem>
            </Field>
            {error && (
              <Typography variant="subtitle1">
                Something is wrong. Please try again.
              </Typography>
            )}
            <div style={{ textAlign: "right" }}>
              <Button onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </div>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "createAdminUserDialogForm"
})(CreateDialog);
