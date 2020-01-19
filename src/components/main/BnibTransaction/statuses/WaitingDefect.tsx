import React from "react";
import { EmpSpan, Div, MyNumber, ContentDiv } from "../components";
import moment from "moment";
import { Typography } from "@material-ui/core";
import {
  BnibTransactionStatus,
  IBnibTransaction
} from "src/store/bnib-transaction";

interface IProps {
  orderNo: number;
  accessLogAcceptItem: any;
  accessLogRejectItem: any;
  transaction: IBnibTransaction;
}

export default function(props: IProps) {
  const {
    orderNo,
    accessLogAcceptItem,
    accessLogRejectItem,
    transaction
  } = props;

  const accessLogItem = React.useMemo(
    () => accessLogAcceptItem || accessLogRejectItem,
    [accessLogAcceptItem, accessLogRejectItem]
  );
  const accepted = React.useMemo(() => Boolean(accessLogAcceptItem), [
    accessLogAcceptItem
  ]);

  return (
    <>
      <Div>
        <MyNumber variant="subtitle2">{orderNo}</MyNumber>
        <ContentDiv>
          {Boolean(accessLogAcceptItem) || Boolean(accessLogRejectItem) ? (
            <Typography variant="subtitle1">
              {accepted ? "Defects Accepted" : "Defects Rejected"} (by{" "}
              <EmpSpan>Buyer</EmpSpan> at{" "}
              <EmpSpan>
                {moment(accessLogItem.time).format("D MMMM YYYY - HH:mm:ss")}
              </EmpSpan>
              )
            </Typography>
          ) : transaction.status ===
            BnibTransactionStatus.DefectProceedApproval ? (
            <Typography variant="subtitle1">
              Waiting for Defect Approval from <EmpSpan>Buyer</EmpSpan>
            </Typography>
          ) : null}
        </ContentDiv>
      </Div>
    </>
  );
}
