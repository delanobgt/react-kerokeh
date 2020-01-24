import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { approveWithdrawRequest } from "src/store/withdraw-request";

interface IComponentProps {
  withdrawRequestId: number;
  fetch: () => void;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

function ApproveDialog(props: IComponentProps) {
  const { withdrawRequestId, restartIntervalRun, fetch, dismiss } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleApprove = React.useCallback(async () => {
    setLoading(true);
    const [err] = await goPromise(approveWithdrawRequest(withdrawRequestId));
    setLoading(false);
    if (err) {
      setError("error");
    } else {
      fetch();
      restartIntervalRun();
      dismiss();
      snackbar.showMessage("Withdraw Request approved.");
    }
  }, [withdrawRequestId, dismiss, restartIntervalRun, fetch, snackbar]);

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
        bgClose={!loading}
      >
        <title>Approve Withdraw Request</title>
        <section>
          <form>
            <Typography variant="subtitle1">Are you sure ?</Typography>
            {error && (
              <Typography variant="subtitle1">
                Something is wrong. Please try again.
              </Typography>
            )}
            <div style={{ textAlign: "right" }}>
              <Button onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Approve!"}
              </Button>
            </div>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default ApproveDialog;
