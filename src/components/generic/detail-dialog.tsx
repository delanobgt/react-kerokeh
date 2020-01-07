import React, { ReactNode } from "react";
import styled from "styled-components";
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

export const SingleEntry = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

export const Label = styled(Typography)`
  flex-basis: 175px;
`;

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

export const makeEntry = (e: FieldEntry) => (
  <SingleEntry key={e.label}>
    <Label>{e.label}</Label>
    {["string", "number"].includes(typeof e.value) ? (
      <Typography>{e.value}</Typography>
    ) : (
      e.value
    )}
  </SingleEntry>
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
            {e.entries.map(e => makeEntry(e))}
          </div>
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
