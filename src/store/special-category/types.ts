// enums
export enum ESpecialCategoryActionTypes {
  SPECIAL_CATEGORY_GET = "@@special-category/SPECIAL_CATEGORY_GET"
}

// entity types
export interface ISpecialCategory {
  id: number,
  name: string,
  priority: number,
  published: boolean | number
}
export type PSpecialCategory = Partial<ISpecialCategory>;

interface ISpecialCategoryFilter {
  id: string;
  name: string;
  published: string;
}
export type PSpecialCategoryFilter = Partial<ISpecialCategoryFilter>;

interface ISpecialCategoryPagination {
  limit: number;
  offset: number;
}
export type PSpecialCategoryPagination = Partial<ISpecialCategoryPagination>;

export type SpecialCategorySortField = "id" | "published" | "name" | "priority";

// redux state type
export interface ISpecialCategoryState {
  specialCategories: ISpecialCategory[];
  realTotal: number;
}

// action types
export interface ISpecialCategoryGetAction {
  type: ESpecialCategoryActionTypes.SPECIAL_CATEGORY_GET;
  specialCategories: ISpecialCategory[];
  realTotal: number;
}

export type SpecialCategoryActionType = ISpecialCategoryGetAction;
