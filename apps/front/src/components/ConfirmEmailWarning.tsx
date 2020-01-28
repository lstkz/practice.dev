import React from 'react';
import { PageWarning } from './PageWarning';
import { useUser } from 'src/hooks/useUser';

export function ConfirmEmailWarning() {
  const user = useUser();
  if (!user || user.isVerified) {
    return null;
  }
  return (
    <PageWarning>Please check your email and confirm your account.</PageWarning>
  );
}
