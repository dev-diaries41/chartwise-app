import { BASE_URL } from "@/app/constants/app";
import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      redirect_uri:`${BASE_URL}/api/auth/callback`
    },
    returnTo: BASE_URL
  }),

});