import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../api/client'

export interface Usuario {
  id: number
  nome: string
  email: string
  role: string
  setor_id: number | null
}

interface AuthCtx {
  usuario: Usuario | null
  carregando: boolean
  login: (email: string, senha: string) => Promise<Usuario>
  logout: () => void
}

const Ctx = createContext<AuthCtx>(null as unknown as AuthCtx)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  // Ao abrir o app, tenta reidratar a sessão a partir do token salvo.
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setCarregando(false)
      return
    }
    api
      .get('/api/me')
      .then((r) => setUsuario(r.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setCarregando(false))
  }, [])

  async function login(email: string, senha: string): Promise<Usuario> {
    const r = await api.post('/api/login', { email, senha })
    localStorage.setItem('token', r.data.access_token)
    const me = await api.get('/api/me')
    setUsuario(me.data)
    return me.data
  }

  function logout() {
    localStorage.removeItem('token')
    setUsuario(null)
  }

  return (
    <Ctx.Provider value={{ usuario, carregando, login, logout }}>{children}</Ctx.Provider>
  )
}
