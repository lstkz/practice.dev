import { useAppState } from './contexts/AppContext';
import { PublicUser } from '../types';
import React from 'react';

export function useUser() {
  const { user } = useAppState();
  const ref = React.useRef(null as PublicUser | null);
  if (user) {
    ref.current = user;
  }
  return ref.current!;
}
