import { ReactElement, ReactNode } from "react";
import { WrappedFieldArrayProps } from "redux-form";

// start-redux form render
export interface IRenderFieldProps {
  input: any;
  label: string;
  type: string;
  meta: { touched: boolean; error: boolean | string };
  children: ReactNode;
  value: any;
}
export type RenderFieldFn = (
  renderFieldProps: IRenderFieldProps
) => ReactElement;

export interface IRenderAutoSuggestFieldProps {
  options: {label:any; value:any}[];
  input: any;
  label: string;
  type: string;
  meta: { touched: boolean; error: boolean | string };
  children: ReactNode;
  value: any;
}
export type RenderAutoSuggestFieldFn = (
  renderFieldProps: IRenderAutoSuggestFieldProps
) => ReactElement;

export interface IRenderFieldArrayProps {
  fields: any;
  meta: { touched: boolean; error: boolean | string };
}
export type RenderFieldArrayFn<T> = (
  renderFieldArrayProps: WrappedFieldArrayProps<T>
) => ReactElement;
// end-redux form render

// start-misc
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
// end-misc
