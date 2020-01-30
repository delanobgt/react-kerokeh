import React from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import moment from "moment";

interface IMyNumberSCProps {
  disabled?: boolean;
  color?: string;
}

export const EmpSpan = styled.span`
  color: cornflowerblue;
`;

export const Div = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

export const ContentDiv = styled.div`
  padding-top: 7px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: normal;
`;

export const MyNumber = styled(Typography)`
  flex-basis: 36px;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 2px solid
    ${(props: IMyNumberSCProps) =>
      props.disabled ? "lightgray" : props.color || "cornflowerblue"};
  margin-right: 0.75rem !important;
`;

interface ITraceProps {
  name: string;
  time: string;
}

export const Trace = (props: ITraceProps) => {
  const { name, time } = props;

  return (
    <div>
      [<EmpSpan>{name}</EmpSpan> at{" "}
      <EmpSpan>{moment(time).format("D MMMM YYYY - HH:mm:ss")}</EmpSpan>]
    </div>
  );
};
