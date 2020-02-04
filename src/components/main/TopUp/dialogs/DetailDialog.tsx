import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";

import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { MyExpansion } from "src/components/generic/detail-dialog";
import moment from "moment";
import { ITopUp } from "src/store/top-up";
import { IUser, getUserById } from "src/store/user";
import { goPromise } from "src/util/helper";
import { getTopUpById } from "src/store/top-up/methods";

interface IComponentProps {
  topUpId: number;
  dismiss: () => void;
}

function DeleteDialog(props: IComponentProps) {
  const { topUpId, dismiss } = props;

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");

  const [topUp, setTopUp] = React.useState<ITopUp>(null);
  const [user, setUser] = React.useState<IUser>(null);

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errTopUp, topUp] = await goPromise<ITopUp>(getTopUpById(topUpId));
    const [errUser, user] = await goPromise<IUser>(getUserById(topUp.user_id));
    setLoading(false);

    if (errTopUp || errUser) {
      console.log(errTopUp, errUser);
      setError("error");
    } else {
      setUser(user);
      setTopUp(topUp);
    }
  }, [topUpId]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const topUpEntries = React.useMemo(() => {
    if (!topUp) return [];
    return [
      { label: "Id", value: topUp.id || "-" },
      { label: "Amount", value: topUp.amount || "-" },
      { label: "Code", value: topUp.code || "-" },
      { label: "Description", value: topUp.description || "-" },
      { label: "Fraud Status", value: topUp.fraud_status || "-" },
      {
        label: "Created At",
        value: moment(topUp.created_at).format("D MMMM YYYY")
      },
      { label: "Payment Channel", value: topUp.payment_channel || "-" },
      { label: "Payment Code", value: topUp.payment_code || "-" },
      { label: "Payment Status", value: topUp.payment_status || "-" },
      { label: "Payment Type", value: topUp.payment_type || "-" },
      {
        label: "VA Number",
        value: topUp.virtual_account_number || "-"
      }
    ];
  }, [topUp]);

  const userEntries = React.useMemo(() => {
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

  return (
    <div>
      <BasicDialog
        open={Boolean(topUpId)}
        dismiss={dismiss}
        maxWidth="sm"
        fullWidth
        bgClose
      >
        <title>Top Up Detail</title>
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
          ) : (
            <>
              <div style={{ width: "100%" }}>
                <MyExpansion
                  entry={{
                    title: "Top Up Info",
                    entries: topUpEntries
                  }}
                  defaultExpanded
                />
                <MyExpansion
                  entry={{
                    title: "User Info",
                    entries: userEntries
                  }}
                />
              </div>
            </>
          )}

          <div style={{ textAlign: "right" }}>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </section>
      </BasicDialog>
    </div>
  );
}

export default DeleteDialog;
