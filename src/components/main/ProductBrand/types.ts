import { PProductBrand } from "src/store/product-brand";

export type TInitialValues = PProductBrand & {
  parent?: {
    label: string;
    value: number;
  };
};
