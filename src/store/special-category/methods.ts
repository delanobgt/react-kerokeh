import _ from "lodash";
import celestineApi from "src/apis/celestine";
import { ISpecialCategory, PSpecialCategory } from "./types";
import shallowDiff from "shallow-diff";
import { PRIMARY_ROUTE } from "./constants";

export const getSpecialCategoryById = async (id:number|string): Promise<ISpecialCategory> => {
  const response = await celestineApi().get(
    `${PRIMARY_ROUTE}/${id}`
  );
  return response.data;
};

export const createSpecialCategory = async (specialCategory: PSpecialCategory): Promise<ISpecialCategory> => {
  const response = await celestineApi().post(
    PRIMARY_ROUTE,
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
    `${PRIMARY_ROUTE}/${oldSpecialCategory.id}`,
    diffSpecialCategory
  );
  return response.data;
};

export const deleteSpecialCategory = async (id: number): Promise<void> => {
  await celestineApi().delete(`${PRIMARY_ROUTE}/${id}`);
};

