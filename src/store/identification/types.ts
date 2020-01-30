// enums
export enum EIdentificationActionTypes {
  IDENTIFICATION_GET = "@@identification/IDENTIFICATION_GET"
}

// entity types
export interface IIdentification {
  id: number;
  identification_image_url: string;
  identification_with_user_url: string;
  number: string;
  rejected_reason: string | null;
  type: string;
  username: string;
  user_id: number;
  verification_attempted: boolean;
  verification_rejected: boolean;
  verified: boolean;
  verified_by: string | null;
}

interface IIdentificationFilter {
  id: string;
  username: string;
  user_id: string;
  type: string;
  verification_attempted: string;
  verified: string;
}
export type PIdentificationFilter = Partial<IIdentificationFilter>;

interface IIdentificationPagination {
  limit: number;
  offset: number;
}
export type PIdentificationPagination = Partial<IIdentificationPagination>;

export type IdentificationSortField =
  | "id"
  | "number"
  | "rejected_reason"
  | "type"
  | "verification_attempted"
  | "verification_rejected"
  | "verified"
  | "verified_by";

// redux state type
export interface IIdentificationState {
  identifications: IIdentification[];
  realTotal: number;
}

// action types
export interface IIdentificationGetAction {
  type: EIdentificationActionTypes.IDENTIFICATION_GET;
  identifications: IIdentification[];
  realTotal: number;
}

export type UserActionType = IIdentificationGetAction;
