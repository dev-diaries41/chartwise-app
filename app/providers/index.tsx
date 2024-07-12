"use client";

import { PropsWithChildren } from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export function Providers({
  children,
}: PropsWithChildren ) {
  return (
    <UserProvider>
        {children}
    </UserProvider>
  );
}