import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import { PPromoCodeFilter } from "src/store/promo-code";
import BasicSelect from "src/components/generic/input/BasicSelect";

interface IComponentProps {
  filter: PPromoCodeFilter;
  updateFilter: (_filter: PPromoCodeFilter) => void;
}

const Div = styled.div`
  margin-bottom: 0.5rem;
`;

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
          fullWidth
        />
      </Div>

      <Div>
        <TextField
          label="Code"
          value={filter.code || ""}
          onChange={e => updateFilter({ code: e.target.value })}
          fullWidth
        />
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Product Type"
          value={filter.product_type || ""}
          onChange={(value: string) => updateFilter({ product_type: value })}
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="bnib_product">BNIB Product</MenuItem>
          <MenuItem value="bnib_buy_order">BNIB Buy Order</MenuItem>
          <MenuItem value="direct_bnib_product">Direct BNIB Product</MenuItem>
          <MenuItem value="direct_bnib_buy_order">
            Direct BNIB Buy Order
          </MenuItem>
        </BasicSelect>
      </Div>
    </div>
  );
}

export default FilterForm;
