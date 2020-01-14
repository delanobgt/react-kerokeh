import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
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
  unsignedRealNumberValidator
} from "src/redux-form/validators";
import { renderTextField } from "src/redux-form/renderers";
import { updateConfig, PConfig } from "src/store/config";

interface IComponentProps {
  configId: number;
  dismiss: () => void;
  restartIntervalRun: () => void;
  initialValues: PConfig;
}

interface IFormProps {
  name: string;
  value: number;
}

function UpdateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const {
    configId,
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
      const { name, value } = formValues;
      const [err] = await goPromise(
        updateConfig({
          id: initialValues.id,
          name: name,
          value: Number(value)
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
        snackbar.showMessage("Product Brand updated.");
      }
    },
    [dismiss, restartIntervalRun, initialValues.id, snackbar]
  );

  const handleClose = () => {
    dismiss();
  };

  return (
    <div>
      <BasicDialog
        open={Boolean(configId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose
      >
        <title>Update Config</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <Field
              name="name"
              type="text"
              label="Name"
              component={renderTextField}
              validate={[requiredValidator]}
              disabled={true}
            />
            <Field
              name="value"
              type="text"
              label="Value"
              component={renderTextField}
              validate={[requiredValidator, unsignedRealNumberValidator]}
              disabled={loading}
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
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "updateConfigDialogForm",
  enableReinitialize: true
})(UpdateDialog);
