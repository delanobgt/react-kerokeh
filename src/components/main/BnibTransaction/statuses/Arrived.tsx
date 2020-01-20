import React from "react";
import { EmpSpan, Div, MyNumber, ContentDiv } from "../components";
import moment from "moment";
import { Typography, Button, CircularProgress } from "@material-ui/core";
import {
  BnibTransactionStatus,
  IBnibTransaction,
  arriveBnibTransactionByCode
} from "src/store/bnib-transaction";
import ConfirmDialog from "src/components/generic/ConfirmDialog";
import { goPromise } from "src/util/helper";
import DisputeDialog from "../dialogs/DisputeDialog";

interface IProps {
  orderNo: number;
  accessLogItem: any;
  transaction: IBnibTransaction;
  onAfterSubmit: () => void;
}

export default function(props: IProps) {
  const { orderNo, accessLogItem, transaction, onAfterSubmit } = props;
  const [error, setError] = React.useState<string>("");
  const [arrivedLoading, setArrivedLoading] = React.useState<boolean>(false);
  const [
    confirmArrivedDialogOpen,
    setArrivedConfirmDialogOpen
  ] = React.useState<boolean>(false);
  const [disputedDialogOpen, setDisputedDialogOpen] = React.useState<boolean>(
    false
  );

  const arrivedConfirmDialogYesCallback = React.useCallback(
    async dismiss => {
      dismiss();
      setError("");
      setArrivedLoading(true);
      const [err] = await goPromise<void>(
        arriveBnibTransactionByCode(transaction.code)
      );
      setArrivedLoading(false);

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
          {Boolean(accessLogItem) ? (
            <Typography variant="subtitle1">
              Arrived (by <EmpSpan>{accessLogItem.admin_username}</EmpSpan> at{" "}
              <EmpSpan>
                {moment(accessLogItem.time).format("D MMMM YYYY - HH:mm:ss")}
              </EmpSpan>
              )
            </Typography>
          ) : transaction.status === BnibTransactionStatus.ShippingToDepatu ? (
            <div>
              <Typography variant="subtitle1">
                Has the product arrived ?
              </Typography>
              {Boolean(error) && (
                <Typography variant="subtitle2" style={{ color: "red" }}>
                  {error}
                </Typography>
              )}

              <Button
                variant="outlined"
                color="primary"
                onClick={() => setDisputedDialogOpen(true)}
                disabled={arrivedLoading}
              >
                DISPUTE
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onClick={() => setArrivedConfirmDialogOpen(true)}
                disabled={arrivedLoading}
                style={{ marginLeft: "1rem" }}
              >
                {arrivedLoading ? <CircularProgress size={24} /> : "ARRIVED"}
              </Button>
            </div>
          ) : null}
        </ContentDiv>
      </Div>
      <ConfirmDialog
        title="PLEASE MIND YOUR ACTION !!"
        message="Are you sure the product has ARRIVED ?"
        visible={confirmArrivedDialogOpen}
        dismiss={() => setArrivedConfirmDialogOpen(false)}
        yesCallback={arrivedConfirmDialogYesCallback}
      />
      {Boolean(disputedDialogOpen) && (
        <DisputeDialog
          transactionCode={transaction.code}
          onAfterSubmit={onAfterSubmit}
          dismiss={() => setDisputedDialogOpen(false)}
        />
      )}
    </>
  );
}
