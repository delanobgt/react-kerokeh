import React from "react";
import { Div, MyNumber, ContentDiv } from "../components";
import { Typography } from "@material-ui/core";

interface IProps {
  orderNo: number;
}

export default function(props: IProps) {
  const { orderNo } = props;

  return (
    <>
      <Div>
        <MyNumber variant="subtitle2">{orderNo}</MyNumber>
        <ContentDiv>
          <Typography variant="subtitle1">Done</Typography>
        </ContentDiv>
      </Div>
    </>
  );
}
