import styled from "styled-components";
import { Typography } from "@material-ui/core";

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
  padding-top: 0.35rem;
`;

export const MyNumber = styled(Typography)`
  padding: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 2px solid
    ${(props: IMyNumberSCProps) =>
      props.disabled ? "lightgray" : props.color || "cornflowerblue"};
  margin-right: 0.75rem !important;
`;
