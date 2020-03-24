import React from "react";
import { TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { PFloatingFundFilter } from "src/store/floating-fund";

interface IComponentProps {
  filter: PFloatingFundFilter;
  updateFilter: (_filter: PFloatingFundFilter) => void;
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
          label="Username"
          value={filter.username || ""}
          onChange={e => updateFilter({ username: e.target.value })}
          fullWidth
        />
      </Div>
    </div>
  );
}

export default FilterForm;
