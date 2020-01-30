import _ from "lodash";
import React from "react";
import { CircularProgress, Typography, Grid } from "@material-ui/core";
import { VerticalAlignBottom as TitleIcon } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";

import Table, {
  OnPaginationChangeFn
} from "src/components/generic/table/ReactTableSSR";
import { RootState } from "src/store";
import { goPromise } from "src/util/helper";
import useIntervalRun from "src/hooks/useIntervalRun";
import TopAction from "./TopAction";
import useTableUrlState from "src/hooks/useTableUrlState";
import SortForm from "src/components/generic/SortForm";
import {
  TablePaper,
  TableInfoWrapper,
  TableTitle
} from "src/components/generic/table/table-infos";
import CollapseFilterAndSort from "src/components/generic/CollapseFilterAndSort";
import {
  ProductRequestSortField,
  IProductRequest,
  IProductRequestGetAction,
  getProductRequests,
  PProductRequestFilter,
  PProductRequestPagination
} from "src/store/product-request";

function ProductRequest() {
  const refreshDelay = 5000;
  const {
    filter,
    pagination,
    updatePagination,
    sorts,
    updateSorts
  } = useTableUrlState<
    PProductRequestFilter,
    PProductRequestPagination,
    ProductRequestSortField
  >({}, { limit: 5, offset: 0 }, []);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const productRequests = useSelector<RootState, IProductRequest[]>(
    state => state.productRequest.productRequests
  );
  const dispatch = useDispatch();

  const productRequestRealTotal = useSelector<RootState, number>(
    state => state.productRequest.realTotal
  );
  const productRequestSortFields: ProductRequestSortField[] = React.useMemo(
    () => ["brand", "id", "name", "product_code", "retail_price", "sub_brand"],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IProductRequestGetAction>(
      getProductRequests(pagination, filter, sorts)
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
    const [err, res] = await goPromise<IProductRequestGetAction>(
      getProductRequests({ offset: 0, limit: 5 }, {}, [])
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
  const columns: Column<IProductRequest>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: row => row.id
      },
      {
        Header: "Name",
        accessor: row => row.name
      },
      {
        Header: "Brand",
        accessor: row => row.brand
      },
      {
        Header: "Sub Brand",
        accessor: row => row.sub_brand
      },
      {
        Header: "Product Code",
        accessor: row => row.product_code
      },
      {
        Header: "Retail Price",
        accessor: row => Number(row.retail_price).toLocaleString("de-DE")
      }
    ],
    []
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
                <Typography variant="h6">Product Requests</Typography>
                <TitleIcon
                  style={{ marginLeft: "0.5rem", color: "cornflowerblue" }}
                />
              </TableTitle>
              <Typography variant="subtitle1">
                List of all product requests
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
            ) : productRequests && _.isArray(productRequests) ? (
              <>
                {/* Filter Form */}
                <CollapseFilterAndSort>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                      <SortForm<ProductRequestSortField>
                        sorts={sorts}
                        sortFields={productRequestSortFields}
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
                />
                <Table
                  pageIndex={pagination.offset / pagination.limit}
                  pageSize={Number(pagination.limit)}
                  columns={columns}
                  data={productRequests}
                  rowCount={productRequestRealTotal}
                  onPaginationChange={onPaginationChange}
                  disableSorting={true}
                />
              </>
            ) : null}
          </TablePaper>
        </Grid>
      </Grid>
    </>
  );
}

export default ProductRequest;
