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
  ResumoSetor,
  Setor,
} from '../api/types'
import KpiCard from '../components/KpiCard'
import MetasChart from '../components/MetasChart'
import RecursosChart from '../components/RecursosChart'
import DemandasChart from '../components/DemandasChart'
import MetasEmRiscoTable from '../components/MetasEmRiscoTable'
import { IconDashboard } from '../components/icons'

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

/* Saúde do setor a partir das metas em risco (dados reais). */
type Saude = 'verde' | 'amarelo' | 'vermelho'
const saudeDe = (r: ResumoSetor): Saude =>
  r.metas_em_risco === 0 ? 'verde' : r.metas_em_risco <= 2 ? 'amarelo' : 'vermelho'
const SAUDE_CLASSE: Record<Saude, string> = {
  verde: 'saude-verde',
  amarelo: 'saude-amarelo',
  vermelho: 'saude-vermelho',
}
const SAUDE_LABEL: Record<Saude, string> = {
  verde: 'No prazo',
  amarelo: 'Atenção',
  vermelho: 'Crítico',
}
const SAUDE_META: { key: Saude; label: string }[] = [
  { key: 'verde', label: 'No prazo' },
  { key: 'amarelo', label: 'Atenção' },
  { key: 'vermelho', label: 'Crítico' },
]

/* ---------- Resumo visual (infográfico) do panorama ---------- */

function InfograficoDashboard({ resumo }: { resumo: ResumoSetor[] }) {
  const total = resumo.length
  const conta = (s: Saude) => resumo.filter((r) => saudeDe(r) === s).length
  const somaMetas = resumo.reduce((a, r) => a + r.total_metas, 0)
  const somaConcl = resumo.reduce((a, r) => a + r.metas_concluidas, 0)
  const pctMetas = somaMetas ? Math.round((somaConcl / somaMetas) * 100) : 0

  return (
    <div className="bp-info">
      <div className="bp-info-tiles">
        <div className="bp-info-tile bp-info-destaque">
          <div className="bp-info-num">{total}</div>
          <div className="bp-info-lbl">Setores</div>
        </div>
        {SAUDE_META.map((s) => (
          <div key={s.key} className="bp-info-tile">
            <div className={`bp-info-num ${SAUDE_CLASSE[s.key]}`}>{conta(s.key)}</div>
            <div className="bp-info-lbl">
              <span className={`bp-info-dot ${SAUDE_CLASSE[s.key]}`} />
              {s.label}
            </div>
          </div>
        ))}
        <div className="bp-info-tile">
          <div className="bp-info-num">{pctMetas}%</div>
          <div className="bp-info-lbl">Metas concluídas</div>
        </div>
      </div>

      <div className="bp-info-distrib">
        <div className="bp-info-barra" role="img" aria-label="Distribuição dos setores por saúde">
          {SAUDE_META.map((s) => {
            const n = conta(s.key)
            if (!n) return null
            return (
              <div
                key={s.key}
                className={`bp-info-seg ${SAUDE_CLASSE[s.key]}`}
                style={{ width: `${(n / total) * 100}%` }}
                title={`${s.label}: ${n}`}
              >
                {n}
              </div>
            )
          })}
        </div>
        <div className="bp-info-legenda">
          {SAUDE_META.map((s) => (
            <span key={s.key} className="bp-info-leg-item">
              <span className={`bp-info-dot ${SAUDE_CLASSE[s.key]}`} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Painel dos setores (cartões clicáveis) ---------- */

function PainelSetoresDashboard({
  resumo,
  onAbrir,
}: {
  resumo: ResumoSetor[]
  onAbrir: (id: number) => void
}) {
  return (
    <div className="bp-painel">
      {resumo.map((r) => {
        const s = saudeDe(r)
        return (
          <button key={r.setor_id} className="bp-setor-card" onClick={() => onAbrir(r.setor_id)}>
            <div className="bp-setor-topo">
              <span className="bp-setor-sigla">{r.sigla}</span>
              <span className={`bp-status ${SAUDE_CLASSE[s]}`}>{SAUDE_LABEL[s]}</span>
            </div>
            <strong className="bp-setor-nome">{r.nome}</strong>
            <div className="bp-setor-stat">
              {Math.round(r.pct_metas_concluidas)}% das metas · {r.metas_em_risco} em risco
            </div>
            <div className="bp-progress" aria-label={`Metas concluídas ${Math.round(r.pct_metas_concluidas)}%`}>
              <div
                className={`bp-progress-fill ${SAUDE_CLASSE[s]}`}
                style={{ width: `${r.pct_metas_concluidas}%` }}
              />
            </div>
            <span className="bp-setor-link">Ver dashboard →</span>
          </button>
        )
      })}
    </div>
  )
}

/* Conteúdo do panorama (sem a barra superior) — reutilizado na página
   /dashboard e como aba "Dashboard" na Sala de Situação da Direção. */
export function DashboardPanorama() {
  const [resumo, setResumo] = useState<ResumoSetor[]>([])
  const [setores, setSetores] = useState<Setor[]>([])
  const [setorId, setSetorId] = useState<string>('')
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [metas, setMetas] = useState<MetasPorSetor[]>([])
  const [recursos, setRecursos] = useState<Recurso[]>([])
  const [timeline, setTimeline] = useState<DemandaTimeline[]>([])
  const [risco, setRisco] = useState<MetaRisco[]>([])
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    api.get('/api/dashboard/resumo-setores').then((r) => setResumo(r.data))
    api.get('/api/setores').then((r) => setSetores(r.data))
  }, [])

  // Detalhe do setor selecionado (drill-down).
  useEffect(() => {
    if (!setorId) return
    setCarregando(true)
    const params = { setor_id: Number(setorId) }
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
    <>
      {!setorId ? (
          <>
            <div className="bp-head">
              <div>
                <h2 className="bp-titulo">
                  <IconDashboard /> Panorama dos setores
                </h2>
                <p className="bp-sub">
                  Saúde e evolução das metas de cada setor. Clique num setor para abrir o dashboard
                  detalhado.
                </p>
              </div>
              <span className="bp-tag">Direção · consolidado</span>
            </div>
            <InfograficoDashboard resumo={resumo} />
            <PainelSetoresDashboard resumo={resumo} onAbrir={(id) => setSetorId(String(id))} />
          </>
        ) : (
          <>
            <button className="bp-voltar" onClick={() => setSetorId('')}>
              ← Todos os setores
            </button>

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
          </>
        )}
    </>
  )
}

/* Página /dashboard — barra superior + panorama. */
export default function Dashboard() {
  const { usuario, logout } = useAuth()
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="marca"><span className="marca-plat">Plataforma</span><span className="marca-adauto">Adauto</span></span>
          <div>
            <strong>Dashboard Estratégico</strong>
            <div className="topbar-sub">ENSP · Fiocruz — Gestão de verbas LOAS</div>
          </div>
        </div>
        <div className="topbar-right">
          <TopNav />
          <div className="usuario">
            <span>{usuario?.nome}</span>
            <button className="link" onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="conteudo">
        <DashboardPanorama />
      </main>
    </div>
  )
}
