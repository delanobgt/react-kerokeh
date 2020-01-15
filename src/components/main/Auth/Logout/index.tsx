import React from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "material-ui-snackbar-provider";

import { signOut } from "src/store/auth";

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const snackbar = useSnackbar();

  React.useEffect(() => {
    dispatch(signOut());
    snackbar.showMessage("Logged Out successfully.");
  }, [dispatch, snackbar]);

  return null;
};

export default Logout;
