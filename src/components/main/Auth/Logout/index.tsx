import React from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "material-ui-snackbar-provider";

import { signOut } from "src/store/auth";
import { EFavoriteActionTypes } from "src/store/favorite";

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const snackbar = useSnackbar();

  React.useEffect(() => {
    dispatch(signOut());
    dispatch({
      type: EFavoriteActionTypes.FAVORITE_GET,
      favorites: [],
    });
    dispatch({
      type: EFavoriteActionTypes.FAVORITE_PLAYING_SET,
      favorite: null,
    });
    snackbar.showMessage("Logged Out successfully.");
  }, [dispatch, snackbar]);

  return null;
};

export default Logout;
