import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

import { deleteAdminUser } from "src/store/adminUser";
import { goPromise } from "src/util/helper";
import { RootState } from "src/store";
import BasicDialog from "src/components/generic/BasicDialog";

interface IComponentProps {
  userId: number;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

function DeleteDialog(props: IComponentProps) {
  const { userId, restartIntervalRun, dismiss } = props;

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleDelete = async () => {
    setLoading(true);
    const [err] = await goPromise(deleteAdminUser(userId));
    setLoading(false);
    if (err) {
      setError("error");
    } else {
      restartIntervalRun();
      dismiss();
    }
  };

  const handleClose = () => {
    dismiss();
  };

  const username = useSelector<RootState, string>(state =>
    _.get(state.adminUser.adminUsers, `${userId}.username`, null)
  );

  return (
    <div>
      <BasicDialog
        open={Boolean(userId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose
      >
        <title>Delete Admin User</title>
        <section>
          <form>
            <Typography variant="subtitle1">Delete {username} ?</Typography>
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
