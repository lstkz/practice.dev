import React from 'react';
import { PublicUser } from '../../types';

interface State {
  user: PublicUser | null;
  isLoaded: boolean;
}

const AppContext = React.createContext<State>(null);

export const AppDispatchContext = React.createContext<
  React.Dispatch<AppAction>
>(null);

type AppAction =
  | { type: 'user-loaded'; user: PublicUser | null }
  | { type: 'logout' };

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
      return { ...state, user: action.user, isLoaded: true };
    }
    case 'logout': {
      return { ...state, user: null };
    }
  }
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(appReducer, {
    user: null,
    isLoaded: false,
  });
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
