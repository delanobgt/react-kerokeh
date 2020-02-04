import React from "react";
import { Button } from "@material-ui/core";
import Table from "src/components/generic/table/ReactTable";

import { IShippingAddress } from "src/store/user";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { Column } from "react-table";

interface IComponentProps {
  open: boolean;
  shippingAddresses: IShippingAddress[];
  dismiss: () => void;
}

function ShippingAddressesDialog(props: IComponentProps) {
  const { open, shippingAddresses, dismiss } = props;

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const columns: Column<IShippingAddress>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: row => row.id,
        Filter: null
      },
      {
        Header: "Name",
        accessor: row => row.name,
        Filter: null
      },
      {
        Header: "Recipient",
        accessor: row => row.recipient,
        Filter: null
      },
      {
        Header: "Phone",
        accessor: row => row.phone,
        Filter: null
      },
      {
        Header: "Province",
        accessor: row => row.province,
        Filter: null
      },
      {
        Header: "City",
        accessor: row => row.city,
        Filter: null
      },
      {
        Header: "Country",
        accessor: row => row.country,
        Filter: null
      },
      {
        Header: "Address",
        accessor: row => row.address,
        Filter: null
      },
      {
        Header: "Zip Code",
        accessor: row => row.zip_code,
        Filter: null
      },
      {
        Header: "Used for Transaction",
        accessor: row => (row.used_for_transaction ? "YES" : "NO"),
        Filter: null
      },
      {
        Header: "Additional Info",
        accessor: row => row.additional_info || "-",
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
            <Table columns={columns} data={shippingAddresses} minimized />
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

export default ShippingAddressesDialog;
