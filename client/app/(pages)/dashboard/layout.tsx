import {SideNav} from '@/app/ui'
import { ChartwiseProvider } from '../../providers/chartwise'
import { SettingsProvider } from '../../providers/settings'
import { auth } from '@/auth'
import { JournalProvider } from '@/app/providers/journal'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const email = session?.user?.email; 

  return (
    <SettingsProvider>
    <ChartwiseProvider email={email}>
    <JournalProvider>

      <div className={``}>
        <SideNav email={email}/>
        <div className="flex flex-col lg:pl-[280px]">{children}</div>
      </div>
      </JournalProvider>  
    </ChartwiseProvider>
    </SettingsProvider> 
  )
}
