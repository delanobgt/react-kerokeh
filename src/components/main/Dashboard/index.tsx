import React from "react";
import { Grid, Paper, Typography, CircularProgress } from "@material-ui/core";
import { goPromise } from "src/util/helper";
import celestineApi from "src/apis/celestine";
import useIntervalRun from "src/hooks/useIntervalRun";

interface Fund {
  floating_fund_amount: number;
  on_process_fund_amount: number;
}

async function getFund(): Promise<Fund> {
  const response = await celestineApi().get(`/admin/statistic/fund`);
  return response.data;
}

function Dashboard() {
  const refreshDelay = 5000;

  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [fund, setFund] = React.useState<Fund>(null);

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, fund] = await goPromise<Fund>(getFund());
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
    const [err, fund] = await goPromise<Fund>(getFund());
    setLoading(false);

    if (err) {
      console.log({ err });
      setError("error");
    } else {
      setFund(fund);
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
          ) : fund ? (
            <>
              <Grid container>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Paper elevation={3} style={{ padding: "1.5rem" }}>
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
              </Grid>
            </>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
