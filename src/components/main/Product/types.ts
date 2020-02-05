import { PProduct } from "src/store/product";

export type TInitialValues = PProduct & {
  product_brand_option?: {
    label: string;
    value: number;
  };
  product_category_option?: {
    label: string;
    value: number;
  };
  initial_detail_images?: { image_path: string; deleted: boolean }[];
  showReleaseDate?: boolean;
};
