import { ReactElement, ReactNode } from "react";

export interface IRenderFieldProps {
  input: any;
  label: string;
  type: string;
  meta: { touched: boolean; error: boolean | string };
  children: ReactNode;
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