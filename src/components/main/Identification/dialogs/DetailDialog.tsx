import React, { ReactNode } from "react";
import {
  Button,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  CircularProgress,
  Chip
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import moment from "moment";

import { IUser, getUserById } from "src/store/user";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { goPromise } from "src/util/helper";
import {
  IIdentification,
  getIdentificationByUserId
} from "src/store/identification";
import { statusLabelDict } from "../constants";
import AcceptDialog from "./AcceptDialog";
import RejectDialog from "./RejectDialog";
import { MyDesc, MyExpansion } from "src/components/generic/detail-dialog";
import DetailImageDialog from "src/components/generic/dialog/DetailImageDialog";

interface IComponentProps {
  userId: number;
  restartIntervalRun: () => void;
  dismiss: () => void;
}

interface FieldEntry {
  label: string;
  value: string | number | ReactNode;
}

interface ExpansionEntry {
  title: string;
  entries: FieldEntry[];
}

function DetailDialog(props: IComponentProps) {
  const { userId, restartIntervalRun, dismiss } = props;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [user, setUser] = React.useState<IUser>(null);
  const [identification, setIdentification] = React.useState<IIdentification>(
    null
  );
  const [acceptDialogId, setAcceptDialogId] = React.useState<number>(null);
  const [rejectDialogId, setRejectDialogId] = React.useState<number>(null);
  const [detailDialogImageUrl, setDetailDialogImageUrl] = React.useState<
    string
  >("");

  // initial fetch
  const fetch = React.useCallback(async () => {
    if (!userId) return;

    setError("");
    setLoading(true);
    const [errIdentification, identification] = await goPromise<
      IIdentification
    >(getIdentificationByUserId(userId));
    const [errUser, user] = await goPromise<IUser>(
      getUserById(identification.user_id)
    );
    setLoading(false);

    if (errUser || errIdentification) {
      console.log(errUser, errIdentification);
      setError("error");
    } else {
      setIdentification(identification);
      setUser(user);
    }
  }, [userId]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

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
          : "-"
      }
    ];
  }, [user]);

  return (
    <>
      <BasicDialog
        open={Boolean(userId)}
        dismiss={dismiss}
        maxWidth="md"
        fullWidth
        bgClose
      >
        <title>Identification Details</title>
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
                    title: "Identification Info",
                    entries: identificationEntries
                  }}
                  defaultExpanded
                />
                <MyExpansion
                  entry={{
                    title: "User Info",
                    entries: userEntries
                  }}
                />

                {identification.verification_attempted && (
                  <ExpansionPanel>
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
                          onClick={() => setRejectDialogId(identification.id)}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          style={{ marginLeft: "0.5rem" }}
                          onClick={() => setAcceptDialogId(identification.id)}
                        >
                          Accept
                        </Button>
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                )}

                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      <strong>Identification Image</strong>
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <img
                      alt=""
                      style={{ width: "100%", cursor: "pointer" }}
                      src={identification.identification_image_url}
                      onClick={() =>
                        setDetailDialogImageUrl(
                          identification.identification_image_url
                        )
                      }
                    />
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      <strong>Identification With User Image</strong>
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <img
                      alt=""
                      style={{ width: "100%", cursor: "pointer" }}
                      src={identification.identification_with_user_url}
                      onClick={() =>
                        setDetailDialogImageUrl(
                          identification.identification_with_user_url
                        )
                      }
                    />
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
      {Boolean(acceptDialogId) && (
        <AcceptDialog
          fetch={fetch}
          restartIntervalRun={restartIntervalRun}
          identificationId={acceptDialogId}
          dismiss={() => setAcceptDialogId(null)}
        />
      )}
      {Boolean(rejectDialogId) && (
        <RejectDialog
          fetch={fetch}
          restartIntervalRun={restartIntervalRun}
          identificationId={rejectDialogId}
          dismiss={() => setRejectDialogId(null)}
        />
      )}
      {Boolean(detailDialogImageUrl) && (
        <DetailImageDialog
          title="Identification Detail Image"
          imageUrl={detailDialogImageUrl}
          dismiss={() => setDetailDialogImageUrl(null)}
        />
      )}
    </>
  );
}

export default DetailDialog;
