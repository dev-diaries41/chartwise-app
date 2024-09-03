import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired();

// Require user to be signed in to view dashboard pages
export const config = {
    matcher: ['/dashboard']
}