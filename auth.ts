// @ts-nocheck

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import db from '@/app/lib/db';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { cookies } from 'next/headers'


async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;

    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {

            // Set the cookie with the UUID4 and email
            const cookieOptions = {
              maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production', // Set to true in production
              sameSite: 'strict',
              path: '/',
            };

            const unsafeCookieOptions = {
              maxAge: 5 * 60 * 1000, // 5 minutes in milliseconds
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production', // Set to true in production
              sameSite: 'strict',
              path: '/',
            };
            
            cookies().set('email', `${email}`, cookieOptions);
            cookies().set('admin', `${'true'}`, unsafeCookieOptions);
            return user;
          }
          if(passwordsMatch) return user;
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});