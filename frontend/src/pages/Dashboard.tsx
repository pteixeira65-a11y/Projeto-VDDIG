import { useEffect, useState } from 'react'
import { api } from '../api/client'
import TopNav from '../components/TopNav'
import { useAuth } from '../auth/AuthContext'
import {
  DemandaTimeline,
  Kpis,
  MetaRisco,
  MetasPorSetor,
  Recurso,
  Setor,
} from '../api/types'
import KpiCard from '../components/KpiCard'
import MetasChart from '../components/MetasChart'
import RecursosChart from '../components/RecursosChart'
import DemandasChart from '../components/DemandasChart'
import MetasEmRiscoTable from '../components/MetasEmRiscoTable'

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export default function Dashboard() {
  const { usuario, logout } = useAuth()
  const [setores, setSetores] = useState<Setor[]>([])
  const [setorId, setSetorId] = useState<string>('')
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [metas, setMetas] = useState<MetasPorSetor[]>([])
  const [recursos, setRecursos] = useState<Recurso[]>([])
  const [timeline, setTimeline] = useState<DemandaTimeline[]>([])
  const [risco, setRisco] = useState<MetaRisco[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.get('/api/setores').then((r) => setSetores(r.data))
  }, [])

  useEffect(() => {
    setCarregando(true)
    const params = setorId ? { setor_id: Number(setorId) } : {}
    Promise.all([
      api.get('/api/dashboard/kpis', { params }),
      api.get('/api/dashboard/metas-por-setor', { params }),
      api.get('/api/dashboard/recursos', { params }),
      api.get('/api/dashboard/demandas-timeline', { params }),
      api.get('/api/dashboard/metas-em-risco', { params }),
    ])
      .then(([k, m, r, t, ri]) => {
        setKpis(k.data)
        setMetas(m.data)
        setRecursos(r.data)
        setTimeline(t.data)
        setRisco(ri.data)
      })
      .finally(() => setCarregando(false))
  }, [setorId])

  const setorSelecionado = setorId ? setores.find((s) => String(s.id) === setorId) : undefined

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="brand-badge">vddig</span>
          <div>
            <strong>Dashboard Estratégico</strong>
            <div className="topbar-sub">ENSP · Fiocruz — Gestão de verbas LOAS</div>
          </div>
        </div>
        <div className="topbar-right">
          <TopNav />
          <select value={setorId} onChange={(e) => setSetorId(e.target.value)}>
            <option value="">Todos os setores</option>
            {setores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
          <div className="usuario">
            <span>{usuario?.nome}</span>
            <button className="link" onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="conteudo">
        {setorSelecionado && (setorSelecionado.missao || setorSelecionado.objetivos) && (
          <section className="setor-sobre card">
            <h2>Missão e objetivos — {setorSelecionado.nome}</h2>
            {setorSelecionado.responsavel && (
              <p className="setor-responsavel">Responsável: {setorSelecionado.responsavel}</p>
            )}
            <div className="setor-sobre-grid">
              {setorSelecionado.missao && (
                <div className="setor-sobre-item">
                  <span className="setor-sobre-rotulo">Missão</span>
                  <p>{setorSelecionado.missao}</p>
                </div>
              )}
              {setorSelecionado.objetivos && (
                <div className="setor-sobre-item">
                  <span className="setor-sobre-rotulo">Objetivos</span>
                  <p>{setorSelecionado.objetivos}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {kpis && (
          <div className="resumo-ia">
            <span className="ia-badge">IA · resumo</span>
            {kpis.resumo_gestor}
          </div>
        )}

        <section className="kpis">
          <KpiCard
            titulo="Metas concluídas"
            valor={kpis ? `${kpis.pct_metas_concluidas}%` : '—'}
            sub={kpis ? `${kpis.metas_concluidas}/${kpis.total_metas} metas` : ''}
            tom="verde"
          />
          <KpiCard
            titulo="Recursos LOAS aplicados"
            valor={kpis ? `${kpis.pct_recursos_aplicados}%` : '—'}
            sub={kpis ? `${brl(kpis.valor_aplicado)} de ${brl(kpis.valor_previsto)}` : ''}
            tom="azul"
          />
          <KpiCard
            titulo="Demandas em aberto"
            valor={kpis ? String(kpis.demandas_abertas) : '—'}
            sub={kpis ? `${kpis.demandas_concluidas} concluídas` : ''}
            tom="roxo"
          />
          <KpiCard
            titulo="Metas em risco"
            valor={kpis ? String(kpis.metas_em_risco) : '—'}
            sub="atrasadas ou fora do prazo"
            tom="vermelho"
          />
        </section>

        <section className="grid-graficos">
          <div className="card">
            <h2>Status das metas por setor</h2>
            <MetasChart dados={metas} />
          </div>
          <div className="card">
            <h2>Aplicação de recursos (previsto × aplicado)</h2>
            <RecursosChart dados={recursos} />
          </div>
          <div className="card">
            <h2>Demandas concluídas ao longo do tempo</h2>
            <DemandasChart dados={timeline} />
          </div>
          <div className="card">
            <h2>Metas em risco</h2>
            <MetasEmRiscoTable dados={risco} />
          </div>
        </section>

        {carregando && <div className="loading-fixo">Atualizando…</div>}
      </main>
    </div>
  )
}
