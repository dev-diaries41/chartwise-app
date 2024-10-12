"use client";

import { PropsWithChildren } from "react";
import { SessionProvider } from 'next-auth/react';
import { JournalProvider } from "./journal";


export function Providers({
  children,
}: PropsWithChildren ) {
  return (
    <SessionProvider>
      <JournalProvider>
        {children}
      </JournalProvider>
    </SessionProvider>
    
  );
}