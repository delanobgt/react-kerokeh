import _ from "lodash";
import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import BasicSelect from "src/components/generic/input/BasicSelect";
import { PBnibProductFilter } from "src/store/bnib-product";
import { EBnibTransactionStatus } from "src/store/bnib-transaction";

interface IComponentProps {
  filter: PBnibProductFilter;
  updateFilter: (_filter: PBnibProductFilter) => void;
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
          label="Code"
          value={filter.code || ""}
          onChange={e => updateFilter({ code: e.target.value })}
          style={{ width: "100%" }}
        />
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Pre Order"
          value={filter.pre_order || ""}
          onChange={(value: string) => updateFilter({ pre_order: value })}
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Matched"
          value={filter.matched || ""}
          onChange={(value: string) => updateFilter({ matched: value })}
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </BasicSelect>
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