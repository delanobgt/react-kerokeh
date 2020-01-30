import React from "react";
import { Div, MyNumber, ContentDiv, Trace } from "../components";
import { Typography } from "@material-ui/core";
import { IBnibTransaction, IAccessLogItem } from "src/store/bnib-transaction";

interface IProps {
  orderNo: number;
  accessLogWaitingItem: IAccessLogItem;
  accessLogInputItem: IAccessLogItem;
  transaction: IBnibTransaction;
}

export default function(props: IProps) {
  const {
    orderNo,
    accessLogWaitingItem,
    accessLogInputItem,
    transaction
  } = props;

  return (
    <>
      <Div>
        <MyNumber variant="subtitle2">{orderNo}</MyNumber>
        <ContentDiv>
          {Boolean(accessLogInputItem) ? (
            <>
              <Trace name="Seller" time={accessLogInputItem.time} />
              <Typography variant="subtitle1">
                Tracking Code: {transaction.office_shipping_tracking_code} (
                {transaction.office_shipping_provider})
              </Typography>
            </>
          ) : Boolean(accessLogWaitingItem) ? (
            <>
              <Typography variant="subtitle1">
                Waiting for Tracking Code
              </Typography>
            </>
          ) : null}
        </ContentDiv>
      </Div>
    </>
  );
}
