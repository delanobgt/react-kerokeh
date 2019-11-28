import React from "react";
import { TextField } from "@material-ui/core";

export const makeDefaultFilterUI = ({
  placeholder
}: {
  placeholder?: string;
}) => ({ column }: { column: any }) => {
  const { filterValue, preFilteredRows, setFilter } = column;
  return (
    <TextField
      value={filterValue || ""}
      onChange={e => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={placeholder || `Search...`}
    />
  );
};

export const defaultFilter = "includes";
