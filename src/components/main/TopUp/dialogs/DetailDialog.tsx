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
      { label: "Id", value: topUp.id || "n/a" },
      { label: "Amount", value: topUp.amount || "n/a" },
      { label: "Code", value: topUp.code || "n/a" },
      { label: "Description", value: topUp.description || "n/a" },
      { label: "Fraud Status", value: topUp.fraud_status || "n/a" },
      {
        label: "Created At",
        value: moment(topUp.created_at).format("D MMMM YYYY")
      },
      { label: "Payment Channel", value: topUp.payment_channel || "n/a" },
      { label: "Payment Code", value: topUp.payment_code || "n/a" },
      { label: "Payment Status", value: topUp.payment_status || "n/a" },
      { label: "Payment Type", value: topUp.payment_type || "n/a" },
      {
        label: "VA Number",
        value: topUp.virtual_account_number || "n/a"
      }
    ];
  }, [topUp]);

  const userEntries = React.useMemo(() => {
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
      { label: "Country Code", value: user.country_code || "n/a" },
      { label: "Phone", value: user.phone || "n/a" },
      { label: "Verified Phone", value: user.verified_phone || "n/a" },
      {
        label: "Joined at",
        value: user.last_login_at
          ? moment(user.created_at).format("D MMMM YYYY")
          : "n/a"
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
