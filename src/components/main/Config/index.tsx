import _ from "lodash";
import React from "react";
import { CircularProgress, Typography, Grid, Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { SettingsApplications as TitleIcon } from "@material-ui/icons";
import { Column } from "react-table";

import Table, {
  OnPaginationChangeFn
} from "src/components/generic/ReactTableSSR";
import { RootState } from "src/store";
import { goPromise } from "src/util/helper";
import useIntervalRun from "src/hooks/useIntervalRun";
import TopAction from "./TopAction";
import UpdateDialog from "./dialogs/UpdateDialog";
import useTableUrlState from "src/hooks/useTableUrlState";
import {
  PConfigFilter,
  PConfigPagination,
  ConfigSortField,
  IConfig,
  IConfigGetAction,
  getConfigs,
  PConfig
} from "src/store/config";
import {
  TablePaper,
  TableInfoWrapper,
  TableTitle
} from "src/components/generic/TableGenerics";

function Config() {
  const refreshDelay = 5000;
  const { filter, pagination, sorts, updatePagination } = useTableUrlState<
    PConfigFilter,
    PConfigPagination,
    ConfigSortField
  >({}, { limit: 10, offset: 0 }, []);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const configs = useSelector<RootState, IConfig[]>(
    state => state.config.configs
  );
  const [updateDialogConfigId, setUpdateDialogConfigId] = React.useState<
    number
  >(null);
  const dispatch = useDispatch();

  const configRealTotal = useSelector<RootState, number>(
    state => state.config.realTotal
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IConfigGetAction>(
      getConfigs(pagination, filter, sorts)
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
    const [err, res] = await goPromise<IConfigGetAction>(
      getConfigs({ offset: 0, limit: 10 }, {}, [])
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
  const columns: Column<IConfig>[] = React.useMemo(
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
        Header: "Value",
        accessor: "value"
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
        Header: "Actions",
        accessor: "",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <Button
                onClick={() => setUpdateDialogConfigId(original.id)}
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
    []
  );

  // set updateInitialValues
  const [updateInitialValues, setUpdateInitialValues] = React.useState<PConfig>(
    { name: "", value: 0 }
  );
  React.useEffect(() => {
    if (!updateDialogConfigId)
      return setUpdateInitialValues({ name: "", value: 0 });
    const config: IConfig = (_.find(
      configs,
      pc => ((pc as unknown) as IConfig).id === updateDialogConfigId
    ) as unknown) as IConfig;
    setUpdateInitialValues(config);
  }, [configs, updateDialogConfigId, setUpdateInitialValues]);

  return (
    <>
      <br />
      <br />
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <TablePaper elevation={3}>
            <TableInfoWrapper>
              <TableTitle>
                <Typography variant="h6">Configs</Typography>
                <TitleIcon
                  style={{ marginLeft: "0.5rem", color: "cornflowerblue" }}
                />
              </TableTitle>
              <Typography variant="subtitle1">List of all configs</Typography>
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
            ) : configs && _.isArray(configs) ? (
              <>
                {/* top action */}
                <TopAction
                  intervalRun={intervalRun}
                  refreshDelay={refreshDelay}
                />
                <Table
                  pageIndex={pagination.offset / pagination.limit}
                  pageSize={Number(pagination.limit)}
                  columns={columns}
                  data={configs}
                  rowCount={configRealTotal}
                  onPaginationChange={onPaginationChange}
                  disableSorting={true}
                />
              </>
            ) : null}
          </TablePaper>
        </Grid>
      </Grid>
      {Boolean(updateDialogConfigId) && (
        <UpdateDialog
          configId={updateDialogConfigId}
          restartIntervalRun={intervalRun.restart}
          dismiss={() => setUpdateDialogConfigId(null)}
          initialValues={updateInitialValues}
        />
      )}
    </>
  );
}

export default Config;
