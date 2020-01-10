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
import DetailDialog from "./dialogs/DetailDialog";
import DetailImageDialog from "./dialogs/DetailImageDialog";
import useTableUrlState from "src/hooks/useTableUrlState";
import moment from "moment";
import FilterForm from "../ProductBrand/FilterForm";
import SortForm from "src/components/generic/SortForm";
import {
  PBannerFilter,
  PBannerPagination,
  BannerSortField,
  IBanner,
  IBannerGetAction,
  getBanners,
  PBanner
} from "src/store/banner";

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
    marginBottom: "1rem",
    display: "flex",
    paddingLeft: theme.spacing(2)
    // justifyContent: "space-between"
  }
}));

const MyPaper = styled(Paper)`
  padding: 1.5em;
`;

function Banner() {
  const refreshDelay = 5000;
  const classes = useStyles({});
  const {
    filter,
    updateFilter,
    pagination,
    updatePagination,
    sorts,
    updateSorts
  } = useTableUrlState<PBannerFilter, PBannerPagination, BannerSortField>(
    {},
    { limit: 5, offset: 0 },
    []
  );
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const banners = useSelector<RootState, IBanner[]>(
    state => state.banner.banners
  );
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(
    false
  );
  const [updateDialogId, setUpdateDialogId] = React.useState<number>(null);
  const [deleteDialogId, setDeleteDialogId] = React.useState<number>(null);
  const [detailDialogId, setDetailDialogId] = React.useState<number>(null);
  const [detailDialogImageUrl, setDetailDialogImageUrl] = React.useState<
    string
  >("");
  const dispatch = useDispatch();

  const bannerRealTotal = useSelector<RootState, number>(
    state => state.banner.realTotal
  );
  const bannerSortFields: BannerSortField[] = React.useMemo(
    () => [
      "action_path",
      "banner_action",
      "banner_type",
      "created_by",
      "id",
      "is_active",
      "title",
      "updated_by",
      "view_count"
    ],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IBannerGetAction>(
      getBanners(pagination, filter, sorts)
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
    const [err, res] = await goPromise<IBannerGetAction>(
      getBanners({ offset: 0, limit: 5 }, {}, [])
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
  const columns: Column<IBanner>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: row => row.id
      },
      {
        Header: "Title",
        accessor: row => row.title
      },
      {
        Header: "Banner Action",
        accessor: row => row.banner_action
      },
      {
        Header: "Banner Type",
        accessor: row => row.banner_type
      },
      {
        Header: "Is Active",
        accessor: row => (row.is_active ? "YES" : "NO")
      },
      {
        Header: "View Count",
        accessor: row => row.view_count
      },
      {
        Header: "Image",
        accessor: "",
        Cell: ({ row: { original } }) => {
          return (
            <img
              src={original.image_url}
              alt=""
              style={{ width: "65px", cursor: "pointer" }}
              onClick={() => setDetailDialogImageUrl(original.image_url)}
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
                onClick={() => setDetailDialogId(original.id)}
                color="primary"
                variant="outlined"
              >
                Detail
              </Button>
              <br />
              <Button
                onClick={() => setUpdateDialogId(original.id)}
                color="primary"
                variant="outlined"
                style={{ marginTop: "1rem" }}
              >
                Update
              </Button>
              <br />
              <Button
                onClick={() => setDeleteDialogId(original.id)}
                color="primary"
                variant="outlined"
                style={{ marginTop: "1rem" }}
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
  const [updateInitialValues, setUpdateInitialValues] = React.useState<PBanner>(
    { expired_at: moment().format("YYYY-MM-DD") }
  );
  React.useEffect(() => {
    if (!updateDialogId)
      return setUpdateInitialValues({
        expired_at: moment().format("YYYY-MM-DD")
      });
    const banner: IBanner = (_.find(
      banners,
      pc => ((pc as unknown) as IBanner).id === updateDialogId
    ) as unknown) as IBanner;
    banner.is_active = Number(banner.is_active);
    banner.expired_at = moment(banner.expired_at).format("YYYY-MM-DD");
    setUpdateInitialValues(banner);
  }, [banners, updateDialogId, setUpdateInitialValues]);

  return (
    <>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <MyPaper elevation={3}>
            <Toolbar className={clsx(classes.root)}>
              <Typography variant="h6">Banners</Typography>
              <Typography variant="subtitle1">List of all banners</Typography>
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
            ) : banners && _.isArray(banners) ? (
              <>
                {/* Filter Form */}
                <div className={classes.filterAndSortForm}>
                  <FilterForm filter={filter} updateFilter={updateFilter} />
                  <div style={{ marginLeft: "2rem" }}>
                    <SortForm<BannerSortField>
                      sorts={sorts}
                      sortFields={bannerSortFields}
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
                  data={banners}
                  rowCount={bannerRealTotal}
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
          initialValues={{ expired_at: moment().format("YYYY-MM-DD") }}
        />
      )}
      {Boolean(updateDialogId) && (
        <UpdateDialog
          bannerId={updateDialogId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setUpdateDialogId(null)}
          initialValues={updateInitialValues}
        />
      )}
      {Boolean(deleteDialogId) && (
        <DeleteDialog
          bannerId={deleteDialogId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setDeleteDialogId(null)}
        />
      )}
      {Boolean(detailDialogId) && (
        <DetailDialog
          bannerId={detailDialogId}
          dismiss={() => setDetailDialogId(null)}
        />
      )}
      {Boolean(detailDialogImageUrl) && (
        <DetailImageDialog
          imageUrl={detailDialogImageUrl}
          dismiss={() => setDetailDialogImageUrl(null)}
        />
      )}
    </>
  );
}

export default Banner;
