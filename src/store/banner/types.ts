// enums
export enum EBannerActionTypes {
  BANNER_GET = "@@banner/BANNER_GET"
}

// entity types
export interface IBanner {
  action: number;
  action_path: string;
  banner_action: string;
  banner_type: string;
  created_by: string;
  id: number;
  image_url: string;
  is_active: boolean | number;
  title: string;
  type: number;
  expired_at: string;
  updated_by: string;
  view_count: number;
}
export type PBanner = Partial<IBanner>;

interface IBannerFilter {
  id: string;
  type: string;
  is_active: string;
  expired_at_start: string;
  expired_at_end: string;
}
export type PBannerFilter = Partial<IBannerFilter>;

interface IBannerPagination {
  limit: number;
  offset: number;
}
export type PBannerPagination = Partial<IBannerPagination>;

export type BannerSortField =
  | "action_path"
  | "banner_action"
  | "banner_type"
  | "created_by"
  | "id"
  | "is_active"
  | "title"
  | "updated_by"
  | "expired_at"
  | "view_count";

// redux state type
export interface IBannerState {
  banners: IBanner[];
  realTotal: number;
}

// action types
export interface IBannerGetAction {
  type: EBannerActionTypes.BANNER_GET;
  banners: IBanner[];
  realTotal: number;
}

export type BannerActionType = IBannerGetAction;
