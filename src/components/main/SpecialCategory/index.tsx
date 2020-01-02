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
  PSpecialCategoryFilter,
  PSpecialCategoryPagination,
  SpecialCategorySortField,
  ISpecialCategory,
  getSpecialCategories,
  ISpecialCategoryGetAction,
  PSpecialCategory
} from "src/store/special-category";
import SortForm from "src/components/generic/SortForm";
import FilterForm from "../ProductBrand/FilterForm";

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

function SpecialCategory() {
  const refreshDelay = 5000;
  const classes = useStyles({});
  const {
    filter,
    updateFilter,
    pagination,
    updatePagination,
    sorts,
    updateSorts
  } = useTableUrlState<
    PSpecialCategoryFilter,
    PSpecialCategoryPagination,
    SpecialCategorySortField
  >({}, { limit: 5, offset: 0 }, []);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const specialCategories = useSelector<RootState, ISpecialCategory[]>(
    state => state.specialCategory.specialCategories
  );
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(
    false
  );
  const [updateDialogSCId, setUpdateDialogSCId] = React.useState<number>(null);
  const [deleteDialogSCId, setDeleteDialogSCId] = React.useState<number>(null);
  const dispatch = useDispatch();

  const specialCategoryRealTotal = useSelector<RootState, number>(
    state => state.specialCategory.realTotal
  );
  const specialCategorySortFields: SpecialCategorySortField[] = React.useMemo(
    () => ["id", "published", "name"],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<ISpecialCategoryGetAction>(
      getSpecialCategories(pagination, filter, sorts)
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
    const [errDF, resDF] = await goPromise<ISpecialCategoryGetAction>(
      getSpecialCategories({ offset: 0, limit: 5 }, {}, [])
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
  const columns: Column<ISpecialCategory>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Name",
        accessor: row => row.name
      },
      {
        Header: "Priority",
        accessor: row => row.priority
      },
      {
        Header: "Published",
        accessor: row => (row.published ? "YES" : "NO")
      },
      {
        Header: "Actions",
        accessor: "",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <Button
                target="_blank"
                href="google.com"
                color="primary"
                variant="outlined"
              >
                View List
              </Button>

              <Button
                onClick={() => setUpdateDialogSCId(original.id)}
                color="primary"
                variant="outlined"
                style={{ marginLeft: "1rem" }}
              >
                Update
              </Button>
              <Button
                onClick={() => setDeleteDialogSCId(original.id)}
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
    PSpecialCategory
  >({ name: "", priority: 0, published: 0 });
  React.useEffect(() => {
    if (!updateDialogSCId)
      return setUpdateInitialValues({ name: "", priority: 0, published: 0 });
    const specialCategory: ISpecialCategory = (_.find(
      specialCategories,
      pc => ((pc as unknown) as ISpecialCategory).id === updateDialogSCId
    ) as unknown) as ISpecialCategory;
    specialCategory.published = Number(specialCategory.published);
    setUpdateInitialValues(specialCategory);
  }, [specialCategories, updateDialogSCId, setUpdateInitialValues]);

  return (
    <>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <MyPaper elevation={3}>
            <Toolbar className={clsx(classes.root)}>
              <Typography variant="h6">Special Categories</Typography>
              <Typography variant="subtitle1">
                List of all special categories
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
            ) : specialCategories && _.isArray(specialCategories) ? (
              <>
                {/* Filter Form */}
                <div className={classes.filterAndSortForm}>
                  <FilterForm filter={filter} updateFilter={updateFilter} />
                  <div style={{ marginLeft: "2rem" }}>
                    <SortForm<SpecialCategorySortField>
                      sorts={sorts}
                      sortFields={specialCategorySortFields}
                      updateSorts={updateSorts}
                    />
                  </div>
                </div>
                {/* top action */}
                <TopAction
                  intervalRun={intervalRun}
                  refreshDelay={refreshDelay}
                  setCreateDialogOpen={setCreateDialogOpen}
                />
                <Table
                  pageIndex={pagination.offset / pagination.limit}
                  pageSize={Number(pagination.limit)}
                  columns={columns}
                  data={specialCategories}
                  rowCount={specialCategoryRealTotal}
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
      {Boolean(updateDialogSCId) && (
        <UpdateDialog
          specialCategoryId={updateDialogSCId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setUpdateDialogSCId(null)}
          initialValues={updateInitialValues}
        />
      )}
      {deleteDialogSCId && (
        <DeleteDialog
          specialCategoryId={deleteDialogSCId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setDeleteDialogSCId(null)}
        />
      )}
    </>
  );
}

export default SpecialCategory;
