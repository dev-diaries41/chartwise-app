import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired();

// Require user to be signed in to view account and trader dashboard
export const config = {
    matcher: ['/trader', '/account']
}