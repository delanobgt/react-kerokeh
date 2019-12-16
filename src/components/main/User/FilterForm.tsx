import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/store";
import { PUserFilter, updateUserFilter } from "src/store/user";
import BasicSelect from "src/components/generic/BasicSelect";
import DatePicker from "src/components/generic/DatePicker";
import moment from "moment";

interface IComponentProps {}

const Div = styled.div`
  margin-bottom: 0.5rem;
`;

function FilterForm(props: IComponentProps) {
  const filterState = useSelector<RootState, PUserFilter>(
    state => state.user.filter
  );

  const dispatch = useDispatch();

  return (
    <div>
      <Typography variant="subtitle2">Filter</Typography>

      <Div>
        <TextField
          label="Id"
          value={filterState.id || ""}
          onChange={e => dispatch(updateUserFilter({ id: e.target.value }))}
        />
      </Div>

      <Div>
        <TextField
          label="Username"
          value={filterState.username || ""}
          onChange={e =>
            dispatch(updateUserFilter({ username: e.target.value }))
          }
        />
      </Div>

      <Div>
        <TextField
          label="Full Name"
          value={filterState.full_name || ""}
          onChange={e =>
            dispatch(updateUserFilter({ full_name: e.target.value }))
          }
        />
      </Div>

      <Div>
        <TextField
          label="Email"
          value={filterState.email || ""}
          onChange={e => dispatch(updateUserFilter({ email: e.target.value }))}
        />
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "8em" }}
          label="Store Closed"
          value={filterState.store_closed || ""}
          onChange={(value: string) =>
            dispatch(updateUserFilter({ store_closed: value }))
          }
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "8em" }}
          label="Banned"
          value={filterState.banned || ""}
          onChange={(value: string) =>
            dispatch(updateUserFilter({ banned: value }))
          }
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="true">Banned</MenuItem>
          <MenuItem value="false">Not Banned</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "8em" }}
          label="Froze"
          value={filterState.froze || ""}
          onChange={(value: string) =>
            dispatch(updateUserFilter({ froze: value }))
          }
        >
          <MenuItem value="">No Filter</MenuItem>
          <MenuItem value="true">Froze</MenuItem>
          <MenuItem value="false">Not Froze</MenuItem>
        </BasicSelect>
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "8em" }}
          label="Is Seller"
          value={filterState.is_seller || ""}
          onChange={(value: string) =>
            dispatch(updateUserFilter({ is_seller: value }))
          }
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
            dispatch(
              updateUserFilter({
                created_at_start: moment(date).format("YYYY-MM-DD")
              })
            )
          }
          value={moment(filterState.created_at_start, "YYYY-MM-DD").toDate()}
        />
        &nbsp;&nbsp;
        <DatePicker
          label="Join At (End)"
          onChange={date =>
            dispatch(
              updateUserFilter({
                created_at_end: moment(date).format("YYYY-MM-DD")
              })
            )
          }
          value={moment(filterState.created_at_end, "YYYY-MM-DD").toDate()}
        />
      </Div>
    </div>
  );
}

export default FilterForm;
