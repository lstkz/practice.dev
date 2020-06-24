import React from 'react';
import { PublicUser } from '../types';

interface State {
  user: PublicUser | null;
}

const AppContext = React.createContext<State>({
  user: null,
});

export const AppDispatchContext = React.createContext<
  React.Dispatch<AppAction>
>(null);

type AppAction = { type: 'user-loaded'; user: PublicUser };

function wrapLog<T extends (state: any, action: any) => any>(reducer: T): T {
  return ((state: any, action: any) => {
    const prevState = state;
    const nextState = reducer(state, action);
    console.log(action, { prevState, nextState });
    return nextState;
  }) as T;
}

const appReducer = wrapLog((state: State, action: AppAction) => {
  switch (action.type) {
    case 'user-loaded': {
      return { ...state, user: action.user };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(appReducer, { user: null });
  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export function useAppState() {
  return React.useContext(AppContext);
}
export function useAppDispatch() {
  return React.useContext(AppDispatchContext);
}
