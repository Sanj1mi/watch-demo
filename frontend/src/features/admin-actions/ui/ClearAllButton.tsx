import { useAdmin } from '@/features/admin-auth'
import { Button, useToast } from '@/shared/ui'
import { adminActionsApi } from '../api/adminActionsApi'

export function ClearAllButton({ onCleared }: { onCleared: () => void }) {
  const { isAdmin } = useAdmin()
  const toast = useToast()

  if (!isAdmin) return null

  const clear = async () => {
    if (!confirm('ВНИМАНИЕ! Это удалит ВСЕ записи из базы данных. Продолжить?')) return
    const res = await adminActionsApi.clearAll()
    if (!res.ok) {
      return toast(res.requiresAuth ? 'Требуется аутентификация администратора' : res.error, 'error')
    }
    toast(res.body.message ?? 'База очищена', 'success')
    onCleared()
  }

  return (
    <Button size="sm" variant="danger" onClick={clear}>
      <i className="fas fa-trash" /> Очистить все
    </Button>
  )
}
