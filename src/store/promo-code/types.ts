// enums
export enum EPromoCodeActionTypes {
  PROMO_CODE_GET = "@@promo-code/PROMO_CODE_GET"
}

// entity types
export interface IPromoCode {
  active_status: boolean | number;
  code: string;
  created_by: string;
  description: string;
  expired_at: string;
  id: number;
  image_url: string;
  limit: number;
  percentage: number;
  product_type: number;
  updated_by: string;
  usage: number;
}
export type PPromoCode = Partial<IPromoCode>;

interface IPromoCodeFilter {
  id: string;
  code: string;
  product_type: string;
  active_status: string;
}
export type PPromoCodeFilter = Partial<IPromoCodeFilter>;

interface IPromoCodePagination {
  limit: number;
  offset: number;
}
export type PPromoCodePagination = Partial<IPromoCodePagination>;

export type PromoCodeSortField =
  | "active_status"
  | "code"
  | "created_by"
  | "description"
  | "expired_at"
  | "id"
  | "limit"
  | "percentage"
  | "product_type"
  | "updated_by"
  | "usage";

// redux state type
export interface IPromoCodeState {
  promoCodes: IPromoCode[];
  realTotal: number;
}

// action types
export interface IPromoCodeGetAction {
  type: EPromoCodeActionTypes.PROMO_CODE_GET;
  promoCodes: IPromoCode[];
  realTotal: number;
}

export type PromoCodeActionType = IPromoCodeGetAction;
