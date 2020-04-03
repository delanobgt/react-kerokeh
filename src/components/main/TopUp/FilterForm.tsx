import _ from "lodash";
import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import { PTopUpFilter } from "src/store/top-up";
import moment from "moment";
import DatePicker from "src/components/generic/input/DatePicker";
import BasicSelect from "src/components/generic/input/BasicSelect";

interface IComponentProps {
  filter: PTopUpFilter;
  updateFilter: (_filter: PTopUpFilter) => void;
}

const Div = styled.div`
  margin-bottom: 0.5rem;
`;

function FilterForm(props: IComponentProps) {
  const { filter, updateFilter } = props;

  const paymentStatuses = React.useMemo(
    () => ["initiated", "pending", "failed", "cancel", "expired", "success"],
    []
  );

  return (
    <div>
      <Typography variant="subtitle2">Filter</Typography>

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
          label="Username"
          value={filter.username || ""}
          onChange={e => updateFilter({ username: e.target.value })}
          fullWidth
        />
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Payment Status"
          value={filter.payment_status || ""}
          onChange={(value: string) => updateFilter({ payment_status: value })}
        >
          <MenuItem value="">No Filter</MenuItem>
          {paymentStatuses.map(status => (
            <MenuItem value={status}>{_.startCase(status)}</MenuItem>
          ))}
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
