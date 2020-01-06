import React from "react";
import moment from "moment";
import jwtDecode from "jwt-decode";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { Typography, CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { SnackbarProvider } from "material-ui-snackbar-provider";

import Nav from "./components/main/Nav";
import Login from "./components/main/Auth/Login";
import Logout from "./components/main/Auth/Logout";
import AdminUser from "./components/main/AdminUser";
import Config from "./components/main/Config";
import DepositFee from "./components/main/DepositFee";
import Product from "./components/main/Product";
import ProductBrand from "./components/main/ProductBrand";
import ProductCategory from "./components/main/ProductCategory";
import PromoCode from "./components/main/PromoCode";
import Identification from "./components/main/Identification";
import User from "./components/main/User";
import SpecialCategory from "./components/main/SpecialCategory";
import SpecialCategoryList from "./components/main/SpecialCategoryList";
import WithdrawRequest from "./components/main/WithdrawRequest";
import JwtTimer from "./components/misc/JwtTimer";
import { RootState } from "./store";
import { getMe, IGetMeAction } from "./store/auth";
import { goPromise } from "./util/helper";
import { JWToken } from "./util/types";

enum EErrorType {
  FETCH_FAIL,
  SESSION_EXPIRED
}

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
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<EErrorType | null>(null);
  const token = useSelector<RootState, string>(state => state.auth.token);
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
          <Route path="/dashboard">
            <HeadlineText variant="h6">Dashboard</HeadlineText>
          </Route>
          <Route path="/config">
            <Config />
          </Route>
          <Route path="/withdraw_request">
            <WithdrawRequest />
          </Route>
          <Route path="/deposit_fee">
            <DepositFee />
          </Route>
          <Route path="/special_category">
            <SpecialCategory />
          </Route>
          <Route path="/special_category_list">
            <SpecialCategoryList />
          </Route>
          <Route path="/product">
            <Product />
          </Route>
          <Route path="/product_category">
            <ProductCategory />
          </Route>
          <Route path="/product_brand">
            <ProductBrand />
          </Route>
          <Route path="/promo_code">
            <PromoCode />
          </Route>
          <Route path="/identification">
            <Identification />
          </Route>
          <Route path="/user">
            <User />
          </Route>
          <Route path="/admin_user">
            <AdminUser />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="*">{() => <Redirect to="/dashboard" />}</Route>
        </Switch>
        <br />
      </>
    );
  }
};

const App = () => {
  const token = useSelector<RootState, string>(state => state.auth.token);

  return (
    <SnackbarProvider SnackbarProps={{ autoHideDuration: 2000 }}>
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
    </SnackbarProvider>
  );
};

export default App;
