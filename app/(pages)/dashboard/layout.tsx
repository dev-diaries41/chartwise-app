import {SideNav} from '@/app/ui'
import { ChartwiseProvider } from '../../providers/chartwise'
import { SubscriptionProvider } from '../../providers/subscription'
import { SettingsProvider } from '../../providers/settings'
import { auth } from '@/auth'
import { JournalProvider } from '@/app/providers/journal'
import { handleGetSubscriptionInfo } from '@/app/lib/subscription'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const email = session?.user?.email; 
  const planInfo = await handleGetSubscriptionInfo(email);

  return (
    <SubscriptionProvider planInfo={planInfo}>
    <SettingsProvider>
    <JournalProvider>
    <ChartwiseProvider>
      <div className={``}>
        <SideNav email={email}/>
        <div className="flex flex-col lg:pl-[280px]">{children}</div>
      </div>
    </ChartwiseProvider>
    </JournalProvider>  
    </SettingsProvider> 
    </SubscriptionProvider>
  )
}
