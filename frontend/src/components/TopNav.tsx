import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  IconDashboard,
  IconSetor,
  IconPrompt,
  IconCuradoria,
  IconBussola,
  IconTerceirizados,
  IconBlueprint,
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

const ITENS: Item[] = [
  { to: '/dashboard', label: 'Dashboard', full: 'Visão Estratégica', Icone: IconDashboard, somenteEstrategico: true },
  { to: '/blueprints', label: 'Blueprints', full: 'Blueprints dos Setores', Icone: IconBlueprint, somenteEstrategico: true },
  { to: '/terceirizados', label: 'Terceirizados', full: 'Diagnóstico de Terceirizados', Icone: IconTerceirizados, somenteEstrategico: true },
  { to: '/setor', label: 'Setor', full: 'Espaço Setorial', Icone: IconSetor },
  { to: '/prompts', label: 'Prompts', full: 'Banco de Prompts', Icone: IconPrompt },
  { to: '/curadoria', label: 'Curadoria', full: 'Curadoria de IAs', Icone: IconCuradoria },
  { to: '/bussola', label: 'Bússola', full: 'Bússola do Saber', Icone: IconBussola },
]

export default function TopNav() {
  const { usuario } = useAuth()
  const { pathname } = useLocation()
  const itens = ITENS.filter(
    (i) => !i.somenteEstrategico || usuario?.role === 'estrategico',
  )

  return (
    <nav className="topnav" aria-label="Navegação principal">
      {itens.map(({ to, label, full, Icone }) => {
        const ativo = pathname === to
        return (
          <Link
            key={to}
            to={to}
            title={full}
            aria-label={full}
            aria-current={ativo ? 'page' : undefined}
            className={`nav-item${ativo ? ' ativo' : ''}`}
          >
            <Icone />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
