import _ from "lodash";
import React from "react";
import { Button } from "@material-ui/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import BasicDialog from "src/components/generic/BasicDialog";
import { IProduct } from "src/store/product";
import { RootState } from "src/store";
import { useSelector } from "react-redux";
import { makeExpansion } from "src/components/generic/detail-dialog";

interface IComponentProps {
  productId: number;
  dismiss: () => void;
}

function DeleteDialog(props: IComponentProps) {
  const { productId, dismiss } = props;

  const handleClose = () => {
    dismiss();
  };

  const product = useSelector<RootState, IProduct>(state => {
    return (_.find(
      state.product.products,
      pc => ((pc as unknown) as IProduct).id === productId
    ) as unknown) as IProduct;
  });

  const productEntries = React.useMemo(() => {
    if (!product) return [];
    return [
      { label: "Id", value: product.id || "-" },
      { label: "Code", value: product.code || "-" },
      { label: "Name", value: product.name || "-" }
    ];
  }, [product]);

  return (
    <div>
      <BasicDialog
        open={Boolean(product)}
        dismiss={dismiss}
        maxWidth="sm"
        fullWidth
        bgClose
      >
        <title>Product Detail</title>
        <section>
          {makeExpansion({ title: "Product", entries: productEntries }, true)}
          <div style={{ width: "100%" }}>
            <TransformWrapper style={{ width: "100%" }}>
              <TransformComponent>
                <img alt="" style={{ width: "100%" }} src={""} />
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
