import _ from "lodash";
import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import BasicSelect from "src/components/generic/input/BasicSelect";
import {
  PBnibTransactionFilter,
  EBnibTransactionStatus
} from "src/store/bnib-transaction";

interface IComponentProps {
  filter: PBnibTransactionFilter;
  updateFilter: (_filter: PBnibTransactionFilter) => void;
}

const Div = styled.div`
  margin-bottom: 0.5rem;
`;

const statuses = Object.keys(EBnibTransactionStatus)
  .filter(stat => isNaN(Number(stat)))
  .map(stat => _.startCase(stat));

function FilterForm(props: IComponentProps) {
  const { filter, updateFilter } = props;

  return (
    <div>
      <Typography variant="subtitle2">Filter</Typography>

      <Div>
        <TextField
          label="Id"
          value={filter.id || ""}
          onChange={e => updateFilter({ id: e.target.value })}
          style={{ width: "100%" }}
        />
      </Div>

      <Div>
        <TextField
          label="Code"
          value={filter.code || ""}
          onChange={e => updateFilter({ code: e.target.value })}
          style={{ width: "100%" }}
        />
      </Div>

      <Div>
        <TextField
          label="Buyer Username"
          value={filter.buyer_username || ""}
          onChange={e => updateFilter({ buyer_username: e.target.value })}
          style={{ width: "100%" }}
        />
      </Div>

      <Div>
        <TextField
          label="Seller Username"
          value={filter.seller_username || ""}
          onChange={e => updateFilter({ seller_username: e.target.value })}
          style={{ width: "100%" }}
        />
      </Div>

      <Div>
        <TextField
          label="Office Shipping Tracking Code"
          value={filter.office_shipping_tracking_code || ""}
          onChange={e =>
            updateFilter({ office_shipping_tracking_code: e.target.value })
          }
          style={{ width: "100%" }}
        />
      </Div>

      <Div>
        <TextField
          label="Buyer Shipping Tracking Code"
          value={filter.buyer_shipping_tracking_code || ""}
          onChange={e =>
            updateFilter({ buyer_shipping_tracking_code: e.target.value })
          }
          style={{ width: "100%" }}
        />
      </Div>

      <Div>
        <TextField
          label="Refund Shipping Tracking Code"
          value={filter.refund_shipping_tracking_code || ""}
          onChange={e =>
            updateFilter({ refund_shipping_tracking_code: e.target.value })
          }
          style={{ width: "100%" }}
        />
      </Div>

      <Div>
        <BasicSelect
          label="Status"
          value={filter.status || ""}
          onChange={(value: string) => updateFilter({ status: value })}
          style={{ width: "100%" }}
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
