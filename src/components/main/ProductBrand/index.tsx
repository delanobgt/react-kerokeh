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
  IProductBrandGetAction,
  PProductBrand
} from "src/store/product-brand";

type TInitialValues = PProductBrand & {
  parent: {
    label: string;
    value: number;
  };
};

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

function ProductBrand() {
  const refreshDelay = 5000;
  const classes = useStyles({});
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
  const [updateDialogPBId, setUpdateDialogPBId] = React.useState<number>(null);
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
              <Button
                onClick={() => setUpdateDialogPBId(original.id)}
                color="primary"
                variant="outlined"
              >
                Update
              </Button>
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
    if (!updateDialogPBId)
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
      pc => ((pc as unknown) as IProductBrand).id === updateDialogPBId
    ) as unknown) as IProductBrand;
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
    updateDialogPBId,
    productBrandsDictId,
    setUpdateInitialValues
  ]);

  return (
    <>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <MyPaper elevation={3}>
            <Toolbar className={clsx(classes.root)}>
              <Typography variant="h6">Product Brands</Typography>
              <Typography variant="subtitle1">
                List of all product brands
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
            ) : productBrands && _.isArray(productBrands) ? (
              <>
                {/* Filter Form */}
                <div className={classes.filterAndSortForm}>
                  <FilterForm filter={filter} updateFilter={updateFilter} />
                  <div style={{ marginLeft: "2rem" }}>
                    <SortForm<ProductBrandSortField>
                      sorts={sorts}
                      sortFields={productBrandSortFields}
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
                  data={productBrands}
                  rowCount={productBrandRealTotal}
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
      {Boolean(updateDialogPBId) && (
        <UpdateDialog
          productBrandId={updateDialogPBId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setUpdateDialogPBId(null)}
          initialValues={updateInitialValues}
        />
      )}
    </>
  );
}

export default ProductBrand;