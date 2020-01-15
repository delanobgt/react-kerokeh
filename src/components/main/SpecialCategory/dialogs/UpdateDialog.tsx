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
import BasicDialog from "src/components/generic/BasicDialog";
import {
  requiredValidator,
  wholeNumberValidator
} from "src/redux-form/validators";
import { renderTextField, renderSelectField } from "src/redux-form/renderers";
import {
  updateSpecialCategory,
  PSpecialCategory
} from "src/store/special-category";

interface IComponentProps {
  specialCategoryId: number;
  dismiss: () => void;
  restartIntervalRun: () => void;
  initialValues: PSpecialCategory;
}

interface IFormProps {
  name: string;
  priority: number;
  published: number | boolean;
}

function UpdateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const {
    specialCategoryId,
    dismiss,
    handleSubmit,
    restartIntervalRun,
    initialValues
  } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const { name, priority, published } = formValues;
      const [err] = await goPromise(
        updateSpecialCategory(initialValues, {
          name,
          priority: Number(priority),
          published: Boolean(published)
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
        snackbar.showMessage("Special Category updated.");
      }
    },
    [dismiss, restartIntervalRun, initialValues, snackbar]
  );

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  return (
    <div>
      <BasicDialog
        open={Boolean(specialCategoryId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose
      >
        <title>Update Special Category</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <Field
              name="name"
              type="text"
              label="Name"
              component={renderTextField}
              validate={[requiredValidator]}
              disabled={loading}
            />
            <Field
              name="priority"
              type="text"
              label="Priority"
              component={renderTextField}
              validate={[requiredValidator, wholeNumberValidator]}
              disabled={loading}
            />
            <Field
              name="published"
              label="Published"
              component={renderSelectField}
              validate={[requiredValidator]}
              disabled={loading}
            >
              <MenuItem value={0}>False</MenuItem>
              <MenuItem value={1}>True</MenuItem>
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
                {loading ? <CircularProgress size={24} /> : "Save"}
              </Button>
            </div>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "updateSpecialCategoryDialogForm",
  enableReinitialize: true
})(UpdateDialog);
