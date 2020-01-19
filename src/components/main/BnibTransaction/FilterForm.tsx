import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import BasicSelect from "src/components/generic/BasicSelect";
import { PBnibTransactionFilter } from "src/store/bnib-transaction";

interface IComponentProps {
  filter: PBnibTransactionFilter;
  updateFilter: (_filter: PBnibTransactionFilter) => void;
}

const Div = styled.div`
  margin-bottom: 0.5rem;
`;

const statuses = [
  "Waiting Payment From Buyer",
  "Waiting Tracking Code",
  "Seller Expired",
  "Buyer Expired",
  "Shipping To Depatu",
  "Arrived At Depatu",
  "Legit Checking",
  "Legit Check Authentic",
  "Legit Check Indefinable",
  "Legit Check Fake",
  "Refunded By Depatu",
  "Disputed By Depatu",
  "Accepted By Depatu",
  "Defect Proceed Approval",
  "Defect Reject",
  "Shipping To Buyer",
  "Arrived At Buyer",
  "Shipping To Seller",
  "Arrived At Seller",
  "Buyer Confirmation",
  "Seller Cancel",
  "Done"
];

function FilterForm(props: IComponentProps) {
  const { filter, updateFilter } = props;

  return (
    <div>
      <Typography variant="subtitle2">Filter</Typography>

      <Div>
        <TextField
          label="Code"
          value={filter.code || ""}
          onChange={e => updateFilter({ code: e.target.value })}
          style={{ width: "15rem" }}
        />
      </Div>

      <Div>
        <TextField
          label="Office Shipping Tracking Code"
          value={filter.office_shipping_tracking_code || ""}
          onChange={e =>
            updateFilter({ office_shipping_tracking_code: e.target.value })
          }
          style={{ width: "15rem" }}
        />
      </Div>

      <Div>
        <TextField
          label="Buyer Shipping Tracking Code"
          value={filter.buyer_shipping_tracking_code || ""}
          onChange={e =>
            updateFilter({ buyer_shipping_tracking_code: e.target.value })
          }
          style={{ width: "15rem" }}
        />
      </Div>

      <Div>
        <TextField
          label="Refund Shipping Tracking Code"
          value={filter.refund_shipping_tracking_code || ""}
          onChange={e =>
            updateFilter({ refund_shipping_tracking_code: e.target.value })
          }
          style={{ width: "15rem" }}
        />
      </Div>

      <Div>
        <BasicSelect
          label="Status"
          value={filter.status || ""}
          onChange={(value: string) => updateFilter({ status: value })}
          style={{ width: "15rem" }}
        >
          <MenuItem value="">No Filter</MenuItem>
          {statuses.map((status, index) => (
            <MenuItem key={status} value={index}>
              {status}
            </MenuItem>
          ))}
        </BasicSelect>
      </Div>
    </div>
  );
}

export default FilterForm;
