import _ from "lodash";
import React from "react";
import { Button, CircularProgress, TextField } from "@material-ui/core";
import {
  Field,
  reduxForm,
  InjectedFormProps,
  SubmissionError
} from "redux-form";
import { useDispatch } from "react-redux";

import { createAdminUser } from "src/store/adminUser";
import { RenderFieldFn } from "src/util/types";
import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/BasicDialog";

const required = (value: any): any =>
  value || typeof value === "number" ? undefined : "Required";

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
        label={label}
        placeholder={label}
        error={touched && error}
        helperText={touched && error}
        type={type}
        fullWidth
        {...input}
        {...custom}
      />
      <br />
      <br />
    </div>
  </div>
);

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

interface IFormProps {
  email: string;
  password: string;
}

function CreateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { open, dismiss, handleSubmit, restartIntervalRun } = props;

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleSave = async (formValues: Record<string, any>) => {
    setLoading(true);
    const { username, password } = formValues;
    const [err] = await goPromise(
      createAdminUser({
        username,
        password,
        role_id: 1
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
    }
  };

  const handleClose = () => {
    dismiss();
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
        <title>Create New Admin User</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
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
  form: "createUserDialogForm"
})(CreateDialog);
