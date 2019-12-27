import _ from "lodash";
import celestineApi from "src/apis/celestine";
import { IProductBrand, PProductBrand } from "./types";
import shallowDiff from "shallow-diff";

export const getProductBrandById = async (
  id: number
): Promise<IProductBrand> => {
  const response = await celestineApi().get(`/admin/product-brand/${id}`);
  const productBrand = response.data.data;
  return productBrand;
};

export const createProductBrand = async (
  productBrand: PProductBrand
): Promise<IProductBrand> => {
  const response = await celestineApi().post(
    `/admin/product-brand`,
    _.pick(productBrand, ["name", "slug", "parent_id"])
  );
  return response.data;
};

export const updateProductBrand = async (
  oldProductBrand: PProductBrand,
  newProductBrand: PProductBrand
): Promise<IProductBrand> => {
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
