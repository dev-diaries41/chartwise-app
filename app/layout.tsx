import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Footer, Header } from './ui'
import { Providers } from './providers'
import { ToastContainer } from 'react-toastify';
import'react-toastify/dist/ReactToastify.css';
import { auth } from '@/auth'

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
  return (
    <html lang="en">
      <Providers> 
      <body className={`${poppins.className}`}>
        <main className='bg-gray-100 dark:bg-gray-900 relative flex flex-col min-h-screen '>
          <Header email ={email!}/>
          {children}
          <ToastContainer />
          <Footer/>
        </main>
      </body>
      </Providers> 
    </html>
  )
}
