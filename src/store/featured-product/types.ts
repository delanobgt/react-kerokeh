import { IProduct } from "../product";
import { IProductCategory } from "../product-category";

// enums
export enum EFeaturedProductActionTypes {
  FEATURED_PRODUCT_GET = "@@featured-product/FEATURED_PRODUCT_GET"
}

// entity types
export interface IFeaturedProduct {
  id: number;
  priority: number;
  product: IProduct;
  product_category: IProductCategory;
  product_category_id: number;
  product_id: number;
  published: number | boolean;
}
export type PFeaturedProduct = Partial<IFeaturedProduct>;

interface IFeaturedProductFilter {
  id: string;
  product_category_id: string;
  published: string;
}
export type PFeaturedProductFilter = Partial<IFeaturedProductFilter>;

interface IFeaturedProductPagination {
  limit: number;
  offset: number;
}
export type PFeaturedProductPagination = Partial<IFeaturedProductPagination>;

export type FeaturedProductSortField = "id" | "priority" | "published";

// redux state type
export interface IFeaturedProductState {
  featuredProducts: IFeaturedProduct[];
  realTotal: number;
}

// action types
export interface IFeaturedProductGetAction {
  type: EFeaturedProductActionTypes.FEATURED_PRODUCT_GET;
  featuredProducts: IFeaturedProduct[];
  realTotal: number;
}

export type FeaturedProductActionType = IFeaturedProductGetAction;
