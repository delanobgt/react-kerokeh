import React from "react";
import {
  Button,
  Typography,
  TextField,
  CircularProgress
} from "@material-ui/core";
import styled from "styled-components";
import { useSnackbar } from "material-ui-snackbar-provider";

import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { goPromise } from "src/util/helper";
import {
  IIdentification,
  acceptIdentificationById
} from "src/store/identification";

const Pre = styled.pre`
  display: inline;
  background: lightgray;
  padding: 0.2rem 0.5rem;
`;

interface IComponentProps {
  identificationId: number;
  fetch: () => void;
  restartIntervalRun: () => void;
  dismiss: () => void;
}

const TERM = "accept";

function AcceptDialog(props: IComponentProps) {
  const { identificationId, fetch, restartIntervalRun, dismiss } = props;
  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [term, setTerm] = React.useState<string>("");

  const handleClose = () => {
    dismiss();
  };

  const submit = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errIdentification] = await goPromise<IIdentification>(
      acceptIdentificationById(identificationId)
    );
    setLoading(false);

    if (errIdentification) {
      console.log(errIdentification);
      setError("error");
    } else {
      fetch();
      restartIntervalRun();
      dismiss();
      snackbar.showMessage("Identification accepted.");
    }
  }, [identificationId, fetch, dismiss, restartIntervalRun, snackbar]);

  return (
    <div>
      <BasicDialog
        open={Boolean(identificationId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Accept Identification</title>
        <section>
          <div>
            <Typography variant="subtitle1">
              Please type <Pre>accept</Pre> for confirmation.
            </Typography>
            <TextField
              value={term}
              onChange={e => setTerm(e.target.value)}
              disabled={loading}
            />
            <Button
              variant="outlined"
              color="primary"
              style={{ marginLeft: "1rem" }}
              disabled={term !== TERM || loading}
              onClick={() => submit()}
            >
              {loading ? <CircularProgress size={24} /> : "Accept"}
            </Button>
            {Boolean(error) && (
              <Typography variant="subtitle2" style={{ color: "red" }}>
                Please try again.
              </Typography>
            )}
          </div>
          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <Button
              onClick={() => handleClose()}
              color="primary"
              disabled={loading}
            >
              Close
            </Button>
          </div>
        </section>
      </BasicDialog>
    </div>
  );
}

export default AcceptDialog;
