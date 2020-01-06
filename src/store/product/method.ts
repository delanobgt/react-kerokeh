import _ from "lodash";
import celestineApi from "src/apis/celestine";
import { IProduct, PProduct } from "./types";
import shallowDiff from "shallow-diff";

export const createProduct = async (product: PProduct): Promise<IProduct> => {
  const response = await celestineApi().post(
    `/admin/product-brand`,
    _.pick(product, ["name", "slug", "parent_id"])
  );
  return response.data;
};

export const updateProduct = async (
  oldProductBrand: PProduct,
  newProductBrand: PProduct
): Promise<IProduct> => {
  const diffProductBrand = _.pick(
    newProductBrand,
    shallowDiff(oldProductBrand, newProductBrand).updated
  );
  const response = await celestineApi().patch(
    `/admin/product-brand/${newProductBrand.id}`,
    _.pick(diffProductBrand, ["name", "slug", "parent_id"])
  );
  return response.data;
};
