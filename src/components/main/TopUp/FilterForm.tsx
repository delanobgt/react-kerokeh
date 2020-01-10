import _ from "lodash";
import React from "react";
import { TextField, Typography, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import { PTopUpFilter } from "src/store/top-up";
import moment from "moment";
import DatePicker from "src/components/generic/DatePicker";
import BasicSelect from "src/components/generic/BasicSelect";

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
    () => ["settlement", "pending", "expire", "failed", "cancel"],
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
        />
      </Div>

      <Div>
        <BasicSelect
          style={{ width: "10em" }}
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
        />
        &nbsp;&nbsp;
        <DatePicker
          label="Join At (End)"
          onChange={date =>
            updateFilter({
              created_at_end: moment(date).format("YYYY-MM-DD")
            })
          }
          value={moment(filter.created_at_end, "YYYY-MM-DD").toDate()}
        />
      </Div>
    </div>
  );
}

export default FilterForm;