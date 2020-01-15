import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import { PWithdrawRequestFilter } from "src/store/withdraw-request";
import BasicSelect from "src/components/generic/BasicSelect";

interface IComponentProps {
  filter: PWithdrawRequestFilter;
  updateFilter: (_filter: PWithdrawRequestFilter) => void;
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
        />
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "8em" }}
          label="Status"
          value={filter.status || ""}
          onChange={(value: string) => updateFilter({ status: value })}
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="success">Success</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </BasicSelect>
      </Div>
    </div>
  );
}

export default FilterForm;
