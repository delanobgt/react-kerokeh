import _ from "lodash";
import React from "react";
import { CircularProgress, Typography, Grid } from "@material-ui/core";
import { Money as TitleIcon } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";

import Table, {
  OnPaginationChangeFn
} from "src/components/generic/table/ReactTableSSR";
import { RootState } from "src/store";
import { goPromise } from "src/util/helper";
import useIntervalRun from "src/hooks/useIntervalRun";
import TopAction from "./TopAction";
import FilterForm from "./FilterForm";
import SortForm from "../../generic/SortForm";
import useTableUrlState from "src/hooks/useTableUrlState";
import moment from "moment";
import {
  TablePaper,
  TableInfoWrapper,
  TableTitle
} from "src/components/generic/table/table-infos";
import CollapseFilterAndSort from "src/components/generic/CollapseFilterAndSort";
import {
  RevenueSortField,
  getRevenues,
  IRevenueGetAction,
  PRevenueFilter,
  PRevenuePagination,
  IRevenue
} from "src/store/revenue";

function Revenue() {
  const refreshDelay = 5000;
  const {
    filter,
    pagination,
    sorts,
    updateFilter,
    updatePagination,
    updateSorts
  } = useTableUrlState<PRevenueFilter, PRevenuePagination, RevenueSortField>(
    {
      created_at_start: moment.utc(0).format("YYYY-MM-DD"),
      created_at_end: moment().format("YYYY-MM-DD")
    },
    { limit: 5, offset: 0 },
    []
  );
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const revenues = useSelector<RootState, IRevenue[]>(
    state => state.revenue.revenues
  );
  const dispatch = useDispatch();

  const revenueRealTotal = useSelector<RootState, number>(
    state => state.revenue.realTotal
  );
  const revenueSortFields: RevenueSortField[] = React.useMemo(
    () => [
      "admin_fee",
      "bid_share",
      "bnib_transaction_id",
      "buyer_id",
      "buyer_promo_code_id",
      "deposit_share",
      "seller_id",
      "seller_promo_code_id",
      "shipping_revenue",
      "total_revenue",
      "type"
    ],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IRevenueGetAction>(
      getRevenues(pagination, filter, sorts)
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
    const [err, res] = await goPromise<IRevenueGetAction>(
      getRevenues({ offset: 0, limit: 5 }, {}, [])
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

  const columns: Column<IRevenue>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: row => row.id
      },
      {
        Header: "BNIB Transaction ID",
        accessor: row => row.bnib_transaction_id
      },
      {
        Header: "Type",
        accessor: row => row.type
      },
      {
        Header: "Bid Share",
        accessor: row => row.bid_share
      },
      {
        Header: "Deposit Share",
        accessor: row => row.deposit_share
      },
      {
        Header: "Admin Fee",
        accessor: row => row.admin_fee
      },
      {
        Header: "Shipping Revenue",
        accessor: row => row.shipping_revenue
      },
      {
        Header: "Total Revenue",
        accessor: row => row.total_revenue
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
                <Typography variant="h6">Revenue</Typography>
                <TitleIcon
                  style={{ marginLeft: "0.5rem", color: "cornflowerblue" }}
                />
              </TableTitle>
              <Typography variant="subtitle1">List of all revenues</Typography>
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
            ) : revenues && _.isArray(revenues) ? (
              <>
                {/* Filter Form */}
                <CollapseFilterAndSort>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                      <FilterForm filter={filter} updateFilter={updateFilter} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <SortForm<RevenueSortField>
                        sorts={sorts}
                        sortFields={revenueSortFields}
                        updateSorts={updateSorts}
                      />
                    </Grid>
                  </Grid>
                </CollapseFilterAndSort>
                {/* top action */}
                <br />
                <TopAction
                  intervalRun={intervalRun}
                  refreshDelay={refreshDelay}
                />
                <Table
                  pageIndex={pagination.offset / pagination.limit}
                  pageSize={Number(pagination.limit)}
                  columns={columns}
                  data={revenues}
                  rowCount={revenueRealTotal}
                  onPaginationChange={onPaginationChange}
                  disableSorting={true}
                />
              </>
            ) : null}
          </TablePaper>
        </Grid>
      </Grid>
    </>
  );
}

export default Revenue;