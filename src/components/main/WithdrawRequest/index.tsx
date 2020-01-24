import _ from "lodash";
import React from "react";
import {
  CircularProgress,
  Typography,
  Grid,
  IconButton,
  Chip
} from "@material-ui/core";
import {
  VerticalAlignTop as TitleIcon,
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
import useTableUrlState from "src/hooks/useTableUrlState";
import FilterForm from "./FilterForm";
import SortForm from "src/components/generic/SortForm";
import DetailDialog from "./dialogs/DetailDialog";
import {
  IWithdrawRequest,
  PWithdrawRequestFilter,
  PWithdrawRequestPagination,
  WithdrawRequestSortField,
  IWithdrawRequestGetAction,
  getWithdrawRequests
} from "src/store/withdraw-request";
import {
  TablePaper,
  TableInfoWrapper,
  TableTitle
} from "src/components/generic/table/table-infos";
import { statusLabelDict } from "./constants";
import CollapseFilterAndSort from "src/components/generic/CollapseFilterAndSort";

function WithdrawRequest() {
  const refreshDelay = 5000;
  const {
    filter,
    updateFilter,
    pagination,
    updatePagination,
    sorts,
    updateSorts
  } = useTableUrlState<
    PWithdrawRequestFilter,
    PWithdrawRequestPagination,
    WithdrawRequestSortField
  >({}, { limit: 5, offset: 0 }, []);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const withdrawRequests = useSelector<RootState, IWithdrawRequest[]>(
    state => state.withdrawRequest.withdrawRequests
  );
  const [detailDialogId, setDetailDialogId] = React.useState<number>(null);
  const dispatch = useDispatch();

  const withdrawRequestRealTotal = useSelector<RootState, number>(
    state => state.withdrawRequest.realTotal
  );
  const withdrawRequestSortFields: WithdrawRequestSortField[] = React.useMemo(
    () => [
      "amount",
      "approved_by",
      "created_at",
      "id",
      "paid",
      "rejected",
      "rejected_reason",
      "status"
    ],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IWithdrawRequestGetAction>(
      getWithdrawRequests(pagination, filter, sorts)
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
    const [err, res] = await goPromise<IWithdrawRequestGetAction>(
      getWithdrawRequests({ offset: 0, limit: 5 }, {}, [])
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

  const columns: Column<IWithdrawRequest>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Amount",
        accessor: row => "Rp. " + Number(row.amount).toLocaleString("de-DE")
      },
      {
        Header: "Status",
        accessor: row => row.status,
        Cell: ({ row: { original } }) => (
          <Chip
            style={{ background: statusLabelDict[original.status].color }}
            label={statusLabelDict[original.status].label}
          />
        )
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
                <Typography variant="h6">Withdraw Requests</Typography>
                <TitleIcon
                  style={{ marginLeft: "0.5rem", color: "cornflowerblue" }}
                />
              </TableTitle>
              <Typography variant="subtitle1">
                List of all withdraw requests
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
            ) : withdrawRequests && _.isArray(withdrawRequests) ? (
              <>
                {/* Filter Form */}
                <CollapseFilterAndSort>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                      <FilterForm filter={filter} updateFilter={updateFilter} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <SortForm<WithdrawRequestSortField>
                        sorts={sorts}
                        sortFields={withdrawRequestSortFields}
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
                  data={withdrawRequests}
                  rowCount={withdrawRequestRealTotal}
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
          withdrawRequestId={detailDialogId}
          restartIntervalRun={restartIntervalRun}
          dismiss={() => setDetailDialogId(null)}
        />
      )}
    </>
  );
}

export default WithdrawRequest;
