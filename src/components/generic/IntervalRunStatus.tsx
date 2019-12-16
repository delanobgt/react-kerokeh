import React from "react";
import { CircularProgress } from "@material-ui/core";
import useIntervalRun from "src/hooks/useIntervalRun";

interface IComponentProps {
  intervalRun: ReturnType<typeof useIntervalRun>;
  refreshDelay: number;
}

export default (props: IComponentProps) => {
  return (
    <div>
      {props.intervalRun.running ? (
        <span>
          <CircularProgress size={18} /> Updating
        </span>
      ) : props.intervalRun.error ? (
        <span>
          Retrying in {(props.refreshDelay - props.intervalRun.lastTime) / 1000}{" "}
          second(s).
        </span>
      ) : (
        <span>Updated {props.intervalRun.lastTime / 1000} second(s) ago</span>
      )}
    </div>
  );
};
