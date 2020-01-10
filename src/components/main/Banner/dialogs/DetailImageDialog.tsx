import React from "react";
import { Button } from "@material-ui/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import BasicDialog from "src/components/generic/BasicDialog";

interface IComponentProps {
  imageUrl: string;
  dismiss: () => void;
}

function DeleteDialog(props: IComponentProps) {
  const { imageUrl, dismiss } = props;

  const handleClose = () => {
    dismiss();
  };

  return (
    <div>
      <BasicDialog
        open={Boolean(imageUrl)}
        dismiss={dismiss}
        maxWidth="md"
        fullWidth
        bgClose
      >
        <title>Banner Image Detail</title>
        <section>
          <div style={{ width: "100%" }}>
            <TransformWrapper style={{ width: "100%" }}>
              <TransformComponent>
                <img alt="" style={{ width: "100%" }} src={imageUrl} />
              </TransformComponent>
            </TransformWrapper>
          </div>
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </section>
      </BasicDialog>
    </div>
  );
}

export default DeleteDialog;
