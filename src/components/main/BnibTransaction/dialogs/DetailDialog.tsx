import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import styled from "styled-components";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import {
  IBnibTransaction,
  getBnibTransactionByCode,
  BnibTransactionStatus,
  getLegitCheckByBnibTransactionId,
  ILegitCheck
} from "src/store/bnib-transaction";
import moment from "moment";
import { MyExpansion } from "src/components/generic/detail-dialog";
import Arrived from "../statuses/Arrived";
import AcceptedRejected from "../statuses/AcceptedRejected";
import { EmpSpan, Div, MyNumber, ContentDiv } from "../components";
import Refund from "../statuses/Refund";
import Defect from "../statuses/Defect";
import WaitingPayment from "../statuses/WaitingPayment";
import WaitingTrackingCode from "../statuses/WaitingTrackingCode";
import WaitingDefect from "../statuses/WaitingDefect";
import LegitCheck from "../statuses/LegitCheck";
import Send from "../statuses/Send";
import DetailImageDialog from "src/components/generic/dialog/DetailImageDialog";
import {
  IUser,
  getUserById,
  getShippingAddressById,
  IShippingAddress
} from "src/store/user";
import LegitCheckModule from "../LegitCheckModule";

interface IComponentProps {
  transactionCode: string;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

const MyPaper = styled(Paper)`
  padding: 1.5rem;
`;

function DetailDialog(props: IComponentProps) {
  const { transactionCode, restartIntervalRun, dismiss } = props;

  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [transaction, setTransaction] = React.useState<IBnibTransaction>(null);
  const [legitCheck, setLegitCheck] = React.useState<ILegitCheck>(null);
  const [buyer, setBuyer] = React.useState<IUser>(null);
  const [seller, setSeller] = React.useState<IUser>(null);
  const [refundShippingAddress, setRefundShippingAddress] = React.useState<
    IShippingAddress
  >(null);
  const buyerShippingAddressComponentRef = React.useRef();
  const refundShippingAddressComponentRef = React.useRef();
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
    const [errLegitCheck, legitCheck] = await goPromise<ILegitCheck>(
      getLegitCheckByBnibTransactionId(transaction.id)
    );
    const [errBuyer, buyer] = await goPromise<IUser>(
      getUserById(transaction.buyer_id)
    );
    const [errSeller, seller] = await goPromise<IUser>(
      getUserById(transaction.seller_id)
    );
    const [errRefundShippingAddress, refundShippingAddress] = await goPromise<
      IShippingAddress
    >(getShippingAddressById(transaction.refund_shipping_address_id));
    setLoading(false);

    if (
      errTransaction ||
      errLegitCheck ||
      errBuyer ||
      errSeller ||
      errRefundShippingAddress
    ) {
      console.log(
        errTransaction,
        errLegitCheck,
        errBuyer,
        errSeller,
        errRefundShippingAddress
      );
      setError("Something went wrong!");
    } else {
      setTransaction(transaction);
      setLegitCheck(legitCheck);
      setBuyer(buyer);
      setSeller(seller);
      setRefundShippingAddress(refundShippingAddress);
    }
  }, [transactionCode]);

  // silent fetch
  const silentFetch = React.useCallback(async () => {
    const [errTransaction, transaction] = await goPromise<IBnibTransaction>(
      getBnibTransactionByCode(transactionCode)
    );
    const [errLegitCheck, legitCheck] = await goPromise<ILegitCheck>(
      getLegitCheckByBnibTransactionId(transaction.id || 0)
    );

    if (errTransaction || errLegitCheck) {
      console.log(errTransaction, errLegitCheck);
      setError("Something went wrong!");
    } else {
      setTransaction(transaction);
      setLegitCheck(legitCheck);
    }
  }, [transactionCode]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const generalEntries = React.useMemo(() => {
    if (!transaction) return [];
    return [
      { label: "Id", value: transaction.id },
      { label: "Code", value: transaction.code },
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
        value: _.startCase(BnibTransactionStatus[transaction.status])
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

  const buyerShippingAddressEntries = React.useMemo(() => {
    if (!transaction) return [];
    return [
      {
        label: "Id",
        value: transaction.shipping_address.id || "-"
      },
      {
        label: "Additional Info",
        value: transaction.shipping_address.additional_info || "-"
      },
      {
        label: "Address",
        value: transaction.shipping_address.address || "-"
      },
      {
        label: "City",
        value: transaction.shipping_address.city || "-"
      },
      {
        label: "Country",
        value: transaction.shipping_address.country || "-"
      },
      {
        label: "Name",
        value: transaction.shipping_address.name || "-"
      },
      {
        label: "Phone",
        value: transaction.shipping_address.phone || "-"
      },
      {
        label: "Province",
        value: transaction.shipping_address.province || "-"
      },
      {
        label: "Recipient",
        value: transaction.shipping_address.recipient || "-"
      },
      {
        label: "Used for Transaction",
        value: transaction.shipping_address.used_for_transaction ? "YES" : "NO"
      },
      {
        label: "Zip Code",
        value: transaction.shipping_address.zip_code || "-"
      }
    ];
  }, [transaction]);

  const refundShippingAddressEntries = React.useMemo(() => {
    if (!refundShippingAddress) return [];
    return [
      {
        label: "Id",
        value: refundShippingAddress.id || "-"
      },
      {
        label: "Additional Info",
        value: refundShippingAddress.additional_info || "-"
      },
      {
        label: "Address",
        value: refundShippingAddress.address || "-"
      },
      {
        label: "City",
        value: refundShippingAddress.city || "-"
      },
      {
        label: "Country",
        value: refundShippingAddress.country || "-"
      },
      {
        label: "Name",
        value: refundShippingAddress.name || "-"
      },
      {
        label: "Phone",
        value: refundShippingAddress.phone || "-"
      },
      {
        label: "Province",
        value: refundShippingAddress.province || "-"
      },
      {
        label: "Recipient",
        value: refundShippingAddress.recipient || "-"
      },
      {
        label: "Used for Transaction",
        value: refundShippingAddress.used_for_transaction ? "YES" : "NO"
      },
      {
        label: "Zip Code",
        value: refundShippingAddress.zip_code || "-"
      }
    ];
  }, [refundShippingAddress]);

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

  const accessLog: any = React.useMemo(
    () =>
      transaction && transaction.access_log
        ? JSON.parse(transaction.access_log)
        : "{}",
    [transaction]
  );

  const timelineComponents = React.useMemo(() => {
    if (!transaction) return null;

    const components = [];
    let counter = 1;

    if (transaction.status === BnibTransactionStatus.BuyerExpired) {
      components.push(
        <Div key={counter}>
          <MyNumber variant="subtitle2">{counter++}</MyNumber>
          <ContentDiv>Payment Expired</ContentDiv>
        </Div>
      );
      return components;
    } else if (
      Boolean(accessLog["waiting-buyer-payment"] || accessLog["buyer-paid"])
    ) {
      components.push(
        <WaitingPayment
          key={counter}
          orderNo={counter++}
          accessLogWaitingItem={accessLog["waiting-buyer-payment"]}
          accessLogPaidItem={accessLog["buyer-paid"]}
          transaction={transaction}
        />
      );
    }

    if (transaction.status === BnibTransactionStatus.SellerCancel) {
      components.push(
        <Div key={counter}>
          <MyNumber variant="subtitle2">{counter++}</MyNumber>
          <ContentDiv>
            Seller Cancelled (
            <EmpSpan>
              {moment(accessLog["seller-cancel"].time).format(
                "D MMMM YYYY - HH:mm:ss"
              )}
            </EmpSpan>
          </ContentDiv>
        </Div>
      );
      return components;
    } else if (transaction.status === BnibTransactionStatus.SellerExpired) {
      components.push(
        <Div key={counter}>
          <MyNumber variant="subtitle2">{counter++}</MyNumber>
          <ContentDiv>Seller Expired</ContentDiv>
        </Div>
      );
      return components;
    } else if (
      Boolean(
        accessLog["waiting-seller-input-track"] ||
          accessLog["seller-input-track"]
      )
    ) {
      components.push(
        <WaitingTrackingCode
          key={counter}
          orderNo={counter++}
          accessLogWaitingItem={accessLog["waiting-seller-input-track"]}
          accessLogInputItem={accessLog["seller-input-track"]}
          transaction={transaction}
        />
      );
    }

    if (
      Boolean(accessLog["disputed"]) ||
      transaction.status === BnibTransactionStatus.DisputedByDepatu
    ) {
      components.push(
        <Div key={counter}>
          <MyNumber variant="subtitle2">{counter++}</MyNumber>
          <ContentDiv>
            Disputed (by{" "}
            <EmpSpan>{accessLog["disputed"].admin_username}</EmpSpan> at{" "}
            <EmpSpan>
              {moment(accessLog["disputed"].time).format(
                "D MMMM YYYY - HH:mm:ss"
              )}
            </EmpSpan>
            )
          </ContentDiv>
        </Div>
      );
      return components;
    } else if (
      Boolean(accessLog["arrived"]) ||
      transaction.status === BnibTransactionStatus.ShippingToDepatu
    ) {
      components.push(
        <Arrived
          key={counter}
          orderNo={counter++}
          accessLogItem={accessLog["arrived"]}
          transaction={transaction}
          onAfterSubmit={() => {
            silentFetch();
            restartIntervalRun();
          }}
        />
      );
    }

    if (
      Boolean(accessLog["accepted"]) ||
      Boolean(accessLog["rejected"]) ||
      transaction.status === BnibTransactionStatus.ArrivedAtDepatu
    ) {
      components.push(
        <AcceptedRejected
          key={counter}
          orderNo={counter++}
          accessLogAcceptedItem={accessLog["accepted"]}
          accessLogRejectedItem={accessLog["rejected"]}
          transaction={transaction}
          onAfterSubmit={() => {
            silentFetch();
            restartIntervalRun();
          }}
        />
      );
    }

    if (
      Boolean(accessLog["defect-true"]) ||
      Boolean(accessLog["defect-false"]) ||
      transaction.status === BnibTransactionStatus.AcceptedByDepatu
    ) {
      components.push(
        <Defect
          key={counter}
          orderNo={counter++}
          accessLogDefectItem={accessLog["defect-true"]}
          accessLogNotDefectItem={accessLog["defect-false"]}
          transaction={transaction}
          onAfterSubmit={() => {
            silentFetch();
            restartIntervalRun();
          }}
        />
      );
    }

    if (
      Boolean(accessLog["defect-true-accept"]) ||
      Boolean(accessLog["defect-true-reject"]) ||
      transaction.status === BnibTransactionStatus.DefectProceedApproval
    ) {
      components.push(
        <WaitingDefect
          key={counter}
          orderNo={counter++}
          accessLogAcceptItem={accessLog["defect-true-accept"]}
          accessLogRejectItem={accessLog["defect-true-reject"]}
          transaction={transaction}
        />
      );
    }

    if (
      Boolean(accessLog["legit-check-fake"]) ||
      Boolean(accessLog["legit-check-indefinable"]) ||
      Boolean(accessLog["legit-check-authentic"]) ||
      transaction.status === BnibTransactionStatus.LegitChecking
    ) {
      components.push(
        <LegitCheck
          key={counter}
          orderNo={counter++}
          legitCheck={legitCheck}
          accessLogFakeItem={accessLog["legit-check-fake"]}
          accessLogIndefineableItem={accessLog["legit-check-indefinable"]}
          accessLogAuthenticItem={accessLog["legit-check-authentic"]}
          transaction={transaction}
          onAfterSubmit={() => {
            silentFetch();
            restartIntervalRun();
          }}
        />
      );
    }

    if (
      Boolean(accessLog["refunded"]) ||
      transaction.status === BnibTransactionStatus.RefundedByDepatu ||
      transaction.status === BnibTransactionStatus.DefectReject ||
      transaction.status === BnibTransactionStatus.LegitCheckFake ||
      transaction.status === BnibTransactionStatus.LegitCheckIndefinable
    ) {
      components.push(
        <Refund
          key={counter}
          orderNo={counter++}
          accessLogItem={accessLog["refunded"]}
          transaction={transaction}
          onAfterSubmit={() => {
            silentFetch();
            restartIntervalRun();
          }}
        />
      );
    }

    if (
      Boolean(accessLog["depatu-send"]) ||
      transaction.status === BnibTransactionStatus.LegitCheckAuthentic
    ) {
      components.push(
        <Send
          key={counter}
          orderNo={counter++}
          accessLogItem={accessLog["depatu-send"]}
          transaction={transaction}
          onAfterSubmit={() => {
            silentFetch();
            restartIntervalRun();
          }}
        />
      );
    }

    return components;
  }, [accessLog, restartIntervalRun, silentFetch, transaction, legitCheck]);

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
                  <div ref={buyerShippingAddressComponentRef}>
                    <MyExpansion
                      entry={{
                        title: "Buyer Shipping Address",
                        entries: buyerShippingAddressEntries
                      }}
                      printable
                    />
                  </div>
                  <div ref={refundShippingAddressComponentRef}>
                    <MyExpansion
                      entry={{
                        title: "Seller Shipping Address",
                        entries: refundShippingAddressEntries
                      }}
                      printable
                    />
                  </div>
                  <br />
                  <MyPaper>
                    <Typography variant="h6">Timeline</Typography>
                    <Typography variant="subtitle1">
                      Current Status:{" "}
                      <EmpSpan>
                        {_.startCase(BnibTransactionStatus[transaction.status])}
                      </EmpSpan>
                    </Typography>
                    <br />

                    {timelineComponents}
                  </MyPaper>
                  <br />
                  {Boolean(legitCheck) && (
                    <LegitCheckModule
                      legitCheck={legitCheck}
                      onAfterSubmit={() => {
                        silentFetch();
                        restartIntervalRun();
                      }}
                    />
                  )}
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
