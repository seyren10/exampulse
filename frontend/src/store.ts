import {
  combineReducers,
  configureStore,
  createAction,
  type PayloadAction,
} from "@reduxjs/toolkit";
import userReducer from "@/features/auth/slice";

export const resetStore = createAction("reset/store");

const appReducer = combineReducers({
  users: userReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: PayloadAction,
) => {
  if (action.type === "reset/store") {
    state = undefined;
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export const storeHasUser = () => {
  return !!store.getState().users.user;
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
