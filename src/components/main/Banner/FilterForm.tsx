import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import BasicSelect from "src/components/generic/BasicSelect";
import { PBannerFilter } from "src/store/banner";
import DatePicker from "src/components/generic/DatePicker";
import moment from "moment";

interface IComponentProps {
  filter: PBannerFilter;
  updateFilter: (_filter: PBannerFilter) => void;
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
          <MenuItem value="0">All</MenuItem>
          <MenuItem value="1">Legit Check</MenuItem>
          <MenuItem value="2">Market Place</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Is Active"
          value={filter.is_active || ""}
          onChange={(value: string) => updateFilter({ is_active: value })}
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <DatePicker
          label="Expired At (Start)"
          onChange={date =>
            updateFilter({
              expired_at_start: moment(date).format("YYYY-MM-DD")
            })
          }
          fullWidth
          value={moment(filter.expired_at_start, "YYYY-MM-DD").toDate()}
        />
      </Div>
      <Div>
        <DatePicker
          label="Expired At (End)"
          onChange={date =>
            updateFilter({
              expired_at_end: moment(date).format("YYYY-MM-DD")
            })
          }
          fullWidth
          value={moment(filter.expired_at_end, "YYYY-MM-DD").toDate()}
        />
      </Div>
    </div>
  );
}

export default FilterForm;
