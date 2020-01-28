import React from "react";
import { EmpSpan, Div, MyNumber, ContentDiv } from "../components";
import moment from "moment";
import { Typography, Button } from "@material-ui/core";
import {
  BnibTransactionStatus,
  IBnibTransaction
} from "src/store/bnib-transaction";
import RefundDialog from "../dialogs/RefundDialog";

interface IProps {
  orderNo: number;
  accessLogItem: any;
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
              <Typography variant="subtitle1">
                Sent Back and Refunded (by{" "}
                <EmpSpan>{accessLogItem.admin_username}</EmpSpan> at{" "}
                <EmpSpan>
                  {moment(accessLogItem.time).format("D MMMM YYYY - HH:mm:ss")}
                </EmpSpan>
                )
              </Typography>
              <Typography variant="subtitle1">
                Courier: {transaction.refund_shipping_provider}
              </Typography>
              <Typography variant="subtitle1">
                Tracking Code: {transaction.refund_shipping_tracking_code}
              </Typography>
            </div>
          ) : transaction.status === BnibTransactionStatus.RefundedByDepatu ||
            transaction.status === BnibTransactionStatus.DefectReject ||
            transaction.status === BnibTransactionStatus.LegitCheckFake ||
            transaction.status ===
              BnibTransactionStatus.LegitCheckIndefinable ? (
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
