import { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EspacoSetorial from './pages/EspacoSetorial'

export function rotaPadrao(role: string) {
  return role === 'estrategico' ? '/dashboard' : '/setor'
}

function Protegido({ children, roles }: { children: ReactNode; roles?: string[] }) {
  const { usuario, carregando } = useAuth()
  if (carregando) return <div className="centro">Carregando…</div>
  if (!usuario) return <Navigate to="/login" replace />
  if (roles && !roles.includes(usuario.role)) return <Navigate to={rotaPadrao(usuario.role)} replace />
  return <>{children}</>
}

function Home() {
  const { usuario, carregando } = useAuth()
  if (carregando) return <div className="centro">Carregando…</div>
  return <Navigate to={usuario ? rotaPadrao(usuario.role) : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <Protegido roles={['estrategico']}>
            <Dashboard />
          </Protegido>
        }
      />
      <Route
        path="/setor"
        element={
          <Protegido roles={['funcionario', 'estrategico']}>
            <EspacoSetorial />
          </Protegido>
        }
      />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
