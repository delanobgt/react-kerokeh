import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import Nav from "./components/main/Nav";
import Login from "./components/main/Auth/Login";
import Logout from "./components/main/Auth/Logout";
import AdminUser from "./components/main/AdminUser";

import { getAdminUsers } from "./store/adminUser";
import { RootState } from "./store";
import { IUser } from "./store/auth";
import BasicDialog from "./components/generic/BasicDialog";
import JwtTimer from "./components/misc/JwtTimer";

const HeadlineText = styled(Typography)`
  padding: 1.5rem 4.75rem;
`;

const AdminRoutes = () => {
  const user = useSelector<RootState, null | IUser>(state => state.auth.user);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const dispatch = useDispatch();

  const fetch = React.useCallback(async () => {
    setLoading(true);
    try {
      dispatch(await getAdminUsers());
    } catch (error) {
      console.log({ error });
      setError("error");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  React.useEffect(() => {
    // fetch();
  }, [fetch]);

  // if (!user) return "Please wait..";

  return (
    <>
      <Nav />

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
      )}
    </Router>
  );
};

export default App;
