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
import queryString from "query-string";

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
import DetailImageDialog from "./dialogs/DetailImageDialog";
import useTableUrlState from "src/hooks/useTableUrlState";
import SortForm from "src/components/generic/SortForm";
import FilterForm from "./FilterForm";
import {
  ISpecialCategoryListGetAction,
  SpecialCategoryListSortField,
  PSpecialCategoryListPagination,
  ISpecialCategoryList,
  PSpecialCategoryListFilter,
  getSpecialCategoryLists
} from "src/store/special-category-list";
import useReactRouter from "use-react-router";
import { TInitialValues } from "./types";
import {
  ISpecialCategory,
  getSpecialCategoryById
} from "src/store/special-category";

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

function SpecialCategoryList() {
  const refreshDelay = 5000;
  const classes = useStyles({});
  const { location } = useReactRouter();
  const search = React.useMemo(() => queryString.parse(location.search), [
    location.search
  ]);
  const {
    filter,
    updateFilter,
    pagination,
    updatePagination,
    sorts,
    updateSorts
  } = useTableUrlState<
    PSpecialCategoryListFilter,
    PSpecialCategoryListPagination,
    SpecialCategoryListSortField
  >(
    { special_category_id: String(search.search_category_id) },
    { limit: 5, offset: 0 },
    []
  );
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const specialCategoryLists = useSelector<RootState, ISpecialCategoryList[]>(
    state => state.specialCategoryList.specialCategoryLists
  );
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(
    false
  );
  const [updateDialogSCLId, setUpdateDialogSCId] = React.useState<number>(null);
  const [deleteDialogSCLId, setDeleteDialogSCLId] = React.useState<number>(
    null
  );
  const [detailDialogImageUrl, setDetailDialogImageUrl] = React.useState<
    string
  >("");
  const dispatch = useDispatch();

  const [currentSpecialCategory, setCurrentSpecialCategory] = React.useState<
    ISpecialCategory
  >(null);
  const specialCategoryListRealTotal = useSelector<RootState, number>(
    state => state.specialCategoryList.realTotal
  );
  const specialCategorySortFields: SpecialCategoryListSortField[] = React.useMemo(
    () => ["id", "published", "name", "priority"],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [errSCLs, resSCLs] = await goPromise<ISpecialCategoryListGetAction>(
      getSpecialCategoryLists(pagination, filter, sorts)
    );
    const [errSC, resSC] = await goPromise<ISpecialCategory>(
      getSpecialCategoryById(String(search.special_category_id))
    );
    if (errSCLs) {
      throw errSCLs;
    } else if (errSC) {
      throw errSC;
    } else {
      dispatch(resSCLs);
      setCurrentSpecialCategory(resSC);
    }
  }, [
    dispatch,
    pagination,
    filter,
    sorts,
    setCurrentSpecialCategory,
    search.special_category_id
  ]);
  const intervalRun = useIntervalRun(() => autoFetch(), refreshDelay);
  const {
    setAlive: setIntervalRunAlive,
    restart: restartIntervalRun
  } = intervalRun;

  // initial fetch
  const fetch = React.useCallback(async () => {
    if (
      !search.special_category_id ||
      search.special_category_id === "undefined"
    ) {
      setError("special_category_id is empty");
      return;
    }

    setError("");
    setLoading(true);
    const [errSCLs, resSCLs] = await goPromise<ISpecialCategoryListGetAction>(
      getSpecialCategoryLists(
        { offset: 0, limit: 5 },
        { special_category_id: String(search.search_category_id) },
        []
      )
    );
    const [errSC, resSC] = await goPromise<ISpecialCategory>(
      getSpecialCategoryById(String(search.special_category_id))
    );
    setLoading(false);

    if (errSCLs || errSC) {
      console.log({ errSCLs, errSC });
      setError("error");
    } else {
      dispatch(resSCLs);
      setCurrentSpecialCategory(resSC);
      setIntervalRunAlive(true);
    }
  }, [dispatch, setIntervalRunAlive, search, setCurrentSpecialCategory]);
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
  const columns: Column<ISpecialCategoryList>[] = React.useMemo(
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
        Header: "Product Brand",
        accessor: row => row.product_brand_name
      },
      {
        Header: "Image",
        accessor: "",
        Cell: ({ row: { original } }) => {
          return (
            <img
              src={original.image_path}
              alt=""
              style={{ width: "65px", cursor: "pointer" }}
              onClick={() => setDetailDialogImageUrl(original.image_path)}
            />
          );
        }
      },
      {
        Header: "Actions",
        accessor: "",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <Button
                onClick={() => setUpdateDialogSCId(original.id)}
                color="primary"
                variant="outlined"
                style={{ marginLeft: "1rem" }}
              >
                Update
              </Button>
              <Button
                onClick={() => setDeleteDialogSCLId(original.id)}
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
    TInitialValues
  >({});
  React.useEffect(() => {
    if (!updateDialogSCLId) return setUpdateInitialValues({});
    const specialCategoryList: ISpecialCategoryList = (_.find(
      specialCategoryLists,
      pc => ((pc as unknown) as ISpecialCategoryList).id === updateDialogSCLId
    ) as unknown) as ISpecialCategoryList;
    specialCategoryList.published = Number(specialCategoryList.published);

    setUpdateInitialValues({
      ...specialCategoryList
    });
  }, [specialCategoryLists, updateDialogSCLId, setUpdateInitialValues]);

  return (
    <>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <MyPaper elevation={3}>
            <Toolbar className={clsx(classes.root)}>
              <Typography variant="h6">
                Special Category List for{" "}
                {!currentSpecialCategory ? "..." : currentSpecialCategory.name}
              </Typography>
              <Typography variant="subtitle1">
                List of all special category lists
              </Typography>
            </Toolbar>
            <br />
            <br />

            {loading ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress size={24} /> Loading...
              </div>
            ) : error ? (
              <Typography
                variant="subtitle1"
                color="secondary"
                style={{ marginLeft: "1rem" }}
              >
                An error occured, please{" "}
                <span onClick={fetch} style={{ color: "lightblue" }}>
                  retry
                </span>{" "}
                ({error}).
              </Typography>
            ) : specialCategoryLists && _.isArray(specialCategoryLists) ? (
              <>
                {/* Filter Form */}
                <div className={classes.filterAndSortForm}>
                  <FilterForm filter={filter} updateFilter={updateFilter} />
                  <div style={{ marginLeft: "2rem" }}>
                    <SortForm<SpecialCategoryListSortField>
                      sorts={sorts}
                      sortFields={specialCategorySortFields}
                      updateSorts={updateSorts}
                    />
                  </div>
                </div>
                <br />
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
                  data={specialCategoryLists}
                  rowCount={specialCategoryListRealTotal}
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
      {Boolean(updateDialogSCLId) && (
        <UpdateDialog
          specialCategoryListId={updateDialogSCLId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setUpdateDialogSCId(null)}
          initialValues={updateInitialValues}
        />
      )}
      {deleteDialogSCLId && (
        <DeleteDialog
          specialCategoryListId={deleteDialogSCLId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setDeleteDialogSCLId(null)}
        />
      )}
      {detailDialogImageUrl && (
        <DetailImageDialog
          imageUrl={detailDialogImageUrl}
          dismiss={() => setDetailDialogImageUrl(null)}
        />
      )}
    </>
  );
}

export default SpecialCategoryList;
