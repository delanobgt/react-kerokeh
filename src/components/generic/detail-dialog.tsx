import React, { ReactNode } from "react";
import styled from "styled-components";
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Button
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import ReactToPrint from "react-to-print";

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

interface IMyExpansionProps {
  entry: ExpansionEntry;
  defaultExpanded?: boolean;
  printable?: boolean;
}

export const MyExpansion = ({
  entry,
  defaultExpanded,
  printable
}: IMyExpansionProps) => {
  const [expanded, setExpanded] = React.useState<boolean>(
    Boolean(defaultExpanded)
  );
  const toggleExpanded = React.useCallback(() => {
    setExpanded(!expanded);
  }, [expanded, setExpanded]);
  const ref = React.useRef();
  return (
    <>
      {printable && expanded && (
        <div style={{ marginTop: "1rem" }}>
          <ReactToPrint
            trigger={() => (
              <Button color="primary" variant="outlined">
                Print {entry.title}
              </Button>
            )}
            content={() => ref.current}
          />
        </div>
      )}
      <ExpansionPanel key={entry.title} ref={ref} expanded={expanded}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={toggleExpanded}
        >
          <Typography>
            <strong>{entry.title}</strong>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {!entry.entries.length ? (
            <Typography variant="subtitle1">No data.</Typography>
          ) : (
            <div style={{ width: "100%" }}>
              {entry.entries.map((e, index) => makeEntry(e, index))}
            </div>
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </>
  );
};
