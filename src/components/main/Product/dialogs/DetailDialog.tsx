import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";

import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { IProduct, getProductById } from "src/store/product";
import { makeExpansion } from "src/components/generic/detail-dialog";
import { goPromise } from "src/util/helper";
import moment from "moment";
import DetailImageDialog from "src/components/generic/dialog/DetailImageDialog";

interface IComponentProps {
  productId: number;
  dismiss: () => void;
}

function DetailDialog(props: IComponentProps) {
  const { productId, dismiss } = props;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [product, setProduct] = React.useState<IProduct>(null);
  const [detailDialogImageUrl, setDetailDialogImageUrl] = React.useState<
    string
  >("");

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errProduct, product] = await goPromise<IProduct>(
      getProductById(productId)
    );
    setLoading(false);

    if (errProduct) {
      console.log(errProduct);
      setError("error");
    } else {
      setProduct(product);
    }
  }, [productId]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const productEntries = React.useMemo(() => {
    if (!product) return [];
    return [
      { label: "Id", value: product.id || "-" },
      { label: "Code", value: product.code || "-" },
      { label: "Name", value: product.name || "-" },
      { label: "Color", value: product.color || "-" },
      { label: "Description", value: product.description || "-" },
      { label: "Detail", value: product.detail || "-" },
      { label: "Story", value: product.story || "-" },
      { label: "Gender", value: product.gender || "-" },
      { label: "Is Active", value: product.is_active ? "YES" : "NO" },
      { label: "Slug", value: product.slug },
      {
        label: "Release Date",
        value: moment(product.release_date).format("D MMMM YYYY")
      },
      { label: "Retail Price", value: product.retail_price || "-" },
      { label: "Slug", value: product.slug },
      { label: "Sold Count", value: product.sold_count },
      { label: "View Count", value: product.view_count },
      {
        label: "BNIB Highest Bid Price",
        value: product.bnib_highest_bid_price
      },
      {
        label: "BNIB Lowest Sell Price",
        value: product.bnib_lowest_sell_price
      },
      {
        label: "Pre Order Highest Bid Price",
        value: product.pre_order_highest_bid_price
      },
      {
        label: "Pre Order Lowest Sell Price",
        value: product.pre_order_lowest_sell_price
      },
      {
        label: "Display Image",
        value: (
          <div style={{ width: "100%" }}>
            <img
              alt=""
              style={{ width: "100%", cursor: "pointer" }}
              src={product.display_image_url}
              onClick={() => setDetailDialogImageUrl(product.display_image_url)}
            />
          </div>
        )
      },
      {
        label: "Detail Image",
        value: (
          <div style={{ width: "100%" }}>
            {product.detail_image_urls.length ? (
              product.detail_image_urls.map(url => (
                <img
                  key={url}
                  alt=""
                  style={{
                    width: "100px",
                    marginRight: "1rem",
                    cursor: "pointer"
                  }}
                  src={url}
                  onClick={() => setDetailDialogImageUrl(url)}
                />
              ))
            ) : (
              <Typography>- no detail images -</Typography>
            )}
          </div>
        )
      }
    ];
  }, [product]);

  const productBrandEntries = React.useMemo(() => {
    if (!product) return [];
    return [
      { label: "Id", value: product.product_brand.id || "-" },
      { label: "Full Name", value: product.product_brand.full_name || "-" },
      { label: "Name", value: product.product_brand.name || "-" },
      { label: "Slug", value: product.product_brand.slug || "-" }
    ];
  }, [product]);

  const productCategoryEntries = React.useMemo(() => {
    if (!product) return [];
    return [
      { label: "Id", value: product.product_category.id || "-" },
      { label: "Name", value: product.product_category.name || "-" },
      { label: "Slug", value: product.product_category.slug || "-" }
    ];
  }, [product]);

  return (
    <>
      <BasicDialog
        open={Boolean(productId)}
        dismiss={dismiss}
        maxWidth="sm"
        fullWidth
        bgClose
      >
        <title>Product Detail</title>
        <section>
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
          ) : product ? (
            <>
              <div style={{ width: "100%" }}>
                {makeExpansion(
                  { title: "Product", entries: productEntries },
                  true
                )}
                {makeExpansion({
                  title: "Product Brand",
                  entries: productBrandEntries
                })}
                {makeExpansion({
                  title: "Product Category",
                  entries: productCategoryEntries
                })}
              </div>
            </>
          ) : null}
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </section>
      </BasicDialog>
      {Boolean(detailDialogImageUrl) && (
        <DetailImageDialog
          title="Product Detail Image"
          imageUrl={detailDialogImageUrl}
          dismiss={() => setDetailDialogImageUrl(null)}
        />
      )}
    </>
  );
}

export default DetailDialog;
