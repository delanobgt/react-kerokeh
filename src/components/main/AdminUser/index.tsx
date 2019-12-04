import _ from "lodash";
import React from "react";
import {
  CircularProgress,
  Paper,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Grid
} from "@material-ui/core";
import clsx from "clsx";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import { Edit as EditIcon, Delete as DeleteIcon } from "@material-ui/icons";

import { makeDefaultFilterUI } from "src/components/generic/table-filters/DefaultFilter";
import Table from "src/components/generic/ReactTable";
import {
  getAdminUsers,
  IAdminUser,
  IUserGetAction,
  INewAdminUser
} from "src/store/adminUser";
import { RootState } from "src/store";
import { goPromise } from "src/util/helper";
import CreateDialog from "./dialogs/CreateDialog";
import UpdateDialog from "./dialogs/UpdateDialog";
import DeleteDialog from "./dialogs/DeleteDialog";
import useIntervalRun from "src/hooks/useIntervalRun";

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

function AdminUsers() {
  const refreshDelay = 5000;
  const classes = useStyles({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(
    false
  );
  const [updateDialogUserId, setUpdateDialogUserId] = React.useState<number>(
    null
  );
  const [deleteDialogUserId, setDeleteDialogUserId] = React.useState<number>(
    null
  );
  const dispatch = useDispatch();
  const _adminUsers = useSelector<RootState, Record<string, IAdminUser>>(
    state => state.adminUser.adminUsers
  );
  const adminUsers = _.values(_adminUsers);
  const authId = useSelector<RootState, null | IAdminUser>(state =>
    _.get(state.auth, "user.id", null)
  );

  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IUserGetAction>(getAdminUsers());
    if (err) {
      console.log({ err });
    } else {
      dispatch(res);
    }
  }, [dispatch]);

  const intervalRun = useIntervalRun(() => autoFetch(), refreshDelay);

  const fetch = React.useCallback(async () => {
    setLoading(true);
    const [err, res] = await goPromise<IUserGetAction>(getAdminUsers());
    setLoading(false);
    if (err) {
      console.log({ err });
      setError("error");
    } else {
      dispatch(res);
    }
  }, [dispatch]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const updateInitialValues = React.useMemo((): INewAdminUser => {
    if (!updateDialogUserId) return { username: "", password: "", role_id: 1 };
    const _adminUser: IAdminUser = _adminUsers[updateDialogUserId];
    return {
      username: _adminUser.username,
      password: "",
      role_id: _adminUser.role.id
    };
  }, [_adminUsers, updateDialogUserId]);

  const columns: Column<IAdminUser>[] = [
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
              onClick={() => setUpdateDialogUserId(original.id)}
              className="mr-3"
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setDeleteDialogUserId(original.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
      Filter: null
    }
  ];

  return (
    <>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <MyPaper elevation={3}>
            <Toolbar className={clsx(classes.root)}>
              <Typography variant="h6">Admin Users</Typography>
              <Typography variant="subtitle1">
                List of all admin users
              </Typography>
            </Toolbar>
            <br />
            <br />

            {loading ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress size={24} />
              </div>
            ) : !error ? (
              <>
                <div className={classes.topAction}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    Add User
                  </Button>
                  <div>
                    {intervalRun.running ? (
                      <span>
                        <CircularProgress size={18} /> Updating
                      </span>
                    ) : intervalRun.error ? (
                      <span>
                        Retrying in{" "}
                        {(refreshDelay - intervalRun.lastTime) / 1000}{" "}
                        second(s).
                      </span>
                    ) : (
                      <span>
                        Updated {intervalRun.lastTime / 1000} second(s) ago
                      </span>
                    )}
                  </div>
                </div>
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
          </MyPaper>
        </Grid>
      </Grid>
      {createDialogOpen && (
        <CreateDialog
          open={createDialogOpen}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setCreateDialogOpen(false)}
        />
      )}
      {updateDialogUserId && (
        <UpdateDialog
          userId={updateDialogUserId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setUpdateDialogUserId(null)}
          initialValues={updateInitialValues}
        />
      )}
      {deleteDialogUserId && (
        <DeleteDialog
          userId={deleteDialogUserId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setDeleteDialogUserId(null)}
        />
      )}
    </>
  );
}

export default AdminUsers;
