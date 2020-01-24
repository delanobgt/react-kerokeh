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
import { PBanner, updateBanner } from "src/store/banner";

interface IComponentProps {
  bannerId: number;
  dismiss: () => void;
  restartIntervalRun: () => void;
  initialValues: PBanner;
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

function UpdateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const {
    initialValues,
    bannerId,
    dismiss,
    handleSubmit,
    restartIntervalRun
  } = props;
  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      console.log(formValues);
      setLoading(true);
      const [err] = await goPromise(
        updateBanner(initialValues, formValues, formValues.image)
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
        snackbar.showMessage("Banner updated.");
      }
    },
    [dismiss, restartIntervalRun, snackbar, initialValues]
  );

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  return (
    <div>
      <BasicDialog
        open={Boolean(bannerId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Update Banner</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <>
              <Field
                name="title"
                type="text"
                label="Title"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="action_path"
                type="text"
                label="Action Path"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="type"
                label="Type"
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
                label="Action"
                component={renderSelectField}
                validate={[requiredValidator]}
                disabled={loading}
              >
                <MenuItem value={0}>Web View</MenuItem>
                <MenuItem value={1}>Apps</MenuItem>
              </Field>
              <Field
                name="is_active"
                label="Is Active"
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
                label="Expired At"
                component={renderDateField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <div>
                <Typography variant="subtitle1">Current Image</Typography>
                <img
                  src={initialValues.image_url}
                  alt=""
                  style={{ width: "100%" }}
                />
              </div>
              <Field
                name="image"
                label="Banner Image"
                component={renderImageField}
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
  form: "updateBannerDialogForm",
  enableReinitialize: true
})(UpdateDialog);
