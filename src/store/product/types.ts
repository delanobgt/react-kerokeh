import { IProductCategory, IProductSize } from "../product-category";
import { IProductBrand } from "../product-brand";

// enums
export enum EProductActionTypes {
  PRODUCT_GET = "@@product/PRODUCT_GET"
}

// entity types
export interface IProduct {
  bnib_highest_bid_price: number;
  bnib_lowest_sell_price: number;
  code: string;
  color: string;
  description: string;
  detail: string;
  detail_image_url: string;
  detail_image_urls: string[];
  display_image_url: string;
  gender: number;
  id: number;
  is_active: number | boolean;
  latest_order_price: number;
  name: string;
  original_display_image_url: string;
  pre_order_highest_bid_price: number;
  pre_order_lowest_sell_price: number;
  product_brand: IProductBrand;
  product_category: IProductCategory;
  product_size: IProductSize;
  release_date: string;
  retail_price: number;
  retail_price_currency: string;
  slug: string;
  sold_count: number;
  story: string;
  view_count: number;
}
export type PProduct = Partial<IProduct>;

interface IProductFilter {
  id: string;
  name: string;
  slug: string;
  code: string;
  gender: string;
  color: string;
  is_active: string;
  release_date_start: string;
  release_date_end: string;
}
export type PProductFilter = Partial<IProductFilter>;

interface IProductPagination {
  limit: number;
  offset: number;
}
export type PProductPagination = Partial<IProductPagination>;

export type ProductSortField =
  | "bnib_highest_bid_price"
  | "bnib_lowest_sell_price"
  | "code"
  | "color"
  | "description"
  | "detail"
  | "gender"
  | "id"
  | "is_active"
  | "name"
  | "pre_order_highest_bid_price"
  | "pre_order_lowest_sell_price"
  | "release_date"
  | "retail_price"
  | "slug"
  | "sold_count"
  | "story"
  | "view_count";

// redux state type
export interface IProductState {
  products: IProduct[];
  realTotal: number;
}

// action types
export interface IProductGetAction {
  type: EProductActionTypes.PRODUCT_GET;
  products: IProduct[];
  realTotal: number;
}

export type ProductActionType = IProductGetAction;
