import React from "react";
import { Grid, Paper, Typography, CircularProgress } from "@material-ui/core";
import { goPromise } from "src/util/helper";
import celestineApi from "src/apis/celestine";
import useIntervalRun from "src/hooks/useIntervalRun";
import styled from "styled-components";
import { Money as MoneyIcon } from "@material-ui/icons";
import Link from "src/components/generic/Link";
import { RoutePath } from "src/Router/routes";

const TitleDiv = styled.div`
  display: flex;
  align-items: center;
`;

const BlueLink = styled(Link)`
  color: cornflowerblue;
`;

interface IFund {
  floating_fund_amount: number;
  on_process_fund_amount: number;
}

interface IDashboardInfo {
  total_user: number;
}

interface ICounter {
  identification: number;
  withdraw_request: number;
  on_shipping_to_depatu: number;
  waiting_for_tracking_code: number;
}

async function getFund(): Promise<IFund> {
  const response = await celestineApi().get(`/admin/statistic/fund`);
  return response.data;
}

async function getDashboardInfo(): Promise<IDashboardInfo> {
  const response = await celestineApi().get(`/admin/statistic`);
  return response.data;
}

async function getCounter(): Promise<ICounter> {
  const response = await celestineApi().get(`/admin/statistic/counter`);
  return response.data;
}

function Dashboard() {
  const refreshDelay = 5000;

  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [fund, setFund] = React.useState<IFund>(null);
  const [counter, setCounter] = React.useState<ICounter>(null);
  const [dashboardInfo, setDashboardInfo] = React.useState<IDashboardInfo>(
    null
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, fund] = await goPromise<IFund>(getFund());
    if (err) {
      throw err;
    } else {
      setFund(fund);
    }
  }, []);
  const intervalRun = useIntervalRun(() => autoFetch(), refreshDelay);
  const { setAlive: setIntervalRunAlive } = intervalRun;

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errFund, fund] = await goPromise<IFund>(getFund());
    const [errCounter, counter] = await goPromise<ICounter>(getCounter());
    const [errDashboardInfo, dashboardInfo] = await goPromise<IDashboardInfo>(
      getDashboardInfo()
    );
    setLoading(false);

    if (errFund || errDashboardInfo || errCounter) {
      console.log({ errFund, errDashboardInfo, errCounter });
      setError("error");
    } else {
      setFund(fund);
      setCounter(counter);
      setDashboardInfo(dashboardInfo);
      setIntervalRunAlive(true);
    }
  }, [setFund, setIntervalRunAlive]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <CircularProgress size={24} /> Loading...
            </div>
          ) : error ? (
            <Typography variant="subtitle1" color="secondary">
              An error occured, please{" "}
              <span onClick={fetch} style={{ color: "lightblue" }}>
                retry
              </span>
              .
            </Typography>
          ) : fund && dashboardInfo && counter ? (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Paper elevation={3} style={{ padding: "1.5rem" }}>
                    <Typography variant="h5">General Info</Typography>
                    <br />
                    <Typography variant="subtitle1">
                      <strong>Total User :</strong> {dashboardInfo.total_user}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Paper elevation={3} style={{ padding: "1.5rem" }}>
                    <TitleDiv>
                      <Typography variant="h5">Depatu Wallet</Typography>
                      <MoneyIcon
                        style={{
                          marginLeft: "0.5rem",
                          color: "cornflowerblue"
                        }}
                      />
                    </TitleDiv>
                    <br />
                    <Typography variant="subtitle1">
                      <strong>Floating Fund :</strong> Rp.{" "}
                      {Number(fund.floating_fund_amount).toLocaleString(
                        "de-De"
                      )}
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>On Process Fund :</strong> Rp.{" "}
                      {Number(fund.on_process_fund_amount).toLocaleString(
                        "de-DE"
                      )}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Paper elevation={3} style={{ padding: "1.5rem" }}>
                    <Typography variant="h5">Things to do!</Typography>
                    <br />
                    <Typography variant="subtitle1">
                      <strong>Identification:</strong> {counter.identification}{" "}
                      ATTEMPTED{" "}
                      {counter.identification > 0 && (
                        <BlueLink to={RoutePath.IDENTIFICATION}>
                          (visit)
                        </BlueLink>
                      )}
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Withdraw Request:</strong>{" "}
                      {counter.withdraw_request} PENDING{" "}
                      {counter.withdraw_request > 0 && (
                        <BlueLink to={RoutePath.WITHDRAW_REQUEST}>
                          (visit)
                        </BlueLink>
                      )}
                    </Typography>

                    <br />
                    <Typography variant="subtitle1">
                      <strong>[Transaction]</strong>
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>On Shipping to Depatu:</strong>{" "}
                      {counter.on_shipping_to_depatu} TRANSACTION(S){" "}
                      {counter.on_shipping_to_depatu > 0 && (
                        <BlueLink to={RoutePath.BNIB_TRANSACTION}>
                          (visit)
                        </BlueLink>
                      )}
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Waiting for Tracking Code:</strong>{" "}
                      {counter.waiting_for_tracking_code} TRANSACTION(S){" "}
                      {counter.waiting_for_tracking_code > 0 && (
                        <BlueLink to={RoutePath.BNIB_TRANSACTION}>
                          (visit)
                        </BlueLink>
                      )}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
