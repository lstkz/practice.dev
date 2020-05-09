import { S } from 'schema';

export const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%_\+.~#?&//=]{1,256}\.[a-z]{1,10}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?$/;

export const getPasswordSchema = () => S.string().min(5);
export const getUsernameSchema = () =>
  S.string()
    .trim()
    .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
    .min(3)
    .max(38);
