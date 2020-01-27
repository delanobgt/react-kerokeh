import _ from "lodash";
import React from "react";
import { CircularProgress, Typography, IconButton } from "@material-ui/core";
import { Details as DetailsIcon, Edit as EditIcon } from "@material-ui/icons";
import { Column } from "react-table";

import Table from "src/components/generic/table/ReactTable";
import { goPromise } from "src/util/helper";
import TopAction from "./TopAction";
import CreateDialog from "./dialogs/CreateDialog";
import UpdateDialog from "./dialogs/UpdateDialog";
import DetailDialog from "./dialogs/DetailDialog";
import { TableInfoWrapper } from "src/components/generic/table/table-infos";
import {
  ILegitCheckDetail,
  getLegitCheckDetails,
  PLegitCheckDetail
} from "src/store/bnib-transaction";

interface IComponentProps {
  legitCheckId: number;
}

function LegitCheckDetailTable(props: IComponentProps) {
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [legitCheckDetails, setLegitCheckDetails] = React.useState<
    ILegitCheckDetail[]
  >([]);
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(
    false
  );
  const [updateDialogId, setUpdateDialogId] = React.useState<number>(null);
  const [detailDialogId, setDetailDialogId] = React.useState<number>(null);

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [err, res] = await goPromise<ILegitCheckDetail[]>(
      getLegitCheckDetails(props.legitCheckId)
    );
    setLoading(false);

    if (err) {
      console.log({ err });
      setError("error");
    } else {
      setLegitCheckDetails(res);
    }
  }, [props.legitCheckId]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const columns: Column<ILegitCheckDetail>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: row => row.id,
        Filter: null
      },
      {
        Header: "Checker Initial",
        accessor: row => row.checker_initial,
        Filter: null
      },
      {
        Header: "Currency",
        accessor: row => row.currency,
        Filter: null
      },
      {
        Header: "Price",
        accessor: row => row.price,
        Filter: null
      },
      {
        Header: "Result",
        accessor: row => row.result,
        Filter: null
      },
      {
        Header: "Actions",
        accessor: "",
        Filter: null,
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <IconButton onClick={() => setDetailDialogId(original.id)}>
                <DetailsIcon />
              </IconButton>
              <IconButton onClick={() => setUpdateDialogId(original.id)}>
                <EditIcon />
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
    PLegitCheckDetail
  >({});
  React.useEffect(() => {
    if (!updateDialogId) return setUpdateInitialValues({});
    const legitCheckDetail: ILegitCheckDetail = (_.find(
      legitCheckDetails,
      pc => ((pc as unknown) as ILegitCheckDetail).id === updateDialogId
    ) as unknown) as ILegitCheckDetail;
    setUpdateInitialValues(legitCheckDetail);
  }, [legitCheckDetails, updateDialogId, setUpdateInitialValues]);

  return (
    <>
      <TableInfoWrapper>
        <Typography variant="subtitle1">Legit Check Details</Typography>
      </TableInfoWrapper>

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
      ) : legitCheckDetails && _.isArray(legitCheckDetails) ? (
        <>
          {/* top action */}
          <br />
          <TopAction
            addButtonVisible={
              legitCheckDetails &&
              _.isArray(legitCheckDetails) &&
              legitCheckDetails.length < 3
            }
            setCreateDialogOpen={setCreateDialogOpen}
          />
          <Table columns={columns} data={legitCheckDetails} />
        </>
      ) : null}
      {Boolean(detailDialogId) && (
        <DetailDialog
          legitCheckDetailId={detailDialogId}
          dismiss={() => setDetailDialogId(null)}
        />
      )}
      {Boolean(createDialogOpen) && (
        <CreateDialog
          open={createDialogOpen}
          dismiss={() => setCreateDialogOpen(null)}
          legit_check_id={props.legitCheckId}
          onAfterSubmit={() => fetch()}
        />
      )}
      {Boolean(updateDialogId) && (
        <UpdateDialog
          legitCheckDetailId={updateDialogId}
          dismiss={() => setUpdateDialogId(null)}
          initialValues={updateInitialValues}
          onAfterSubmit={() => fetch()}
        />
      )}
    </>
  );
}

export default LegitCheckDetailTable;
