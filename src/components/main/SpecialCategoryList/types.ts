import { PSpecialCategoryList } from "src/store/special-category-list";

export type TInitialValues = PSpecialCategoryList & {
  product_brand?: {
    label: string;
    value: number;
  };
  special_category?: {
    label: string;
    value: number;
  };
};
  