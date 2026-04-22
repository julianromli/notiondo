import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { account, session, user, verification } from './db/schema';

const baseURL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';

export const auth = betterAuth({
  baseURL,
  basePath: '/api/auth',
  secret: process.env.BETTER_AUTH_SECRET ?? 'dev-insecure-secret-change-in-production',
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: { user, account, session, verification },
  }),
  emailAndPassword: { enabled: true },
  trustedOrigins: [baseURL, 'http://127.0.0.1:3000'],
});
