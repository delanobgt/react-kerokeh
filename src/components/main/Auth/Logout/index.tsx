import React from "react";
import { useDispatch } from "react-redux";

import { signOut } from "src/store/auth";

const Logout: React.FC = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(signOut());
  });

  return null;
};

export default Logout;
