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
        value: buyOrder.product_detail.product_brand.id || "n/a"
      },
      {
        label: "Full Name",
        value: buyOrder.product_detail.product_brand.full_name || "n/a"
      },
      {
        label: "Name",
        value: buyOrder.product_detail.product_brand.name || "n/a"
      },
      {
        label: "Slug",
        value: buyOrder.product_detail.product_brand.slug || "n/a"
      }
    ];
  }, [buyOrder]);

  const buyerEntries = React.useMemo(() => {
    if (!buyer) return [];
    return [
      { label: "Id", value: buyer.id || "n/a" },
      { label: "Username", value: buyer.username || "n/a" },
      { label: "Full Name", value: buyer.full_name || "n/a" },
      { label: "Email", value: buyer.email || "n/a" },
      { label: "Gender", value: buyer.gender || "n/a" },
      {
        label: "Birthday",
        value: buyer.birthday
          ? moment(buyer.birthday).format("D MMMM YYYY")
          : "n/a"
      },
      { label: "Referral Code", value: buyer.referral_code || "n/a" },
      { label: "Verified Email", value: buyer.verified_email || "n/a" },
      { label: "Country Code", value: buyer.country_code || "n/a" },
      { label: "Phone", value: buyer.phone || "n/a" },
      { label: "Verified Phone", value: buyer.verified_phone || "n/a" },
      {
        label: "Joined at",
        value: buyer.last_login_at
          ? moment(buyer.created_at).format("D MMMM YYYY")
          : "n/a"
      }
    ];
  }, [buyer]);

  const productCategoryEntries = React.useMemo(() => {
    if (!buyOrder) return [];
    return [
      {
        label: "Id",
        value: buyOrder.product_detail.product_category.id || "n/a"
      },
      {
        label: "Name",
        value: buyOrder.product_detail.product_category.name || "n/a"
      },
      {
        label: "Slug",
        value: buyOrder.product_detail.product_category.slug || "n/a"
      }
    ];
  }, [buyOrder]);

  const productDetailEntries = React.useMemo(() => {
    if (!buyOrder) return [];
    return [
      { label: "Id", value: buyOrder.product_detail.id || "n/a" },
      { label: "Code", value: buyOrder.product_detail.code || "n/a" },
      { label: "Name", value: buyOrder.product_detail.name || "n/a" },
      { label: "Color", value: buyOrder.product_detail.color || "n/a" },
      {
        label: "Description",
        value: buyOrder.product_detail.description || "n/a"
      },
      { label: "Detail", value: buyOrder.product_detail.detail || "n/a" },
      { label: "Story", value: buyOrder.product_detail.story || "n/a" },
      { label: "Gender", value: buyOrder.product_detail.gender || "n/a" },
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
        value: buyOrder.product_detail.retail_price || "n/a"
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
