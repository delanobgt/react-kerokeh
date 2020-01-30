import React from "react";
import { Div, MyNumber, ContentDiv, Trace } from "../components";
import { Typography, Button } from "@material-ui/core";
import {
  EBnibTransactionStatus,
  IAccessLogItem,
  IBnibTransaction
} from "src/store/bnib-transaction";
import RefundDialog from "../dialogs/small-dialogs/RefundDialog";

interface IProps {
  orderNo: number;
  accessLogItem: IAccessLogItem;
  transaction: IBnibTransaction;
  onAfterSubmit: () => void;
}

export default function(props: IProps) {
  const { orderNo, accessLogItem, transaction, onAfterSubmit } = props;
  const [refundDialogOpen, setRefundDialogOpen] = React.useState<boolean>(
    false
  );

  return (
    <>
      <Div>
        <MyNumber variant="subtitle2">{orderNo}</MyNumber>
        <ContentDiv>
          {Boolean(accessLogItem) ? (
            <div>
              <Trace
                name={accessLogItem.admin_username}
                time={accessLogItem.time}
              />
              <Typography variant="subtitle1">
                Sent Back and Refunded
              </Typography>
              <Typography variant="subtitle1">
                Courier: {transaction.refund_shipping_provider}
              </Typography>
              <Typography variant="subtitle1">
                Tracking Code: {transaction.refund_shipping_tracking_code}
              </Typography>
            </div>
          ) : transaction.status === EBnibTransactionStatus.RefundedByDepatu ||
            transaction.status === EBnibTransactionStatus.DefectReject ||
            transaction.status === EBnibTransactionStatus.LegitCheckFake ||
            transaction.status ===
              EBnibTransactionStatus.LegitCheckIndefinable ? (
            <div>
              <Typography variant="subtitle1">Refund the product ?</Typography>

              <Button
                variant="outlined"
                color="primary"
                onClick={() => setRefundDialogOpen(true)}
              >
                YES
              </Button>
            </div>
          ) : null}
        </ContentDiv>
      </Div>
      {Boolean(refundDialogOpen) && (
        <RefundDialog
          transactionCode={transaction.code}
          onAfterSubmit={onAfterSubmit}
          dismiss={() => setRefundDialogOpen(false)}
        />
      )}
    </>
  );
}
