import { PFeaturedProduct } from "src/store/featured-product";

export type TInitialValues = PFeaturedProduct & {
  product_option?: {
    label: string;
    value: number;
  };
  product_category_option?: {
    label: string;
    value: number;
  };
};
