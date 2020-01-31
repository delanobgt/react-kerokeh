import React from "react";
import QRCode from "qrcode.react";
import crypto from "crypto";
import { Button } from "@material-ui/core";
import { ArrowDownward as ArrowDownwardIcon } from "@material-ui/icons";

interface IComponentProps {
  value: string;
  size?: number;
  level?: string;
  includeMargin?: boolean;
  filename?: string;
}

function QRCodeDownload(props: IComponentProps) {
  const { value, filename, ...rest } = props;

  const [id, setId] = React.useState<string>(null);

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
        <Button
          variant="outlined"
          color="primary"
          onClick={downloadQR}
          style={{ marginTop: "0.5rem" }}
        >
          <ArrowDownwardIcon /> Download
        </Button>
      </div>
    )
  );
}

export default QRCodeDownload;
