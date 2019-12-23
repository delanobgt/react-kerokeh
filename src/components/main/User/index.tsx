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
import {
  IUser,
  IUserGetAction,
  PUserPagination,
  PUserFilter,
  getUsers,
  UserSortField
} from "src/store/user";
import FilterForm from "./FilterForm";
import SortForm from "../../generic/SortForm";
import DetailDialog from "./dialogs/DetailDialog";
import useTableUrlState from "src/hooks/useTableUrlState";
import moment from "moment";

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
  },
  filterAndSortForm: {
    display: "flex",
    paddingLeft: theme.spacing(2)
    // justifyContent: "space-between"
  }
}));

const MyPaper = styled(Paper)`
  padding: 1.5em;
`;

function Users() {
  const refreshDelay = 5000;
  const classes = useStyles({});
  const {
    filter,
    pagination,
    sorts,
    updateFilter,
    updatePagination,
    updateSorts
  } = useTableUrlState<PUserFilter, PUserPagination, UserSortField>(
    {
      created_at_start: moment.utc(0).format("YYYY-MM-DD"),
      created_at_end: moment().format("YYYY-MM-DD")
    },
    { limit: 5, offset: 0 },
    []
  );
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const users = useSelector<RootState, IUser[]>(state => state.user.users);
  const [detailDialogUserId, setDetailDialogUserId] = React.useState<
    number | null
  >(null);
  const dispatch = useDispatch();

  const userRealTotal = useSelector<RootState, number>(
    state => state.user.realTotal
  );
  const userSortFields: UserSortField[] = React.useMemo(
    () => ["id", "username", "full_name", "email"],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IUserGetAction>(
      getUsers(pagination, filter, sorts)
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
    const [err, res] = await goPromise<IUserGetAction>(
      getUsers({ offset: 0, limit: 5 }, {}, [])
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

  const columns: Column<IUser>[] = React.useMemo(
    () => [
      {
        Header: "User ID",
        accessor: "id"
      },
      {
        Header: "Username",
        accessor: "username"
      },
      {
        Header: "Full Name",
        accessor: "full_name"
      },
      {
        Header: "Gender",
        accessor: "gender"
      },
      {
        Header: "Email",
        accessor: "email"
      },
      {
        Header: "Actions",
        accessor: "",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <Button
                onClick={() => setDetailDialogUserId(original.id)}
                color="primary"
                variant="outlined"
              >
                Details
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
          <MyPaper elevation={3}>
            <Toolbar className={clsx(classes.root)}>
              <Typography variant="h6">Users</Typography>
              <Typography variant="subtitle1">List of all users</Typography>
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
            ) : users && _.isArray(users) ? (
              <>
                {/* Filter Form */}
                <div className={classes.filterAndSortForm}>
                  <FilterForm filter={filter} updateFilter={updateFilter} />
                  <div style={{ marginLeft: "2rem" }}>
                    <SortForm<UserSortField>
                      sorts={sorts}
                      sortFields={userSortFields}
                      updateSorts={updateSorts}
                    />
                  </div>
                </div>
                {/* top action */}
                <TopAction
                  intervalRun={intervalRun}
                  refreshDelay={refreshDelay}
                />
                <Table
                  pageIndex={pagination.offset / pagination.limit}
                  pageSize={Number(pagination.limit)}
                  columns={columns}
                  data={users}
                  rowCount={userRealTotal}
                  onPaginationChange={onPaginationChange}
                  disableSorting={true}
                />
              </>
            ) : null}
          </MyPaper>
        </Grid>
      </Grid>
      {Boolean(detailDialogUserId) && (
        <DetailDialog
          userId={detailDialogUserId}
          dismiss={() => setDetailDialogUserId(null)}
        />
      )}
    </>
  );
}

export default Users;