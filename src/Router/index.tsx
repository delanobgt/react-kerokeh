import React from "react";
import moment from "moment";
import jwtDecode from "jwt-decode";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Typography, CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import Nav from "src/components/main/Nav";
import Login from "src/components/main/Auth/Login";
import Logout from "src/components/main/Auth/Logout";
import User from "src/components/main/User";
import JwtTimer from "src/components/misc/JwtTimer";
import { RootState } from "src/store";
import { getMe, IGetMeAction } from "src/store/auth";
import { goPromise } from "src/util/helper";
import { JWToken } from "src/util/types";
import { RoutePath } from "./routes";
import Dashboard from "src/components/main/Dashboard";

enum EErrorType {
  FETCH_FAIL,
  SESSION_EXPIRED,
}

const CenterItAll = styled("div")`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const routes = [
  {
    routePath: RoutePath.DASHBOARD,
    component: <Dashboard />,
  },
  {
    routePath: RoutePath.LOGOUT,
    component: <Logout />,
  },
  {
    routePath: RoutePath.USER,
    component: <User />,
  },
];

const AdminRoutes = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<EErrorType | null>(null);
  const token = useSelector<RootState, string>((state) => state.auth.token);
  const dispatch = useDispatch();

  const fetch = React.useCallback(async () => {
    setLoading(true);

    const [err, res] = await goPromise<IGetMeAction>(getMe());
    if (err) setError(EErrorType.FETCH_FAIL);
    else dispatch(res);

    setLoading(false);
  }, [dispatch]);

  // check if JWT is expired or not
  React.useEffect(() => {
    const decoded: JWToken = jwtDecode(token);
    if (decoded.exp * 1000 < moment().valueOf()) {
      localStorage.removeItem("auth_token");
      setError(EErrorType.SESSION_EXPIRED);
    } else {
      fetch();
    }
  }, [fetch, token]);

  // render component based on condition
  if (error === EErrorType.FETCH_FAIL) {
    // fail to fetch
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
  } else if (error === EErrorType.SESSION_EXPIRED) {
    // session expired
    return (
      <CenterItAll>
        <Typography variant="subtitle1">
          Your session has expired. Please{" "}
          <a href="/" style={{ color: "lightblue" }}>
            login
          </a>{" "}
          again.
        </Typography>
      </CenterItAll>
    );
  } else if (loading) {
    // still loading
    return (
      <CenterItAll>
        <CircularProgress size={24} /> &nbsp;{" "}
        <Typography variant="subtitle1">Please wait...</Typography>
      </CenterItAll>
    );
  } else {
    // success
    return (
      <>
        <Nav />

        <JwtTimer />

        <Switch>
          {routes.map((route) => (
            <Route key={route.routePath} path={route.routePath}>
              {route.component}
            </Route>
          ))}
          <Route path="*">{() => <Redirect to={RoutePath.DASHBOARD} />}</Route>
        </Switch>
      </>
    );
  }
};

const App = () => {
  const token = useSelector<RootState, string>((state) => state.auth.token);

  return (
    <Router>
      {!token ? (
        <Switch>
          <Route path={RoutePath.LOGIN}>
            <Login />
          </Route>
          <Route path="*">{() => <Redirect to={RoutePath.LOGIN} />}</Route>
        </Switch>
      ) : (
        <AdminRoutes />
      )}
    </Router>
  );
};

export default App;
