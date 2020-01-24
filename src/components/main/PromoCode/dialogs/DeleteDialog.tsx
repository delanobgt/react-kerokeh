import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { deletePromoCode } from "src/store/promo-code";

interface IComponentProps {
  promoCodeId: number;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

function DeleteDialog(props: IComponentProps) {
  const { promoCodeId, restartIntervalRun, dismiss } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleDelete = async () => {
    setLoading(true);
    const [err] = await goPromise(deletePromoCode(promoCodeId));
    setLoading(false);
    if (err) {
      setError("error");
    } else {
      restartIntervalRun();
      dismiss();
      snackbar.showMessage("Promo Code deleted.");
    }
  };

  const handleClose = () => {
    dismiss();
  };

  return (
    <div>
      <BasicDialog
        open={Boolean(promoCodeId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Delete Promo Code</title>
        <section>
          <form>
            <Typography variant="subtitle1">Delete ?</Typography>
            {error && (
              <Typography variant="subtitle1">
                Something is wrong. Please try again.
              </Typography>
            )}
            <div style={{ textAlign: "right" }}>
              <Button onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleDelete} color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Delete it!"}
              </Button>
            </div>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default DeleteDialog;
