import { ReactElement, ReactNode } from "react";
import { WrappedFieldArrayProps } from "redux-form";
import { IProductSize } from "src/store/product-categories";

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

export interface IRenderFieldArrayProps {
  fields: any;
  meta: { touched: boolean; error: boolean | string };
}
export type RenderFieldArrayFn<T> = (
  renderFieldArrayProps: WrappedFieldArrayProps<T>
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
