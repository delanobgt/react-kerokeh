import _ from "lodash";
import React from "react";
import { Div, MyNumber, ContentDiv, Trace } from "../components";
import { Typography, Button, CircularProgress } from "@material-ui/core";
import {
  EBnibTransactionStatus,
  IBnibTransaction,
  defectBnibTransactionByCode,
  IAccessLogItem
} from "src/store/bnib-transaction";
import ConfirmDialog from "src/components/generic/dialog/ConfirmDialog";
import { goPromise } from "src/util/helper";
import DefectDialog from "../dialogs/small-dialogs/DefectDialog";
import DetailImageDialog from "src/components/generic/dialog/DetailImageDialog";

interface IProps {
  orderNo: number;
  accessLogDefectItem: IAccessLogItem;
  accessLogNotDefectItem: IAccessLogItem;
  transaction: IBnibTransaction;
  onAfterSubmit: () => void;
}

export default function(props: IProps) {
  const {
    orderNo,
    accessLogDefectItem,
    accessLogNotDefectItem,
    transaction,
    onAfterSubmit
  } = props;

  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const accessLogItem = React.useMemo(
    () => accessLogDefectItem || accessLogNotDefectItem,
    [accessLogDefectItem, accessLogNotDefectItem]
  );
  const defected = React.useMemo(() => Boolean(accessLogDefectItem), [
    accessLogDefectItem
  ]);
  const [defectDialogOpen, setDefectDialogOpen] = React.useState<boolean>(
    false
  );
  const [notDefectDialogOpen, setNotDefectDialogOpen] = React.useState<boolean>(
    false
  );
  const [detailDialogImageUrl, setDetailDialogImageUrl] = React.useState<
    string
  >("");
  const confirmDialogNotDefectCallback = React.useCallback(
    async dismiss => {
      dismiss();
      setError("");
      setLoading(true);
      const [err] = await goPromise<void>(
        defectBnibTransactionByCode(transaction.code, false)
      );
      setLoading(false);

      if (err) {
        console.log(err);
        setError(_.get(err, "response.data.errors", "Something went wrong!"));
      } else {
        onAfterSubmit();
      }
    },
    [onAfterSubmit, transaction.code]
  );

  return (
    <>
      <Div>
        <MyNumber variant="subtitle2">{orderNo}</MyNumber>
        <ContentDiv>
          {Boolean(accessLogDefectItem) || Boolean(accessLogNotDefectItem) ? (
            <div>
              <Trace
                name={accessLogItem.admin_username}
                time={accessLogItem.time}
              />
              <Typography variant="subtitle1">
                {defected ? "Defected" : "Not defected"}
              </Typography>

              {defected && (
                <div>
                  {transaction.defected_image_urls.map(url => (
                    <img
                      key={url}
                      src={url}
                      alt=""
                      style={{
                        height: "60px",
                        marginRight: "1rem",
                        cursor: "pointer"
                      }}
                      onClick={() => setDetailDialogImageUrl(url)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : transaction.status === EBnibTransactionStatus.AcceptedByDepatu ? (
            <div>
              <Typography variant="subtitle1">
                Is the product defected ?
              </Typography>
              {Boolean(error) && (
                <Typography variant="subtitle2" style={{ color: "red" }}>
                  {error}
                </Typography>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setNotDefectDialogOpen(true)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "NOT DEFECTED"}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={() => setDefectDialogOpen(true)}
                disabled={loading}
              >
                DEFECTED
              </Button>
            </div>
          ) : null}
        </ContentDiv>
      </Div>
      <ConfirmDialog
        title="PLEASE MIND YOUR ACTION !!"
        message="Are you sure the product is NOT DEFECTED ?"
        visible={notDefectDialogOpen}
        confirmText="NOT DEFECTED"
        dismiss={() => setNotDefectDialogOpen(false)}
        yesCallback={confirmDialogNotDefectCallback}
      />
      {Boolean(defectDialogOpen) && (
        <DefectDialog
          transactionCode={transaction.code}
          onAfterSubmit={onAfterSubmit}
          dismiss={() => setDefectDialogOpen(false)}
        />
      )}
      {Boolean(detailDialogImageUrl) && (
        <DetailImageDialog
          title="Defect Detail Image"
          imageUrl={detailDialogImageUrl}
          dismiss={() => setDetailDialogImageUrl(null)}
        />
      )}
    </>
  );
}
