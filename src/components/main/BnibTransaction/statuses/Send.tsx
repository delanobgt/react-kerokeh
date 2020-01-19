import React from "react";
import { EmpSpan, Div, MyNumber, ContentDiv } from "../components";
import moment from "moment";
import { Typography, Button } from "@material-ui/core";
import {
  BnibTransactionStatus,
  IBnibTransaction
} from "src/store/bnib-transaction";
import SendDialog from "../dialogs/SendDialog";

interface IProps {
  orderNo: number;
  accessLogItem: any;
  transaction: IBnibTransaction;
  onAfterSubmit: () => void;
}

export default function(props: IProps) {
  const { orderNo, accessLogItem, transaction, onAfterSubmit } = props;
  const [sendDialogOpen, setSendDialogOpen] = React.useState<boolean>(false);

  return (
    <>
      <Div>
        <MyNumber variant="subtitle2">{orderNo}</MyNumber>
        <ContentDiv>
          {Boolean(accessLogItem) ? (
            <div>
              <Typography variant="subtitle1">
                Sent to <EmpSpan>Buyer</EmpSpan> (by{" "}
                <EmpSpan>{accessLogItem.admin_username}</EmpSpan> at{" "}
                <EmpSpan>
                  {moment(accessLogItem.time).format("D MMMM YYYY - HH:mm:ss")}
                </EmpSpan>
                )
              </Typography>
              <Typography variant="subtitle1">
                Courier: {transaction.buyer_shipping_provider}
              </Typography>
              <Typography variant="subtitle1">
                Tracking Code: {transaction.buyer_shipping_tracking_code}
              </Typography>
            </div>
          ) : transaction.status ===
            BnibTransactionStatus.LegitCheckAuthentic ? (
            <div>
              <Typography variant="subtitle1">Send the product ?</Typography>

              <Button
                variant="outlined"
                color="primary"
                onClick={() => setSendDialogOpen(true)}
              >
                YES
              </Button>
            </div>
          ) : null}
        </ContentDiv>
      </Div>
      {Boolean(sendDialogOpen) && (
        <SendDialog
          transactionCode={transaction.code}
          onAfterSubmit={onAfterSubmit}
          dismiss={() => setSendDialogOpen(false)}
        />
      )}
    </>
  );
}
