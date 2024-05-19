'use server';

import { cookies } from 'next/headers';

export const getCookies = async (name: string) => {
  return cookies().get(name)?.value;
};
