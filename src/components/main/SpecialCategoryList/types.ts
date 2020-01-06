import { PSpecialCategoryList } from "src/store/special-category-list";

export type TInitialValues = PSpecialCategoryList & {
  product_brand_option?: {
    label: string;
    value: number;
  };
};
  