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
import styled from "styled-components";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import moment from "moment";

import { IUser, getUserById } from "src/store/user";
import BasicDialog from "src/components/generic/BasicDialog";
import { goPromise } from "src/util/helper";
import {
  IIdentification,
  getIdentificationByUserId
} from "src/store/identification";
import { statusLabelDict } from "../constants";
import AcceptDialog from "./AcceptDialog";
import RejectDialog from "./RejectDialog";
import { MyDesc } from "src/components/generic/detail-dialog";

const SingleEntry = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;
const Label = styled(Typography)`
  flex-basis: 175px;
`;

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
  const [user, setUser] = React.useState<IUser | null>(null);
  const [
    identification,
    setIdentification
  ] = React.useState<IIdentification | null>(null);
  const [
    acceptDialogIdentificationId,
    setAcceptDialogIdentificationId
  ] = React.useState<number | null>(null);
  const [
    rejectDialogIdentificationId,
    setRejectDialogIdentificationId
  ] = React.useState<number | null>(null);

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

  const handleClose = () => {
    dismiss();
  };

  const makeEntry = (e: FieldEntry) => (
    <SingleEntry key={e.label}>
      <Label>{e.label}</Label>
      {["string", "number"].includes(typeof e.value) ? (
        <Typography>{e.value}</Typography>
      ) : (
        e.value
      )}
    </SingleEntry>
  );

  const makeExpansion = (e: ExpansionEntry, expanded?: boolean) => {
    const props = {
      expanded
    };
    return (
      <ExpansionPanel {...props}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <strong>{e.title}</strong>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {!e.entries.length ? (
            <Typography variant="subtitle1">No data.</Typography>
          ) : (
            <div style={{ width: "100%" }}>
              {e.entries.map(e => makeEntry(e))}
            </div>
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };

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
              <CircularProgress size={24} /> Loading identification...
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
                    title: "Identification Info",
                    entries: identificationEntries
                  },
                  true
                )}
                {makeExpansion({
                  title: "User Info",
                  entries: userEntries
                })}

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
                          onClick={() =>
                            setRejectDialogIdentificationId(identification.id)
                          }
                        >
                          Reject
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          style={{ marginLeft: "0.5rem" }}
                          onClick={() =>
                            setAcceptDialogIdentificationId(identification.id)
                          }
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
                    <div style={{ width: "100%" }}>
                      <TransformWrapper style={{ width: "100%" }}>
                        <TransformComponent>
                          <img
                            alt=""
                            style={{ width: "100%" }}
                            src={identification.identification_image_url}
                          />
                        </TransformComponent>
                      </TransformWrapper>
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      <strong>Identification With User Image</strong>
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div style={{ width: "100%" }}>
                      <TransformWrapper style={{ width: "100%" }}>
                        <TransformComponent>
                          <img
                            alt=""
                            style={{ width: "100%" }}
                            src={identification.identification_with_user_url}
                          />
                        </TransformComponent>
                      </TransformWrapper>
                    </div>
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
      {Boolean(acceptDialogIdentificationId) && (
        <AcceptDialog
          fetch={fetch}
          restartIntervalRun={restartIntervalRun}
          identificationId={acceptDialogIdentificationId}
          dismiss={() => setAcceptDialogIdentificationId(null)}
        />
      )}
      {Boolean(rejectDialogIdentificationId) && (
        <RejectDialog
          fetch={fetch}
          restartIntervalRun={restartIntervalRun}
          identificationId={rejectDialogIdentificationId}
          dismiss={() => setRejectDialogIdentificationId(null)}
        />
      )}
    </>
  );
}

export default DetailDialog;
