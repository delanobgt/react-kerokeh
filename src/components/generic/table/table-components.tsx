import styled from "styled-components";
import { Typography, TableCell } from "@material-ui/core";

export const Title = styled(Typography)`
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: normal;
  width: 35vw;
`;

export const Entry = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

export const Label = styled.div`
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: normal;
  width: 25%;
  min-width: 25%;
  flex-basis: 25%;
  margin-right: 0.8rem;
`;

export const Value = styled.div`
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: normal;
  width: 75%;
  min-width: 75%;
  flex-basis: 75%;
`;

export const HeaderTableCellDiv = styled.div`
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  width: 100%;
`;

export const BodyTableCell = styled(TableCell)`
  word-wrap break-word;
  overflow-wrap: break-word;
  white-space: normal;
  max-width: 1px;
`;
