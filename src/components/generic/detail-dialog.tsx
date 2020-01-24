import React, { ReactNode } from "react";
import styled from "styled-components";
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

export const MyDesc = styled(Typography)`
  color: red;
  padding-left: 0.75rem;
`;

export interface FieldEntry {
  label: string;
  value: string | number | ReactNode;
}

export interface ExpansionEntry {
  title: string;
  entries: FieldEntry[];
}

export const makeEntry = (e: FieldEntry, key: number) => (
  <div
    key={key}
    style={{
      display: "flex",
      marginBottom: "1rem"
    }}
  >
    <div
      style={{
        overflowWrap: "break-word",
        wordWrap: "break-word",
        whiteSpace: "normal",
        width: "25%",
        minWidth: "25%",
        flexBasis: "25%",
        marginRight: "0.8rem",
        color: "grey"
      }}
    >
      {e.label}
    </div>
    <div
      style={{
        overflowWrap: "break-word",
        wordWrap: "break-word",
        whiteSpace: "normal",
        width: "75%",
        minWidth: "75%",
        flexBasis: "75%"
      }}
    >
      {["string", "number"].includes(typeof e.value) ? (
        <Typography>{e.value}</Typography>
      ) : (
        e.value
      )}
    </div>
  </div>
);

export const makeExpansion = (e: ExpansionEntry, defaultExpanded?: boolean) => {
  const props = {
    defaultExpanded
  };
  return (
    <ExpansionPanel key={e.title} {...props}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          <strong>{e.title}</strong>
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {!e.entries.length ? (
          <Typography variant="subtitle1">No data.</Typography>
        ) : (
          <div style={{ width: "100%" }}>
            {e.entries.map((e, index) => makeEntry(e, index))}
          </div>
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
