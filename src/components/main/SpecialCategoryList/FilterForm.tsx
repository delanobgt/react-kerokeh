import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import BasicSelect from "src/components/generic/input/BasicSelect";
import { PSpecialCategoryListFilter } from "src/store/special-category-list";

interface IComponentProps {
  filter: PSpecialCategoryListFilter;
  updateFilter: (_filter: PSpecialCategoryListFilter) => void;
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
          label="Name"
          value={filter.name || ""}
          onChange={e => updateFilter({ name: e.target.value })}
          fullWidth
        />
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Published"
          value={filter.published || ""}
          onChange={(value: string) => updateFilter({ published: value })}
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </BasicSelect>
      </Div>
    </div>
  );
}

export default FilterForm;
