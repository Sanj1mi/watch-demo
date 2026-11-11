import { useState } from 'react'
import { ToastProvider } from '@/shared/ui'
import { AdminProvider } from '@/features/admin-auth'
import { Header } from '@/widgets/header'
import type { Tab } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { HospitalPage } from '@/pages/hospital'
import { JournalPage } from '@/pages/journal'
import { JpaPage } from '@/pages/jpa'

export default function App() {
  const [tab, setTab] = useState<Tab>('main')

  return (
    <ToastProvider>
      <AdminProvider>
        <div className="mx-auto max-w-[1400px] px-4 pt-4 pb-24 md:px-5 md:pb-8">
          <Header tab={tab} onTabChange={setTab} />
          {/* главная остаётся смонтированной, чтобы не терять фильтры */}
          <div className={tab === 'main' ? '' : 'hidden'}>
            <HospitalPage />
          </div>
          {tab === 'journal' && <JournalPage />}
          {tab === 'jpa' && <JpaPage />}
          <Footer />
        </div>
      </AdminProvider>
    </ToastProvider>
  )
}
