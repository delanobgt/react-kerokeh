// enums
export enum EAdminUserActionTypes {
  USER_GET = "@@adminUser/USER_GET",
  USER_DELETE = "@@adminUser/USER_DELETE"
}

// entity types
export interface IAdminUser {
  id: number;
  role: {
    id: number;
    name: string;
  };
  username: string;
}

export interface INewAdminUser {
  username: string;
  password: string;
  role_id: number;
}

// redux state type
export interface IAdminUserState {
  adminUsers: { [key: string]: IAdminUser };
}

// action types
export interface IAdminUserGetAction {
  type: EAdminUserActionTypes.USER_GET;
  adminUsers: IAdminUser[];
}

export interface IAdminUserDeleteAction {
  type: EAdminUserActionTypes.USER_DELETE;
  adminUserId: number;
}

export type AdminUserActionType = IAdminUserGetAction | IAdminUserDeleteAction;
