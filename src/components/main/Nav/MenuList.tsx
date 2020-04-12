import _ from "lodash";
import React from "react";
import {
  ListItemIcon,
  ListItemText,
  ListItem,
  List,
  Typography,
  Button,
  CircularProgress,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import {
  Contactless as ContactlessIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "material-ui-snackbar-provider";
import { goPromise } from "src/util/helper";
import {
  getFavorites,
  IFavoriteGetAction,
  IFavorite,
  setPlayingFavorite,
} from "src/store/favorite";
import { RootState } from "src/store";
import DeleteDialog from "./DeleteDialog";
import UpdateDialog from "./UpdateDialog";

interface IProps {
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function formatDuration(duration: number): string {
  let hh = `${Math.floor(duration / 60)}`;
  if (hh.length < 2) hh = "0" + hh;
  let mm = `${duration % 60}`;
  if (mm.length < 2) hh = "0" + mm;
  return `${hh}:${mm}`;
}

export default function MenuList({ setDrawerOpen }: IProps) {
  const snackbar = useSnackbar();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [updateDialogObject, setUpdateDialogObject] = React.useState<any>(null);
  const [deleteDialogId, setDeleteDialogId] = React.useState<number>(null);
  const dispatch = useDispatch();

  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [err, res] = await goPromise<IFavoriteGetAction>(getFavorites());
    console.log(res.favorites);

    setLoading(false);
    if (err) {
      console.log({ err });
      setError("error");
    } else {
      dispatch(res);
    }
  }, [dispatch]);

  const silentFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IFavoriteGetAction>(getFavorites());
    if (err) {
      console.log({ err });
    } else {
      dispatch(res);
    }
  }, [dispatch]);

  const favorites = useSelector<RootState, IFavorite[]>(
    (state) => state.favorie.favorites
  );

  const playingFavorite = useSelector<RootState, IFavorite>(
    (state) => state.favorie.playingFavorite
  );

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return loading ? (
    <div style={{ textAlign: "center" }}>
      <CircularProgress size={24} /> Loading...
    </div>
  ) : error ? (
    <div>
      <Typography variant="subtitle1" color="secondary" align="center">
        Something went wrong.
      </Typography>
      <Button onClick={fetch} style={{ color: "lightblue" }}>
        retry
      </Button>
    </div>
  ) : (
    <>
      <List>
        {favorites.map((fav) => (
          <ListItem
            button
            key={fav.id}
            onClick={() => {
              dispatch(setPlayingFavorite(fav));
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>
              <ContactlessIcon />
            </ListItemIcon>
            <ListItemText
              primary={`${fav.song.artist} - ${fav.song.title}`}
              secondary={`${formatDuration(fav.song.duration)} / ${
                fav.song.album
              } / ${fav.song.genre}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() =>
                  setUpdateDialogObject({
                    id: fav.id,
                    title: fav.song.title,
                    artist: fav.song.artist,
                  })
                }
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => setDeleteDialogId(fav.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {Boolean(deleteDialogId) && (
        <DeleteDialog
          favoriteId={deleteDialogId}
          dismiss={() => setDeleteDialogId(null)}
          restartIntervalRun={() => {
            silentFetch();
            if (playingFavorite && deleteDialogId === playingFavorite.id) {
              dispatch(setPlayingFavorite(null));
            }
          }}
        />
      )}
      {Boolean(updateDialogObject) && (
        <UpdateDialog
          id={updateDialogObject.id}
          title={updateDialogObject.title}
          artist={updateDialogObject.artist}
          dismiss={() => setUpdateDialogObject(null)}
          refresh={() => {
            silentFetch();
          }}
        />
      )}
    </>
  );
}
