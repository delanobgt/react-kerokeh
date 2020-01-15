import React from "react";
import {
  Button,
  Typography,
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Chip
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

import { IUser, getUserById } from "src/store/user";
import BasicDialog from "src/components/generic/BasicDialog";
import moment from "moment";
import { goPromise } from "src/util/helper";
import { makeExpansion } from "src/components/generic/detail-dialog";
import {
  IWithdrawRequest,
  getWithdrawRequestById
} from "src/store/withdraw-request";
import ApproveDialog from "./ApproveDialog";
import RejectDialog from "./RejectDialog";
import { statusLabelDict } from "../constants";

interface IComponentProps {
  withdrawRequestId: number;
  restartIntervalRun: () => void;
  dismiss: () => void;
}

function DetailDialog(props: IComponentProps) {
  const { withdrawRequestId, restartIntervalRun, dismiss } = props;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [withdrawRequest, setWithdrawRequest] = React.useState<
    IWithdrawRequest
  >(null);
  const [user, setUser] = React.useState<IUser>(null);

  const [approveDialogId, setApproveDialogId] = React.useState<number>(null);
  const [rejectDialogId, setRejectDialogId] = React.useState<number>(null);

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errWithdrawRequest, withdrawRequest] = await goPromise<
      IWithdrawRequest
    >(getWithdrawRequestById(withdrawRequestId));
    const [errUser, user] = await goPromise<IUser>(
      getUserById(withdrawRequest.user_id)
    );
    setLoading(false);

    if (errUser || errWithdrawRequest) {
      console.log(errUser, errWithdrawRequest);
      setError("error");
    } else {
      setUser(user);
      setWithdrawRequest(withdrawRequest);
    }
  }, [withdrawRequestId]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const handleClose = () => {
    dismiss();
  };

  const withdrawRequestEntries = React.useMemo(() => {
    if (!withdrawRequest) return [];
    const entries = [
      { label: "Id", value: withdrawRequest.id || "-" },
      { label: "Amount", value: withdrawRequest.amount || "-" },
      { label: "Approved by", value: withdrawRequest.approved_by || "-" },
      {
        label: "Created At",
        value: moment(withdrawRequest.created_at).format("D MMMM YYYY")
      },
      {
        label: "Status",
        value: (
          <Chip
            style={{
              background: statusLabelDict[withdrawRequest.status].color
            }}
            label={statusLabelDict[withdrawRequest.status].label}
          />
        )
      }
    ];
    if (withdrawRequest.rejected)
      entries.push({
        label: "Rejected Reason",
        value: (
          <Typography style={{ color: "red" }}>
            {withdrawRequest.rejected_reason}
          </Typography>
        )
      });
    return entries;
  }, [withdrawRequest]);

  const bankEntries = React.useMemo(() => {
    if (!withdrawRequest) return [];
    const entries = [
      { label: "Id", value: withdrawRequest.bank.id || "-" },
      { label: "Name", value: withdrawRequest.bank.name || "-" },
      { label: "Number", value: withdrawRequest.bank.number || "-" },
      { label: "Owner", value: withdrawRequest.bank.owner || "-" },
      {
        label: "Used for Withdraw",
        value: withdrawRequest.bank.used_for_withdraw ? "YES" : "NO"
      }
    ];
    return entries;
  }, [withdrawRequest]);

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
    <>
      <BasicDialog
        open={Boolean(withdrawRequestId)}
        dismiss={dismiss}
        maxWidth="sm"
        fullWidth
        bgClose
      >
        <title>Withdraw Request Details</title>
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
                {makeExpansion(
                  {
                    title: "Withdraw Request Info",
                    entries: withdrawRequestEntries
                  },
                  true
                )}
                {makeExpansion({ title: "Bank Info", entries: bankEntries })}
                {makeExpansion({ title: "User Info", entries: userEntries })}
                {Boolean(withdrawRequest) &&
                  withdrawRequest.status === "pending" && (
                    <ExpansionPanel defaultExpanded>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>
                          <strong>Actions</strong>
                        </Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <div style={{ width: "100%", textAlign: "right" }}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setRejectDialogId(withdrawRequestId)}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            style={{ marginLeft: "0.5rem" }}
                            onClick={() =>
                              setApproveDialogId(withdrawRequestId)
                            }
                          >
                            Approve
                          </Button>
                        </div>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  )}
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
      {Boolean(approveDialogId) && (
        <ApproveDialog
          withdrawRequestId={approveDialogId}
          fetch={fetch}
          restartIntervalRun={restartIntervalRun}
          dismiss={() => setApproveDialogId(null)}
        />
      )}
      {Boolean(rejectDialogId) && (
        <RejectDialog
          withdrawRequestId={rejectDialogId}
          fetch={fetch}
          restartIntervalRun={restartIntervalRun}
          dismiss={() => setRejectDialogId(null)}
        />
      )}
    </>
  );
}

export default DetailDialog;
