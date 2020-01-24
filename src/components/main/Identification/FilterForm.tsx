import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import BasicSelect from "src/components/generic/input/BasicSelect";
import { PIdentificationFilter } from "src/store/identification";

interface IComponentProps {
  filter: PIdentificationFilter;
  updateFilter: (_filter: PIdentificationFilter) => void;
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
        <BasicSelect
          style={{ width: "100%" }}
          label="Type"
          value={filter.type || ""}
          onChange={(value: string) => updateFilter({ type: value })}
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="ktp">KTP</MenuItem>
          <MenuItem value="paspor">Paspor</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Verified"
          value={filter.verified || ""}
          onChange={(value: string) => updateFilter({ verified: value })}
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Verification Attempted"
          value={filter.verification_attempted || ""}
          onChange={(value: string) =>
            updateFilter({ verification_attempted: value })
          }
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
