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
import { createFavorite } from "src/store/favorite";
import ImageInput from "src/components/generic/input/ImageInput";
import Bounce from "react-reveal/Bounce";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
  refresh: () => void;
}

function CreateDialog(props: IComponentProps) {
  const { open, dismiss, refresh } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [file, setFile] = React.useState<File>(null);
  const [completed, setCompleted] = React.useState<number>(0);
  const [songName, setSongName] = React.useState<string>("");
  const [songArtist, setSongArtist] = React.useState<string>("");

  const handleSave = React.useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      const [err] = await goPromise(createFavorite(file, songName, songArtist));
      setLoading(false);
      if (err) {
        console.log(err);
        setError("error");
      } else {
        dismiss();
        refresh();
        snackbar.showMessage("Song added to Library.");
      }
    },
    [dismiss, snackbar, file, refresh, songName, songArtist]
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
        <title>Add New Song</title>
        <section>
          <form onSubmit={handleSave}>
            <>
              {!loading && (
                <>
                  {Boolean(songName) && Boolean(songArtist) && (
                    <>
                      <TextField
                        color="primary"
                        value={songName}
                        label="Title"
                        fullWidth
                        onChange={(e) => {
                          setSongName(e.target.value);
                        }}
                      />
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Tooltip title="Switch Title and Artist">
                          <div>
                            <IconButton
                              edge="end"
                              onClick={() => {
                                const _songName = songName;
                                const _songArtist = songArtist;
                                setSongName(_songArtist);
                                setSongArtist(_songName);
                              }}
                            >
                              <CachedIcon />
                            </IconButton>
                          </div>
                        </Tooltip>
                      </div>
                      <TextField
                        color="primary"
                        value={songArtist}
                        label="Artist"
                        fullWidth
                        onChange={(e) => {
                          setSongArtist(e.target.value);
                        }}
                      />
                    </>
                  )}

                  <br />
                  <br />
                  <ImageInput
                    label="Song"
                    accept=".mp3"
                    extensions={["mp3"]}
                    value={file}
                    onChange={(file) => {
                      console.log(file);
                      setFile(file);
                      const tokens = file.name
                        .replace(/\(.*\)/gi, "")
                        .replace(/\..+/gi, "")
                        .split(/-+/);
                      if (tokens.length < 2) tokens.push(tokens[0]);
                      setSongName(tokens[0].trim());
                      setSongArtist(tokens[1].trim());
                    }}
                    maxSize={8000000}
                  />
                  {Boolean(file) && (
                    <Typography variant="subtitle1">
                      Filename: {file.name}
                    </Typography>
                  )}

                  {error && (
                    <Typography variant="subtitle1">
                      Something is wrong. Please try again.
                    </Typography>
                  )}
                </>
              )}

              {loading && (
                <>
                  <img
                    alt=""
                    src={
                      "https://i.pinimg.com/originals/97/e9/42/97e942ce7fc4e9d4ea6d844a382f251f.gif"
                    }
                    style={{ width: "100%" }}
                  />
                  <LinearProgress variant="indeterminate" value={completed} />
                </>
              )}

              <br />
              <div style={{ textAlign: "right" }}>
                <Button onClick={handleClose} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={loading || !Boolean(file)}
                >
                  {loading ? <CircularProgress size={24} /> : "Add"}
                </Button>
              </div>
            </>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default CreateDialog;
