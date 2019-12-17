import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/store";
import BasicSelect from "src/components/generic/BasicSelect";
import {
  PIdentificationFilter,
  updateIdentificationFilter
} from "src/store/identification";

interface IComponentProps {}

const Div = styled.div`
  margin-bottom: 0.5rem;
`;

function FilterForm(props: IComponentProps) {
  const filterState = useSelector<RootState, PIdentificationFilter>(
    state => state.identification.filter
  );

  const dispatch = useDispatch();

  return (
    <div>
      <Typography variant="subtitle2">Filter</Typography>

      <Div>
        <TextField
          label="Id"
          value={filterState.id || ""}
          onChange={e =>
            dispatch(updateIdentificationFilter({ id: e.target.value }))
          }
        />
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "8em" }}
          label="Type"
          value={filterState.type || ""}
          onChange={(value: string) =>
            dispatch(updateIdentificationFilter({ type: value }))
          }
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="ktp">KTP</MenuItem>
          <MenuItem value="paspor">Paspor</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "8em" }}
          label="Verified"
          value={filterState.verified || ""}
          onChange={(value: string) =>
            dispatch(updateIdentificationFilter({ verified: value }))
          }
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "12em" }}
          label="Verification Attempted"
          value={filterState.verification_attempted || ""}
          onChange={(value: string) =>
            dispatch(
              updateIdentificationFilter({ verification_attempted: value })
            )
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
