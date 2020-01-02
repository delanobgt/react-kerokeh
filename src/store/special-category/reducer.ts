import { Reducer } from "redux";
import {
  ESpecialCategoryActionTypes,
  ISpecialCategoryState,
  SpecialCategoryActionType
} from "./types";

const initialState: ISpecialCategoryState = {
  specialCategories: [],
  realTotal: 0
};

const reducer: Reducer<ISpecialCategoryState, SpecialCategoryActionType> = (
  state = initialState,
  action: SpecialCategoryActionType
): ISpecialCategoryState => {
  switch (action.type) {
    case ESpecialCategoryActionTypes.SPECIAL_CATEGORY_GET: {
      const { specialCategories } = action;
      return {
        ...state,
        specialCategories,
        realTotal: action.realTotal
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as specialCategoryReducer };
