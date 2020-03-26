import React from "react";
import styled from "styled-components";
import useIntervalRun from "src/hooks/useIntervalRun";
import IntervalRunStatus from "src/components/generic/IntervalRunStatus";
import { getFloatingFundExcelData } from "src/store/floating-fund/methods";
import moment from "moment";
import { Button } from "@material-ui/core";

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
  const handleDownloadExcelClick = React.useCallback(async () => {
    const excelData = await getFloatingFundExcelData();
    const objectURL = window.URL.createObjectURL(new Blob([excelData]));
    const linkNode = document.createElement("a");
    linkNode.href = objectURL;
    linkNode.setAttribute(
      "download",
      `[DEPATU] Floating Funds per ${moment().format(
        "DD-MMM-YYYY (HH:mm:ss)"
      )}.xlsx`
    );
    document.body.appendChild(linkNode);
    linkNode.click();
    document.body.removeChild(linkNode);
    URL.revokeObjectURL(objectURL);
  }, []);

  return (
    <RootDiv>
      <div>
        <Button
          color="primary"
          variant="contained"
          onClick={handleDownloadExcelClick}
        >
          Download Excel
        </Button>
      </div>
      {/* display auto-updating status */}
      <IntervalRunStatus
        intervalRun={props.intervalRun}
        refreshDelay={props.refreshDelay}
      />
    </RootDiv>
  );
};
