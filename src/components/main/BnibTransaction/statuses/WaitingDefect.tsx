import React from "react";
import { EmpSpan, Div, MyNumber, ContentDiv, Trace } from "../components";
import { Typography } from "@material-ui/core";
import {
  EBnibTransactionStatus,
  IBnibTransaction,
  IAccessLogItem
} from "src/store/bnib-transaction";

interface IProps {
  orderNo: number;
  accessLogAcceptItem: IAccessLogItem;
  accessLogRejectItem: IAccessLogItem;
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
            <>
              <Trace name="Buyer" time={accessLogItem.time} />
              <Typography variant="subtitle1">
                {accepted ? "Defects Accepted" : "Defects Rejected"}
              </Typography>
            </>
          ) : transaction.status ===
            EBnibTransactionStatus.DefectProceedApproval ? (
            <Typography variant="subtitle1">
              Waiting for Defect Approval from <EmpSpan>Buyer</EmpSpan>
            </Typography>
          ) : null}
        </ContentDiv>
      </Div>
    </>
  );
}
