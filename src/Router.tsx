import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { Typography, CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import Nav from "./components/main/Nav";
import Login from "./components/main/Auth/Login";
import Logout from "./components/main/Auth/Logout";
import AdminUser from "./components/main/AdminUser";

import { RootState } from "./store";
import { IUser, getMe, IGetMeAction } from "./store/auth";
import JwtTimer from "./components/misc/JwtTimer";
import { goPromise } from "./util/helper";

const HeadlineText = styled(Typography)`
  padding: 1.5rem 4.75rem;
`;

const CenterItAll = styled("div")`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const AdminRoutes = () => {
  const user = useSelector<RootState, null | IUser>(state => state.auth.user);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const dispatch = useDispatch();

  const fetch = React.useCallback(async () => {
    setLoading(true);
    const [err, res] = await goPromise<IGetMeAction>(getMe());
    if (err) {
      console.log({ err });
      setError("error");
    } else {
      dispatch(res);
    }
    setLoading(false);
  }, [dispatch]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  if (error) {
    return (
      <CenterItAll>
        <Typography variant="subtitle1">
          Can't get your profile. Please{" "}
          <a href="/" style={{ color: "lightblue" }}>
            refresh
          </a>{" "}
          the page.
        </Typography>
      </CenterItAll>
    );
  } else if (loading) {
    return (
      <CenterItAll>
        <CircularProgress size={24} /> &nbsp;{" "}
        <Typography variant="subtitle1">Please wait...</Typography>
      </CenterItAll>
    );
  } else {
    return (
      <>
        <Nav />

        <JwtTimer />

        <Switch>
          <Route path="/dashboard">
            <HeadlineText variant="h6">Dashboard</HeadlineText>
          </Route>
          <Route path="/admin_user">
            <AdminUser />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="*">{() => <Redirect to="/dashboard" />}</Route>
        </Switch>
      </>
    );
  }
};

const App = () => {
  const token = useSelector<RootState, string>(state => state.auth.token);

  return (
    <Router>
      {!token ? (
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="*">{() => <Redirect to="/login" />}</Route>
        </Switch>
      ) : (
        <AdminRoutes />
      )}
    </Router>
  );
};

export default App;
