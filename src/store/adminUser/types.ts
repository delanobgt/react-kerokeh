export enum EAdminUserActionTypes {
  USER_GET = "@@adminUser/USER_GET",
  USER_DELETE = "@@adminUser/USER_DELETE"
}

export interface IAdminUser {
  id: number;
  role: {
    id: number;
    name: string;
  };
  username: string;
}

export interface IAdminUserState {
  adminUsers: { [key: string]: IAdminUser };
}

export interface INewAdminUser {
  username: string;
  password: string;
  role_id: number;
}

export interface IUserGetAction {
  type: EAdminUserActionTypes.USER_GET;
  adminUsers: IAdminUser[];
}

export interface IUserDeleteAction {
  type: EAdminUserActionTypes.USER_DELETE;
  adminUserId: number;
}

export type AdminUserActionType = IUserGetAction | IUserDeleteAction;
