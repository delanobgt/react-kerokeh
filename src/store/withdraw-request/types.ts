// enums
export enum EWithdrawRequestActionTypes {
  WITHDRAW_REQUEST_GET = "@@withdraw-request/WITHDRAW_REQUEST_GET"
}

// entity types
export interface IWithdrawRequest {
  amount: number;
  approved_by: null | string;
  bank: {
    id: number;
    name: string;
    number: string;
    owner: string;
    used_for_withdraw: number | boolean;
    user_id: number;
  };
  created_at: string;
  id: number;
  paid: boolean | number;
  rejected: boolean | number;
  rejected_reason: null | string;
  rejected_wallet_mutation_id: number;
  status: string;
  user_id: number;
  username: string;
  wallet_mutation_id: number;
  withdraw_proof_image_url: string;
}
export type PWithdrawRequest = Partial<IWithdrawRequest>;

interface IWithdrawRequestFilter {
  id: string;
  user_id: string;
  status: string;
  username: string;
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

export interface IWalletMutation {
  amount: number;
  balance: number;
  created_at: string;
  description: string;
  id: number;
  type: string;
  user_id: number;
  wallet_id: number;
}
export type PWalletMutation = Partial<IWalletMutation>;

interface IWalletMutationFilter {
  user_id: string;
}
export type PWalletMutationFilter = Partial<IWalletMutationFilter>;

interface IWalletMutationPagination {
  limit: number;
  offset: number;
}
export type PWalletMutationPagination = Partial<IWalletMutationPagination>;

export type WalletMutationSortField =
  | "amount"
  | "balance"
  | "created_at"
  | "description"
  | "id"
  | "type";

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
