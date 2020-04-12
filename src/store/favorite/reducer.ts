import { Reducer } from "redux";
import {
  EFavoriteActionTypes,
  IFavoriteState,
  FavoriteActionType,
} from "./types";

const initialState: IFavoriteState = {
  favorites: [],
  playingFavorite: null,
};

const reducer: Reducer<IFavoriteState, FavoriteActionType> = (
  state = initialState,
  action: FavoriteActionType
): IFavoriteState => {
  switch (action.type) {
    case EFavoriteActionTypes.FAVORITE_GET: {
      const { favorites } = action;
      return {
        ...state,
        favorites,
      };
    }
    case EFavoriteActionTypes.FAVORITE_PLAYING_SET: {
      const { favorite } = action;
      return {
        ...state,
        playingFavorite: favorite,
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as favoriteReducer };
