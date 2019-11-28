import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from "@material-ui/core";
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { useDispatch } from "react-redux";

import { createAdminUser, getAdminUsers } from "src/store/adminUser";
import { RenderFieldFn } from "src/util/types";
import { goPromise } from "src/util/helper";

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
  dismiss: () => any;
}

interface IFormProps {
  email: string;
  password: string;
}

function CreateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { open, dismiss, handleSubmit } = props;

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const dispatch = useDispatch();

  const handleSave = async (formValues: Record<string, any>) => {
    setLoading(true);
    console.log(formValues);
    const [err, res] = await goPromise(
      createAdminUser({
        username: "",
        password: "",
        role_id: 0
      })
    );
    if (err) {
    } else {
      const [err, res] = await goPromise(getAdminUsers());
      dispatch(res);
      dismiss();
    }
    setLoading(false);
  };

  const handleClose = () => {
    dismiss();
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogTitle id="alert-dialog-title">
            Create New Admin User
          </DialogTitle>
          <DialogContent>
            <Field
              name="username"
              type="text"
              component={renderField}
              label="Username"
              validate={[required]}
            />
            <Field
              name="password"
              type="password"
              component={renderField}
              label="Password"
              validate={[required]}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "createUserDialogForm"
})(CreateDialog);