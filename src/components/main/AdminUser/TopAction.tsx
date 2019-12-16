import React from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import useIntervalRun from "src/hooks/useIntervalRun";
import IntervalRunStatus from "src/components/generic/IntervalRunStatus";

interface IComponentProps {
  setCreateDialogOpen: (b: boolean) => void;
  intervalRun: ReturnType<typeof useIntervalRun>;
  refreshDelay: number;
}

const RootDiv = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1em;
`;

export default (props: IComponentProps) => {
  return (
    <RootDiv>
      <Button
        color="primary"
        variant="contained"
        onClick={() => props.setCreateDialogOpen(true)}
      >
        Add User
      </Button>

      {/* display auto-updating status */}
      <IntervalRunStatus
        intervalRun={props.intervalRun}
        refreshDelay={props.refreshDelay}
      />
    </RootDiv>
  );
};
