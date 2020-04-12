import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { authReducer } from "./auth";
import { favoriteReducer } from "./favorite";
import { userReducer } from "./user";

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const rootReducer = combineReducers({
  auth: authReducer,
  favorie: favoriteReducer,
  user: userReducer,
  form: formReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
