import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import { createStore } from "redux";
import HttpsRedirect from "react-https-redirect";
import { SnackbarProvider } from "material-ui-snackbar-provider";

import { rootReducer } from "src/store";
import Router from "src/Router";

import * as serviceWorker from "./util/serviceWorker";

const store = createStore(rootReducer, {
  auth: {
    token: localStorage.getItem("auth_token")
  }
});

const myTheme = createMuiTheme({
  palette: {
    primary: { main: "#8cb4ef", light: "#8cb4ef", dark: "#8cb4ef" },
    secondary: { main: "#d1be18" }
  }
});

ReactDOM.render(
  <SnackbarProvider SnackbarProps={{ autoHideDuration: 2000 }}>
    <Provider store={store}>
      <MuiThemeProvider theme={myTheme}>
        <HttpsRedirect>
          <Router />
        </HttpsRedirect>
      </MuiThemeProvider>
    </Provider>
  </SnackbarProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
