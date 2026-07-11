import { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EspacoSetorial from './pages/EspacoSetorial'
import BussolaDoSaber from './pages/BussolaDoSaber'
import CuradoriaIAs from './pages/CuradoriaIAs'
import BancoPrompts from './pages/BancoPrompts'
import TerceirizadosDiagnostico from './pages/TerceirizadosDiagnostico'
import BlueprintsSetores from './pages/BlueprintsSetores'
import ColaboraAI from './pages/ColaboraAI'
import RecuperarSenha from './pages/RecuperarSenha'
import BoasVindas from './components/BoasVindas'
import Chatbot from './components/Chatbot'

export function rotaPadrao(_role: string) {
  // Todos entram pelo espaço de abas: a Direção na Sala de Situação (Colabora AI
  // + Dashboard/Blueprints/Terceirizados em abas); o funcionário no espaço do setor.
  return '/curadoria'
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
  const { usuario } = useAuth()
  return (
    <>
      <BoasVindas />
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/colabora" element={<ColaboraAI />} />
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
      <Route
        path="/bussola"
        element={
          <Protegido>
            <BussolaDoSaber />
          </Protegido>
        }
      />
      <Route
        path="/curadoria"
        element={
          <Protegido>
            <CuradoriaIAs />
          </Protegido>
        }
      />
      <Route
        path="/prompts"
        element={
          <Protegido>
            <BancoPrompts />
          </Protegido>
        }
      />
      <Route
        path="/terceirizados"
        element={
          <Protegido roles={['estrategico']}>
            <TerceirizadosDiagnostico />
          </Protegido>
        }
      />
      <Route
        path="/blueprints"
        element={
          <Protegido roles={['estrategico']}>
            <BlueprintsSetores />
          </Protegido>
        }
      />
      <Route path="*" element={<Home />} />
      </Routes>
      {usuario && <Chatbot />}
    </>
  )
}
