import _ from "lodash";
import React from "react";
import {
  CircularProgress,
  Paper,
  Toolbar,
  Typography,
  Grid,
  Button
} from "@material-ui/core";
import clsx from "clsx";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";

import Table, {
  OnPaginationChangeFn
} from "src/components/generic/ReactTableSSR";
import { RootState } from "src/store";
import { goPromise } from "src/util/helper";
import useIntervalRun from "src/hooks/useIntervalRun";
import TopAction from "./TopAction";
import CreateDialog from "./dialogs/CreateDialog";
import UpdateDialog from "./dialogs/UpdateDialog";
import DeleteDialog from "./dialogs/DeleteDialog";
import useTableUrlState from "src/hooks/useTableUrlState";
import {
  getDepositFees,
  IDepositFeeGetAction,
  PDepositFeeFilter,
  PDepositFeePagination,
  DepositFeeSortField,
  IDepositFee,
  PDepositFee
} from "src/store/deposit-fee";

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    display: "block"
  },
  topAction: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(2)
  }
}));

const MyPaper = styled(Paper)`
  padding: 1.5em;
`;

function DepositFee() {
  const refreshDelay = 5000;
  const classes = useStyles({});
  const { filter, pagination, sorts, updatePagination } = useTableUrlState<
    PDepositFeeFilter,
    PDepositFeePagination,
    DepositFeeSortField
  >({}, { limit: 5, offset: 0 }, []);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const depositFees = useSelector<RootState, IDepositFee[]>(
    state => state.depositFee.depositFees
  );
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(
    false
  );
  const [updateDialogId, setUpdateDialogId] = React.useState<number>(null);
  const [deleteDialogId, setDeleteDialogId] = React.useState<number>(null);
  const dispatch = useDispatch();

  const depositFeeRealTotal = useSelector<RootState, number>(
    state => state.depositFee.realTotal
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IDepositFeeGetAction>(
      getDepositFees(pagination, filter, sorts)
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
    const [err, res] = await goPromise<IDepositFeeGetAction>(
      getDepositFees({ offset: 0, limit: 5 }, {}, [])
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
  const columns: Column<IDepositFee>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Fee",
        accessor: row => `Rp. ${Number(row.fee).toLocaleString("de-DE")}`
      },
      {
        Header: "Starting Price",
        accessor: row =>
          `Rp. ${Number(row.starting_price).toLocaleString("de-DE")}`
      },
      {
        Header: "Created By",
        accessor: "created_by"
      },
      {
        Header: "Updated By",
        accessor: "updated_by"
      },
      {
        Header: "Actions",
        accessor: "",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <Button
                onClick={() => setUpdateDialogId(original.id)}
                color="primary"
                variant="outlined"
              >
                Update
              </Button>
              <Button
                onClick={() => setDeleteDialogId(original.id)}
                color="primary"
                variant="outlined"
                style={{ marginLeft: "1rem" }}
              >
                Delete
              </Button>
            </div>
          );
        }
      }
    ],
    []
  );

  // set updateInitialValues
  const [updateInitialValues, setUpdateInitialValues] = React.useState<
    PDepositFee
  >({ fee: 0, starting_price: 0 });
  React.useEffect(() => {
    if (!updateDialogId)
      return setUpdateInitialValues({ fee: 0, starting_price: 0 });
    const depositFee: IDepositFee = (_.find(
      depositFees,
      pc => ((pc as unknown) as IDepositFee).id === updateDialogId
    ) as unknown) as IDepositFee;
    setUpdateInitialValues(depositFee);
  }, [depositFees, updateDialogId, setUpdateInitialValues]);

  return (
    <>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <MyPaper elevation={3}>
            <Toolbar className={clsx(classes.root)}>
              <Typography variant="h6">Deposit Fees</Typography>
              <Typography variant="subtitle1">
                List of all deposit fees
              </Typography>
            </Toolbar>
            <br />
            <br />

            {loading ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress size={24} /> Loading user...
              </div>
            ) : error ? (
              <Typography variant="subtitle1" color="secondary">
                An error occured, please{" "}
                <span onClick={fetch} style={{ color: "lightblue" }}>
                  retry
                </span>
                .
              </Typography>
            ) : depositFees && _.isArray(depositFees) ? (
              <>
                <TopAction
                  intervalRun={intervalRun}
                  refreshDelay={refreshDelay}
                  setCreateDialogOpen={setCreateDialogOpen}
                />
                <Table
                  pageIndex={pagination.offset / pagination.limit}
                  pageSize={Number(pagination.limit)}
                  columns={columns}
                  data={depositFees}
                  rowCount={depositFeeRealTotal}
                  onPaginationChange={onPaginationChange}
                  disableSorting={true}
                />
              </>
            ) : null}
          </MyPaper>
        </Grid>
      </Grid>
      {Boolean(createDialogOpen) && (
        <CreateDialog
          open={createDialogOpen}
          restartIntervalRun={restartIntervalRun}
          dismiss={() => setCreateDialogOpen(null)}
        />
      )}
      {Boolean(updateDialogId) && (
        <UpdateDialog
          productBrandId={updateDialogId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setUpdateDialogId(null)}
          initialValues={updateInitialValues}
        />
      )}
      {deleteDialogId && (
        <DeleteDialog
          depositFeeId={deleteDialogId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setDeleteDialogId(null)}
        />
      )}
    </>
  );
}

export default DepositFee;
