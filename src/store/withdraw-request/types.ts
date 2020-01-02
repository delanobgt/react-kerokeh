// enums
export enum EWithdrawRequestActionTypes {
  WITHDRAW_REQUEST_GET = "@@withdraw-request/WITHDRAW_REQUEST_GET"
}

// entity types
export interface IWithdrawRequest {
  amount: number;
  approved_by: null | string;
  created_at: string;
  id: number;
  paid: boolean | number;
  rejected: boolean | number;
  rejected_reason: null | string;
  rejected_wallet_mutation_id: number;
  status: string;
  user_id: number;
  wallet_mutation_id: number;
  withdraw_proof_image_url: string;
}
export type PWithdrawRequest = Partial<IWithdrawRequest>;

interface IWithdrawRequestFilter {
  id: string;
  status: string;
}
export type PWithdrawRequestFilter = Partial<IWithdrawRequestFilter>;

interface IWithdrawRequestPagination {
  limit: number;
  offset: number;
}
export type PWithdrawRequestPagination = Partial<IWithdrawRequestPagination>;

export type WithdrawRequestSortField =
  | "amount"
  | "approved_by"
  | "created_at"
  | "id"
  | "paid"
  | "rejected"
  | "rejected_reason"
  | "status";

// redux state type
export interface IWithdrawRequestState {
  withdrawRequests: IWithdrawRequest[];
  realTotal: number;
}

// action types
export interface IWithdrawRequestGetAction {
  type: EWithdrawRequestActionTypes.WITHDRAW_REQUEST_GET;
  withdrawRequests: IWithdrawRequest[];
  realTotal: number;
}

export type WithdrawRequestActionType = IWithdrawRequestGetAction;
