import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Field, Modal, controlClass, useToast } from '@/shared/ui'
import { useAdmin } from '../model/AdminContext'

export function AdminLoginModal({ onClose }: { onClose: () => void }) {
  const { login } = useAdmin()
  const toast = useToast()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError('Введите пароль')
      return
    }
    const res = await login(password)
    if (res.ok) {
      toast('Вы вошли как администратор', 'success')
      onClose()
    } else {
      setError(res.error)
      toast('Ошибка аутентификации', 'error')
    }
  }

  return (
    <Modal title="Административный доступ" icon="fa-key" onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Пароль:" htmlFor="adminPassword">
          <input
            id="adminPassword"
            type="password"
            autoFocus
            placeholder="Введите пароль"
            className={controlClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit">
          <i className="fas fa-sign-in-alt" /> Войти
        </Button>
        {error && <p className="mt-3 text-accent">{error}</p>}
      </form>
    </Modal>
  )
}
