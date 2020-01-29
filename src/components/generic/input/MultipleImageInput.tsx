import React from "react";
import { Button, Typography, IconButton } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import styled from "styled-components";

const MainDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2px solid cornflowerblue;
  border-radius: 5px;
  padding: 0.5rem;
`;

function checkExtension(
  pExt: string,
  extensions: null | undefined | string[]
): boolean {
  if (!extensions) return true;
  for (let ext of extensions) {
    if (pExt.toLowerCase().endsWith("." + ext.toLowerCase())) return true;
  }
  return false;
}

function checkSize(size: number, maxSize: number) {
  if (!maxSize) return true;
  return size <= maxSize;
}

interface IComponentProps1 {
  file: any;
  onClick?: () => void;
}

interface IComponentProps2 {
  label: string;
  files: any[];
  onChange: (files: any[]) => void;
  accept?: string;
  extensions?: string[];
  maxSize?: number;
}

function ImagePiece(props: IComponentProps1) {
  const { file } = props;
  const [objectURL, setObjectURL] = React.useState<string>("");
  React.useEffect(() => {
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setObjectURL(objectURL);
      return () => {
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [file, setObjectURL]);

  return (
    objectURL && (
      <MainDiv style={{ marginBottom: "0.5rem", minWidth: "50%" }}>
        <img src={objectURL} alt="" style={{ height: "40px" }} />
      </MainDiv>
    )
  );
}

export default function(props: IComponentProps2) {
  const { label, files, onChange, accept, extensions, maxSize } = props;

  const inputRef = React.useRef(null);

  const [errors, setErrors] = React.useState<string[]>([]);

  const realOnChange = React.useCallback(
    (event: any) => {
      setErrors([]);
      const newErrors: string[] = [];

      const newFiles = event.target.files;

      if (!newFiles || !newFiles.length) return;

      for (const newFile of newFiles) {
        if (!checkExtension(newFile.name, extensions)) {
          newErrors.push("invalid extension");
          break;
        }
        if (!checkSize(newFile.size, maxSize)) {
          newErrors.push("file size exceeded");
          break;
        }
      }
      setErrors(newErrors);

      if (!newErrors.length) onChange([...files, ...newFiles]);
      inputRef.current.value = "";
    },
    [onChange, extensions, maxSize, files]
  );

  const handleDelete = React.useCallback(
    (index: number) => {
      onChange([...files.slice(0, index), ...files.slice(index + 1)]);
    },
    [files, onChange]
  );

  const onOpenFileClick = React.useCallback(() => {
    if (inputRef && inputRef.current) inputRef.current.click();
  }, [inputRef]);

  return (
    <>
      <input
        ref={inputRef}
        accept={accept || ""}
        style={{ display: "none" }}
        type="file"
        onChange={realOnChange}
        multiple
      />
      <div>
        <Typography variant="body1">
          {label} ({extensions.join(", ")})
        </Typography>
        <div>
          {files.map((file, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <ImagePiece file={file} />
              <IconButton onClick={() => handleDelete(index)}>
                <CloseIcon />
              </IconButton>
            </div>
          ))}
        </div>
        <MainDiv>
          <Button onClick={onOpenFileClick}>Choose Image</Button>
        </MainDiv>
        {Boolean(errors.length) && (
          <Typography variant="subtitle2">{errors.join(", ")}</Typography>
        )}
      </div>
    </>
  );
}
