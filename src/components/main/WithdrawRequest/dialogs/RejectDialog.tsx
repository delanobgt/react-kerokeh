import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/BasicDialog";
import {
  approveWithdrawRequest,
  rejectWithdrawRequest
} from "src/store/withdraw-request";
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
  rejected_reason: string;
}

function RejectDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const {
    withdrawRequestId,
    restartIntervalRun,
    fetch,
    dismiss,
    handleSubmit
  } = props;

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const snackbar = useSnackbar();

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const [err] = await goPromise(
        rejectWithdrawRequest(withdrawRequestId, formValues.rejected_reason)
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
        snackbar.showMessage("Withdraw Request rejected.");
      }
    },
    [dismiss, restartIntervalRun, snackbar, withdrawRequestId, fetch]
  );

  const handleClose = () => {
    dismiss();
  };

  return (
    <div>
      <BasicDialog
        open={Boolean(withdrawRequestId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose
      >
        <title>Approve Withdraw Request</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <Field
              name="rejected_reason"
              type="text"
              label="Rejected Reason"
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
                {loading ? <CircularProgress size={24} /> : "Reject!"}
              </Button>
            </div>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "rejectWithdrawRequestDialogForm"
})(RejectDialog);
