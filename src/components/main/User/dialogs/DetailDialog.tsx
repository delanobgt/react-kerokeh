import _ from "lodash";
import React from "react";
import { Button, Typography, CircularProgress, Chip } from "@material-ui/core";

import {
  IUser,
  getUserById,
  IShippingAddress,
  getShippingAddressesByUserId
} from "src/store/user";
import BasicDialog from "src/components/generic/BasicDialog";
import moment from "moment";
import { goPromise } from "src/util/helper";
import {
  IIdentification,
  getIdentificationByUserId
} from "src/store/identification";
import { statusLabelDict } from "../../Identification/constants";
import { makeExpansion, MyDesc } from "src/components/generic/detail-dialog";

interface IComponentProps {
  userId: number;
  dismiss: () => void;
}

function DetailDialog(props: IComponentProps) {
  const { userId, dismiss } = props;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [user, setUser] = React.useState<IUser | null>(null);
  const [referral, setReferral] = React.useState<IUser | null>(null);
  const [
    activeShippingAddress,
    setActiveShippingAddress
  ] = React.useState<IShippingAddress | null>(null);
  const [
    activeRefundShippingAddress,
    setActiveRefundShippingAddress
  ] = React.useState<IShippingAddress | null>(null);
  const [
    identification,
    setIdentification
  ] = React.useState<IIdentification | null>(null);

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errUser, user] = await goPromise<IUser>(getUserById(userId));
    const [errReferral, referral] = !user.referrer_id
      ? [null, null]
      : await goPromise<IUser>(getUserById(user.referrer_id));
    const [errShippingAddresses, shippingAddresses] = await goPromise<
      IShippingAddress
    >(getShippingAddressesByUserId(user.id));
    const [, identification] = await goPromise<IIdentification>(
      getIdentificationByUserId(user.id)
    );
    setLoading(false);

    if (errUser || errReferral || errShippingAddresses) {
      console.log(errUser, errReferral, errShippingAddresses);
      setError("error");
    } else {
      setUser(user);
      setReferral(referral);
      setIdentification(identification);
      if (user.active_shipping_address_id) {
        setActiveShippingAddress(
          (_.find(
            shippingAddresses,
            sa =>
              ((sa as unknown) as IShippingAddress).id ===
              user.active_shipping_address_id
          ) as unknown) as IShippingAddress
        );
      }
      if (user.active_refund_shipping_address_id) {
        setActiveRefundShippingAddress(
          (_.find(
            shippingAddresses,
            sa =>
              ((sa as unknown) as IShippingAddress).id ===
              user.active_refund_shipping_address_id
          ) as unknown) as IShippingAddress
        );
      }
    }
  }, [userId]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const handleClose = () => {
    dismiss();
  };

  const generalEntries = React.useMemo(() => {
    if (!user) return [];
    return [
      { label: "Id", value: user.id || "-" },
      { label: "Username", value: user.username || "-" },
      { label: "Full Name", value: user.full_name || "-" },
      { label: "Email", value: user.email || "-" },
      { label: "Gender", value: user.gender || "-" },
      {
        label: "Birthday",
        value: user.birthday ? moment(user.birthday).format("D MMMM YYYY") : "-"
      },
      { label: "Referral Code", value: user.referral_code || "-" },
      { label: "Verified Email", value: user.verified_email || "-" },
      { label: "Country Code", value: user.country_code || "-" },
      { label: "Phone", value: user.phone || "-" },
      { label: "Verified Phone", value: user.verified_phone || "-" },
      {
        label: "Joined at",
        value: user.last_login_at
          ? moment(user.created_at).format("D MMMM YYYY")
          : "-"
      }
    ];
  }, [user]);
  const authEntries = React.useMemo(() => {
    if (!user) return [];
    return [
      { label: "Login Count", value: user.login_count || "-" },
      {
        label: "Last Login Device",
        value: user.last_login_device || "-"
      },
      { label: "Last Login IP", value: user.last_login_ip || "-" },
      {
        label: "Last Login At",
        value: user.last_login_at
          ? moment(user.last_login_at).format("D MMMM YYYY")
          : "-"
      },
      {
        label: "Failed Login Count",
        value: user.failed_login_count || "-"
      },
      {
        label: "Phone Verification Counter",
        value: user.phone_verification_counter || "-"
      },
      { label: "Banned", value: user.banned ? "YES" : "NO" },
      { label: "Froze", value: user.froze ? "YES" : "NO" }
    ];
  }, [user]);
  const bankEntries = React.useMemo(() => {
    if (!user) return [];
    return [
      { label: "Bank Id", value: user.bank.id || "-" },
      { label: "Name", value: user.bank.name || "-" },
      {
        label: "Number",
        value: user.bank.number || "-"
      },
      { label: "Owner", value: user.bank.owner || "-" },
      {
        label: "Used For Withdraw",
        value: user.bank.used_for_withdraw ? "YES" : "NO"
      }
    ];
  }, [user]);
  const walletEntries = React.useMemo(() => {
    if (!user) return [];
    return [
      { label: "Wallet Id", value: user.wallet.id || "-" },
      { label: "Amount", value: user.wallet.amount }
    ];
  }, [user]);

  const sellerEntries = React.useMemo(() => {
    if (!user) return [];
    return [
      { label: "Is Seller", value: user.is_seller ? "YES" : "NO" },
      { label: "Store Closed", value: user.store_closed ? "YES" : "NO" },
      {
        label: "Store Close Start Date",
        value: user.store_close_start_date
          ? moment(user.store_close_start_date).format("D MMMM YYYY")
          : "-"
      },
      {
        label: "Store Close End Date",
        value: user.store_close_end_date
          ? moment(user.store_close_end_date).format("D MMMM YYYY")
          : "-"
      }
    ];
  }, [user]);

  const referralEntries = React.useMemo(() => {
    if (!referral) return [];
    return [
      { label: "Id", value: referral.id || "-" },
      { label: "Username", value: referral.username || "-" },
      { label: "Full Name", value: referral.full_name || "-" },
      { label: "Email", value: referral.email || "-" },
      { label: "Gender", value: referral.gender || "-" },
      {
        label: "Joined at",
        value: referral.last_login_at
          ? moment(referral.created_at).format("D MMMM YYYY")
          : "-"
      }
    ];
  }, [referral]);

  const activeShippingAddressEntries = React.useMemo(() => {
    if (!activeShippingAddress) return [];
    return [
      { label: "Id", value: activeShippingAddress.id || "-" },
      { label: "Name", value: activeShippingAddress.name || "-" },
      { label: "Address", value: activeShippingAddress.address || "-" },
      { label: "Address", value: activeShippingAddress.address || "-" },
      { label: "City", value: activeShippingAddress.city || "-" },
      { label: "Country", value: activeShippingAddress.country || "-" },
      { label: "Province", value: activeShippingAddress.province || "-" },
      { label: "Recipient", value: activeShippingAddress.recipient || "-" },
      { label: "Zip Code", value: activeShippingAddress.zip_code || "-" },
      {
        label: "Used for Transaction",
        value: activeShippingAddress.used_for_transaction ? "YES" : "NO"
      },
      {
        label: "Additional Info",
        value: activeShippingAddress.additional_info || "-"
      }
    ];
  }, [activeShippingAddress]);

  const activeRefundShippingAddressEntries = React.useMemo(() => {
    if (!activeRefundShippingAddress) return [];
    return [
      { label: "Id", value: activeRefundShippingAddress.id || "-" },
      { label: "Name", value: activeRefundShippingAddress.name || "-" },
      { label: "Address", value: activeRefundShippingAddress.address || "-" },
      { label: "Address", value: activeRefundShippingAddress.address || "-" },
      { label: "City", value: activeRefundShippingAddress.city || "-" },
      { label: "Country", value: activeRefundShippingAddress.country || "-" },
      { label: "Province", value: activeRefundShippingAddress.province || "-" },
      {
        label: "Recipient",
        value: activeRefundShippingAddress.recipient || "-"
      },
      { label: "Zip Code", value: activeRefundShippingAddress.zip_code || "-" },
      {
        label: "Used for Transaction",
        value: activeRefundShippingAddress.used_for_transaction ? "YES" : "NO"
      },
      {
        label: "Additional Info",
        value: activeRefundShippingAddress.additional_info || "-"
      }
    ];
  }, [activeRefundShippingAddress]);

  const identificationEntries = React.useMemo(() => {
    if (!identification) return [];
    const key =
      Number(identification.verification_attempted) * 2 ** 2 +
      Number(identification.verification_rejected) * 2 ** 1 +
      Number(identification.verified) * 2 ** 0;
    return [
      { label: "Id", value: identification.id || "-" },
      { label: "Number", value: identification.number || "-" },
      { label: "Type", value: identification.type || "-" },
      {
        label: "Status",
        value: (
          <div>
            <Chip
              style={{ background: statusLabelDict[key].color }}
              label={statusLabelDict[key].label}
            />
            {identification.verification_rejected ? (
              <MyDesc
                variant="subtitle2"
                style={{ color: statusLabelDict[key].color }}
              >
                {identification.rejected_reason}
              </MyDesc>
            ) : identification.verified ? (
              <MyDesc
                variant="subtitle2"
                style={{ color: statusLabelDict[key].color }}
              >
                Verified by {identification.verified_by}
              </MyDesc>
            ) : null}
          </div>
        )
      }
    ];
  }, [identification]);

  return (
    <div>
      <BasicDialog
        open={Boolean(userId)}
        dismiss={dismiss}
        maxWidth="sm"
        fullWidth
        bgClose
      >
        <title>User Details</title>
        <section>
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <CircularProgress size={24} /> Loading user...
            </div>
          ) : error ? (
            <Typography variant="subtitle1" color="secondary">
              An error occured, please{" "}
              <span onClick={fetch} style={{ color: "lightblue" }}>
                retry
              </span>
              .
            </Typography>
          ) : user ? (
            <>
              <div>
                {makeExpansion(
                  {
                    title: "General Info",
                    entries: generalEntries
                  },
                  true
                )}
                {makeExpansion({ title: "Auth", entries: authEntries })}
                {makeExpansion({ title: "Bank", entries: bankEntries })}
                {makeExpansion({ title: "Seller", entries: sellerEntries })}
                {makeExpansion({ title: "Wallet", entries: walletEntries })}
                {makeExpansion({
                  title: "Active Shipping Address",
                  entries: activeShippingAddressEntries
                })}
                {makeExpansion({
                  title: "Active Refund Shipping Address",
                  entries: activeRefundShippingAddressEntries
                })}
                {makeExpansion({ title: "Referral", entries: referralEntries })}
                {makeExpansion({
                  title: "Identification",
                  entries: identificationEntries
                })}
              </div>
            </>
          ) : null}
          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <Button onClick={() => handleClose()} color="primary">
              Close
            </Button>
          </div>
        </section>
      </BasicDialog>
    </div>
  );
}

export default DetailDialog;
