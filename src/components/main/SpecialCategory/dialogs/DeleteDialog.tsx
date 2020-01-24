import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { deleteSpecialCategory } from "src/store/special-category";

interface IComponentProps {
  specialCategoryId: number;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

function DeleteDialog(props: IComponentProps) {
  const { specialCategoryId, restartIntervalRun, dismiss } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleDelete = React.useCallback(async () => {
    setLoading(true);
    const [err] = await goPromise(deleteSpecialCategory(specialCategoryId));
    setLoading(false);
    if (err) {
      setError("error");
    } else {
      restartIntervalRun();
      dismiss();
      snackbar.showMessage("Special Category deleted.");
    }
  }, [dismiss, restartIntervalRun, specialCategoryId, snackbar]);

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
        bgClose={!loading}
      >
        <title>Delete Special Category</title>
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
