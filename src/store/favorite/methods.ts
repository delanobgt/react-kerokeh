import kerokehApi from "src/apis/kerokeh";
import { IFavorite } from "./types";
import { PRIMARY_ROUTE } from "./constants";

export const createFavorite = async (
  file: File,
  title: string,
  artist: string
): Promise<IFavorite> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("artist", artist);
  const response = await kerokehApi().post(PRIMARY_ROUTE, formData);
  return response.data;
};

export const updateFavorite = async (
  id: number,
  title: string,
  artist: string
): Promise<IFavorite> => {
  const response = await kerokehApi().put(`${PRIMARY_ROUTE}/${id}`, {
    title,
    artist,
  });
  return response.data;
};

export const deleteFavorite = async (favoriteId: number): Promise<void> => {
  const response = await kerokehApi().delete(`${PRIMARY_ROUTE}/${favoriteId}`);
};
