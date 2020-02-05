import React from "react";
import moment from "moment";
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { RootState } from "src/store";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import Link from "src/components/generic/Link";
import { JWToken } from "src/util/types";
import { useSnackbar } from "material-ui-snackbar-provider";

const JwtTimer = () => {
  const token = useSelector<RootState, string>(state => state.auth.token);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const snackbar = useSnackbar();

  React.useEffect(() => {
    if (!token) return;
    const decoded: JWToken = jwtDecode(token);
    const expiredTimeLeftMs = Math.max(
      0,
      decoded.exp * 1000 - moment().valueOf()
    );
    const timeouts: number[] = [];
    timeouts.push(
      setTimeout(() => {
        setDialogOpen(true);
      }, expiredTimeLeftMs)
    );
    // minutes
    [
      5,
      4,
      3,
      2,
      1,
      30 / 60,
      15 / 60,
      5 / 60,
      4 / 60,
      3 / 60,
      2 / 60,
      1 / 60
    ].forEach(minute => {
      console.log("before", minute);
      const timeoutDelayMs = expiredTimeLeftMs - minute * 60 * 1000;
      if (timeoutDelayMs > 0) {
        timeouts.push(
          setTimeout(() => {
            const time = minute < 1 ? minute * 60 : minute;
            const unit = minute < 1 ? "seconds" : "minutes";
            console.log("after", minute);
            snackbar.showMessage(
              `Your session will be expired in ${time} ${unit}`
            );
          }, timeoutDelayMs)
        );
      }
    });

    return () => {
      for (const timeout of timeouts) {
        clearTimeout(timeout);
      }
    };
  }, [token, snackbar]);

  return (
    <BasicDialog
      open={dialogOpen}
      dismiss={() => {}}
      maxWidth="xs"
      fullWidth={true}
    >
      <title>Your session has expired</title>
      <details>Please login again to access this admin panel again.</details>
      <section>
        <div style={{ textAlign: "right" }}>
          <Button color="primary" variant="contained">
            <Link to="/logout">Login</Link>
          </Button>
        </div>
      </section>
    </BasicDialog>
  );
};

export default JwtTimer;
