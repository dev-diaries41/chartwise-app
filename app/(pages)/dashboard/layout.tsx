'use client'
import {SideNav} from '@/app/ui'
import { ChartwiseProvider } from '../../providers/chartwise'
import { SubscriptionProvider } from '../../providers/subscription'
import { SettingsProvider } from '../../providers/settings'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SubscriptionProvider>
    <SettingsProvider>
    <ChartwiseProvider>
      <div className={`bg-gray-900`}>
        <SideNav />
        <div className="flex flex-col bg-gray-900 lg:pl-[200px]">{children}</div>
      </div>
    </ChartwiseProvider>
    </SettingsProvider> 
    </SubscriptionProvider>
  )
}
