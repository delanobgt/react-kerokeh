import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { approveWithdrawRequest } from "src/store/withdraw-request";
import {
  reduxForm,
  Field,
  InjectedFormProps,
  SubmissionError
} from "redux-form";
import { requiredValidator } from "src/redux-form/validators";
import { renderTextField } from "src/redux-form/renderers";

interface IComponentProps {
  withdrawRequestId: number;
  fetch: () => void;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

interface IFormProps {
  transaction_code: string;
}

function ApproveDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const {
    withdrawRequestId,
    restartIntervalRun,
    fetch,
    dismiss,
    handleSubmit
  } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const [err] = await goPromise(
        approveWithdrawRequest(withdrawRequestId, formValues.transaction_code)
      );
      setLoading(false);
      if (err) {
        if (_.has(err, "response.data.errors")) {
          throw new SubmissionError(err.response.data.errors);
        } else {
          setError("error");
        }
      } else {
        fetch();
        restartIntervalRun();
        dismiss();
        snackbar.showMessage("Withdraw Request approved.");
      }
    },
    [dismiss, restartIntervalRun, snackbar, withdrawRequestId, fetch]
  );

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  return (
    <div>
      <BasicDialog
        open={Boolean(withdrawRequestId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Approve Withdraw Request</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <Field
              name="transaction_code"
              type="text"
              label="Transaction Code"
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
                {loading ? <CircularProgress size={24} /> : "Approve!"}
              </Button>
            </div>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "approveWithdrawRequestDialogForm"
})(ApproveDialog);
