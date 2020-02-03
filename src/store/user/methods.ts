import { IUser, IShippingAddress } from "./types";
import celestineApi from "src/apis/celestine";
import { PRIMARY_ROUTE, SECONDARY_ROUTE } from "./constants";

export const getUserById = async (id: number): Promise<IUser> => {
  const response = await celestineApi().get(`${PRIMARY_ROUTE}/${id}`);
  const user = response.data;
  return user;
};

export const getShippingAddressById = async (id: number): Promise<IShippingAddress> => {
  const response = await celestineApi().get(`${SECONDARY_ROUTE}/${id}`);
  const shippingAdress = response.data;
  return shippingAdress;
};

export const getShippingAddressesByUserId = async (user_id: number): Promise<IShippingAddress[]> => {
  const response = await celestineApi().get(SECONDARY_ROUTE, {
    params: {
      user_id
    }
  });
  const shippingAdresses = response.data.data;
  return shippingAdresses;
};

