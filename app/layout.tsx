import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Footer, Header } from './ui'
import { ToastContainer } from 'react-toastify';
import'react-toastify/dist/ReactToastify.css';
import { auth } from '@/auth'
import { handleGetSubscriptionInfo } from './lib/subscription'
import { SessionProvider } from 'next-auth/react'
import { SubscriptionProvider } from './providers/subscription'
import { CHARTWISE_DESCRIPTION } from './constants/hero';

const poppins = Poppins({ subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  metadataBase: new URL('https://chartwise.vercel.app/'),
  title: 'ChartWise',
  description: CHARTWISE_DESCRIPTION,
  keywords: ['trade', 'trading', 'charts', 'analysis', 'wealth', 'ai', 'artificial intelligence', 'openai', 'investing', 'forex', 'stocks', 'cryptocurrency'],
  applicationName: 'ChartWise',
  openGraph: {
    type: 'website',
    url: 'https://chartwise.vercel.app/',
    description: CHARTWISE_DESCRIPTION,
    siteName: 'ChartWise',
    images: ['/chartwise-opengraph.png']
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const email = session?.user.email;
  const planInfo = await handleGetSubscriptionInfo(email);

  return (
    <html lang="en">
        <SessionProvider>
        <SubscriptionProvider planInfo={planInfo}>
          <body className={`${poppins.className}`}>
            <main className='bg-gray-100 dark:bg-gray-900 relative flex flex-col min-h-screen '>
              <Header email ={email!}/>
              {children}
              <ToastContainer />
              <Footer/>
            </main>
          </body>
        </SubscriptionProvider>
      </SessionProvider>
    </html>
  )
}
