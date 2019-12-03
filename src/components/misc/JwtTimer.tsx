import React from "react";
import moment from "moment";
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { RootState } from "src/store";
import BasicDialog from "src/components/generic/BasicDialog";
import Link from "src/components/generic/Link";
import { JWToken } from "src/util/types";

const JwtTimer = () => {
  const token = useSelector<RootState, string>(state => state.auth.token);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const decoded: JWToken = jwtDecode(token);
    const timeoutDelay = Math.max(0, decoded.exp * 1000 - moment().valueOf());
    const expTimeout = setTimeout(() => {
      setDialogOpen(true);
    }, timeoutDelay);
    return () => {
      clearTimeout(expTimeout);
    };
  }, []);

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
