import React from "react";
import { EmpSpan, Div, MyNumber, ContentDiv } from "../components";
import moment from "moment";
import { Typography } from "@material-ui/core";
import { IBnibTransaction } from "src/store/bnib-transaction";

interface IProps {
  orderNo: number;
  accessLogWaitingItem: any;
  accessLogInputItem: any;
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
            <Typography variant="subtitle1">
              Tracking Code: {transaction.office_shipping_tracking_code} (
              {transaction.office_shipping_provider}) (by{" "}
              <EmpSpan>Seller</EmpSpan> at{" "}
              <EmpSpan>
                {moment(accessLogInputItem.time).format(
                  "D MMMM YYYY - HH:mm:ss"
                )}
              </EmpSpan>
              )
            </Typography>
          ) : Boolean(accessLogWaitingItem) ? (
            <Typography variant="subtitle1">
              Waiting for Tracking Code (by <EmpSpan>Seller</EmpSpan> at{" "}
              <EmpSpan>
                {moment(accessLogWaitingItem.time).format(
                  "D MMMM YYYY - HH:mm:ss"
                )}
              </EmpSpan>
              )
            </Typography>
          ) : null}
        </ContentDiv>
      </Div>
    </>
  );
}
