import React from "react";
import { TextField } from "@material-ui/core";
import matchSorter from "match-sorter";

interface IComponentProps {
  placeholder?: string;
  onChange?: (e: string) => void;
}

export const makeDefaultFilterUI = ({
  placeholder,
  onChange
}: IComponentProps) => ({ column }: { column: any }) => {
  const { filterValue, setFilter } = column;
  return (
    <TextField
      value={filterValue || ""}
      onChange={e => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        // onChange(e.target.value || undefined);
      }}
      placeholder={placeholder || `Search...`}
    />
  );
};

export const defaultFilter = function fuzzyTextFilterFn(
  rows: any,
  id: number | string,
  filterValue: string
) {
  return matchSorter(rows, filterValue, {
    keys: [(row: any) => row.values[id]]
  });
};
