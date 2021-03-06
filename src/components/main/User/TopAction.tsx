import React from "react";
import styled from "styled-components";
import useIntervalRun from "src/hooks/useIntervalRun";
import IntervalRunStatus from "src/components/generic/IntervalRunStatus";

interface IComponentProps {
  intervalRun: ReturnType<typeof useIntervalRun>;
  refreshDelay: number;
}

const RootDiv = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default (props: IComponentProps) => {
  return (
    <RootDiv>
      <div />
      {/* display auto-updating status */}
      <IntervalRunStatus
        intervalRun={props.intervalRun}
        refreshDelay={props.refreshDelay}
      />
    </RootDiv>
  );
};
