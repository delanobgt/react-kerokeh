import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";

import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { makeExpansion } from "src/components/generic/detail-dialog";
import { goPromise } from "src/util/helper";
import {
  ILegitCheckDetail,
  getLegitCheckDetailById
} from "src/store/bnib-transaction";

interface IComponentProps {
  legitCheckDetailId: number;
  dismiss: () => void;
}

function DetailDialog(props: IComponentProps) {
  const { legitCheckDetailId, dismiss } = props;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [legitCheckDetail, setLegitCheckDetail] = React.useState<
    ILegitCheckDetail
  >(null);

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errLegitCheckDetail, legitCheckDetail] = await goPromise<
      ILegitCheckDetail
    >(getLegitCheckDetailById(legitCheckDetailId));
    setLoading(false);

    if (errLegitCheckDetail) {
      console.log(errLegitCheckDetail);
      setError("error");
    } else {
      setLegitCheckDetail(legitCheckDetail);
    }
  }, [legitCheckDetailId]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const legitCheckDetailEntries = React.useMemo(() => {
    if (!legitCheckDetail) return [];
    return [
      { label: "Id", value: legitCheckDetail.id || "-" },
      {
        label: "Checker Initial",
        value: legitCheckDetail.checker_initial || "-"
      },
      { label: "Currency", value: legitCheckDetail.currency || "-" },
      { label: "Price", value: legitCheckDetail.price || "-" },
      { label: "Result", value: legitCheckDetail.result || "-" },
      { label: "Created By", value: legitCheckDetail.created_by || "-" },
      { label: "Updated By", value: legitCheckDetail.updated_by || "-" }
    ];
  }, [legitCheckDetail]);

  return (
    <>
      <BasicDialog
        open={Boolean(legitCheckDetailId)}
        dismiss={dismiss}
        maxWidth="sm"
        fullWidth
        bgClose
      >
        <title>Legit Check Detail</title>
        <section>
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <CircularProgress size={24} /> Loading...
            </div>
          ) : error ? (
            <Typography variant="subtitle1" color="secondary">
              An error occured, please{" "}
              <span onClick={fetch} style={{ color: "lightblue" }}>
                retry
              </span>
              .
            </Typography>
          ) : legitCheckDetail ? (
            <>
              <div style={{ width: "100%" }}>
                {makeExpansion(
                  {
                    title: "Legit Check Detail",
                    entries: legitCheckDetailEntries
                  },
                  true
                )}
              </div>
            </>
          ) : null}
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </section>
      </BasicDialog>
    </>
  );
}

export default DetailDialog;
