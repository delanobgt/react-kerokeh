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

import Nav from "src/components/main/Nav";
import Login from "src/components/main/Auth/Login";
import Logout from "src/components/main/Auth/Logout";
import AdminUser from "src/components/main/AdminUser";
import Config from "src/components/main/Config";
import DepositFee from "src/components/main/DepositFee";
import Product from "src/components/main/Product";
import ProductBrand from "src/components/main/ProductBrand";
import ProductCategory from "src/components/main/ProductCategory";
import PromoCode from "src/components/main/PromoCode";
import Identification from "src/components/main/Identification";
import User from "src/components/main/User";
import SpecialCategory from "src/components/main/SpecialCategory";
import SpecialCategoryList from "src/components/main/SpecialCategoryList";
import WithdrawRequest from "src/components/main/WithdrawRequest";
import JwtTimer from "src/components/misc/JwtTimer";
import { RootState } from "src/store";
import { getMe, IGetMeAction } from "src/store/auth";
import { goPromise } from "src/util/helper";
import { JWToken } from "src/util/types";
import { RoutePath } from "./routes";
import TopUp from "src/components/main/TopUp";
import Banner from "src/components/main/Banner";
import BnibTransaction from "src/components/main/BnibTransaction";

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

const routes = [
  {
    routePath: RoutePath.ADMIN_USER,
    component: <AdminUser />
  },
  {
    routePath: RoutePath.BANNER,
    component: <Banner />
  },
  {
    routePath: RoutePath.BNIB_TRANSACTION,
    component: <BnibTransaction />
  },
  {
    routePath: RoutePath.CONFIG,
    component: <Config />
  },
  {
    routePath: RoutePath.DASHBOARD,
    component: <HeadlineText variant="h6">Dashboard</HeadlineText>
  },
  {
    routePath: RoutePath.DEPOSIT_FEE,
    component: <DepositFee />
  },
  {
    routePath: RoutePath.IDENTIFICATION,
    component: <Identification />
  },
  {
    routePath: RoutePath.LOGOUT,
    component: <Logout />
  },
  {
    routePath: RoutePath.PRODUCT,
    component: <Product />
  },
  {
    routePath: RoutePath.PRODUCT_BRAND,
    component: <ProductBrand />
  },
  {
    routePath: RoutePath.PRODUCT_CATEGORY,
    component: <ProductCategory />
  },
  {
    routePath: RoutePath.PROMO_CODE,
    component: <PromoCode />
  },
  {
    routePath: RoutePath.SPECIAL_CATEGORY,
    component: <SpecialCategory />
  },
  {
    routePath: RoutePath.SPECIAL_CATEGORY_LIST,
    component: <SpecialCategoryList />
  },
  {
    routePath: RoutePath.TOP_UP,
    component: <TopUp />
  },
  {
    routePath: RoutePath.USER,
    component: <User />
  },
  {
    routePath: RoutePath.WITHDRAW_REQUEST,
    component: <WithdrawRequest />
  }
];

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
          {routes.map(route => (
            <Route key={route.routePath} path={route.routePath}>
              {route.component}
            </Route>
          ))}
          <Route path="*">{() => <Redirect to={RoutePath.DASHBOARD} />}</Route>
        </Switch>
        <br />
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
