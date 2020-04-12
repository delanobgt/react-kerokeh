import React from "react";
import moment from "moment";
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { RootState } from "src/store";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import Link from "src/components/generic/Link";
import { JWToken } from "src/util/types";
// import styled from "styled-components";

// const TimerPanel = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   position: fixed;
//   left: 50%;
//   top: 0
//   transform: translate(-50%, 0);
//   font-size: 0.8rem;
//   font-family: Roboto;
//   color: rgba(0, 0, 0, 0.65);
//   background: rgba(255, 255, 255, 0.75);
//   border-bottom-left-radius: 5px;
//   border-bottom-right-radius: 5px;
//   padding: 0.15em 0.25em;
//   width: 7.5em;
//   z-index: 20;
// `;

const JwtTimer = () => {
  const token = useSelector<RootState, string>((state) => state.auth.token);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [timerMs, setTimerMs] = React.useState<number>(0);

  React.useEffect(() => {
    if (!token) return;
    const decoded: JWToken = jwtDecode(token);

    const expiredTimeLeftMs = Math.max(
      0,
      decoded.exp * 1000 - moment().valueOf()
    );
    const expiredTimeout: number = setTimeout(() => {
      setDialogOpen(true);
    }, expiredTimeLeftMs);

    const timerInterval = setInterval(() => {
      setTimerMs(decoded.exp * 1000 - moment().valueOf());
    }, 1000);

    return () => {
      clearTimeout(expiredTimeout);
      clearInterval(timerInterval);
    };
  }, [token]);

  return (
    <>
      {/* <TimerPanel>
        {String(Math.floor(timerMs / (60 * 60 * 1000))).padStart(2, "0")} :{" "}
        {String(
          Math.floor(Math.floor(timerMs % (60 * 60 * 1000)) / (60 * 1000))
        ).padStart(2, "0")}{" "}
        :{" "}
        {String(Math.floor(Math.floor(timerMs % (60 * 1000)) / 1000)).padStart(
          2,
          "0"
        )}
      </TimerPanel> */}
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
    </>
  );
};

export default JwtTimer;
