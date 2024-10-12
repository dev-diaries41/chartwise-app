// import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

// export default withMiddlewareAuthRequired();

// // Require user to be signed in to view dashboard pages
// export const config = {
//     matcher: ['/dashboard']
// }

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};