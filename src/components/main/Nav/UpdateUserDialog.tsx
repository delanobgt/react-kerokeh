import _ from "lodash";
import React from "react";
import {
  Button,
  CircularProgress,
  Typography,
  MenuItem,
  LinearProgress,
  TextField,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Cached as CachedIcon } from "@material-ui/icons";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { createFavorite, updateFavorite } from "src/store/favorite";
import ImageInput from "src/components/generic/input/ImageInput";
import Bounce from "react-reveal/Bounce";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/store";
import { IAuthUser, IGetMeAction, getMe, updateMe } from "src/store/auth";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
}

function UpdateUserDialog(props: IComponentProps) {
  const { open, dismiss } = props;

  const snackbar = useSnackbar();
  const user = useSelector<RootState, IAuthUser>((state) => state.auth.user);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [name, setName] = React.useState<string>(user.name);
  const [email, setEmail] = React.useState<string>(user.email);
  const dispatch = useDispatch();

  const handleSave = React.useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      const [err] = await goPromise(updateMe(name, email));
      setLoading(false);
      if (err) {
        console.log(err);
        setError("error");
      } else {
        dismiss();
        const [err, res] = await goPromise<IGetMeAction>(getMe());
        dispatch(res);
        snackbar.showMessage("Profile saved.");
      }
    },
    [dismiss, snackbar, name, email, dispatch]
  );

  const handleClose = () => {
    dismiss();
  };

  // React.useEffect(() => {
  //   if (loading) {
  //     const interval = setInterval(() => {
  //       const unit = 95 / 65;
  //       setCompleted(Math.max(completed + unit, 95));
  //     }, 1000);
  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }
  // }, [loading, completed]);

  return (
    <div>
      <BasicDialog
        open={open}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Edit Song</title>
        <section>
          <form onSubmit={handleSave}>
            <>
              <TextField
                color="primary"
                value={name}
                label="Name"
                fullWidth
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <br />
              <br />
              <TextField
                color="primary"
                type="email"
                value={email}
                label="Email"
                fullWidth
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              {error && (
                <Typography variant="subtitle1">
                  Something is wrong. Please try again.
                </Typography>
              )}

              <br />
              <br />
              <div style={{ textAlign: "right" }}>
                <Button onClick={handleClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Save"}
                </Button>
              </div>
            </>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default UpdateUserDialog;
