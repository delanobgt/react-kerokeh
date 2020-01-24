import _ from "lodash";
import React from "react";
import { Typography, MenuItem, IconButton } from "@material-ui/core";
import {
  Close as CloseIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from "@material-ui/icons";
import styled from "styled-components";
import BasicSelect from "src/components/generic/input/BasicSelect";
import { ISort } from "src/util/types";

interface IComponentProps<T> {
  sorts: ISort<T>[];
  sortFields: T[];
  updateSorts: (sorts: ISort<T>[]) => void;
}

const Div = styled.div`
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
`;

function SortForm<T>({ sorts, sortFields, updateSorts }: IComponentProps<T>) {
  const usedSortFields = React.useMemo(
    () => _.mapKeys(sorts, (e: ISort<T>) => e.field),
    [sorts]
  );

  const handleAdd = React.useCallback(
    (value: T) => {
      const newSorts: ISort<T>[] = [
        ...sorts,
        { field: value, dir: "asc" } as ISort<T>
      ];
      updateSorts(newSorts);
    },
    [sorts, updateSorts]
  );

  const handleReplace = React.useCallback(
    (index: number, value: T) => {
      const newSorts: ISort<T>[] = [...sorts];
      newSorts[index] = {
        field: value,
        dir: newSorts[index].dir
      };
      updateSorts(newSorts);
    },
    [sorts, updateSorts]
  );

  const handleToggleSort = React.useCallback(
    (index: number) => {
      const newSorts: ISort<T>[] = [...sorts];
      newSorts[index] = {
        ...newSorts[index],
        dir: newSorts[index].dir === "asc" ? "desc" : "asc"
      };
      updateSorts(newSorts);
    },
    [sorts, updateSorts]
  );

  const handleDelete = React.useCallback(
    (index: number) => {
      const newSorts: ISort<T>[] = [
        ...sorts.slice(0, index),
        ...sorts.slice(index + 1)
      ];
      updateSorts(newSorts);
    },
    [sorts, updateSorts]
  );

  return (
    <div>
      <Typography variant="subtitle2">Sort</Typography>

      {sorts.map((sort, index) => (
        <Div key={index}>
          <Typography
            variant="subtitle1"
            display="inline"
            style={{ marginRight: "0.5rem" }}
          >
            {index === 0 ? "Firstly, sort by " : "if tie, then sort by "}
          </Typography>
          <BasicSelect
            style={{ flexGrow: 1 }}
            label="Field"
            value={(sort.field as unknown) as string}
            onChange={(value: string) => {
              handleReplace(index, (value as unknown) as T);
            }}
          >
            {sortFields.map((field: T) => {
              const sField: string = (field as unknown) as string;
              return (
                <MenuItem
                  key={sField}
                  value={sField}
                  disabled={_.has(usedSortFields, sField)}
                >
                  {_.startCase(sField)}
                </MenuItem>
              );
            })}
          </BasicSelect>
          <IconButton onClick={() => handleToggleSort(index)}>
            {sort.dir === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
          <IconButton edge="start" onClick={() => handleDelete(index)}>
            <CloseIcon />
          </IconButton>
        </Div>
      ))}

      <Div>
        <BasicSelect
          style={{ width: "100%" }}
          label="Add Sort Criteria"
          value=""
          onChange={(value: string) => {
            handleAdd((value as unknown) as T);
          }}
        >
          {sortFields.map((field: T) => {
            const sField: string = (field as unknown) as string;
            return (
              <MenuItem
                key={sField}
                disabled={_.has(usedSortFields, sField)}
                value={sField}
              >
                {_.startCase(sField)}
              </MenuItem>
            );
          })}
        </BasicSelect>
      </Div>
    </div>
  );
}

export default SortForm;
