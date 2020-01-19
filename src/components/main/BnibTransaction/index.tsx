import _ from "lodash";
import React from "react";
import { CircularProgress, Typography, Grid, Button } from "@material-ui/core";
import { Receipt as TitleIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import useReactRouter from "use-react-router";
import queryString from "query-string";

import Table, {
  OnPaginationChangeFn
} from "src/components/generic/ReactTableSSR";
import { RootState } from "src/store";
import { goPromise } from "src/util/helper";
import useIntervalRun from "src/hooks/useIntervalRun";
import TopAction from "./TopAction";
import DetailDialog from "./dialogs/DetailDialog";
import useTableUrlState from "src/hooks/useTableUrlState";
import moment from "moment";
import FilterForm from "./FilterForm";
import SortForm from "src/components/generic/SortForm";
import {
  TablePaper,
  TableInfoWrapper,
  TableTitle
} from "src/components/generic/TableGenerics";
import {
  PBnibTransactionFilter,
  PBnibTransactionPagination,
  BnibTransactionSortField,
  IBnibTransaction,
  IBnibTransactionGetAction,
  getBnibTransactions
} from "src/store/bnib-transaction";

const useStyles = makeStyles(theme => ({
  filterAndSortForm: {
    marginBottom: "1rem",
    display: "flex",
    paddingLeft: theme.spacing(2)
    // justifyContent: "space-between"
  }
}));

function BnibTransaction() {
  const refreshDelay = 5000;
  const classes = useStyles({});

  const { location } = useReactRouter();
  const isSearchEmpty = React.useMemo(() => {
    const parsed = queryString.parse(location.search);
    return _.size(parsed) === 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    filter,
    updateFilter,
    pagination,
    updatePagination,
    sorts,
    updateSorts
  } = useTableUrlState<
    PBnibTransactionFilter,
    PBnibTransactionPagination,
    BnibTransactionSortField
  >(
    {},
    { limit: 5, offset: 0 },
    isSearchEmpty ? [{ field: "created_at", dir: "desc" }] : []
  );
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const bnibTransactions = useSelector<RootState, IBnibTransaction[]>(
    state => state.bnibTransaction.bnibTransactions
  );
  const [detailDialogCode, setDetailDialogCode] = React.useState<string>(null);
  const dispatch = useDispatch();

  const bnibTransactionRealTotal = useSelector<RootState, number>(
    state => state.bnibTransaction.realTotal
  );
  const bnibTransactionSortFields: BnibTransactionSortField[] = React.useMemo(
    () => [
      "code",
      "created_at",
      "id",
      "is_defected",
      "legit_checked",
      "legit_status",
      "status"
    ],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IBnibTransactionGetAction>(
      getBnibTransactions(pagination, filter, sorts)
    );
    if (err) {
      throw err;
    } else {
      dispatch(res);
    }
  }, [dispatch, pagination, filter, sorts]);
  const intervalRun = useIntervalRun(() => autoFetch(), refreshDelay);
  const {
    setAlive: setIntervalRunAlive,
    restart: restartIntervalRun
  } = intervalRun;

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [err, res] = await goPromise<IBnibTransactionGetAction>(
      getBnibTransactions({ offset: 0, limit: 5 }, {}, [])
    );
    setLoading(false);

    if (err) {
      console.log({ err });
      setError("error");
    } else {
      dispatch(res);
      setIntervalRunAlive(true);
    }
  }, [dispatch, setIntervalRunAlive]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const dRestartIntervalRun = React.useMemo(
    () => _.debounce(restartIntervalRun, 600),
    [restartIntervalRun]
  );

  // on table change (pagination, filter, sorts)
  React.useEffect(() => {
    dRestartIntervalRun();
  }, [dRestartIntervalRun, pagination, filter, sorts]);

  const onPaginationChange: OnPaginationChangeFn = React.useCallback(
    (pageIndex, pageSize) => {
      updatePagination({
        offset: pageIndex * pageSize,
        limit: pageSize
      });
    },
    [updatePagination]
  );
  const columns: Column<IBnibTransaction>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Code",
        accessor: row => row.code
      },
      {
        Header: "Status",
        accessor: row => row.status_message
      },
      {
        Header: "Created At",
        accessor: row => moment(row.created_at).format("D MMMM YYYY (HH:mm:ss)")
      },
      {
        Header: "Actions",
        accessor: "",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <Button
                onClick={() => setDetailDialogCode(original.code)}
                color="primary"
                variant="outlined"
              >
                Detail
              </Button>
            </div>
          );
        }
      }
    ],
    []
  );

  return (
    <>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <TablePaper elevation={3}>
            <TableInfoWrapper>
              <TableTitle>
                <Typography variant="h6">BNIB Transactions</Typography>
                <TitleIcon
                  style={{ marginLeft: "0.5rem", color: "cornflowerblue" }}
                />
              </TableTitle>
              <Typography variant="subtitle1">
                List of all BNIB transactions.
              </Typography>
            </TableInfoWrapper>
            <br />
            <br />

            {loading ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress size={24} /> Loading...
              </div>
            ) : error ? (
              <Typography variant="subtitle1" color="secondary">
                An error occured, please{" "}
                <span onClick={fetch} style={{ color: "lightblue" }}>
                  retry
                </span>
                .
              </Typography>
            ) : bnibTransactions && _.isArray(bnibTransactions) ? (
              <>
                {/* Filter Form */}
                <div className={classes.filterAndSortForm}>
                  <FilterForm filter={filter} updateFilter={updateFilter} />
                  <div style={{ marginLeft: "2rem" }}>
                    <SortForm<BnibTransactionSortField>
                      sorts={sorts}
                      sortFields={bnibTransactionSortFields}
                      updateSorts={updateSorts}
                    />
                  </div>
                </div>
                <TopAction
                  intervalRun={intervalRun}
                  refreshDelay={refreshDelay}
                />
                <Table
                  pageIndex={pagination.offset / pagination.limit}
                  pageSize={Number(pagination.limit)}
                  columns={columns}
                  data={bnibTransactions}
                  rowCount={bnibTransactionRealTotal}
                  onPaginationChange={onPaginationChange}
                  disableSorting={true}
                />
              </>
            ) : null}
          </TablePaper>
        </Grid>
      </Grid>
      {Boolean(detailDialogCode) && (
        <DetailDialog
          transactionCode={detailDialogCode}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setDetailDialogCode(null)}
        />
      )}
    </>
  );
}

export default BnibTransaction;
