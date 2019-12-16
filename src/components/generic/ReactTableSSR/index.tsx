import React from "react";
import { useFilters, useSortBy, useTable, usePagination } from "react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Typography
} from "@material-ui/core";

interface IComponentProps {
  columns: any[];
  data: any[];
  rowCount: number;
  onPaginationChange: OnPaginationChangeFn;
  disableSorting?: boolean;
}

export type OnPaginationChangeFn = (
  pageIndex: number,
  pageSize: number
) => void;

// Our table component
function ReactTableSSR({
  columns,
  data,
  rowCount,
  onPaginationChange,
  disableSorting
}: IComponentProps) {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: null
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,

    // pagination shits
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data: (data as unknown) as object[],
      defaultColumn, // Be sure to pass the defaultColumn option,
      initialState: { pageIndex: 0, pageSize: 5 },
      manualPagination: true,
      pageCount: Math.ceil(rowCount / 5),
      disableSorting
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number
  ): void => {
    gotoPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPageSize(parseInt(event.target.value, 10));
  };

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    if (onPaginationChange) onPaginationChange(pageIndex, pageSize);
  }, [onPaginationChange, pageIndex, pageSize]);

  return (
    <>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup: any, index) => (
            <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any, index: number) => (
                <TableCell key={index}>
                  {/* Add a sort direction indicator */}
                  <TableSortLabel
                    hideSortIcon={disableSorting}
                    active={column.isSorted}
                    direction={column.isSortedDesc ? "desc" : "asc"}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                  </TableSortLabel>

                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row: any, index: number): any => {
            prepareRow(row);
            return (
              <TableRow key={index} {...row.getRowProps()}>
                {row.cells.map((cell: any, index: number) => {
                  return (
                    <TableCell key={index} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={rowCount}
        rowsPerPage={pageSize}
        page={pageIndex}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <br />
      <Typography variant="subtitle1" align="center">
        <em>Tips</em>: Hold <strong>Shift</strong> to do multi-sort
      </Typography>
    </>
  );
}

export default ReactTableSSR;
