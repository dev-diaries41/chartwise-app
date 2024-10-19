import NextAuth from 'next-auth';
import {User as ChartWiseUser} from '@/app/types'

declare module 'next-auth' {
  interface User  extends Omit<ChartWiseUser, 'salt' | 'hashedPassword'>{
    id?: string; // Optional id if needed for type compatibility (surpress authorize in ./auth.ts)
  }

  interface Session {
    user: User; // Ensure your custom user properties are included in the session
  }
}
