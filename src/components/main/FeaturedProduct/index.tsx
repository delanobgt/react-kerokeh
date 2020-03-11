import _ from "lodash";
import React from "react";
import {
  CircularProgress,
  Typography,
  Grid,
  IconButton
} from "@material-ui/core";
import {
  Style as TitleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@material-ui/icons";
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
import { TInitialValues } from "./types";
import {
  TablePaper,
  TableInfoWrapper,
  TableTitle
} from "src/components/generic/table/table-infos";
import CollapseFilterAndSort from "src/components/generic/CollapseFilterAndSort";
import {
  FeaturedProductSortField,
  PFeaturedProductPagination,
  PFeaturedProductFilter,
  IFeaturedProduct,
  getFeaturedProducts,
  IFeaturedProductGetAction
} from "src/store/featured-product";
import DeleteDialog from "./dialogs/DeleteDialog";

function FeaturedProduct() {
  const refreshDelay = 5000;
  const {
    filter,
    pagination,
    sorts,
    updateFilter,
    updatePagination,
    updateSorts
  } = useTableUrlState<
    PFeaturedProductFilter,
    PFeaturedProductPagination,
    FeaturedProductSortField
  >({}, { limit: 5, offset: 0 }, []);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const featuredProducts = useSelector<RootState, IFeaturedProduct[]>(
    state => state.featuredProduct.featuredProducts
  );
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(
    false
  );
  const [updateDialogId, setUpdateDialogId] = React.useState<number>(null);
  const [deleteDialogId, setDeleteDialogId] = React.useState<number>(null);
  const dispatch = useDispatch();

  const productBrandRealTotal = useSelector<RootState, number>(
    state => state.productBrand.realTotal
  );
  const featuredProductSortFields: FeaturedProductSortField[] = React.useMemo(
    () => ["id", "priority", "published"],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IFeaturedProductGetAction>(
      getFeaturedProducts(pagination, filter, sorts)
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
    const [errPB, resPB] = await goPromise<IFeaturedProductGetAction>(
      getFeaturedProducts({ offset: 0, limit: 5 }, {}, [])
    );
    setLoading(false);

    if (errPB) {
      console.log({ errPB });
      setError("error");
    } else {
      dispatch(resPB);
      setIntervalRunAlive(true);
    }
  }, [dispatch, setIntervalRunAlive]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const dRestartIntervalRun = React.useMemo(
    () => _.debounce(restartIntervalRun, 1000),
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
  const columns: Column<IFeaturedProduct>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: row => row.id
      },
      {
        Header: "Product Name",
        accessor: row => row.product.name
      },
      {
        Header: "Product Category Name",
        accessor: row => row.product_category.name
      },
      {
        Header: "Published",
        accessor: row => (row.published ? "PUBLISHED" : "NOT PUBLISHED")
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
              <IconButton onClick={() => setDeleteDialogId(original.id)}>
                <DeleteIcon />
              </IconButton>
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
    if (!updateDialogId) return setUpdateInitialValues({});
    const featuredProduct: IFeaturedProduct = (_.find(
      featuredProducts,
      pc => ((pc as unknown) as IFeaturedProduct).id === updateDialogId
    ) as unknown) as IFeaturedProduct;
    featuredProduct.published = Number(featuredProduct.published);
    console.log(featuredProduct);
    setUpdateInitialValues({
      ...featuredProduct,
      product_option: {
        label: featuredProduct.product.name,
        value: featuredProduct.product.id
      },
      product_category_option: {
        label: featuredProduct.product_category.name,
        value: featuredProduct.product_category.id
      }
    });
  }, [featuredProducts, updateDialogId, setUpdateInitialValues]);

  return (
    <>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <TablePaper elevation={3}>
            <TableInfoWrapper>
              <TableTitle>
                <Typography variant="h6">Featured Product</Typography>
                <TitleIcon
                  style={{ marginLeft: "0.5rem", color: "cornflowerblue" }}
                />
              </TableTitle>
              <Typography variant="subtitle1">
                List of all featured products
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
            ) : featuredProducts && _.isArray(featuredProducts) ? (
              <>
                {/* Filter Form */}
                <CollapseFilterAndSort>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                      <FilterForm filter={filter} updateFilter={updateFilter} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <SortForm<FeaturedProductSortField>
                        sorts={sorts}
                        sortFields={featuredProductSortFields}
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
                  data={featuredProducts}
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
          featuredProductId={updateDialogId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setUpdateDialogId(null)}
          initialValues={updateInitialValues}
        />
      )}
      {Boolean(deleteDialogId) && (
        <DeleteDialog
          featuredProductId={deleteDialogId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setDeleteDialogId(null)}
        />
      )}
    </>
  );
}

export default FeaturedProduct;
