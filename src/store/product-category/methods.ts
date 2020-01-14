import _ from "lodash";
import celestineApi from "src/apis/celestine";
import { IProductCategory, IProductSize } from "./types";
import shallowDiff from "shallow-diff";
import { PRIMARY_ROUTE, SECONDARY_ROUTE } from "./constants";

export const createProductCategory = async (
  productCategory: IProductCategory
): Promise<IProductCategory> => {
  const response = await celestineApi().post(
    PRIMARY_ROUTE,
    productCategory
  );
  return response.data;
};

export const updateProductCategory = async (
  oldProductCategory: IProductCategory,
  newProductCategory: IProductCategory
): Promise<IProductCategory> => {
  const diffProductCategory = _.pick(
    newProductCategory,
    shallowDiff(oldProductCategory, newProductCategory).updated
  );
  const response = await celestineApi().patch(
    `${PRIMARY_ROUTE}/${newProductCategory.id}`,
    diffProductCategory
  );
  return response.data;
};

export const getProductSizesByPCId = async (
  productCategoryId: number
): Promise<IProductSize[]> => {
  const response = await celestineApi().get(
    `${SECONDARY_ROUTE}?product_category_id=${productCategoryId}`
  );
  const productSizes = response.data.data;
  return productSizes;
};

export const createProductSize = async (
  productSize: IProductSize
): Promise<IProductSize> => {
  const response = await celestineApi().post(
    SECONDARY_ROUTE,
    productSize
  );
  return response.data;
};

export const updateProductSize = async (
  productSize: IProductSize
): Promise<IProductSize> => {
  const response = await celestineApi().patch(
    `${SECONDARY_ROUTE}/${productSize.id}`,
    productSize
  );
  return response.data;
};
