import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import moment from "moment";
import { MyExpansion } from "src/components/generic/detail-dialog";
import DetailImageDialog from "src/components/generic/dialog/DetailImageDialog";
import { IUser, getUserById } from "src/store/user";
import { IBnibBuyOrder, getBnibBuyOrderByCode } from "src/store/bnib-buy-order";

interface IComponentProps {
  transactionCode: string;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

function DetailDialog(props: IComponentProps) {
  const { transactionCode, dismiss } = props;

  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [buyOrder, setBuyOrder] = React.useState<IBnibBuyOrder>(null);
  const [buyer, setBuyer] = React.useState<IUser>(null);
  const [detailDialogImageUrl, setDetailDialogImageUrl] = React.useState<
    string
  >("");

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errBuyOrder, buyOrder] = await goPromise<IBnibBuyOrder>(
      getBnibBuyOrderByCode(transactionCode)
    );
    const [errBuyer, buyer] = await goPromise<IUser>(
      getUserById(buyOrder.buyer_id)
    );
    setLoading(false);

    if (errBuyOrder || errBuyer) {
      console.log(errBuyOrder, errBuyer);
      setError("Something went wrong!");
    } else {
      setBuyOrder(buyOrder);
      setBuyer(buyer);
    }
  }, [transactionCode]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const productBrandEntries = React.useMemo(() => {
    if (!buyOrder) return [];
    return [
      {
        label: "Id",
        value: buyOrder.product_detail.product_brand.id || "-"
      },
      {
        label: "Full Name",
        value: buyOrder.product_detail.product_brand.full_name || "-"
      },
      {
        label: "Name",
        value: buyOrder.product_detail.product_brand.name || "-"
      },
      {
        label: "Slug",
        value: buyOrder.product_detail.product_brand.slug || "-"
      }
    ];
  }, [buyOrder]);

  const buyerEntries = React.useMemo(() => {
    if (!buyer) return [];
    return [
      { label: "Id", value: buyer.id || "-" },
      { label: "Username", value: buyer.username || "-" },
      { label: "Full Name", value: buyer.full_name || "-" },
      { label: "Email", value: buyer.email || "-" },
      { label: "Gender", value: buyer.gender || "-" },
      {
        label: "Birthday",
        value: buyer.birthday
          ? moment(buyer.birthday).format("D MMMM YYYY")
          : "-"
      },
      { label: "Referral Code", value: buyer.referral_code || "-" },
      { label: "Verified Email", value: buyer.verified_email || "-" },
      { label: "Country Code", value: buyer.country_code || "-" },
      { label: "Phone", value: buyer.phone || "-" },
      { label: "Verified Phone", value: buyer.verified_phone || "-" },
      {
        label: "Joined at",
        value: buyer.last_login_at
          ? moment(buyer.created_at).format("D MMMM YYYY")
          : "-"
      }
    ];
  }, [buyer]);

  const productCategoryEntries = React.useMemo(() => {
    if (!buyOrder) return [];
    return [
      {
        label: "Id",
        value: buyOrder.product_detail.product_category.id || "-"
      },
      {
        label: "Name",
        value: buyOrder.product_detail.product_category.name || "-"
      },
      {
        label: "Slug",
        value: buyOrder.product_detail.product_category.slug || "-"
      }
    ];
  }, [buyOrder]);

  const productDetailEntries = React.useMemo(() => {
    if (!buyOrder) return [];
    return [
      { label: "Id", value: buyOrder.product_detail.id || "-" },
      { label: "Code", value: buyOrder.product_detail.code || "-" },
      { label: "Name", value: buyOrder.product_detail.name || "-" },
      { label: "Color", value: buyOrder.product_detail.color || "-" },
      {
        label: "Description",
        value: buyOrder.product_detail.description || "-"
      },
      { label: "Detail", value: buyOrder.product_detail.detail || "-" },
      { label: "Story", value: buyOrder.product_detail.story || "-" },
      { label: "Gender", value: buyOrder.product_detail.gender || "-" },
      {
        label: "Is Active",
        value: buyOrder.product_detail.is_active ? "YES" : "NO"
      },
      { label: "Slug", value: buyOrder.product_detail.slug },
      {
        label: "Release Date",
        value: moment(buyOrder.product_detail.release_date).format(
          "D MMMM YYYY"
        )
      },
      {
        label: "Retail Price",
        value: buyOrder.product_detail.retail_price || "-"
      },
      { label: "Slug", value: buyOrder.product_detail.slug },
      { label: "Sold Count", value: buyOrder.product_detail.sold_count },
      { label: "View Count", value: buyOrder.product_detail.view_count },
      {
        label: "Display Image",
        value: (
          <div style={{ width: "100%" }}>
            <img
              alt=""
              style={{ width: "100%", cursor: "pointer" }}
              src={buyOrder.product_detail.display_image_url}
              onClick={() =>
                setDetailDialogImageUrl(
                  buyOrder.product_detail.display_image_url
                )
              }
            />
          </div>
        )
      },
      {
        label: "Detail Image",
        value: (
          <div style={{ width: "100%" }}>
            {(buyOrder.product_detail.detail_image_urls || []).map(url => (
              <img
                key={url}
                alt=""
                style={{
                  width: "100px",
                  marginRight: "1rem",
                  cursor: "pointer"
                }}
                src={url}
              />
            ))}
          </div>
        )
      },
      {
        label: "Product Brand",
        value: (
          <MyExpansion
            entry={{
              title: "Product Brand",
              entries: productBrandEntries
            }}
          />
        )
      },
      {
        label: "Product Category",
        value: (
          <MyExpansion
            entry={{
              title: "Product Category",
              entries: productCategoryEntries
            }}
          />
        )
      }
    ];
  }, [buyOrder, productBrandEntries, productCategoryEntries]);

  return (
    <>
      <div>
        <BasicDialog
          open={Boolean(transactionCode)}
          dismiss={dismiss}
          maxWidth="xl"
          fullWidth
          bgClose={!loading}
        >
          <title>BNIB Buy Order Detail</title>
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
            ) : buyOrder ? (
              <>
                <div style={{ width: "100%" }}>
                  <MyExpansion
                    entry={{
                      title: "Buyer Info",
                      entries: buyerEntries
                    }}
                  />
                  <MyExpansion
                    entry={{
                      title: "Product Detail",
                      entries: productDetailEntries
                    }}
                  />
                </div>
              </>
            ) : null}
            <div style={{ textAlign: "right" }}>
              <Button onClick={handleClose}>Close</Button>
            </div>
          </section>
        </BasicDialog>
      </div>

      {Boolean(detailDialogImageUrl) && (
        <DetailImageDialog
          title="Detail Image"
          imageUrl={detailDialogImageUrl}
          dismiss={() => setDetailDialogImageUrl(null)}
        />
      )}
    </>
  );
}

export default DetailDialog;
