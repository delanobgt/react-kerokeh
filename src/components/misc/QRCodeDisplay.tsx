import React from "react";
import QRCode from "qrcode.react";
import crypto from "crypto";
import { Button, CircularProgress } from "@material-ui/core";
import {
  ArrowDownward as ArrowDownwardIcon,
  Print as PrintIcon
} from "@material-ui/icons";
import { useSnackbar } from "material-ui-snackbar-provider";
import { goPromise } from "src/util/helper";
import eroshApi from "src/apis/erosh";

interface IComponentProps {
  value: string;
  size?: number;
  level?: string;
  includeMargin?: boolean;
  filename?: string;
}

function QRCodeDisplay(props: IComponentProps) {
  const { value, filename, ...rest } = props;

  const [loading, setLoading] = React.useState<boolean>(false);
  const snackbar = useSnackbar();
  const [id, setId] = React.useState<string>(null);

  const handleAddToPrintQueue = React.useCallback(async () => {
    setLoading(true);
    const [err] = await goPromise(
      eroshApi().post({
        value,
        label: filename
      })
    );
    setLoading(false);
    if (err) {
      snackbar.showMessage("Something went wrong. Please try again later.");
    } else {
      snackbar.showMessage("Print Job added to queue.");
    }
  }, [snackbar, value, filename]);

  const generateId = React.useCallback(async () => {
    const id = (await crypto.randomBytes(16)).toString("hex");
    setId(id);
  }, [setId]);

  React.useEffect(() => {
    generateId();
  }, [generateId]);

  const downloadQR = React.useCallback(() => {
    if (!id) return;
    const canvas: any = document.getElementById(id);
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${filename}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }, [id, filename]);

  return (
    Boolean(id) && (
      <div>
        <QRCode id={id} value={value} {...rest} />
        <br />
        <div style={{ marginTop: "0.5rem" }}>
          <Button variant="outlined" color="primary" onClick={downloadQR}>
            <ArrowDownwardIcon /> Download
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddToPrintQueue}
            style={{ marginLeft: "0.5rem" }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <>
                <PrintIcon /> Add to Print Queue
              </>
            )}
          </Button>
        </div>
      </div>
    )
  );
}

export default QRCodeDisplay;
