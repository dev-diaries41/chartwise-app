'use client'
import {SideNav} from '@/app/ui'
import { TradeProvider } from '../providers/trader'
import { SubscriptionProvider } from '../providers/subscription'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SubscriptionProvider>
    <TradeProvider>
      <div className={`bg-gray-900`}>
        <SideNav />
        <div className="flex flex-col bg-gray-900 lg:pl-[200px]">{children}</div>
      </div>
      </TradeProvider>
      </SubscriptionProvider>
  )
}
