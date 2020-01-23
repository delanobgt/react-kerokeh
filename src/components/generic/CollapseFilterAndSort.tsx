import React from "react";
import { ReactNode } from "react";
import { Collapse, Button } from "@material-ui/core";
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from "@material-ui/icons";

interface IComponentProps {
  defaultExpanded?: boolean;
  children?: ReactNode;
}

function CollapseFilterAndSort(props: IComponentProps) {
  const { defaultExpanded, children } = props;
  const [expanded, setExpanded] = React.useState<boolean>(
    defaultExpanded || false
  );

  const toggleShow = React.useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <div>
      <div style={{ textAlign: "right" }}>
        <Button onClick={toggleShow} color="primary">
          {!expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}{" "}
          {!expanded ? "Show" : "Hide"} Filter & Sort
        </Button>
      </div>
      <Collapse in={expanded} timeout="auto">
        {children}
      </Collapse>
    </div>
  );
}

export default CollapseFilterAndSort;
