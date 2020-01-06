import { IProductBrand } from "../product-brand";
import { ISpecialCategory } from "../special-category/types";

// enums
export enum ESpecialCategoryListActionTypes {
  SPECIAL_CATEGORY_LIST_GET = "@@special-category-list/SPECIAL_CATEGORY_LIST_GET"
}

// entity types
export interface ISpecialCategoryList {
  id: number;
  image_path: string;
  name: string;
  priority: number;
  published: boolean | number;
  product_brand_id: number;
  product_brand: IProductBrand;
  special_category_id: number;
  special_category: ISpecialCategory;
}
export type PSpecialCategoryList = Partial<ISpecialCategoryList>;

interface ISpecialCategoryListFilter {
  id: string;
  published: string;
  name: string;
  special_category_id: string;
}
export type PSpecialCategoryListFilter = Partial<ISpecialCategoryListFilter>;

interface ISpecialCategoryListPagination {
  limit: number;
  offset: number;
}
export type PSpecialCategoryListPagination = Partial<ISpecialCategoryListPagination>;

export type SpecialCategoryListSortField = "id" | "published" | "name" | "priority";

// redux state type
export interface ISpecialCategoryListState {
  specialCategoryLists: ISpecialCategoryList[];
  realTotal: number;
}

// action types
export interface ISpecialCategoryListGetAction {
  type: ESpecialCategoryListActionTypes.SPECIAL_CATEGORY_LIST_GET;
  specialCategoryLists: ISpecialCategoryList[];
  realTotal: number;
}

export type SpecialCategoryListActionType = ISpecialCategoryListGetAction;
