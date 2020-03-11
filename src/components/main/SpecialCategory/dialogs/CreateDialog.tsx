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
import {
  requiredValidator,
  nonZeroWholeNumberValidator
} from "src/redux-form/validators";
import { renderTextField, renderSelectField } from "src/redux-form/renderers";
import { createSpecialCategory } from "src/store/special-category";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

interface IFormProps {
  name: string;
  priority: number;
  published: number;
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
      const { name, priority, published } = formValues;
      const [err] = await goPromise(
        createSpecialCategory({
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
        snackbar.showMessage("Special Category created.");
      }
    },
    [dismiss, restartIntervalRun, snackbar]
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
        bgClose={!loading}
      >
        <title>Create New Special Category</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <>
              <Field
                name="name"
                type="string"
                label="Name*"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="priority"
                type="text"
                label="Priority*"
                component={renderTextField}
                validate={[requiredValidator, nonZeroWholeNumberValidator]}
                disabled={loading}
              />
              <Field
                name="published"
                label="Published*"
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
                  {loading ? <CircularProgress size={24} /> : "Create"}
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
  form: "createSpecialCategoryDialogForm"
})(CreateDialog);
