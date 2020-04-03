import _ from "lodash";
import React from "react";
import {
  CircularProgress,
  Typography,
  Grid,
  IconButton
} from "@material-ui/core";
import {
  VerticalAlignBottom as TitleIcon,
  Details as DetailsIcon
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";

import Table, {
  OnPaginationChangeFn
} from "src/components/generic/table/ReactTableSSR";
import { RootState } from "src/store";
import { goPromise } from "src/util/helper";
import useIntervalRun from "src/hooks/useIntervalRun";
import TopAction from "./TopAction";
import DetailDialog from "./dialogs/DetailDialog";
import useTableUrlState from "src/hooks/useTableUrlState";
import {
  ITopUp,
  PTopUpFilter,
  PTopUpPagination,
  TopUpSortField,
  getTopUps,
  ITopUpGetAction
} from "src/store/top-up";
import SortForm from "src/components/generic/SortForm";
import FilterForm from "./FilterForm";
import moment from "moment";
import {
  TablePaper,
  TableInfoWrapper,
  TableTitle
} from "src/components/generic/table/table-infos";
import CollapseFilterAndSort from "src/components/generic/CollapseFilterAndSort";

function TopUp() {
  const refreshDelay = 5000;
  const {
    filter,
    updateFilter,
    pagination,
    updatePagination,
    sorts,
    updateSorts
  } = useTableUrlState<PTopUpFilter, PTopUpPagination, TopUpSortField>(
    {
      created_at_start: moment("2018-01-01").format("YYYY-MM-DD"),
      created_at_end: moment().format("YYYY-MM-DD")
    },
    { limit: 5, offset: 0 },
    []
  );
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const topUps = useSelector<RootState, ITopUp[]>(state => state.topUp.topUps);
  const [detailDialogId, setDetailDialogId] = React.useState<number>(null);
  const dispatch = useDispatch();

  const topUpRealTotal = useSelector<RootState, number>(
    state => state.topUp.realTotal
  );
  const topUpSortFields: TopUpSortField[] = React.useMemo(
    () => [
      "amount",
      "code",
      "created_at",
      "description",
      "fraud_status",
      "id",
      "invoice_id",
      "payment_channel",
      "payment_code",
      "payment_status",
      "payment_type",
      "virtual_account_number"
    ],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<ITopUpGetAction>(
      getTopUps(pagination, filter, sorts)
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
    const [errDF, resDF] = await goPromise<ITopUpGetAction>(
      getTopUps({ offset: 0, limit: 5 }, {}, [])
    );
    setLoading(false);

    if (errDF) {
      console.log({ errDF });
      setError("error");
    } else {
      dispatch(resDF);
      setIntervalRunAlive(true);
    }
  }, [dispatch, setIntervalRunAlive]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const dRestartIntervalRun = React.useMemo(
    () => _.debounce(restartIntervalRun, 1000),
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
  const columns: Column<ITopUp>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: row => row.id
      },
      {
        Header: "Username",
        accessor: row => row.username
      },
      {
        Header: "Amount",
        accessor: row => Number(row.amount || 0).toLocaleString("de-DE")
      },
      {
        Header: "Code",
        accessor: row => row.code
      },
      {
        Header: "Payment Status",
        accessor: row => row.payment_status
      },
      {
        Header: "Actions",
        accessor: "",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <IconButton onClick={() => setDetailDialogId(original.id)}>
                <DetailsIcon />
              </IconButton>
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
                <Typography variant="h6">Top Ups</Typography>
                <TitleIcon
                  style={{ marginLeft: "0.5rem", color: "cornflowerblue" }}
                />
              </TableTitle>
              <Typography variant="subtitle1">List of all top ups</Typography>
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
            ) : topUps && _.isArray(topUps) ? (
              <>
                {/* Filter Form */}
                <CollapseFilterAndSort>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                      <FilterForm filter={filter} updateFilter={updateFilter} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <SortForm<TopUpSortField>
                        sorts={sorts}
                        sortFields={topUpSortFields}
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
                  data={topUps}
                  rowCount={topUpRealTotal}
                  onPaginationChange={onPaginationChange}
                  disableSorting={true}
                />
              </>
            ) : null}
          </TablePaper>
        </Grid>
      </Grid>
      {Boolean(detailDialogId) && (
        <DetailDialog
          topUpId={detailDialogId}
          dismiss={() => setDetailDialogId(null)}
        />
      )}
    </>
  );
}

export default TopUp;
