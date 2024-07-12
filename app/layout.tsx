import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Footer, Header } from './ui'
import { Providers } from './providers'
import { ToastContainer } from'react-toastify';
import'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3001'),
  title: 'ChartWise',
  description: 'Trasform your trading experience. Get actionable insights, identify key patterns and trends and practical trade execution ideas just by uploading a chart.',
  keywords: ['trade', 'trading', 'charts', 'analysis', 'technical-analysis', 'ai', 'artificial intelligence', 'gpt', 'openai', 'computer vision', 'S&P 500', 'spx', 'btc', 'usd', 'gbp', 'forex', 'cryptocurrency'],
  applicationName: 'ChartWise',
  openGraph: {
    type: 'website',
    url: 'http://localhost:3001',
    description: 'Trasform your trading experience. Get actionable insights, identify key patterns and trends and practical trade execution ideas just by uploading a chart.',
    siteName: 'ChartWise',
    images: ['/chartwise-hp.png']

  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers> 
      <body className={`${inter.className} bg-gray-900`}>
        <main className='relative flex flex-col min-h-screen bg-gray-900 '>
          <Header/>
          {children}
          <ToastContainer />
          <Footer/>
        </main>
      </body>
      </Providers> 
    </html>
  )
}
