import { PProduct } from "src/store/product";

export type TLegitCheckInitialValues = PProduct & {
  initial_images?: {image_path: string, deleted: boolean}[];
};
