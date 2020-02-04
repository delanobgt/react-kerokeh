import React from "react";
import { useFilters, useSortBy, useTable } from "react-table";
import matchSorter from "match-sorter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Typography,
  Hidden,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import { makeDefaultFilterUI } from "./table-filters/DefaultFilter";
import {
  HeaderTableCellDiv,
  BodyTableCell,
  Title,
  Entry,
  Label,
  Value
} from "./table-components";

interface IComponentProps {
  columns: any[];
  data: any[];
  showPagination?: boolean;
}

function fuzzyTextFilterFn(
  rows: any,
  id: number | string,
  filterValue: string
) {
  return matchSorter(rows, filterValue, {
    keys: [(row: any) => row.values[id]]
  });
}

fuzzyTextFilterFn.autoRemove = (val: any) => !val;

// Define a custom filter function!
function filterGreaterThan(
  rows: any,
  id: number | string,
  filterValue: string
) {
  return rows.filter((row: any) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

filterGreaterThan.autoRemove = (val: any) => typeof val !== "number";

const makeHeaderTableCell = (column: any, key: number) => {
  return (
    <TableCell style={{ maxWidth: "1px" }} key={key}>
      {/* Add a sort direction indicator */}
      <TableSortLabel
        active={column.isSorted}
        direction={column.isSortedDesc ? "desc" : "asc"}
        {...column.getHeaderProps(column.getSortByToggleProps())}
        style={{ width: "100%" }}
      >
        <HeaderTableCellDiv>{column.render("Header")}</HeaderTableCellDiv>
      </TableSortLabel>
      {/* Render the columns filter UI */}
      {column.canFilter && <div>{column.render("Filter")}</div>}
    </TableCell>
  );
};

const makeBodyTableCell = (cell: any, key: number) => {
  return (
    <BodyTableCell {...cell.getCellProps()} key={key}>
      {cell.render("Cell")}
    </BodyTableCell>
  );
};

// Our table component
function ReactTable({ columns, data, showPagination }: IComponentProps) {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: makeDefaultFilterUI({}),
      filter: "contains"
    }),
    []
  );
  const filterTypes = React.useMemo(
    () => ({
      gt: filterGreaterThan,
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: any, id: number | string, filterValue: string) => {
        return rows.filter((row: any) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number
  ): void => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data: (data as unknown) as object[],
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes
    },
    useFilters,
    useSortBy
  );

  return (
    <>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup: any) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              <Hidden mdDown>
                {headerGroup.headers.map((column: any, key: number) =>
                  makeHeaderTableCell(column, key)
                )}
              </Hidden>
              <Hidden lgUp>
                <TableCell style={{ maxWidth: "1px" }}>&nbsp;</TableCell>
              </Hidden>
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row: any, i: number): any => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} key={i}>
                  <Hidden smDown key={1}>
                    {row.cells.map((cell: any, index: number) =>
                      makeBodyTableCell(cell, index)
                    )}
                  </Hidden>
                  <Hidden mdUp key={2}>
                    <TableCell style={{ maxWidth: "1px" }}>
                      <ExpansionPanel style={{ width: "100%" }}>
                        <ExpansionPanelSummary
                          expandIcon={<ExpandMoreIcon />}
                          style={{ flexGrow: 1 }}
                        >
                          <Title>
                            {Boolean(row.cells[0]) &&
                              row.cells[0].render("Cell")}{" "}
                            {Boolean(row.cells[1]) && (
                              <span>- {row.cells[1].render("Cell")}</span>
                            )}
                          </Title>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <div style={{ width: "100%" }}>
                            {row.cells.map((cell: any, index: number) => {
                              return (
                                <Entry key={index}>
                                  <Label>{cell.column.Header}</Label>
                                  <Value>{cell.render("Cell")}</Value>
                                </Entry>
                              );
                            })}
                          </div>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </TableCell>
                  </Hidden>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      {Boolean(showPagination) && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="Rows"
        />
      )}
      <br />
      <Typography variant="subtitle1" align="center">
        <em>Tips</em>: Hold <strong>Shift</strong> to do multi-sort
      </Typography>
    </>
  );
}

export default ReactTable;
