import _ from "lodash";
import React from "react";
import { Div, MyNumber, ContentDiv, Trace } from "../components";
import {
  Typography,
  Button,
  CircularProgress,
  MenuItem
} from "@material-ui/core";
import {
  EBnibTransactionStatus,
  IBnibTransaction,
  legitCheckBnibTransactionByCode,
  ILegitCheck,
  createLegitCheck,
  IAccessLogItem
} from "src/store/bnib-transaction";
import ConfirmDialog from "src/components/generic/dialog/ConfirmDialog";
import { goPromise } from "src/util/helper";
import BasicSelect from "src/components/generic/input/BasicSelect";

interface IComponentProps {
  orderNo: number;
  legitCheck: ILegitCheck;
  accessLogFakeItem: IAccessLogItem;
  accessLogIndefineableItem: IAccessLogItem;
  accessLogAuthenticItem: IAccessLogItem;
  transaction: IBnibTransaction;
  onAfterSubmit: () => void;
}

function LegitCheck(props: IComponentProps) {
  const {
    orderNo,
    legitCheck,
    accessLogFakeItem,
    accessLogIndefineableItem,
    accessLogAuthenticItem,
    transaction,
    onAfterSubmit
  } = props;
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState<boolean>(
    false
  );
  const [result, setResult] = React.useState<string>("");

  const pleaseCreateLegitCheck = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [err] = await goPromise<void>(createLegitCheck(transaction.id));
    setLoading(false);

    if (err) {
      console.log(err);
      setError(_.get(err, "response.data.errors", "Something went wrong!"));
    } else {
      onAfterSubmit();
    }
  }, [onAfterSubmit, transaction.id]);

  const confirmDialogYesCallback = React.useCallback(
    async dismiss => {
      dismiss();
      setError("");
      setLoading(true);
      const [err] = await goPromise<void>(
        legitCheckBnibTransactionByCode(transaction.code, result)
      );
      setLoading(false);

      if (err) {
        console.log(err);
        setError(_.get(err, "response.data.errors", "Something went wrong!"));
      } else {
        onAfterSubmit();
      }
    },
    [onAfterSubmit, transaction.code, result]
  );

  return (
    <>
      <Div>
        <MyNumber variant="subtitle2">{orderNo}</MyNumber>
        <ContentDiv>
          {Boolean(accessLogFakeItem) ? (
            <>
              <Trace
                name={accessLogFakeItem.admin_username}
                time={accessLogFakeItem.time}
              />
              <Typography variant="subtitle1">
                Legit Check <span style={{ color: "red" }}>FAKE</span>
              </Typography>
            </>
          ) : Boolean(accessLogIndefineableItem) ? (
            <>
              <Trace
                name={accessLogIndefineableItem.admin_username}
                time={accessLogIndefineableItem.time}
              />
              <Typography variant="subtitle1">
                Legit Check <span style={{ color: "orange" }}>INDEFINABLE</span>
              </Typography>
            </>
          ) : Boolean(accessLogAuthenticItem) ? (
            <>
              <Typography variant="subtitle1">
                <Trace
                  name={accessLogAuthenticItem.admin_username}
                  time={accessLogAuthenticItem.time}
                />
                Legit Check{" "}
                <span style={{ color: "limegreen" }}>AUTHENTIC</span>
              </Typography>
            </>
          ) : transaction.status === EBnibTransactionStatus.LegitChecking ? (
            legitCheck ? (
              <div>
                <Typography variant="subtitle1">
                  What is the Legit Check result ?
                </Typography>
                <div>
                  <BasicSelect
                    style={{ width: "10rem" }}
                    label="Result"
                    value={result}
                    onChange={(value: string) => {
                      setResult(value);
                    }}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="authentic">Authentic</MenuItem>
                    <MenuItem value="indefinable">Indefinable</MenuItem>
                    <MenuItem value="fake">Fake</MenuItem>
                  </BasicSelect>
                  {Boolean(error) && (
                    <Typography variant="body2" style={{ color: "red" }}>
                      {error}
                    </Typography>
                  )}
                </div>
                <br />
                <Button
                  variant="outlined"
                  color="primary"
                  type="submit"
                  disabled={loading || result === "" || !Boolean(legitCheck)}
                  onClick={() => setConfirmDialogOpen(true)}
                >
                  {loading ? <CircularProgress size={24} /> : "SAVE"}
                </Button>
              </div>
            ) : (
              <div>
                <Typography variant="subtitle1">
                  It's Legit Check time!
                </Typography>
                <div>
                  {Boolean(error) && (
                    <Typography variant="subtitle2" style={{ color: "red" }}>
                      {error}
                    </Typography>
                  )}
                </div>
                <br />
                <Button
                  variant="outlined"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  onClick={() => pleaseCreateLegitCheck()}
                >
                  {loading ? <CircularProgress size={24} /> : "Do Legit Check"}
                </Button>
              </div>
            )
          ) : null}
        </ContentDiv>
      </Div>
      <ConfirmDialog
        title="PLEASE MIND YOUR ACTION !!"
        message={`Are you sure the Legit Check is ${_.upperCase(result)} ?`}
        visible={confirmDialogOpen}
        dismiss={() => setConfirmDialogOpen(false)}
        yesCallback={confirmDialogYesCallback}
      />
    </>
  );
}

export default LegitCheck;
