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

interface IComponentProps {
  id: number;
  title: string;
  artist: string;
  dismiss: () => void;
  refresh: () => void;
}

function UpdateDialog(props: IComponentProps) {
  const { id, dismiss, refresh } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>(props.title);
  const [artist, setArtist] = React.useState<string>(props.artist);

  const handleSave = React.useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      const [err] = await goPromise(updateFavorite(id, title, artist));
      setLoading(false);
      if (err) {
        console.log(err);
        setError("error");
      } else {
        dismiss();
        refresh();
        snackbar.showMessage("Song updated.");
      }
    },
    [dismiss, snackbar, refresh, title, artist, id]
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
        open={Boolean(id)}
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
                value={title}
                label="Title"
                fullWidth
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Tooltip title="Switch Title and Artist">
                  <div>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        const _songName = title;
                        const _songArtist = artist;
                        setTitle(_songArtist);
                        setArtist(_songName);
                      }}
                    >
                      <CachedIcon />
                    </IconButton>
                  </div>
                </Tooltip>
              </div>
              <TextField
                color="primary"
                value={artist}
                label="Artist"
                fullWidth
                onChange={(e) => {
                  setArtist(e.target.value);
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

export default UpdateDialog;
