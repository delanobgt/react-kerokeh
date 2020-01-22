import React from "react";
import { TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { PProductCategoryFilter } from "src/store/product-category";

interface IComponentProps {
  filter: PProductCategoryFilter;
  updateFilter: (_filter: PProductCategoryFilter) => void;
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
        <TextField
          label="Slug"
          value={filter.slug || ""}
          onChange={e => updateFilter({ slug: e.target.value })}
          fullWidth
        />
      </Div>
    </div>
  );
}

export default FilterForm;
