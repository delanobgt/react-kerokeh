import _ from "lodash";
import React from "react";
import { CircularProgress, Typography, Grid, Button } from "@material-ui/core";
import { MoneyOff as TitleIcon } from "@material-ui/icons";
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
import DetailImageDialog from "./dialogs/DetailImageDialog";
import useTableUrlState from "src/hooks/useTableUrlState";
import {
  PPromoCodeFilter,
  PPromoCodePagination,
  PromoCodeSortField,
  IPromoCode,
  IPromoCodeGetAction,
  getPromoCodes,
  PPromoCode
} from "src/store/promo-code";
import moment from "moment";
import FilterForm from "../ProductBrand/FilterForm";
import SortForm from "src/components/generic/SortForm";
import {
  TablePaper,
  TableInfoWrapper,
  TableTitle
} from "src/components/generic/TableGenerics";

const useStyles = makeStyles(theme => ({
  filterAndSortForm: {
    marginBottom: "1rem",
    display: "flex",
    paddingLeft: theme.spacing(2)
    // justifyContent: "space-between"
  }
}));

function PromoCode() {
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
    PPromoCodeFilter,
    PPromoCodePagination,
    PromoCodeSortField
  >({}, { limit: 5, offset: 0 }, []);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const promoCodes = useSelector<RootState, IPromoCode[]>(
    state => state.promoCode.promoCodes
  );
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(
    false
  );
  const [updateDialogId, setUpdateDialogId] = React.useState<number>(null);
  const [deleteDialogId, setDeleteDialogId] = React.useState<number>(null);
  const [detailDialogImageUrl, setDetailDialogImageUrl] = React.useState<
    string
  >("");
  const dispatch = useDispatch();

  const promoCodeRealTotal = useSelector<RootState, number>(
    state => state.promoCode.realTotal
  );
  const promoCodeSortFields: PromoCodeSortField[] = React.useMemo(
    () => [
      "active_status",
      "code",
      "created_by",
      "description",
      "expired_at",
      "id",
      "limit",
      "percentage",
      "product_type",
      "updated_by",
      "usage"
    ],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IPromoCodeGetAction>(
      getPromoCodes(pagination, filter, sorts)
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
    const [err, res] = await goPromise<IPromoCodeGetAction>(
      getPromoCodes({ offset: 0, limit: 5 }, {}, [])
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
  const columns: Column<IPromoCode>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Code",
        accessor: row => row.code
      },
      {
        Header: "Description",
        accessor: row => row.description || "-"
      },
      {
        Header: "Percentage",
        accessor: row => row.percentage
      },
      {
        Header: "Limit",
        accessor: row => row.limit
      },
      {
        Header: "Usage",
        accessor: row => row.usage
      },
      {
        Header: "Product Type",
        accessor: row => _.startCase(row.product_type || "-")
      },
      {
        Header: "Active Status",
        accessor: row => (row.active_status ? "YES" : "NO")
      },
      {
        Header: "Expired At",
        accessor: row => moment(row.expired_at).format("D MMMM YYYY")
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
                onClick={() => setUpdateDialogId(original.id)}
                color="primary"
                variant="outlined"
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
  const [updateInitialValues, setUpdateInitialValues] = React.useState<
    PPromoCode
  >({ expired_at: moment().format("YYYY-MM-DD") });
  React.useEffect(() => {
    if (!updateDialogId)
      return setUpdateInitialValues({
        expired_at: moment().format("YYYY-MM-DD")
      });
    const promoCode: IPromoCode = (_.find(
      promoCodes,
      pc => ((pc as unknown) as IPromoCode).id === updateDialogId
    ) as unknown) as IPromoCode;
    promoCode.active_status = Number(promoCode.active_status);
    promoCode.expired_at = moment(promoCode.expired_at).format("YYYY-MM-DD");
    setUpdateInitialValues(promoCode);
  }, [promoCodes, updateDialogId, setUpdateInitialValues]);

  return (
    <>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <TablePaper elevation={3}>
            <TableInfoWrapper>
              <TableTitle>
                <Typography variant="h6">Promo Codes</Typography>
                <TitleIcon
                  style={{ marginLeft: "0.5rem", color: "cornflowerblue" }}
                />
              </TableTitle>
              <Typography variant="subtitle1">
                List of all promo codes
              </Typography>
            </TableInfoWrapper>
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
            ) : promoCodes && _.isArray(promoCodes) ? (
              <>
                {/* Filter Form */}
                <div className={classes.filterAndSortForm}>
                  <FilterForm filter={filter} updateFilter={updateFilter} />
                  <div style={{ marginLeft: "2rem" }}>
                    <SortForm<PromoCodeSortField>
                      sorts={sorts}
                      sortFields={promoCodeSortFields}
                      updateSorts={updateSorts}
                    />
                  </div>
                </div>
                <TopAction
                  intervalRun={intervalRun}
                  refreshDelay={refreshDelay}
                  setCreateDialogOpen={setCreateDialogOpen}
                />
                <Table
                  pageIndex={pagination.offset / pagination.limit}
                  pageSize={Number(pagination.limit)}
                  columns={columns}
                  data={promoCodes}
                  rowCount={promoCodeRealTotal}
                  onPaginationChange={onPaginationChange}
                  disableSorting={true}
                />
              </>
            ) : null}
          </TablePaper>
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
          promoCodeId={updateDialogId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setUpdateDialogId(null)}
          initialValues={updateInitialValues}
        />
      )}
      {deleteDialogId && (
        <DeleteDialog
          promoCodeId={deleteDialogId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setDeleteDialogId(null)}
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

export default PromoCode;
