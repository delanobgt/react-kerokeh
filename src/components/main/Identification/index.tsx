import _ from "lodash";
import React from "react";
import {
  CircularProgress,
  Paper,
  Toolbar,
  Typography,
  Grid,
  Button,
  Chip
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
import { ISort } from "src/util/types";
import DetailDialog from "./dialogs/DetailDialog";
import {
  IIdentification,
  PIdentificationPagination,
  PIdentificationFilter,
  IdentificationSortField,
  IIdentificationGetAction,
  getIdentifications,
  updateIdentificationPagination,
  updateIdentificationSorts
} from "src/store/identification";
import { statusLabelDict } from "./constants";
import { MyDesc } from "./components";

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
    display: "flex",
    paddingLeft: theme.spacing(2)
    // justifyContent: "space-between"
  }
}));

const MyPaper = styled(Paper)`
  padding: 1.5em;
`;

function Identifications() {
  const refreshDelay = 5000;
  const classes = useStyles({});
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const identifications = useSelector<RootState, IIdentification[]>(
    state => state.identification.identifications
  );
  const [
    detailDialogIdentificationUserId,
    setDetailDialogIdentificationUserId
  ] = React.useState<number | null>(null);
  const dispatch = useDispatch();

  const identificationPagination = useSelector<
    RootState,
    PIdentificationPagination
  >(state => state.identification.pagination);
  const identificationFilter = useSelector<RootState, PIdentificationFilter>(
    state => state.identification.filter
  );
  const identificationSorts = useSelector<
    RootState,
    ISort<IdentificationSortField>[]
  >(state => state.identification.sorts);
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
      getIdentifications(
        identificationPagination,
        identificationFilter,
        identificationSorts
      )
    );
    if (err) {
      throw err;
    } else {
      dispatch(res);
    }
  }, [
    dispatch,
    identificationPagination,
    identificationFilter,
    identificationSorts
  ]);
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
      getIdentifications({ limit: 5 }, {}, [])
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
  }, [
    dRestartIntervalRun,
    identificationPagination,
    identificationFilter,
    identificationSorts
  ]);

  const onPaginationChange: OnPaginationChangeFn = React.useCallback(
    (pageIndex, pageSize) => {
      dispatch(
        updateIdentificationPagination({
          offset: pageIndex * pageSize,
          limit: pageSize
        })
      );
    },
    [dispatch]
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
              <Button
                onClick={() =>
                  setDetailDialogIdentificationUserId(original.user_id)
                }
                color="primary"
                variant="outlined"
              >
                Details
              </Button>
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
          <MyPaper elevation={3}>
            <Toolbar className={clsx(classes.root)}>
              <Typography variant="h6">Identifications</Typography>
              <Typography variant="subtitle1">
                List of all identifications
              </Typography>
            </Toolbar>
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
                <div className={classes.filterAndSortForm}>
                  <FilterForm />
                  <div style={{ marginLeft: "2rem" }}>
                    <SortForm
                      sorts={identificationSorts}
                      sortFields={identificationSortFields}
                      updateSorts={updateIdentificationSorts}
                    />
                  </div>
                </div>
                {/* top action */}
                <TopAction
                  intervalRun={intervalRun}
                  refreshDelay={refreshDelay}
                />
                <Table
                  columns={columns}
                  data={identifications}
                  rowCount={identificationRealTotal}
                  onPaginationChange={onPaginationChange}
                  disableSorting={true}
                />
              </>
            ) : null}
          </MyPaper>
        </Grid>
      </Grid>
      {Boolean(detailDialogIdentificationUserId) && (
        <DetailDialog
          userId={detailDialogIdentificationUserId}
          restartIntervalRun={restartIntervalRun}
          dismiss={() => setDetailDialogIdentificationUserId(null)}
        />
      )}
    </>
  );
}

export default Identifications;
