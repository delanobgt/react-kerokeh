import _ from "lodash";
import React from "react";
import styled from "styled-components";
import { ILegitCheck, publishFinalResult } from "src/store/bnib-transaction";
import { Paper, MenuItem, Button, Typography } from "@material-ui/core";
import { goPromise } from "src/util/helper";
import LegitCheckDetailTable from "../tables/LegitCheckDetail";
import BasicSelect from "src/components/generic/input/BasicSelect";
import DetailImageDialog from "src/components/generic/dialog/DetailImageDialog";
import UpdateLegitCheckImagesDialog from "./small-dialogs/UpdateLegitCheckImagesDialog";
import { TLegitCheckInitialValues } from "../types";

interface IComponentProps {
  legitCheck: ILegitCheck;
  onAfterSubmit: () => void;
}

const MyPaper = styled(Paper)`
  padding: 1.5rem;
`;

function LegitCheckModule(props: IComponentProps) {
  const { legitCheck, onAfterSubmit } = props;

  const [finalResult, setFinalResult] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [detailDialogImageUrl, setDetailDialogImageUrl] = React.useState<
    string
  >("");
  const [updateDialogId, setUpdateDialogId] = React.useState<number>(null);

  // set updateInitialValues
  const [updateInitialValues, setUpdateInitialValues] = React.useState<
    TLegitCheckInitialValues
  >({});
  React.useEffect(() => {
    if (!updateDialogId || !legitCheck) return setUpdateInitialValues({});
    const initial_images = legitCheck.image_urls.map(url => ({
      image_path: url,
      deleted: false
    }));
    setUpdateInitialValues({
      initial_images
    });
  }, [updateDialogId, setUpdateInitialValues, legitCheck]);

  const publish = React.useCallback(async () => {
    if (!legitCheck) return;
    setError("");
    setLoading(true);
    const [err] = await goPromise<void>(
      publishFinalResult(legitCheck.id, finalResult)
    );
    setLoading(false);

    if (err) {
      console.log(err);
      setError(_.get(err, "response.data.errors", "Something went wrong!"));
    } else {
      onAfterSubmit();
    }
  }, [onAfterSubmit, legitCheck, finalResult]);

  return (
    <>
      <MyPaper>
        <Typography variant="h6">Legit Check</Typography>
        <br />
        <Typography variant="subtitle1">Images</Typography>
        <div>
          {legitCheck.image_urls.map(url => (
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
        {Boolean(!legitCheck.final_result) && (
          <Button
            color="primary"
            variant="outlined"
            onClick={() => setUpdateDialogId(legitCheck.id)}
          >
            Add/Remove Image
          </Button>
        )}
        <br />
        <br />

        <div>
          <LegitCheckDetailTable legitCheck={legitCheck} />
        </div>

        <div>
          <br />
          <Typography variant="subtitle1">
            Publish Legit Check Result
          </Typography>
          <BasicSelect
            style={{ width: "10rem" }}
            label="Final Result"
            disabled={Boolean(legitCheck.final_result) || loading}
            value={legitCheck.final_result || finalResult}
            onChange={(value: string) => {
              setFinalResult(value);
            }}
          >
            <MenuItem value=""></MenuItem>
            <MenuItem value="authentic">Authentic</MenuItem>
            <MenuItem value="indefinable">Indefinable</MenuItem>
            <MenuItem value="fake">Fake</MenuItem>
          </BasicSelect>
          {Boolean(error) && (
            <Typography variant="body2" style={{ color: "red" }}>
              {error}
            </Typography>
          )}
          {Boolean(!legitCheck.final_result) && (
            <div style={{ marginTop: "0.75rem" }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={publish}
                disabled={!finalResult || loading}
              >
                Publish
              </Button>
            </div>
          )}
        </div>
      </MyPaper>
      {Boolean(detailDialogImageUrl) && (
        <DetailImageDialog
          title="Legit Check Detail Image"
          imageUrl={detailDialogImageUrl}
          dismiss={() => setDetailDialogImageUrl(null)}
        />
      )}
      {Boolean(updateDialogId) && (
        <UpdateLegitCheckImagesDialog
          legitCheckId={updateDialogId}
          onAfterSubmit={onAfterSubmit}
          dismiss={() => setUpdateDialogId(null)}
          initialValues={updateInitialValues}
        />
      )}
    </>
  );
}

export default LegitCheckModule;
