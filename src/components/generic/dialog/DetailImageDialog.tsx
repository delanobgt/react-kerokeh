import React from "react";
import { Button } from "@material-ui/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ArrowDownward as ArrowDownwardIcon } from "@material-ui/icons";

import BasicDialog from "./BasicDialog";

interface IComponentProps {
  title?: string;
  filename?: string;
  imageUrl: string;
  dismiss: () => void;
}

function DetailImageDialog(props: IComponentProps) {
  const { title, filename, imageUrl, dismiss } = props;

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  return (
    <div>
      <BasicDialog
        open={Boolean(imageUrl)}
        dismiss={dismiss}
        maxWidth="md"
        fullWidth
        bgClose
      >
        <title>{title || "Image Detail"}</title>
        <section>
          <div style={{ width: "100%" }}>
            <Button
              style={{ marginBottom: "1rem" }}
              variant="outlined"
              color="primary"
              href={imageUrl}
              download={imageUrl || filename}
            >
              <ArrowDownwardIcon /> Download
            </Button>
            <TransformWrapper style={{ width: "100%" }}>
              <TransformComponent>
                <img alt="" style={{ width: "100%" }} src={imageUrl} />
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </section>
      </BasicDialog>
    </div>
  );
}

export default DetailImageDialog;
