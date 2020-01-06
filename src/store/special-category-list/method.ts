import _ from "lodash";
import celestineApi from "src/apis/celestine";
import { ISpecialCategoryList, PSpecialCategoryList } from "./types";
import shallowDiff from "shallow-diff";

export const createSpecialCategoryList = async (specialCategoryList: PSpecialCategoryList, image : any): Promise<ISpecialCategoryList> => {
  const formData = new FormData();
  formData.append("name", String(specialCategoryList.name));
  formData.append("priority", String(specialCategoryList.priority));
  formData.append("published", String(specialCategoryList.published));
  formData.append("product_brand_id", String(specialCategoryList.product_brand_id));
  formData.append("special_category_id", String(specialCategoryList.special_category_id));
  formData.append("image", image);
  const response = await celestineApi().post(
    `/admin/special-category-list`,
    formData
  );
  return response.data;
};

export const updateSpecialCategoryList = async (
  oldSpecialCategoryList: PSpecialCategoryList,
  newSpecialCategoryList: PSpecialCategoryList,
  image:any
): Promise<ISpecialCategoryList> => {
  const formData = new FormData();
  formData.append("name", String(newSpecialCategoryList.name));
  formData.append("priority", String(newSpecialCategoryList.priority));
  formData.append("published", String(newSpecialCategoryList.published));
  formData.append("product_brand_id", String(newSpecialCategoryList.product_brand_id));
  if (image) formData.append("image", image);
  const response = await celestineApi().patch(
    `/admin/special-category-list/${oldSpecialCategoryList.id}`,
    formData
  );
  return response.data;
};

export const deleteSpecialCategoryList = async (id: number): Promise<void> => {
  await celestineApi().delete(`/admin/special-category-list/${id}`);
};

