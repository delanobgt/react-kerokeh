import _ from "lodash";
import celestineApi from "src/apis/celestine";
import { ISpecialCategory, PSpecialCategory } from "./types";
import shallowDiff from "shallow-diff";

export const createSpecialCategory = async (specialCategory: PSpecialCategory): Promise<ISpecialCategory> => {
  const response = await celestineApi().post(
    `/admin/special-category`,
    specialCategory
  );
  return response.data;
};

export const updateSpecialCategory = async (
  oldSpecialCategory: PSpecialCategory,
  newSpecialCategory: PSpecialCategory
): Promise<ISpecialCategory> => {
  const diffSpecialCategory = _.pick(
    newSpecialCategory,
    shallowDiff(oldSpecialCategory, newSpecialCategory).updated
  );
  const response = await celestineApi().patch(
    `/admin/special-category/${oldSpecialCategory.id}`,
    diffSpecialCategory
  );
  return response.data;
};

export const deleteSpecialCategory = async (id: number): Promise<void> => {
  await celestineApi().delete(`/admin/special-category/${id}`);
};

