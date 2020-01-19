import React from "react";
import { EmpSpan, Div, MyNumber, ContentDiv } from "../components";
import moment from "moment";
import { Typography, Button, CircularProgress } from "@material-ui/core";
import {
  BnibTransactionStatus,
  IBnibTransaction,
  acceptBnibTransactionByCode
} from "src/store/bnib-transaction";
import ConfirmDialog from "src/components/generic/ConfirmDialog";
import { goPromise } from "src/util/helper";
import RejectDialog from "../dialogs/RejectDialog";

interface IProps {
  orderNo: number;
  accessLogAcceptedItem: any;
  accessLogRejectedItem: any;
  transaction: IBnibTransaction;
  onAfterSubmit: () => void;
}

export default function(props: IProps) {
  const {
    orderNo,
    accessLogAcceptedItem,
    accessLogRejectedItem,
    transaction,
    onAfterSubmit
  } = props;

  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const accessLogItem = React.useMemo(
    () => accessLogAcceptedItem || accessLogRejectedItem,
    [accessLogAcceptedItem, accessLogRejectedItem]
  );
  const accepted = React.useMemo(() => Boolean(accessLogAcceptedItem), [
    accessLogAcceptedItem
  ]);
  const [acceptDialogOpen, setAcceptDialogOpen] = React.useState<boolean>(
    false
  );
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState<boolean>(
    false
  );
  const confirmDialogYesCallback = React.useCallback(
    async dismiss => {
      dismiss();
      setError("");
      setLoading(true);
      const [err] = await goPromise<void>(
        acceptBnibTransactionByCode(transaction.code)
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
    [onAfterSubmit, transaction.code]
  );

  return (
    <>
      <Div>
        <MyNumber variant="subtitle2">{orderNo}</MyNumber>
        <ContentDiv>
          {Boolean(accessLogAcceptedItem) || Boolean(accessLogRejectedItem) ? (
            <div>
              <Typography variant="subtitle1">
                {accepted ? "Accepted" : "Rejected"} (by{" "}
                <EmpSpan>{accessLogItem.admin_username}</EmpSpan> at{" "}
                <EmpSpan>
                  {moment(accessLogItem.time).format("D MMMM YYYY - HH:mm:ss")}
                </EmpSpan>
                )
              </Typography>

              {!accepted && (
                <Typography variant="subtitle2" style={{ color: "red" }}>
                  Rejected Reason: {transaction.refund_reason}
                </Typography>
              )}
            </div>
          ) : transaction.status === BnibTransactionStatus.ArrivedAtDepatu ? (
            <div>
              <Typography variant="subtitle1">
                Is the product correct ?
              </Typography>
              {Boolean(error) && (
                <Typography variant="subtitle2" style={{ color: "red" }}>
                  {error}
                </Typography>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setRejectDialogOpen(true)}
                disabled={loading}
              >
                NO
              </Button>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={() => setAcceptDialogOpen(true)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "YES"}
              </Button>
            </div>
          ) : null}
        </ContentDiv>
      </Div>
      <ConfirmDialog
        title="PLEASE MIND YOUR ACTION !!"
        message="Are you sure the product is CORRECT ?"
        visible={acceptDialogOpen}
        dismiss={() => setAcceptDialogOpen(false)}
        yesCallback={confirmDialogYesCallback}
      />
      {Boolean(rejectDialogOpen) && (
        <RejectDialog
          transactionCode={transaction.code}
          onAfterSubmit={onAfterSubmit}
          dismiss={() => setRejectDialogOpen(false)}
        />
      )}
    </>
  );
}
