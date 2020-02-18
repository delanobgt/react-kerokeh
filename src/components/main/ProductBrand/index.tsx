import _ from "lodash";
import React from "react";
import {
  CircularProgress,
  Typography,
  Grid,
  IconButton
} from "@material-ui/core";
import { Style as TitleIcon, Edit as EditIcon } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";

import Table, {
  OnPaginationChangeFn
} from "src/components/generic/table/ReactTableSSR";
import { RootState } from "src/store";
import { goPromise } from "src/util/helper";
import useIntervalRun from "src/hooks/useIntervalRun";
import TopAction from "./TopAction";
import FilterForm from "./FilterForm";
import SortForm from "../../generic/SortForm";
import CreateDialog from "./dialogs/CreateDialog";
import UpdateDialog from "./dialogs/UpdateDialog";
import useTableUrlState from "src/hooks/useTableUrlState";
import {
  ProductBrandSortField,
  PProductBrandPagination,
  PProductBrandFilter,
  IProductBrand,
  getProductBrands,
  IProductBrandGetAction
} from "src/store/product-brand";
import { TInitialValues } from "./types";
import {
  TablePaper,
  TableInfoWrapper,
  TableTitle
} from "src/components/generic/table/table-infos";
import CollapseFilterAndSort from "src/components/generic/CollapseFilterAndSort";

function ProductBrand() {
  const refreshDelay = 5000;
  const {
    filter,
    pagination,
    sorts,
    updateFilter,
    updatePagination,
    updateSorts
  } = useTableUrlState<
    PProductBrandFilter,
    PProductBrandPagination,
    ProductBrandSortField
  >({}, { limit: 5, offset: 0 }, []);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const productBrands = useSelector<RootState, IProductBrand[]>(
    state => state.productBrand.productBrands
  );
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(
    false
  );
  const [updateDialogId, setUpdateDialogId] = React.useState<number>(null);
  const dispatch = useDispatch();

  const productBrandRealTotal = useSelector<RootState, number>(
    state => state.productBrand.realTotal
  );
  const productBrandSortFields: ProductBrandSortField[] = React.useMemo(
    () => ["id", "name", "full_name", "slug"],
    []
  );

  const [productBrandsDictId, setProductBrandsDictId] = React.useState<
    Record<string, IProductBrand>
  >({});

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IProductBrandGetAction>(
      getProductBrands(pagination, filter, sorts)
    );
    const [errParent, resParent] = await goPromise<IProductBrandGetAction>(
      getProductBrands({ offset: 0, limit: 100 }, {}, [
        { field: "full_name", dir: "asc" }
      ])
    );
    if (err) {
      throw err;
    } else if (errParent) {
      throw errParent;
    } else {
      dispatch(res);
      setProductBrandsDictId(_.mapKeys(resParent.productBrands, "id"));
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
    const [errPB, resPB] = await goPromise<IProductBrandGetAction>(
      getProductBrands({ offset: 0, limit: 5 }, {}, [])
    );
    const [errParent, resParent] = await goPromise<IProductBrandGetAction>(
      getProductBrands({ offset: 0, limit: 100 }, { parent_id: "0" }, [
        { field: "full_name", dir: "asc" }
      ])
    );
    setLoading(false);

    if (errPB || errParent) {
      console.log({ errPB, errParent });
      setError("error");
    } else {
      dispatch(resPB);
      setProductBrandsDictId(_.mapKeys(resParent.productBrands, "id"));
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
  const columns: Column<IProductBrand>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Full Name",
        accessor: "full_name"
      },
      {
        Header: "Slug",
        accessor: "slug"
      },
      {
        Header: "Is Active",
        accessor: row => (row.is_active ? "YES" : "NO")
      },
      {
        Header: "Parent Brand",
        accessor: row =>
          _.get(productBrandsDictId, `${row.parent_id}.full_name`, "-")
      },
      {
        Header: "Actions",
        accessor: "",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <IconButton onClick={() => setUpdateDialogId(original.id)}>
                <EditIcon />
              </IconButton>
            </div>
          );
        }
      }
    ],
    [productBrandsDictId]
  );

  // set updateInitialValues
  const [updateInitialValues, setUpdateInitialValues] = React.useState<
    TInitialValues
  >({ name: "", slug: "", parent: { label: "No Parent", value: 0 } });
  React.useEffect(() => {
    if (!updateDialogId)
      return setUpdateInitialValues({
        name: "",
        slug: "",
        parent: {
          label: "No Parent",
          value: 0
        }
      });
    const productBrand: IProductBrand = (_.find(
      productBrands,
      pc => ((pc as unknown) as IProductBrand).id === updateDialogId
    ) as unknown) as IProductBrand;
    productBrand.is_active = Number(productBrand.is_active);
    setUpdateInitialValues({
      ...productBrand,
      parent: {
        label: String(
          _.get(
            productBrandsDictId,
            `${productBrand.parent_id}.full_name`,
            "No Parent"
          )
        ),
        value: productBrand.parent_id
      }
    });
  }, [
    productBrands,
    updateDialogId,
    productBrandsDictId,
    setUpdateInitialValues
  ]);

  return (
    <>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <TablePaper elevation={3}>
            <TableInfoWrapper>
              <TableTitle>
                <Typography variant="h6">Product Brands</Typography>
                <TitleIcon
                  style={{ marginLeft: "0.5rem", color: "cornflowerblue" }}
                />
              </TableTitle>
              <Typography variant="subtitle1">
                List of all product brands
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
            ) : productBrands && _.isArray(productBrands) ? (
              <>
                {/* Filter Form */}
                <CollapseFilterAndSort>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                      <FilterForm filter={filter} updateFilter={updateFilter} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <SortForm<ProductBrandSortField>
                        sorts={sorts}
                        sortFields={productBrandSortFields}
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
                  setCreateDialogOpen={setCreateDialogOpen}
                />
                <Table
                  pageIndex={pagination.offset / pagination.limit}
                  pageSize={Number(pagination.limit)}
                  columns={columns}
                  data={productBrands}
                  rowCount={productBrandRealTotal}
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
    </>
  );
}

export default ProductBrand;
