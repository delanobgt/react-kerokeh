import _ from "lodash";
import React from "react";
import {
  CircularProgress,
  Typography,
  Grid,
  IconButton,
  Chip
} from "@material-ui/core";
import {
  People as TitleIcon,
  Details as DetailsIcon
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "react-table";
import useReactRouter from "use-react-router";
import queryString from "query-string";

import Table, {
  OnPaginationChangeFn
} from "src/components/generic/table/ReactTableSSR";
import { RootState } from "src/store";
import { goPromise } from "src/util/helper";
import useIntervalRun from "src/hooks/useIntervalRun";
import TopAction from "./TopAction";
import FilterForm from "./FilterForm";
import SortForm from "../../generic/SortForm";
import DetailDialog from "./dialogs/DetailDialog";
import {
  IIdentification,
  PIdentificationPagination,
  PIdentificationFilter,
  IdentificationSortField,
  IIdentificationGetAction,
  getIdentifications
} from "src/store/identification";
import { statusLabelDict } from "./constants";
import useTableUrlState from "src/hooks/useTableUrlState";
import { MyDesc } from "src/components/generic/detail-dialog";
import {
  TablePaper,
  TableInfoWrapper,
  TableTitle
} from "src/components/generic/table/table-infos";
import CollapseFilterAndSort from "src/components/generic/CollapseFilterAndSort";

function Identifications() {
  const refreshDelay = 5000;
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const identifications = useSelector<RootState, IIdentification[]>(
    state => state.identification.identifications
  );
  const [detailDialogId, setDetailDialogId] = React.useState<number | null>(
    null
  );
  const dispatch = useDispatch();

  const { location } = useReactRouter();
  const isSearchEmpty = React.useMemo(() => {
    const parsed = queryString.parse(location.search);
    return _.size(parsed) === 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    filter,
    pagination,
    sorts,
    updateFilter,
    updatePagination,
    updateSorts
  } = useTableUrlState<
    PIdentificationFilter,
    PIdentificationPagination,
    IdentificationSortField
  >(
    {},
    { limit: 5, offset: 0 },
    isSearchEmpty ? [{ field: "verification_attempted", dir: "desc" }] : []
  );

  const identificationRealTotal = useSelector<RootState, number>(
    state => state.identification.realTotal
  );
  const identificationSortFields: IdentificationSortField[] = React.useMemo(
    () => [
      "id",
      "number",
      "rejected_reason",
      "type",
      "verification_attempted",
      "verification_rejected",
      "verified",
      "verified_by"
    ],
    []
  );

  // interval fetch
  const autoFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IIdentificationGetAction>(
      getIdentifications(pagination, filter, sorts)
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
    const [err, res] = await goPromise<IIdentificationGetAction>(
      getIdentifications({ offset: 0, limit: 5 }, {}, [])
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

  const columns: Column<IIdentification>[] = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: row => row.id
      },
      {
        Header: "Number",
        accessor: row => row.number
      },
      {
        Header: "Type",
        accessor: row => row.type
      },
      {
        Header: "Status",
        accessor: row => row.id,
        Cell: ({ row: { original } }) => {
          const key =
            Number(original.verification_attempted) * 2 ** 2 +
            Number(original.verification_rejected) * 2 ** 1 +
            Number(original.verified) * 2 ** 0;
          return (
            <div>
              <Chip
                style={{ background: statusLabelDict[key].color }}
                label={statusLabelDict[key].label}
              />
              {original.verification_rejected ? (
                <MyDesc
                  variant="subtitle2"
                  style={{ color: statusLabelDict[key].color }}
                >
                  {original.rejected_reason}
                </MyDesc>
              ) : original.verified ? (
                <MyDesc
                  variant="subtitle2"
                  style={{ color: statusLabelDict[key].color }}
                >
                  Verified by {original.verified_by}
                </MyDesc>
              ) : null}
            </div>
          );
        }
      },
      {
        Header: "Actions",
        accessor: "",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <IconButton onClick={() => setDetailDialogId(original.user_id)}>
                <DetailsIcon />
              </IconButton>
            </div>
          );
        }
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
                <Typography variant="h6">Identifications</Typography>
                <TitleIcon
                  style={{ marginLeft: "0.5rem", color: "cornflowerblue" }}
                />
              </TableTitle>
              <Typography variant="subtitle1">
                List of all identifications
              </Typography>
            </TableInfoWrapper>
            <br />
            <br />

            {loading ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress size={24} /> Loading identification...
              </div>
            ) : error ? (
              <Typography variant="subtitle1" color="secondary">
                An error occured, please{" "}
                <span onClick={fetch} style={{ color: "lightblue" }}>
                  retry
                </span>
                .
              </Typography>
            ) : identifications && _.isArray(identifications) ? (
              <>
                {/* Filter Form */}
                <CollapseFilterAndSort>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                      <FilterForm filter={filter} updateFilter={updateFilter} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <SortForm
                        sorts={sorts}
                        sortFields={identificationSortFields}
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
                  data={identifications}
                  rowCount={identificationRealTotal}
                  onPaginationChange={onPaginationChange}
                  disableSorting={true}
                />
              </>
            ) : null}
          </TablePaper>
        </Grid>
      </Grid>
      {Boolean(detailDialogId) && (
        <DetailDialog
          userId={detailDialogId}
          restartIntervalRun={restartIntervalRun}
          dismiss={() => setDetailDialogId(null)}
        />
      )}
    </>
  );
}

export default Identifications;
