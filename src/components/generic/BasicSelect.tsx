import crypto from "crypto";
import React, { ReactNode } from "react";
import { FormControl, InputLabel, Select } from "@material-ui/core";

interface IComponentProps {
  style?: React.CSSProperties;
  value: string;
  label: string;
  onChange: (value: string) => void;
  children?: ReactNode;
}

function BasicSelect(props: IComponentProps) {
  const [labelId, setLabelId] = React.useState<string | null>(null);

  const init = React.useCallback(async () => {
    const labelId = (await crypto.randomBytes(32)).toString();
    setLabelId(labelId);
  }, [setLabelId]);

  React.useEffect(() => {
    init();
  }, [init]);

  if (!labelId) return null;

  return (
    <FormControl style={props.style || {}}>
      <InputLabel id={labelId}>{props.label}</InputLabel>
      <Select
        labelId={labelId}
        value={props.value}
        onChange={e => props.onChange(String(e.target.value))}
      >
        {props.children || null}
      </Select>
    </FormControl>
  );
}

export default BasicSelect;
