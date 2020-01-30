import React from "react";
import { Div, MyNumber, ContentDiv, Trace } from "../components";
import { Typography } from "@material-ui/core";
import { IBnibTransaction, IAccessLogItem } from "src/store/bnib-transaction";

interface IProps {
  orderNo: number;
  accessLogWaitingItem: IAccessLogItem;
  accessLogPaidItem: IAccessLogItem;
  transaction: IBnibTransaction;
}

export default function(props: IProps) {
  const { orderNo, accessLogWaitingItem, accessLogPaidItem } = props;

  return (
    <>
      <Div>
        <MyNumber variant="subtitle2">{orderNo}</MyNumber>
        <ContentDiv>
          {Boolean(accessLogPaidItem) ? (
            <>
              <Trace name="Buyer" time={accessLogPaidItem.time} />
              <Typography variant="subtitle1">Payment Done</Typography>
            </>
          ) : Boolean(accessLogWaitingItem) ? (
            <Typography variant="subtitle1">Waiting Payment</Typography>
          ) : null}
        </ContentDiv>
      </Div>
    </>
  );
}
