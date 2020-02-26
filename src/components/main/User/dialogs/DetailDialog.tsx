import _ from "lodash";
import React from "react";
import {
  Button,
  Typography,
  CircularProgress,
  Chip,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import {
  IUser,
  getUserById,
  IShippingAddress,
  getShippingAddressesByUserId
} from "src/store/user";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import moment from "moment";
import { goPromise } from "src/util/helper";
import {
  IIdentification,
  getIdentificationByUserId
} from "src/store/identification";
import { statusLabelDict } from "../../Identification/constants";
import { MyExpansion, MyDesc } from "src/components/generic/detail-dialog";
import ShippingAddressesDialog from "./ShippingAddressesDialog";

interface IComponentProps {
  userId: number;
  dismiss: () => void;
}

function DetailDialog(props: IComponentProps) {
  const { userId, dismiss } = props;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [user, setUser] = React.useState<IUser>(null);
  const [referral, setReferral] = React.useState<IUser>(null);
  const [shippingAddresses, setShippingAddresses] = React.useState<
    IShippingAddress[]
  >([]);
  const [activeShippingAddress, setActiveShippingAddress] = React.useState<
    IShippingAddress
  >(null);
  const [
    activeRefundShippingAddress,
    setActiveRefundShippingAddress
  ] = React.useState<IShippingAddress>(null);
  const [identification, setIdentification] = React.useState<IIdentification>(
    null
  );
  const [
    shippingAddressesDialogOpen,
    setShippingAddressesDialogOpen
  ] = React.useState<boolean>(false);

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errUser, user] = await goPromise<IUser>(getUserById(userId));
    const [errReferral, referral] = !user.referrer_id
      ? [null, null]
      : await goPromise<IUser>(getUserById(user.referrer_id));
    const [errShippingAddresses, shippingAddresses] = await goPromise<
      IShippingAddress[]
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
      setShippingAddresses(shippingAddresses);
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

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const generalEntries = React.useMemo(() => {
    if (!user) return [];
    return [
      { label: "Id", value: user.id || "n/a" },
      { label: "Username", value: user.username || "n/a" },
      { label: "Full Name", value: user.full_name || "n/a" },
      { label: "Email", value: user.email || "n/a" },
      { label: "Gender", value: user.gender || "n/a" },
      {
        label: "Birthday",
        value: user.birthday
          ? moment(user.birthday).format("D MMMM YYYY")
          : "n/a"
      },
      { label: "Referral Code", value: user.referral_code || "n/a" },
      { label: "Verified Email", value: user.verified_email || "n/a" },
      {
        label: "Country Code",
        value: user.country_code ? "+" + user.country_code : "n/a"
      },
      {
        label: "Phone",
        value: user.phone ? "+" + user.country_code + user.phone : "n/a"
      },
      {
        label: "Verified Phone",
        value: user.verified_phone
          ? "+" + user.country_code + user.verified_phone
          : "n/a"
      },
      {
        label: "Joined at",
        value: user.last_login_at
          ? moment(user.created_at).format("D MMMM YYYY")
          : "n/a"
      }
    ];
  }, [user]);
  const authEntries = React.useMemo(() => {
    if (!user) return [];
    return [
      { label: "Login Count", value: user.login_count || "n/a" },
      {
        label: "Last Login Device",
        value: user.last_login_device || "n/a"
      },
      { label: "Last Login IP", value: user.last_login_ip || "n/a" },
      {
        label: "Last Login At",
        value: user.last_login_at
          ? moment(user.last_login_at).format("D MMMM YYYY")
          : "n/a"
      },
      {
        label: "Failed Login Count",
        value: user.failed_login_count || "n/a"
      },
      {
        label: "Phone Verification Counter",
        value: user.phone_verification_counter || "n/a"
      },
      { label: "Banned", value: user.banned ? "YES" : "NO" },
      { label: "Froze", value: user.froze ? "YES" : "NO" }
    ];
  }, [user]);
  const bankEntries = React.useMemo(() => {
    if (!user) return [];
    return [
      { label: "Bank Id", value: user.bank.id || "n/a" },
      { label: "Name", value: user.bank.name || "n/a" },
      {
        label: "Number",
        value: user.bank.number || "n/a"
      },
      { label: "Owner", value: user.bank.owner || "n/a" },
      {
        label: "Used For Withdraw",
        value: user.bank.used_for_withdraw ? "YES" : "NO"
      }
    ];
  }, [user]);
  const walletEntries = React.useMemo(() => {
    if (!user) return [];
    return [
      { label: "Wallet Id", value: user.wallet.id || "n/a" },
      {
        label: "Amount",
        value: Number(user.wallet.amount || 0).toLocaleString("de-DE")
      }
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
          : "n/a"
      },
      {
        label: "Store Close End Date",
        value: user.store_close_end_date
          ? moment(user.store_close_end_date).format("D MMMM YYYY")
          : "n/a"
      }
    ];
  }, [user]);

  const referralEntries = React.useMemo(() => {
    if (!referral) return [];
    return [
      { label: "Id", value: referral.id || "n/a" },
      { label: "Username", value: referral.username || "n/a" },
      { label: "Full Name", value: referral.full_name || "n/a" },
      { label: "Email", value: referral.email || "n/a" },
      { label: "Gender", value: referral.gender || "n/a" },
      {
        label: "Joined at",
        value: referral.last_login_at
          ? moment(referral.created_at).format("D MMMM YYYY")
          : "n/a"
      }
    ];
  }, [referral]);

  const activeShippingAddressEntries = React.useMemo(() => {
    if (!activeShippingAddress) return [];
    return [
      { label: "Id", value: activeShippingAddress.id || "n/a" },
      { label: "Name", value: activeShippingAddress.name || "n/a" },
      { label: "Address", value: activeShippingAddress.address || "n/a" },
      { label: "Address", value: activeShippingAddress.address || "n/a" },
      { label: "City", value: activeShippingAddress.city || "n/a" },
      { label: "Country", value: activeShippingAddress.country || "n/a" },
      { label: "Province", value: activeShippingAddress.province || "n/a" },
      { label: "Recipient", value: activeShippingAddress.recipient || "n/a" },
      { label: "Zip Code", value: activeShippingAddress.zip_code || "n/a" },
      {
        label: "Used for Transaction",
        value: activeShippingAddress.used_for_transaction ? "YES" : "NO"
      },
      {
        label: "Additional Info",
        value: activeShippingAddress.additional_info || "n/a"
      }
    ];
  }, [activeShippingAddress]);

  const activeRefundShippingAddressEntries = React.useMemo(() => {
    if (!activeRefundShippingAddress) return [];
    return [
      { label: "Id", value: activeRefundShippingAddress.id || "n/a" },
      { label: "Name", value: activeRefundShippingAddress.name || "n/a" },
      { label: "Address", value: activeRefundShippingAddress.address || "n/a" },
      { label: "Address", value: activeRefundShippingAddress.address || "n/a" },
      { label: "City", value: activeRefundShippingAddress.city || "n/a" },
      { label: "Country", value: activeRefundShippingAddress.country || "n/a" },
      {
        label: "Province",
        value: activeRefundShippingAddress.province || "n/a"
      },
      {
        label: "Recipient",
        value: activeRefundShippingAddress.recipient || "n/a"
      },
      {
        label: "Zip Code",
        value: activeRefundShippingAddress.zip_code || "n/a"
      },
      {
        label: "Used for Transaction",
        value: activeRefundShippingAddress.used_for_transaction ? "YES" : "NO"
      },
      {
        label: "Additional Info",
        value: activeRefundShippingAddress.additional_info || "n/a"
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
      { label: "Id", value: identification.id || "n/a" },
      { label: "Number", value: identification.number || "n/a" },
      { label: "Type", value: identification.type || "n/a" },
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
    <>
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
          ) : user ? (
            <>
              <div>
                <MyExpansion
                  entry={{
                    title: "General Info",
                    entries: generalEntries
                  }}
                  defaultExpanded
                />
                <MyExpansion entry={{ title: "Auth", entries: authEntries }} />
                <MyExpansion entry={{ title: "Bank", entries: bankEntries }} />
                <MyExpansion
                  entry={{ title: "Seller", entries: sellerEntries }}
                />
                <MyExpansion
                  entry={{ title: "Wallet", entries: walletEntries }}
                />
                <MyExpansion
                  entry={{
                    title: "Active Shipping Address",
                    entries: activeShippingAddressEntries
                  }}
                />
                <MyExpansion
                  entry={{
                    title: "Active Refund Shipping Address",
                    entries: activeRefundShippingAddressEntries
                  }}
                />
                <MyExpansion
                  entry={{ title: "Referral", entries: referralEntries }}
                />
                <MyExpansion
                  entry={{
                    title: "Identification",
                    entries: identificationEntries
                  }}
                />
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      <strong>Shipping Addresses</strong>
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setShippingAddressesDialogOpen(true)}
                    >
                      Show
                    </Button>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
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
      <ShippingAddressesDialog
        open={shippingAddressesDialogOpen}
        shippingAddresses={shippingAddresses}
        dismiss={() => setShippingAddressesDialogOpen(false)}
      />
    </>
  );
}

export default DetailDialog;
