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

const poppins = Poppins({ subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  metadataBase: new URL('https://chartwise.vercel.app/'),
  title: 'ChartWise',
  description: 'ChartWise helps traders identify patterns, trends, and more, and provides detailed insights to inform precise trade execution strategies.',
  keywords: ['trade', 'trading', 'charts', 'analysis', 'wealth', 'ai', 'artificial intelligence', 'openai', 'investing', 'forex', 'stocks', 'cryptocurrency'],
  applicationName: 'ChartWise',
  openGraph: {
    type: 'website',
    url: 'https://chartwise.vercel.app/',
    description: 'ChartWise assists traders with techincal analysis by identifying patterns and trends, and offering insights for precise trade strategies',
    siteName: 'ChartWise',
    images: ['/chartwise-homepage.png']
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
