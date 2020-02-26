import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import moment from "moment";
import { MyExpansion } from "src/components/generic/detail-dialog";
import DetailImageDialog from "src/components/generic/dialog/DetailImageDialog";
import { IUser, getUserById } from "src/store/user";
import { IBnibProduct, getBnibProductByCode } from "src/store/bnib-product";

interface IComponentProps {
  transactionCode: string;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

function DetailDialog(props: IComponentProps) {
  const { transactionCode, dismiss } = props;

  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [bnibProduct, setBnibProduct] = React.useState<IBnibProduct>(null);
  const [seller, setSeller] = React.useState<IUser>(null);
  const [detailDialogImageUrl, setDetailDialogImageUrl] = React.useState<
    string
  >("");

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errBnibProduct, bnibProduct] = await goPromise<IBnibProduct>(
      getBnibProductByCode(transactionCode)
    );
    const [errSeller, seller] = await goPromise<IUser>(
      getUserById(bnibProduct.seller_id)
    );
    setLoading(false);

    if (errBnibProduct || errSeller) {
      console.log(errBnibProduct, errSeller);
      setError("Something went wrong!");
    } else {
      setBnibProduct(bnibProduct);
      setSeller(seller);
    }
  }, [transactionCode]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const productBrandEntries = React.useMemo(() => {
    if (!bnibProduct) return [];
    return [
      {
        label: "Id",
        value: bnibProduct.product_detail.product_brand.id || "n/a"
      },
      {
        label: "Full Name",
        value: bnibProduct.product_detail.product_brand.full_name || "n/a"
      },
      {
        label: "Name",
        value: bnibProduct.product_detail.product_brand.name || "n/a"
      },
      {
        label: "Slug",
        value: bnibProduct.product_detail.product_brand.slug || "n/a"
      }
    ];
  }, [bnibProduct]);

  const sellerEntries = React.useMemo(() => {
    if (!seller) return [];
    return [
      { label: "Id", value: seller.id || "n/a" },
      { label: "Username", value: seller.username || "n/a" },
      { label: "Full Name", value: seller.full_name || "n/a" },
      { label: "Email", value: seller.email || "n/a" },
      { label: "Gender", value: seller.gender || "n/a" },
      {
        label: "Birthday",
        value: seller.birthday
          ? moment(seller.birthday).format("D MMMM YYYY")
          : "n/a"
      },
      { label: "Referral Code", value: seller.referral_code || "n/a" },
      { label: "Verified Email", value: seller.verified_email || "n/a" },
      { label: "Country Code", value: seller.country_code || "n/a" },
      { label: "Phone", value: seller.phone || "n/a" },
      { label: "Verified Phone", value: seller.verified_phone || "n/a" },
      {
        label: "Joined at",
        value: seller.last_login_at
          ? moment(seller.created_at).format("D MMMM YYYY")
          : "n/a"
      }
    ];
  }, [seller]);

  const productCategoryEntries = React.useMemo(() => {
    if (!bnibProduct) return [];
    return [
      {
        label: "Id",
        value: bnibProduct.product_detail.product_category.id || "n/a"
      },
      {
        label: "Name",
        value: bnibProduct.product_detail.product_category.name || "n/a"
      },
      {
        label: "Slug",
        value: bnibProduct.product_detail.product_category.slug || "n/a"
      }
    ];
  }, [bnibProduct]);

  const productDetailEntries = React.useMemo(() => {
    if (!bnibProduct) return [];
    return [
      { label: "Id", value: bnibProduct.product_detail.id || "n/a" },
      { label: "Code", value: bnibProduct.product_detail.code || "n/a" },
      { label: "Name", value: bnibProduct.product_detail.name || "n/a" },
      { label: "Color", value: bnibProduct.product_detail.color || "n/a" },
      {
        label: "Description",
        value: bnibProduct.product_detail.description || "n/a"
      },
      { label: "Detail", value: bnibProduct.product_detail.detail || "n/a" },
      { label: "Story", value: bnibProduct.product_detail.story || "n/a" },
      { label: "Gender", value: bnibProduct.product_detail.gender || "n/a" },
      {
        label: "Is Active",
        value: bnibProduct.product_detail.is_active ? "YES" : "NO"
      },
      { label: "Slug", value: bnibProduct.product_detail.slug },
      {
        label: "Release Date",
        value: moment(bnibProduct.product_detail.release_date).format(
          "D MMMM YYYY"
        )
      },
      {
        label: "Retail Price",
        value: bnibProduct.product_detail.retail_price || "n/a"
      },
      { label: "Slug", value: bnibProduct.product_detail.slug },
      { label: "Sold Count", value: bnibProduct.product_detail.sold_count },
      { label: "View Count", value: bnibProduct.product_detail.view_count },
      {
        label: "Display Image",
        value: (
          <div style={{ width: "100%" }}>
            <img
              alt=""
              style={{ width: "100%", cursor: "pointer" }}
              src={bnibProduct.product_detail.display_image_url}
              onClick={() =>
                setDetailDialogImageUrl(
                  bnibProduct.product_detail.display_image_url
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
            {(bnibProduct.product_detail.detail_image_urls || []).map(url => (
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
  }, [bnibProduct, productBrandEntries, productCategoryEntries]);

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
          <title>BNIB Product Detail</title>
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
            ) : bnibProduct ? (
              <>
                <div style={{ width: "100%" }}>
                  <MyExpansion
                    entry={{
                      title: "Seller Info",
                      entries: sellerEntries
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
