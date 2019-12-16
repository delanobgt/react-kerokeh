import { ReactElement, ReactNode } from "react";

// redux form render
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

// misc
export interface JWToken {
  exp: number;
  iat: number;
  id: number;
  username: string;
  role: string;
}

export interface ISort<T> {
  field: T;
  dir: "asc" | "desc";
}
