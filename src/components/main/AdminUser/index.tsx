import _ from "lodash";
import React from "react";
import {
  CircularProgress,
  Typography,
  IconButton,
  Grid
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VpnKey as TitleIcon
} from "@material-ui/icons";

import { makeDefaultFilterUI } from "src/components/generic/table-filters/DefaultFilter";
import Table from "src/components/generic/ReactTable";
import {
  getAdminUsers,
  IAdminUser,
  IAdminUserGetAction,
  INewAdminUser
} from "src/store/adminUser";
import { RootState } from "src/store";
import { goPromise } from "src/util/helper";
import CreateDialog from "./dialogs/CreateDialog";
import UpdateDialog from "./dialogs/UpdateDialog";
import DeleteDialog from "./dialogs/DeleteDialog";
import useIntervalRun from "src/hooks/useIntervalRun";
import TopAction from "./TopAction";
import {
  TablePaper,
  TableTitle,
  TableInfoWrapper
} from "src/components/generic/TableGenerics";

function AdminUsers() {
  const refreshDelay = 5000;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(
    false
  );
  const [updateDialogId, setUpdateDialogId] = React.useState<number>(null);
  const [deleteDialogId, setDeleteDialogId] = React.useState<number>(null);
  const dispatch = useDispatch();
  const _adminUsers = useSelector<RootState, Record<string, IAdminUser>>(
    state => state.adminUser.adminUsers
  );
  const adminUsers = _.values(_adminUsers);
  const authId = useSelector<RootState, null | IAdminUser>(state =>
    _.get(state.auth, "user.id", null)
  );

  // auto-update
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IAdminUserGetAction>(getAdminUsers());
    if (err) {
      console.log({ err });
    } else {
      dispatch(res);
    }
  }, [dispatch]);
  const intervalRun = useIntervalRun(() => autoFetch(), refreshDelay);
  const { setAlive: setIntervalRunAlive } = intervalRun;

  // initial-fetch
  const fetch = React.useCallback(async () => {
    setLoading(true);
    const [err, res] = await goPromise<IAdminUserGetAction>(getAdminUsers());
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

  const updateInitialValues = React.useMemo((): INewAdminUser => {
    if (!updateDialogId) return { username: "", password: "", role_id: 1 };
    const _adminUser: IAdminUser = _adminUsers[updateDialogId];
    return {
      username: _adminUser.username,
      password: "",
      role_id: _adminUser.role.id
    };
  }, [_adminUsers, updateDialogId]);

  const columns: Column<IAdminUser>[] = React.useMemo(
    () => [
      {
        Header: "User ID",
        accessor: "id",
        Filter: makeDefaultFilterUI({ placeholder: "Search by ID.." })
      },
      {
        Header: "Username",
        accessor: (row: IAdminUser) => row.username,
        Filter: makeDefaultFilterUI({ placeholder: "Search by Username.." })
      },
      {
        Header: "Role",
        accessor: (row: IAdminUser) => row.role.name,
        Filter: makeDefaultFilterUI({ placeholder: "Search by Role.." })
      },
      {
        Header: "Actions",
        accessor: "",
        Cell: ({ row: { original } }) => {
          // actions not available on the user account itself
          if (String(authId) === String(original.id)) return null;
          return (
            <div>
              <IconButton
                onClick={() => setUpdateDialogId(original.id)}
                className="mr-3"
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => setDeleteDialogId(original.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          );
        },
        Filter: null
      }
    ],
    [authId]
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
                <Typography variant="h6">Admin Users</Typography>
                <TitleIcon style={{ marginLeft: "0.5rem" }} />
              </TableTitle>
              <Typography variant="subtitle1">
                List of all admin users
              </Typography>
            </TableInfoWrapper>
            <br />
            <br />

            {loading ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress size={24} />
              </div>
            ) : !error ? (
              <>
                {/* top action */}
                <TopAction
                  intervalRun={intervalRun}
                  refreshDelay={refreshDelay}
                  setCreateDialogOpen={setCreateDialogOpen}
                />
                <Table columns={columns} data={adminUsers} />
              </>
            ) : (
              <Typography variant="subtitle1" color="secondary">
                An error occured, please{" "}
                <span onClick={fetch} style={{ color: "lightblue" }}>
                  retry
                </span>
                .
              </Typography>
            )}
          </TablePaper>
        </Grid>
      </Grid>
      {createDialogOpen && (
        <CreateDialog
          open={createDialogOpen}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setCreateDialogOpen(false)}
        />
      )}
      {updateDialogId && (
        <UpdateDialog
          userId={updateDialogId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setUpdateDialogId(null)}
          initialValues={updateInitialValues}
        />
      )}
      {deleteDialogId && (
        <DeleteDialog
          userId={deleteDialogId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setDeleteDialogId(null)}
        />
      )}
    </>
  );
}

export default AdminUsers;
