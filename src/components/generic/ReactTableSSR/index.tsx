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
  Typography,
  Hidden,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

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

const makeHeaderTableCell = (column: any) => {
  return (
    <TableCell style={{ maxWidth: "1px" }}>
      {/* Add a sort direction indicator */}
      <TableSortLabel
        active={column.isSorted}
        direction={column.isSortedDesc ? "desc" : "asc"}
        {...column.getHeaderProps(column.getSortByToggleProps())}
        style={{ width: "100%" }}
      >
        <div
          style={{
            width: "100%",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal"
          }}
        >
          {column.render("Header")}
        </div>
      </TableSortLabel>
      {/* Render the columns filter UI */}
      {column.canFilter && <div>{column.render("Filter")}</div>}
    </TableCell>
  );
};

const makeBodyTableCell = (cell: any) => {
  return (
    <TableCell
      {...cell.getCellProps()}
      style={{
        wordWrap: "break-word",
        overflowWrap: "break-word",
        whiteSpace: "normal",
        maxWidth: "1px"
      }}
    >
      {cell.render("Cell")}
    </TableCell>
  );
};

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
    page
    // gotoPage,
    // setPageSize
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
  // React.useEffect(() => {
  //   gotoPage(pageIndex || 0);
  // }, [gotoPage, pageIndex]);
  // React.useEffect(() => {
  //   setPageSize(pageSize || 5);
  // }, [setPageSize, pageSize]);

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
              <Hidden mdDown>
                {headerGroup.headers.map((column: any) =>
                  makeHeaderTableCell(column)
                )}
              </Hidden>
              <Hidden lgUp>
                <TableCell style={{ maxWidth: "1px" }}>&nbsp;</TableCell>
              </Hidden>
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row: any, index: number): any => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()} key={index}>
                <Hidden smDown>
                  {row.cells.map((cell: any) => makeBodyTableCell(cell))}
                </Hidden>
                <Hidden mdUp>
                  <TableCell style={{ maxWidth: "1px" }}>
                    <ExpansionPanel style={{ width: "100%" }}>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        style={{ flexGrow: 1 }}
                      >
                        <Typography
                          style={{
                            overflowWrap: "break-word",
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            width: "55vw"
                          }}
                        >
                          {row.cells[0].render("Cell")} -{" "}
                          {row.cells[1].render("Cell")}
                        </Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <div style={{ width: "100%" }}>
                          {row.cells.map((cell: any, index: number) => {
                            console.log(cell);
                            return (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  marginBottom: "1rem"
                                }}
                              >
                                <div
                                  style={{
                                    overflowWrap: "break-word",
                                    wordWrap: "break-word",
                                    whiteSpace: "normal",
                                    width: "25%",
                                    minWidth: "25%",
                                    flexBasis: "25%",
                                    marginRight: "0.8rem"
                                  }}
                                >
                                  {cell.column.Header}
                                </div>
                                <div
                                  style={{
                                    overflowWrap: "break-word",
                                    wordWrap: "break-word",
                                    whiteSpace: "normal",
                                    width: "75%",
                                    minWidth: "75%",
                                    flexBasis: "75%"
                                  }}
                                >
                                  {cell.render("Cell")}
                                </div>
                              </div>
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={rowCount}
        page={pageIndex || 0}
        rowsPerPage={pageSize || 5}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        labelRowsPerPage="Rows"
      />
    </>
  );
}

export default ReactTableSSR;
