import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { verifyToken } from "../lib/auth";
import { AuthErrors } from "../constants/errors";
import { useRouter } from "next/navigation";

const INVALID_LINK_ERROR = 'Invalid password reset link'
const EXPIRED_LINK_ERROR = 'Password reset link has expired'

const useResetPassword = () => {

    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const router = useRouter()

    useLayoutEffect(() => {
        const validateReset = async() => {
        const token = searchParams.get('token')
        if(!token){
            router.push(`/forgot-password?error=${INVALID_LINK_ERROR}`);
            return;
        };

        try {
            const {email} = await verifyToken<{email:string}>(token)
            setEmail(email);
        } catch (error: any) {
            console.error(error.message)
            if(!token){
                router.push('/forgot-password?error=Invalid%20token');
                return;
            };
            if(error.message === AuthErrors.EXPIRED_TOKEN){
                router.push(`/forgot-password?error=${EXPIRED_LINK_ERROR}`);
            }else{
                router.push(`/forgot-password?error=${INVALID_LINK_ERROR}`);
            }
        }
     } 
     validateReset()
    },[])

    return {
        email,
    }
}

export default useResetPassword;

   

    