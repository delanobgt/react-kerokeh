import _ from "lodash";
import celestineApi from "src/apis/celestine";
import { IFeaturedProduct, PFeaturedProduct } from "./types";
import shallowDiff from "shallow-diff";
import { PRIMARY_ROUTE } from "./constants";

export const getFeaturedProductById = async (
  id: number
): Promise<IFeaturedProduct> => {
  const response = await celestineApi().get(`${PRIMARY_ROUTE}/${id}`);
  const featuredProduct = response.data.data;
  return featuredProduct;
};

export const createFeaturedProduct = async (
  featuredProduct: PFeaturedProduct
): Promise<IFeaturedProduct> => {
  const response = await celestineApi().post(PRIMARY_ROUTE, featuredProduct);
  return response.data;
};

export const updateFeaturedProduct = async (
  oldFeaturedProduct: PFeaturedProduct,
  newFeaturedProduct: PFeaturedProduct
): Promise<IFeaturedProduct> => {
  const diffProductBrand = _.pick(
    newFeaturedProduct,
    shallowDiff(oldFeaturedProduct, newFeaturedProduct).updated
  );
  const response = await celestineApi().patch(
    `${PRIMARY_ROUTE}/${newFeaturedProduct.id}`,
    diffProductBrand
  );
  return response.data;
};

export const deleteFeaturedProduct = async (id: number) => {
  await celestineApi().delete(`${PRIMARY_ROUTE}/${id}`);
};
