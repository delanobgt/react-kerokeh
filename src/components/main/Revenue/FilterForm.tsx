import React from "react";
import { TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { PRevenueFilter } from "src/store/revenue";
import DatePicker from "src/components/generic/input/DatePicker";
import moment from "moment";

interface IComponentProps {
  filter: PRevenueFilter;
  updateFilter: (_filter: PRevenueFilter) => void;
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
          label="Buyer Username"
          value={filter.buyer_username || ""}
          onChange={e => updateFilter({ buyer_username: e.target.value })}
          fullWidth
        />
      </Div>

      <Div>
        <TextField
          label="Seller Username"
          value={filter.seller_username || ""}
          onChange={e => updateFilter({ seller_username: e.target.value })}
          fullWidth
        />
      </Div>

      <Div>
        <DatePicker
          label="Created At (Start)"
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
          label="Created At (End)"
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
