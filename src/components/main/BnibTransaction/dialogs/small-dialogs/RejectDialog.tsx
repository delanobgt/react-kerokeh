import _ from "lodash";
import React from "react";
import {
  Button,
  Typography,
  TextField,
  CircularProgress
} from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";

import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { goPromise } from "src/util/helper";
import { rejectBnibTransactionByCode } from "src/store/bnib-transaction";

interface IComponentProps {
  transactionCode: string;
  onAfterSubmit: () => void;
  dismiss: () => void;
}

function RejectDialog(props: IComponentProps) {
  const { transactionCode, onAfterSubmit, dismiss } = props;
  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [reason, setReason] = React.useState<string>("");

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const submit = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [err] = await goPromise<void>(
      rejectBnibTransactionByCode(transactionCode, reason)
    );
    setLoading(false);

    if (err) {
      console.log(err);
      setError(_.get(err, "response.data.errors", "Something went wrong!"));
    } else {
      onAfterSubmit();
      dismiss();
      snackbar.showMessage("Bnib Transaction Product rejected.");
    }
  }, [transactionCode, reason, onAfterSubmit, dismiss, snackbar]);

  return (
    <div>
      <BasicDialog
        open={Boolean(transactionCode)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Reject</title>
        <section>
          <div>
            <Typography variant="subtitle1">
              Please input the rejected reason.
            </Typography>
            <TextField
              value={reason}
              onChange={e => setReason(e.target.value)}
              disabled={loading}
              fullWidth
            />
            {Boolean(error) && (
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {error}
              </Typography>
            )}
          </div>
          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <Button
              onClick={() => handleClose()}
              color="primary"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={reason === "" || loading}
              onClick={() => submit()}
            >
              {loading ? <CircularProgress size={24} /> : "Reject"}
            </Button>
          </div>
        </section>
      </BasicDialog>
    </div>
  );
}

export default RejectDialog;
