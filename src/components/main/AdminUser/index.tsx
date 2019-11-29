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
import CreateDialog from "./dialogs/CreateDialog";
import ConfirmDialog from "src/components/generic/ConfirmDialog";
import {
  getAdminUsers,
  deleteAdminUser,
  IAdminUser,
  IUserGetAction
} from "src/store/adminUser";
import { RootState } from "src/store";
import { goPromise } from "src/util/helper";

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    display: "block"
  },
  subtitle: {
    paddingLeft: theme.spacing(2)
  }
}));

const MyPaper = styled(Paper)`
  padding: 1.5em;
`;

function AdminUsers() {
  const classes = useStyles({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  // const [userDetailsDialogId, setUserDetailsDialog] = React.useState(null);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [deleteDialogUserId, setDeleteDialogUserId] = React.useState(null);
  const dispatch = useDispatch();
  const _adminUsers = useSelector<RootState, Record<string, IAdminUser>>(
    state => state.adminUser.adminUsers
  );
  const adminUsers = _.values(_adminUsers);
  const authId = useSelector<RootState, number>(state => state.auth.user.id);

  const fetch = React.useCallback(async () => {
    setLoading(true);
    const [err, res] = await goPromise<IUserGetAction>(getAdminUsers());
    if (err) {
      console.log({ err });
      setError("error");
    } else {
      console.log({ res });
      dispatch(res);
    }
    setLoading(false);
  }, [dispatch]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const handleDelete = (id: number) => () => {
    const deleteDialogCallback = async (dismiss: () => void) => {
      dismiss();
      try {
        setLoading(true);
        dispatch(await deleteAdminUser(id));
      } catch (error) {
        console.log({ error });
        setError("error");
      } finally {
        setLoading(false);
      }
    };
    // setDeleteDialog({
    //   deleteDialogObject: _adminUsers[id],
    //   deleteDialogCallback
    // });
  };

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
        if (String(authId) === String(original.id)) return null;
        return (
          <div>
            <IconButton
              // onClick={handleSeeDetails(original.id)}
              className="mr-3"
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete(original.id)}>
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
                <div className={classes.subtitle}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    Add User
                  </Button>
                </div>
                <Table columns={columns} data={adminUsers} />
              </>
            ) : (
              <Typography
                variant="subtitle1"
                color="secondary"
                className={classes.subtitle}
              >
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
          dismiss={() => setCreateDialogOpen(false)}
        />
      )}
      {/* {userDetailsDialogId && (
        <DetailsDialog
          payload={_.find(users, u => u.id == userDetailsDialogId)}
          visible={Boolean(userDetailsDialogId)}
          dismiss={() => setUserDetailsDialog(null)}
          rolesDict={rolesDict}
          majorsDict={majorsDict}
          updateUser={updateUserById(userDetailsDialogId)}
        />
      )} */}
      {/* {deleteDialogObject && (
        <ConfirmDialog
          title={`Delete User "${deleteDialogObject.username}"?`}
          message="Are you sure?"
          visible={Boolean(deleteDialogObject)}
          yesCallback={deleteDialogCallback}
          dismiss={() =>
            setDeleteDialog({
              deleteDialogObject: null,
              deleteDialogCallback: null
            })
          }
        />
      )} */}
    </>
  );
}

export default AdminUsers;
