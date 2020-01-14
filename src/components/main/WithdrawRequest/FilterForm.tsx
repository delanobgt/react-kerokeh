import React from "react";
import { TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { PWithdrawRequestFilter } from "src/store/withdraw-request";

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
        <TextField
          label="Status"
          value={filter.status || ""}
          onChange={e => updateFilter({ status: e.target.value })}
        />
      </Div>
    </div>
  );
}

export default FilterForm;
