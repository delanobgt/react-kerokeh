import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import { PUserFilter } from "src/store/user";
import BasicSelect from "src/components/generic/input/BasicSelect";
import DatePicker from "src/components/generic/input/DatePicker";
import moment from "moment";

interface IComponentProps {
  filter: PUserFilter;
  updateFilter: (_filter: PUserFilter) => void;
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
          label="Username"
          value={filter.username || ""}
          onChange={e => updateFilter({ username: e.target.value })}
          fullWidth
        />
      </Div>

      <Div>
        <TextField
          label="Full Name"
          value={filter.full_name || ""}
          onChange={e => updateFilter({ full_name: e.target.value })}
          fullWidth
        />
      </Div>

      <Div>
        <TextField
          label="Email"
          value={filter.email || ""}
          onChange={e => updateFilter({ email: e.target.value })}
          fullWidth
        />
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Store Closed"
          value={filter.store_closed || ""}
          onChange={(value: string) => updateFilter({ store_closed: value })}
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Banned"
          value={filter.banned || ""}
          onChange={(value: string) => updateFilter({ banned: value })}
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="true">Banned</MenuItem>
          <MenuItem value="false">Not Banned</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Froze"
          value={filter.froze || ""}
          onChange={(value: string) => updateFilter({ froze: value })}
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="true">Froze</MenuItem>
          <MenuItem value="false">Not Froze</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Is Seller"
          value={filter.is_seller || ""}
          onChange={(value: string) => updateFilter({ is_seller: value })}
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="true">Is Seller</MenuItem>
          <MenuItem value="false">Is Not Seller</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <DatePicker
          label="Join At (Start)"
          onChange={date =>
            updateFilter({
              created_at_start: moment(date).format("YYYY-MM-DD")
            })
          }
          value={moment(filter.created_at_start, "YYYY-MM-DD").toDate()}
          fullWidth
        />
      </Div>
      <Div>
        <DatePicker
          label="Join At (End)"
          onChange={date =>
            updateFilter({
              created_at_end: moment(date).format("YYYY-MM-DD")
            })
          }
          value={moment(filter.created_at_end, "YYYY-MM-DD").toDate()}
          fullWidth
        />
      </Div>
    </div>
  );
}

export default FilterForm;
