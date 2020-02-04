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
  SubmissionError,
  InjectedFormProps
} from "redux-form";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { requiredValidator } from "src/redux-form/validators";
import {
  renderTextField,
  renderSelectField,
  renderDateField,
  renderImageField
} from "src/redux-form/renderers";
import { createBanner } from "src/store/banner";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
  restartIntervalRun: () => void;
  initialValues: {
    expired_at: string;
  };
}

interface IFormProps {
  title: string;
  type: number;
  action: number;
  action_path: string;
  is_active: boolean | number;
  expired_at: string;
  image: any;
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
      const [err] = await goPromise(createBanner(formValues, formValues.image));
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
        snackbar.showMessage("Banner created.");
      }
    },
    [dismiss, restartIntervalRun, snackbar]
  );

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
        bgClose={!loading}
      >
        <title>Create Banner</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <>
              <Field
                name="title"
                type="text"
                label="Title*"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="action_path"
                type="text"
                label="Action Path*"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="type"
                label="Type*"
                component={renderSelectField}
                validate={[requiredValidator]}
                disabled={loading}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Legit Check</MenuItem>
                <MenuItem value={2}>Market Place</MenuItem>
              </Field>
              <Field
                name="action"
                label="Action*"
                component={renderSelectField}
                validate={[requiredValidator]}
                disabled={loading}
              >
                <MenuItem value={0}>Web View</MenuItem>
                <MenuItem value={1}>Apps</MenuItem>
              </Field>
              <Field
                name="is_active"
                label="Is Active*"
                component={renderSelectField}
                validate={[requiredValidator]}
                disabled={loading}
              >
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Inactive</MenuItem>
              </Field>
              <Field
                name="expired_at"
                type="text"
                label="Expired At*"
                component={renderDateField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="image"
                label="Banner Image (1x3)*"
                component={renderImageField}
                validate={[requiredValidator]}
                disabled={loading}
                accept="image/jpg,image/jpeg,image/png"
                extensions={["jpg", "jpeg", "png"]}
              />
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
            </>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "createBannerDialogForm"
})(CreateDialog);
