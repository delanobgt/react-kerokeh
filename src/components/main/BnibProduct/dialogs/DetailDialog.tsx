import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import {
  IBnibTransaction,
  getBnibTransactionByCode,
  EBnibTransactionStatus
} from "src/store/bnib-transaction";
import moment from "moment";
import { MyExpansion } from "src/components/generic/detail-dialog";
import DetailImageDialog from "src/components/generic/dialog/DetailImageDialog";
import { IUser, getUserById } from "src/store/user";

interface IComponentProps {
  transactionCode: string;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

function DetailDialog(props: IComponentProps) {
  const { transactionCode, dismiss } = props;

  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [transaction, setTransaction] = React.useState<IBnibTransaction>(null);
  const [buyer, setBuyer] = React.useState<IUser>(null);
  const [seller, setSeller] = React.useState<IUser>(null);
  const [detailDialogImageUrl, setDetailDialogImageUrl] = React.useState<
    string
  >("");

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errTransaction, transaction] = await goPromise<IBnibTransaction>(
      getBnibTransactionByCode(transactionCode)
    );
    const [errBuyer, buyer] = await goPromise<IUser>(
      getUserById(transaction.buyer_id)
    );
    const [errSeller, seller] = await goPromise<IUser>(
      getUserById(transaction.seller_id)
    );
    setLoading(false);

    if (errTransaction || errBuyer || errSeller) {
      console.log(errTransaction, errBuyer, errSeller);
      setError("Something went wrong!");
    } else {
      setTransaction(transaction);
      setBuyer(buyer);
      setSeller(seller);
    }
  }, [transactionCode]);

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const generalEntries = React.useMemo(() => {
    if (!transaction) return [];
    return [
      { label: "Id", value: transaction.id },
      { label: "Code", value: transaction.code },
      { label: "Invoice Code", value: transaction.bnib_buy_order_invoice_code },
      { label: "Buyer Username", value: transaction.buyer_username },
      { label: "Seller Username", value: transaction.seller_username },
      {
        label: "Created at",
        value: moment(transaction.created_at).format("D MMMM YYYY")
      },
      {
        label: "Bid Payment Expired At",
        value: transaction.bid_payment_expired_at
          ? moment(transaction.bid_payment_expired_at).format("D MMMM YYYY")
          : "-"
      },
      {
        label: "Buyer Confirmation",
        value: transaction.buyer_confirmation ? "YES" : "NO"
      },
      {
        label: "Buyer Confirmation Expired At",
        value: transaction.bid_payment_expired_at
          ? moment(transaction.bid_payment_expired_at).format("D MMMM YYYY")
          : "-"
      },
      {
        label: "Status",
        value: _.startCase(EBnibTransactionStatus[transaction.status])
      }
    ];
  }, [transaction]);

  const productBrandEntries = React.useMemo(() => {
    if (!transaction) return [];
    return [
      {
        label: "Id",
        value: transaction.product_detail.product_brand.id || "-"
      },
      {
        label: "Full Name",
        value: transaction.product_detail.product_brand.full_name || "-"
      },
      {
        label: "Name",
        value: transaction.product_detail.product_brand.name || "-"
      },
      {
        label: "Slug",
        value: transaction.product_detail.product_brand.slug || "-"
      }
    ];
  }, [transaction]);

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

  const sellerEntries = React.useMemo(() => {
    if (!seller) return [];
    return [
      { label: "Id", value: seller.id || "-" },
      { label: "Username", value: seller.username || "-" },
      { label: "Full Name", value: seller.full_name || "-" },
      { label: "Email", value: seller.email || "-" },
      { label: "Gender", value: seller.gender || "-" },
      {
        label: "Birthday",
        value: seller.birthday
          ? moment(seller.birthday).format("D MMMM YYYY")
          : "-"
      },
      { label: "Referral Code", value: seller.referral_code || "-" },
      { label: "Verified Email", value: seller.verified_email || "-" },
      { label: "Country Code", value: seller.country_code || "-" },
      { label: "Phone", value: seller.phone || "-" },
      { label: "Verified Phone", value: seller.verified_phone || "-" },
      {
        label: "Joined at",
        value: seller.last_login_at
          ? moment(seller.created_at).format("D MMMM YYYY")
          : "-"
      }
    ];
  }, [seller]);

  const productCategoryEntries = React.useMemo(() => {
    if (!transaction) return [];
    return [
      {
        label: "Id",
        value: transaction.product_detail.product_category.id || "-"
      },
      {
        label: "Name",
        value: transaction.product_detail.product_category.name || "-"
      },
      {
        label: "Slug",
        value: transaction.product_detail.product_category.slug || "-"
      }
    ];
  }, [transaction]);

  const productDetailEntries = React.useMemo(() => {
    if (!transaction) return [];
    return [
      { label: "Id", value: transaction.product_detail.id || "-" },
      { label: "Code", value: transaction.product_detail.code || "-" },
      { label: "Name", value: transaction.product_detail.name || "-" },
      { label: "Color", value: transaction.product_detail.color || "-" },
      {
        label: "Description",
        value: transaction.product_detail.description || "-"
      },
      { label: "Detail", value: transaction.product_detail.detail || "-" },
      { label: "Story", value: transaction.product_detail.story || "-" },
      { label: "Gender", value: transaction.product_detail.gender || "-" },
      {
        label: "Is Active",
        value: transaction.product_detail.is_active ? "YES" : "NO"
      },
      { label: "Slug", value: transaction.product_detail.slug },
      {
        label: "Release Date",
        value: moment(transaction.product_detail.release_date).format(
          "D MMMM YYYY"
        )
      },
      {
        label: "Retail Price",
        value: transaction.product_detail.retail_price || "-"
      },
      { label: "Slug", value: transaction.product_detail.slug },
      { label: "Sold Count", value: transaction.product_detail.sold_count },
      { label: "View Count", value: transaction.product_detail.view_count },
      {
        label: "Display Image",
        value: (
          <div style={{ width: "100%" }}>
            <img
              alt=""
              style={{ width: "100%", cursor: "pointer" }}
              src={transaction.product_detail.display_image_url}
              onClick={() =>
                setDetailDialogImageUrl(
                  transaction.product_detail.display_image_url
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
            {(transaction.product_detail.detail_image_urls || []).map(url => (
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
  }, [transaction, productBrandEntries, productCategoryEntries]);

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
          <title>BNIB Transaction Detail</title>
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
            ) : transaction ? (
              <>
                <div style={{ width: "100%" }}>
                  <MyExpansion
                    entry={{
                      title: "Transaction Info",
                      entries: generalEntries
                    }}
                    defaultExpanded
                  />
                  <MyExpansion
                    entry={{
                      title: "Buyer Info",
                      entries: buyerEntries
                    }}
                  />
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
