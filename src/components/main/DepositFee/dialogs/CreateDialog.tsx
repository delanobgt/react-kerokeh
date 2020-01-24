import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
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
import { renderTextField } from "src/redux-form/renderers";
import { createDepositFee } from "src/store/deposit-fee";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

interface IFormProps {
  fee: number;
  starting_price: number;
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
      const { fee, starting_price } = formValues;
      const [err] = await goPromise(
        createDepositFee({
          fee: Number(fee),
          starting_price: Number(starting_price)
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
        snackbar.showMessage("Deposit Fee created.");
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
        <title>Create Deposit Fee</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <>
              <Field
                name="fee"
                type="number"
                label="Fee"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="starting_price"
                type="number"
                label="Starting Price"
                component={renderTextField}
                validate={[requiredValidator]}
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
            </>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "createDepositFeeDialogForm"
})(CreateDialog);
