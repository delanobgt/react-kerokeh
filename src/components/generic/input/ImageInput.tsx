import React from "react";
import { Button, Typography } from "@material-ui/core";
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

interface IComponentProps {
  label: string;
  value: any;
  onChange: (event: any) => void;
  accept?: string;
  extensions?: string[];
  maxSize?: number;
}

export default function (props: IComponentProps) {
  const { label, value, onChange, accept, extensions, maxSize } = props;

  const inputRef = React.useRef(null);

  const [errors, setErrors] = React.useState<string[]>([]);

  const realOnChange = React.useCallback(
    (event: any) => {
      setErrors([]);
      const newErrors: string[] = [];

      const file = event.target.files[0];
      if (!file) return;

      if (!checkExtension(file.name, extensions)) {
        newErrors.push("invalid extension");
      }
      if (!checkSize(file.size, maxSize)) {
        newErrors.push("file size exceeded");
      }
      setErrors(newErrors);

      if (!newErrors.length) onChange(file);
      inputRef.current.value = "";
    },
    [onChange, extensions, maxSize]
  );

  const onClick = React.useCallback(() => {
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
      />
      <div>
        <Typography variant="body1">
          {label} ({extensions.join(", ")})
        </Typography>
        <MainDiv>
          <Button onClick={onClick}>Choose File</Button>
        </MainDiv>
        {Boolean(errors.length) && (
          <Typography variant="subtitle2">{errors.join(", ")}</Typography>
        )}
      </div>
    </>
  );
}
