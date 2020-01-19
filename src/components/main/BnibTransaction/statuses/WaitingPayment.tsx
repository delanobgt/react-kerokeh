import React from "react";
import { EmpSpan, Div, MyNumber, ContentDiv } from "../components";
import moment from "moment";
import { Typography } from "@material-ui/core";
import { IBnibTransaction } from "src/store/bnib-transaction";

interface IProps {
  orderNo: number;
  accessLogWaitingItem: any;
  accessLogPaidItem: any;
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
            <Typography variant="subtitle1">
              Payment Done (by <EmpSpan>Buyer</EmpSpan> at{" "}
              <EmpSpan>
                {moment(accessLogPaidItem.time).format(
                  "D MMMM YYYY - HH:mm:ss"
                )}
              </EmpSpan>
              )
            </Typography>
          ) : Boolean(accessLogWaitingItem) ? (
            <Typography variant="subtitle1">
              Waiting Payment (from <EmpSpan>Buyer</EmpSpan> at{" "}
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
