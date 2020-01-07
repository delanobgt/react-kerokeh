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
import FilterForm from "./FilterForm";
import SortForm from "src/components/generic/SortForm";
import {
  PProductFilter,
  PProductPagination,
  ProductSortField,
  IProduct,
  getProducts,
  IProductGetAction,
  PProduct
} from "src/store/product";
import { TInitialValues } from "./types";

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

function Product() {
  const refreshDelay = 5000;
  const classes = useStyles({});
  const {
    filter,
    updateFilter,
    pagination,
    updatePagination,
    sorts,
    updateSorts
  } = useTableUrlState<PProductFilter, PProductPagination, ProductSortField>(
    {},
    { limit: 5, offset: 0 },
    []
  );
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const products = useSelector<RootState, IProduct[]>(
    state => state.product.products
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

  const productRealTotal = useSelector<RootState, number>(
    state => state.product.realTotal
  );
  const productSortFields: ProductSortField[] = React.useMemo(
    () => [
      "bnib_highest_bid_price",
      "bnib_lowest_sell_price",
      "code",
      "color",
      "description",
      "detail",
      "gender",
      "id",
      "is_active",
      "name",
      "pre_order_highest_bid_price",
      "pre_order_lowest_sell_price",
      "release_date",
      "retail_price",
      "slug",
      "sold_count",
      "story",
      "view_count"
    ],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IProductGetAction>(
      getProducts(pagination, filter, sorts)
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
    const [err, res] = await goPromise<IProductGetAction>(
      getProducts({ offset: 0, limit: 5 }, {}, [])
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
  const columns: Column<IProduct>[] = React.useMemo(
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
        Header: "Name",
        accessor: row => row.name
      },
      {
        Header: "Color",
        accessor: row => row.color
      },
      {
        Header: "Description",
        accessor: row => row.description || "-"
      },
      {
        Header: "Is Active",
        accessor: row => (row.is_active ? "YES" : "NO")
      },
      {
        Header: "Image",
        accessor: "",
        Cell: ({ row: { original } }) => {
          return (
            <img
              src={original.display_image_url}
              alt=""
              style={{ width: "65px", cursor: "pointer" }}
              onClick={() =>
                setDetailDialogImageUrl(original.display_image_url)
              }
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
  const [updateInitialValues, setUpdateInitialValues] = React.useState<
    TInitialValues
  >({});
  React.useEffect(() => {
    if (!updateDialogId) return setUpdateInitialValues({});
    const product: IProduct = (_.find(
      products,
      pc => ((pc as unknown) as IProduct).id === updateDialogId
    ) as unknown) as IProduct;
    product.is_active = Number(product.is_active);
    product.release_date = moment(product.release_date).format("YYYY-MM-DD");
    const initial_detail_images = product.detail_image_urls.map(url => ({
      image_path: url,
      deleted: false
    }));
    setUpdateInitialValues({
      ...product,
      product_brand_option: {
        label: product.product_brand.full_name,
        value: product.product_brand.id
      },
      product_category_option: {
        label: product.product_category.name,
        value: product.product_category.id
      },
      initial_detail_images
    });
  }, [products, updateDialogId, setUpdateInitialValues]);

  return (
    <>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <MyPaper elevation={3}>
            <Toolbar className={clsx(classes.root)}>
              <Typography variant="h6">Products</Typography>
              <Typography variant="subtitle1">List of all products</Typography>
            </Toolbar>
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
            ) : products && _.isArray(products) ? (
              <>
                {/* Filter Form */}
                <div className={classes.filterAndSortForm}>
                  <FilterForm filter={filter} updateFilter={updateFilter} />
                  <div style={{ marginLeft: "2rem" }}>
                    <SortForm<ProductSortField>
                      sorts={sorts}
                      sortFields={productSortFields}
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
                  data={products}
                  rowCount={productRealTotal}
                  onPaginationChange={onPaginationChange}
                  disableSorting={true}
                />
              </>
            ) : null}
          </MyPaper>
        </Grid>
      </Grid>
      {Boolean(detailDialogId) && (
        <DetailDialog
          productId={detailDialogId}
          dismiss={() => setDetailDialogId(null)}
        />
      )}
      {Boolean(createDialogOpen) && (
        <CreateDialog
          open={createDialogOpen}
          restartIntervalRun={restartIntervalRun}
          dismiss={() => setCreateDialogOpen(null)}
          initialValues={{ release_date: moment().format("YYYY-MM-DD") }}
        />
      )}
      {Boolean(updateDialogId) && (
        <UpdateDialog
          productId={updateDialogId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setUpdateDialogId(null)}
          initialValues={updateInitialValues}
        />
      )}
      {Boolean(deleteDialogId) && (
        <DeleteDialog
          productId={deleteDialogId}
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

export default Product;
