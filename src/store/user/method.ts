import { IUser, IShippingAddress } from "./types";
import celestineApi from "src/apis/celestine";

export const getUserById = async (id: number): Promise<IUser> => {
  const response = await celestineApi().get(`/admin/user/${id}`);
  const user = response.data;
  return user;
};

export const getShippingAddressesByUserId = async (user_id: number): Promise<IShippingAddress> => {
  const response = await celestineApi().get(`/admin/shipping-address`, {
    params: {
      user_id
    }
  });
  const shippingAdresses = response.data.data;
  return shippingAdresses;
};

