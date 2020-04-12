import {
  IFavorite,
  IFavoriteGetAction,
  IPlayingFavoriteSetAction,
  EFavoriteActionTypes,
} from "./types";
import kerokehApi from "src/apis/kerokeh";
import { PRIMARY_ROUTE } from "./constants";

export const getFavorites = async (): Promise<IFavoriteGetAction> => {
  const response = await kerokehApi().get(`${PRIMARY_ROUTE}`);
  const favorites = response.data;
  return {
    type: EFavoriteActionTypes.FAVORITE_GET,
    favorites,
  };
};

export const setPlayingFavorite = (
  favorite: IFavorite
): IPlayingFavoriteSetAction => {
  return {
    type: EFavoriteActionTypes.FAVORITE_PLAYING_SET,
    favorite,
  };
};
