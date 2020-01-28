// enums
export enum EProductRequestActionTypes {
  PRODUCT_REQUEST_GET = "@@top-up/PRODUCT_REQUEST_GET"
}

// entity types
export interface IProductRequest {
  brand: string;
  id: number;
  name: string;
  product_code: string;
  requester_id: number;
  retail_price: number;
  sub_brand: string;
}
export type PProductRequest = Partial<IProductRequest>;

interface IProductRequestFilter {
}
export type PProductRequestFilter = Partial<IProductRequestFilter>;

interface IProductRequestPagination {
  limit: number;
  offset: number;
}
export type PProductRequestPagination = Partial<IProductRequestPagination>;

export type ProductRequestSortField =
  | 'brand'
  | 'id'
  | 'name'
  | 'product_code'
  | 'retail_price'
  | 'sub_brand';

// redux state type
export interface IProductRequestState {
  productRequests: IProductRequest[];
  realTotal: number;
}

// action types
export interface IProductRequestGetAction {
  type: EProductRequestActionTypes.PRODUCT_REQUEST_GET;
  productRequests: IProductRequest[];
  realTotal: number;
}

export type ProductRequestActionType = IProductRequestGetAction;
