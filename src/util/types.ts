import { ReactElement } from "react";

export interface IRenderFieldProps {
  input: any;
  label: string;
  type: string;
  meta: { touched: boolean; error: string };
}

export type RenderFieldFn = (
  renderFieldProps: IRenderFieldProps
) => ReactElement;

export interface JWToken {
  exp: number;
  iat: number;
  id: number;
  username: string;
  role: string;
}