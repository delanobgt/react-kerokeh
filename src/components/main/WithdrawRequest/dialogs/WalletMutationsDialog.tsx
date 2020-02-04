import React from "react";
import { Button } from "@material-ui/core";
import Table from "src/components/generic/table/ReactTable";

import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { Column } from "react-table";
import { IWalletMutation } from "src/store/withdraw-request";
import moment from "moment";

interface IComponentProps {
  open: boolean;
  walletMutations: IWalletMutation[];
  dismiss: () => void;
}

function WalletMutationsDialog(props: IComponentProps) {
  const { open, walletMutations, dismiss } = props;

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const columns: Column<IWalletMutation>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: row => row.id,
        Filter: null
      },
      {
        Header: "Amount",
        accessor: row => row.amount,
        Filter: null
      },
      {
        Header: "Balance",
        accessor: row => row.balance,
        Filter: null
      },
      {
        Header: "Type",
        accessor: row => row.type,
        Filter: null
      },
      {
        Header: "Description",
        accessor: row => row.description,
        Filter: null
      },
      {
        Header: "Created At",
        accessor: row => moment(row.created_at).format("D MMMM YYYY"),
        Filter: null
      }
    ],
    []
  );

  return (
    <div>
      <BasicDialog
        open={open}
        dismiss={dismiss}
        maxWidth="lg"
        fullWidth
        bgClose
      >
        <title>Shipping Addresses</title>
        <section>
          <div style={{ width: "100%" }}>
            <Table columns={columns} data={walletMutations} minimized />
          </div>
          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </div>
        </section>
      </BasicDialog>
    </div>
  );
}

export default WalletMutationsDialog;
