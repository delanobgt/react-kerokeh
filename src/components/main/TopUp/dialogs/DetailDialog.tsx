import _ from "lodash";
import React from "react";
import { Button } from "@material-ui/core";

import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { RootState } from "src/store";
import { useSelector } from "react-redux";
import { makeExpansion } from "src/components/generic/detail-dialog";
import moment from "moment";
import { ITopUp } from "src/store/top-up";

interface IComponentProps {
  topUpId: number;
  dismiss: () => void;
}

function DeleteDialog(props: IComponentProps) {
  const { topUpId, dismiss } = props;

  const handleClose = () => {
    dismiss();
  };

  const topUp = useSelector<RootState, ITopUp>(
    state =>
      (_.find(
        state.topUp.topUps,
        pc => ((pc as unknown) as ITopUp).id === topUpId
      ) as unknown) as ITopUp
  );

  const topUpEntries = React.useMemo(() => {
    if (!topUp) return [];
    return [
      { label: "Id", value: topUp.id || "-" },
      { label: "Amount", value: topUp.amount || "-" },
      { label: "Code", value: topUp.code || "-" },
      { label: "Description", value: topUp.description || "-" },
      { label: "Fraud Status", value: topUp.fraud_status || "-" },
      {
        label: "Created At",
        value: moment(topUp.created_at).format("D MMMM YYYY")
      },
      { label: "Payment Channel", value: topUp.payment_channel || "-" },
      { label: "Payment Code", value: topUp.payment_code || "-" },
      { label: "Payment Status", value: topUp.payment_status || "-" },
      { label: "Payment Type", value: topUp.payment_type || "-" },
      {
        label: "VA Number",
        value: topUp.virtual_account_number || "-"
      }
    ];
  }, [topUp]);

  return (
    <div>
      <BasicDialog
        open={Boolean(topUpId)}
        dismiss={dismiss}
        maxWidth="sm"
        fullWidth
        bgClose
      >
        <title>Top Up Detail</title>
        <section>
          {Boolean(topUp) && (
            <div style={{ width: "100%" }}>
              {makeExpansion({ title: "Product", entries: topUpEntries }, true)}
            </div>
          )}
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </section>
      </BasicDialog>
    </div>
  );
}

export default DeleteDialog;
