// enums
export enum EProductBrandActionTypes {
  PRODUCT_BRAND_GET = "@@product-brand/PRODUCT_BRAND_GET"
}

// entity types
export interface IProductBrand {
  foreign_id: number | null;
  foreign_source: string | null;
  full_name: string;
  id: number;
  name: string;
  parent_id: number;
  slug: string;
  is_active: boolean | number;
}
export type PProductBrand = Partial<IProductBrand>;

interface IProductBrandFilter {
  id: string;
  name: string;
  full_name: string;
  slug: string;
  parent_id: string;
}
export type PProductBrandFilter = Partial<IProductBrandFilter>;

interface IProductBrandPagination {
  limit: number;
  offset: number;
}
export type PProductBrandPagination = Partial<IProductBrandPagination>;

export type ProductBrandSortField = "id" | "name" | "full_name" | "slug";

// redux state type
export interface IProductBrandState {
  productBrands: IProductBrand[];
  realTotal: number;
}

// action types
export interface IProductBrandGetAction {
  type: EProductBrandActionTypes.PRODUCT_BRAND_GET;
  productBrands: IProductBrand[];
  realTotal: number;
}

export type ProductBrandActionType = IProductBrandGetAction;
