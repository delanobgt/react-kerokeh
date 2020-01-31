import React from "react";
import { EmpSpan, Div, MyNumber, ContentDiv, Trace } from "../components";
import { Typography, Button } from "@material-ui/core";
import {
  EBnibTransactionStatus,
  IBnibTransaction,
  IAccessLogItem
} from "src/store/bnib-transaction";
import SendDialog from "../dialogs/small-dialogs/SendDialog";
import QRCodeDownload from "src/components/misc/QRCodeDownload";

interface IProps {
  orderNo: number;
  accessLogItem: IAccessLogItem;
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
          <div>
            <Typography variant="subtitle1">QR Code</Typography>
            <QRCodeDownload
              filename={transaction.code}
              value={transaction.bnib_buy_order_invoice_code}
              size={180}
              level="H"
              includeMargin
            />
          </div>
          <br />
          {Boolean(accessLogItem) ? (
            <div>
              <Trace
                name={accessLogItem.admin_username}
                time={accessLogItem.time}
              />
              <Typography variant="subtitle1">
                Sent to <EmpSpan>Buyer</EmpSpan>
              </Typography>
              <Typography variant="subtitle1">
                Courier: {transaction.buyer_shipping_provider}
              </Typography>
              <Typography variant="subtitle1">
                Tracking Code: {transaction.buyer_shipping_tracking_code}
              </Typography>
            </div>
          ) : transaction.status ===
            EBnibTransactionStatus.LegitCheckAuthentic ? (
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
