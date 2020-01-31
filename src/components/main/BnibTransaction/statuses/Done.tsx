import React from "react";
import { Div, MyNumber, ContentDiv } from "../components";
import { Typography, Button } from "@material-ui/core";
import { IBnibTransaction } from "src/store/bnib-transaction";
import { Launch as LaunchIcon } from "@material-ui/icons";

interface IProps {
  orderNo: number;
  transaction: IBnibTransaction;
}

export default function(props: IProps) {
  const { orderNo, transaction } = props;

  const href = React.useMemo(
    () =>
      `${process.env.REACT_APP_BNIB_QR_CODE_BASE_URL}/${transaction.bnib_buy_order_invoice_code}`,
    [transaction]
  );

  return (
    <>
      <Div>
        <MyNumber variant="subtitle2">{orderNo}</MyNumber>
        <ContentDiv>
          <Typography variant="subtitle1">Done</Typography>
          <Typography variant="subtitle1">
            <Button
              variant="outlined"
              color="primary"
              href={href}
              target="_blank"
            >
              See Status <LaunchIcon style={{ marginLeft: "0.2rem" }} />
            </Button>
          </Typography>
        </ContentDiv>
      </Div>
    </>
  );
}
