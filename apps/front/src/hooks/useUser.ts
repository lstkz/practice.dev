import { getGlobalState } from '../features/global/interface';
import React from 'react';
import { User } from 'shared';

export function useUser() {
  const { user } = getGlobalState.useState();
  const ref = React.useRef(null as User | null);
  if (user) {
    ref.current = user;
  }
  return ref.current!;
}
