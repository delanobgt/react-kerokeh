import _ from "lodash";
import React from "react";
import { EmpSpan, Div, MyNumber, ContentDiv } from "../components";
import moment from "moment";
import {
  Typography,
  Button,
  CircularProgress,
  MenuItem
} from "@material-ui/core";
import {
  BnibTransactionStatus,
  IBnibTransaction,
  legitCheckBnibTransactionByCode,
  ILegitCheck,
  createLegitCheck
} from "src/store/bnib-transaction";
import ConfirmDialog from "src/components/generic/ConfirmDialog";
import { goPromise } from "src/util/helper";
import BasicSelect from "src/components/generic/BasicSelect";

interface IComponentProps {
  orderNo: number;
  legitCheck: ILegitCheck;
  accessLogFakeItem: any;
  accessLogIndefineableItem: any;
  accessLogAuthenticItem: any;
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
      setError(
        "Something went wrong. Maybe other admin has taken action on this transaction."
      );
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
        setError(
          "Something went wrong. Maybe other admin has taken action on this transaction."
        );
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
            <Typography variant="subtitle1">
              Legit Check <span style={{ color: "red" }}>FAKE</span> (by{" "}
              <EmpSpan>{accessLogFakeItem.admin_username}</EmpSpan> at{" "}
              <EmpSpan>
                {moment(accessLogFakeItem.time).format(
                  "D MMMM YYYY - HH:mm:ss"
                )}
              </EmpSpan>
              )
            </Typography>
          ) : Boolean(accessLogIndefineableItem) ? (
            <Typography variant="subtitle1">
              Legit Check <span style={{ color: "orange" }}>INDEFINABLE</span>{" "}
              (by <EmpSpan>{accessLogIndefineableItem.admin_username}</EmpSpan>{" "}
              at{" "}
              <EmpSpan>
                {moment(accessLogIndefineableItem.time).format(
                  "D MMMM YYYY - HH:mm:ss"
                )}
              </EmpSpan>
              )
            </Typography>
          ) : Boolean(accessLogAuthenticItem) ? (
            <Typography variant="subtitle1">
              Legit Check <span style={{ color: "limegreen" }}>AUTHENTIC</span>{" "}
              (by <EmpSpan>{accessLogAuthenticItem.admin_username}</EmpSpan> at{" "}
              <EmpSpan>
                {moment(accessLogAuthenticItem.time).format(
                  "D MMMM YYYY - HH:mm:ss"
                )}
              </EmpSpan>
              )
            </Typography>
          ) : transaction.status === BnibTransactionStatus.LegitChecking ? (
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
