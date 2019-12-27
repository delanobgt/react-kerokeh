import _ from "lodash";
import celestineApi from "src/apis/celestine";
import { IProductCategory, IProductSize } from "./types";
import shallowDiff from "shallow-diff";

export const createProductCategory = async (
  productCategory: IProductCategory
): Promise<IProductCategory> => {
  const response = await celestineApi().post(
    `/admin/product-category`,
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
    `/admin/product-category/${newProductCategory.id}`,
    diffProductCategory
  );
  return response.data;
};

export const getProductSizesByPCId = async (
  productCategoryId: number
): Promise<IProductSize[]> => {
  const response = await celestineApi().get(
    `/admin/product-size?product_category_id=${productCategoryId}`
  );
  const productSizes = response.data.data;
  return productSizes;
};

export const createProductSize = async (
  productSize: IProductSize
): Promise<IProductSize> => {
  const response = await celestineApi().post(
    `/admin/product-size`,
    productSize
  );
  return response.data;
};

export const updateProductSize = async (
  productSize: IProductSize
): Promise<IProductSize> => {
  const response = await celestineApi().patch(
    `/admin/product-size/${productSize.id}`,
    productSize
  );
  return response.data;
};
