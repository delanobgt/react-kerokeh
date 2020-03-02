import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography, Grid } from "@material-ui/core";
import Table from "src/components/generic/table/ReactTableSSR";

import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { Column } from "react-table";
import {
  IWalletMutation,
  PWalletMutationFilter,
  PWalletMutationPagination,
  WalletMutationSortField,
  getWalletMutationsByUserId
} from "src/store/withdraw-request";
import moment from "moment";
import useTableState from "src/hooks/useTableState";
import { goPromise } from "src/util/helper";
import useIntervalRun from "src/hooks/useIntervalRun";
import { OnPaginationChangeFn } from "src/components/generic/table/ReactTableSSR";
import CollapseFilterAndSort from "src/components/generic/CollapseFilterAndSort";
import SortForm from "src/components/generic/SortForm";
import TopAction from "./TopAction";

interface IComponentProps {
  open: boolean;
  userId: number;
  dismiss: () => void;
}

function WalletMutationsDialog(props: IComponentProps) {
  const refreshDelay = 5000;
  const { open, userId, dismiss } = props;

  const {
    filter,
    pagination,
    updatePagination,
    sorts,
    updateSorts
  } = useTableState<
    PWalletMutationFilter,
    PWalletMutationPagination,
    WalletMutationSortField
  >({}, { limit: 5, offset: 0 }, []);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [walletMutations, setWalletMutations] = React.useState<
    IWalletMutation[]
  >([]);
  const [walletMutationRealTotal, setWalletMutationRealTotal] = React.useState<
    number
  >(0);

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const walletMutationSortFields: WalletMutationSortField[] = React.useMemo(
    () => ["amount", "balance", "created_at", "description", "id", "type"],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<{
      data: IWalletMutation[];
      realTotal: number;
    }>(getWalletMutationsByUserId(userId, filter, pagination, sorts));
    if (err) {
      throw err;
    } else {
      setWalletMutations(res.data);
      setWalletMutationRealTotal(res.realTotal);
    }
  }, [pagination, filter, sorts, userId]);
  const intervalRun = useIntervalRun(() => autoFetch(), refreshDelay);
  const {
    setAlive: setIntervalRunAlive,
    restart: restartIntervalRun
  } = intervalRun;

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [err, res] = await goPromise<{
      data: IWalletMutation[];
      realTotal: number;
    }>(getWalletMutationsByUserId(userId, filter, pagination, sorts));
    setLoading(false);

    if (err) {
      console.log({ err });
      setError("error");
    } else {
      setWalletMutations(res.data);
      setWalletMutationRealTotal(res.realTotal);
      setIntervalRunAlive(true);
    }
  }, [
    setWalletMutations,
    setIntervalRunAlive,
    userId,
    filter,
    pagination,
    sorts
  ]);
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

  const columns: Column<IWalletMutation>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: row => row.id,
        Filter: null
      },
      {
        Header: "Amount",
        accessor: row => row.amount,
        Filter: null
      },
      {
        Header: "Balance",
        accessor: row => row.balance,
        Filter: null
      },
      {
        Header: "Type",
        accessor: row => row.type,
        Filter: null
      },
      {
        Header: "Description",
        accessor: row => row.description,
        Filter: null
      },
      {
        Header: "Created At",
        accessor: row => moment(row.created_at).format("D MMMM YYYY"),
        Filter: null
      }
    ],
    []
  );

  return (
    <div>
      <BasicDialog
        open={open}
        dismiss={dismiss}
        maxWidth="lg"
        fullWidth
        bgClose
      >
        <title>Wallet Mutations</title>
        <section>
          <div style={{ width: "100%" }}>
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
            ) : walletMutations && _.isArray(walletMutations) ? (
              <>
                {/* Filter Form */}
                <CollapseFilterAndSort>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                      <SortForm<WalletMutationSortField>
                        sorts={sorts}
                        sortFields={walletMutationSortFields}
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
                  data={walletMutations}
                  rowCount={walletMutationRealTotal}
                  onPaginationChange={onPaginationChange}
                  disableSorting={true}
                />
              </>
            ) : null}
          </div>
          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </div>
        </section>
      </BasicDialog>
    </div>
  );
}

export default WalletMutationsDialog;
