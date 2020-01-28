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
  justify-content: flex-end;
`;

export default (props: IComponentProps) => {
  return (
    <RootDiv>
      {/* display auto-updating status */}
      <IntervalRunStatus
        intervalRun={props.intervalRun}
        refreshDelay={props.refreshDelay}
      />
    </RootDiv>
  );
};
