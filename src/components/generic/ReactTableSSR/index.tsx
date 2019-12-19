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
  pageIndex: number;
  pageSize: number;
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
  disableSorting,
  pageIndex,
  pageSize
}: IComponentProps) {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: null
    }),
    []
  );

  const onPaginationChangeRef = React.useRef(null);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,

    // pagination shits
    page,
    gotoPage,
    setPageSize
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

  // call pagination listener on pagination change
  const handleChangePage = React.useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      newPage: number
    ): void => {
      onPaginationChangeRef.current(newPage, pageSize);
    },
    [pageSize]
  );
  const handleChangeRowsPerPage = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const newPageSize = parseInt(event.target.value, 10);
      onPaginationChangeRef.current(pageIndex, newPageSize);
    },
    [pageIndex]
  );

  // update pagination state based on props
  React.useEffect(() => {
    gotoPage(pageIndex);
  }, [gotoPage, pageIndex]);
  React.useEffect(() => {
    setPageSize(pageSize);
  }, [setPageSize, pageSize]);

  // Listen for changes in pagination handler
  React.useEffect(() => {
    onPaginationChangeRef.current = onPaginationChange;
  }, [onPaginationChange]);

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
        page={pageIndex}
        rowsPerPage={pageSize}
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
