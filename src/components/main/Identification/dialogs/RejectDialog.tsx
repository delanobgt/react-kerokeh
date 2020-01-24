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
import {
  IIdentification,
  rejectIdentificationById
} from "src/store/identification";

interface IComponentProps {
  identificationId: number;
  fetch: () => void;
  restartIntervalRun: () => void;
  dismiss: () => void;
}

function AcceptDialog(props: IComponentProps) {
  const { identificationId, fetch, restartIntervalRun, dismiss } = props;
  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [reason, setReason] = React.useState<string>("");

  const handleClose = () => {
    dismiss();
  };

  const submit = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errIdentification] = await goPromise<IIdentification>(
      rejectIdentificationById(identificationId, reason)
    );
    setLoading(false);

    if (errIdentification) {
      console.log(errIdentification);
      setError("error");
    } else {
      fetch();
      restartIntervalRun();
      dismiss();
      snackbar.showMessage("Identification rejected.");
    }
  }, [identificationId, reason, fetch, dismiss, restartIntervalRun, snackbar]);

  return (
    <div>
      <BasicDialog
        open={Boolean(identificationId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Reject Identification</title>
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
            <div style={{ textAlign: "right" }}>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginTop: "1rem" }}
                disabled={reason === "" || loading}
                onClick={() => submit()}
              >
                {loading ? <CircularProgress size={24} /> : "Reject"}
              </Button>
            </div>
            {Boolean(error) && (
              <Typography variant="subtitle2" style={{ color: "red" }}>
                Please try again.
              </Typography>
            )}
          </div>
          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <Button
              onClick={() => handleClose()}
              color="primary"
              disabled={loading}
            >
              Close
            </Button>
          </div>
        </section>
      </BasicDialog>
    </div>
  );
}

export default AcceptDialog;
