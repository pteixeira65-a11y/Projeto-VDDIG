import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  IconSetor,
  IconPrompt,
  IconCuradoria,
  IconBussola,
} from './icons'

/* Navegação principal — consistente em todas as telas.
   Rótulos curtos + ícone; `title`/`aria-label` trazem o nome completo. */

type Item = {
  to: string
  label: string
  full: string
  Icone: (p: { className?: string }) => JSX.Element
  somenteEstrategico?: boolean
}

// Dashboard, Blueprints e Terceirizados viram abas na Sala de Situação da Direção
// (e no espaço do setor), por isso saíram do menu do topo.
const ITENS: Item[] = [
  { to: '/setor', label: 'Setor', full: 'Espaço Setorial', Icone: IconSetor },
  { to: '/prompts', label: 'Prompts', full: 'Banco de Prompts', Icone: IconPrompt },
  { to: '/curadoria', label: 'Curadoria', full: 'Curadoria de IAs', Icone: IconCuradoria },
  { to: '/bussola', label: 'Bússola', full: 'Bússola do Saber', Icone: IconBussola },
]

export default function TopNav() {
  const { usuario } = useAuth()
  const { pathname } = useLocation()
  const ehDirecao = usuario?.role === 'estrategico'
  const itens = ITENS.filter(
    (i) => !i.somenteEstrategico || ehDirecao,
  )

  return (
    <nav className="topnav" aria-label="Navegação principal">
      {itens.map(({ to, label, full, Icone }) => {
        const ativo = pathname === to
        // Para a Direção, /curadoria é a Sala de Situação.
        const rotulo = to === '/curadoria' && ehDirecao ? 'Direção' : label
        const completo = to === '/curadoria' && ehDirecao ? 'Sala de Situação · Direção' : full
        return (
          <Link
            key={to}
            to={to}
            title={completo}
            aria-label={completo}
            aria-current={ativo ? 'page' : undefined}
            className={`nav-item${ativo ? ' ativo' : ''}`}
          >
            <Icone />
            <span>{rotulo}</span>
          </Link>
        )
      })}
    </nav>
  )
}
