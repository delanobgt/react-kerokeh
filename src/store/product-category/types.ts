// enums
export enum EProductCategoryActionTypes {
  PRODUCT_CATEGORY_GET = "@@product-category/PRODUCT_CATEGORY_GET"
}

// entity types
export interface IProductCategory {
  id?: number;
  name: string;
  slug: string;
}

export interface IProductSize {
  id?: number;
  product_category_id: number;
  size: string;
}

export type TProductCategory = IProductCategory & {
  productSizes: IProductSize[];
}

interface IProductCategoryFilter {
  id: string;
  name: string;
  slug: string;
}
export type PProductCategoryFilter = Partial<IProductCategoryFilter>;

interface IProductCategoryPagination {
  limit: number;
  offset: number;
}
export type PProductCategoryPagination = Partial<IProductCategoryPagination>;

export type ProductCategorySortField = "id" | "name" | "slug";

// redux state type
export interface IProductCategoryState {
  productCategories: IProductCategory[];
  realTotal: number;
}

// action types
export interface IProductCategoryGetAction {
  type: EProductCategoryActionTypes.PRODUCT_CATEGORY_GET;
  productCategories: IProductCategory[];
  realTotal: number;
}

export type ProductCategoryActionType = IProductCategoryGetAction;
