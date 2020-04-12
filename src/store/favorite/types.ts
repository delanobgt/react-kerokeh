// enums
export enum EFavoriteActionTypes {
  FAVORITE_GET = "@@favorite/FAVORITE_GET",
  FAVORITE_PLAYING_SET = "@@favorite/FAVORITE_PLAYING_SET",
}

// entity types
export interface ISong {
  id: number;
  title: string;
  genre: string;
  artist: string;
  album: string;
  duration: number;
  accompaniment_path: string;
  vocals_path: string;
  created_at: string;
  updated_at: string;
}
export type PSong = Partial<ISong>;

export interface IFavorite {
  id: number;
  user_id: number;
  song_id: number;
  created_at: string;
  updated_at: string;
  song: ISong;
}
export type PFavorite = Partial<IFavorite>;

// redux state type
export interface IFavoriteState {
  favorites: IFavorite[];
  playingFavorite: IFavorite;
}

// action types
export interface IFavoriteGetAction {
  type: EFavoriteActionTypes.FAVORITE_GET;
  favorites: IFavorite[];
}

export interface IPlayingFavoriteSetAction {
  type: EFavoriteActionTypes.FAVORITE_PLAYING_SET;
  favorite: IFavorite;
}

export type FavoriteActionType = IFavoriteGetAction | IPlayingFavoriteSetAction;
