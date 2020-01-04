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
  accept?: string;
  extensions?: string[];
}
export type RenderFieldFn = (
  renderFieldProps: IRenderFieldProps
) => ReactElement;

export interface IRenderAutoSuggestFieldProps {
  options: { label: any; value: any }[];
  input: any;
  label: string;
  type: string;
  meta: { touched: boolean; error: boolean | string };
  children: ReactNode;
  value: any;
  disabled: boolean;
}
export type RenderAutoSuggestFieldFn = (
  renderFieldProps: IRenderAutoSuggestFieldProps
) => ReactElement;

export interface IRenderAsyncAutoSuggestFieldProps {
  input: any;
  label: string;
  type: string;
  meta: { touched: boolean; error: boolean | string };
  value: any;
  disabled: boolean;
  promiseOptions: (inputValue:string) => Promise<any>;
}
export type RenderAsyncAutoSuggestFieldFn = (
  renderFieldProps: IRenderAsyncAutoSuggestFieldProps
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
