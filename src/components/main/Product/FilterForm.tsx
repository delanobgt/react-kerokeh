import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import { PProductFilter } from "src/store/product";
import BasicSelect from "src/components/generic/input/BasicSelect";
import DatePicker from "src/components/generic/input/DatePicker";
import moment from "moment";

interface IComponentProps {
  filter: PProductFilter;
  updateFilter: (_filter: PProductFilter) => void;
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

      <Div>
        <TextField
          label="Code"
          value={filter.code || ""}
          onChange={e => updateFilter({ code: e.target.value })}
          fullWidth
        />
      </Div>

      <Div>
        <TextField
          label="Color"
          value={filter.color || ""}
          onChange={e => updateFilter({ color: e.target.value })}
          fullWidth
        />
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Gender"
          value={filter.gender || ""}
          onChange={(value: string) => updateFilter({ gender: value })}
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value={0}>Men</MenuItem>
          <MenuItem value={1}>Women</MenuItem>
          <MenuItem value={2}>Youth</MenuItem>
          <MenuItem value={3}>Infant</MenuItem>
          <MenuItem value={4}>Indefinable</MenuItem>
          <MenuItem value={5}>Unisex</MenuItem>
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
          <MenuItem value="true">Active</MenuItem>
          <MenuItem value="false">Inactive</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <DatePicker
          label="Release Date (Start)"
          onChange={date =>
            updateFilter({
              release_date_start: moment(date).format("YYYY-MM-DD")
            })
          }
          value={moment(filter.release_date_start, "YYYY-MM-DD").toDate()}
          fullWidth
        />
      </Div>
      <Div>
        <DatePicker
          label="Release Date (End)"
          onChange={date =>
            updateFilter({
              release_date_end: moment(date).format("YYYY-MM-DD")
            })
          }
          value={moment(filter.release_date_end, "YYYY-MM-DD").toDate()}
          fullWidth
        />
      </Div>
    </div>
  );
}

export default FilterForm;
