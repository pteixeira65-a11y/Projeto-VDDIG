import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { TercDiagnostico } from '../api/types'
import TopNav from '../components/TopNav'
import KpiCard from '../components/KpiCard'

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const brlExato = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function TerceirizadosPainel() {
  const [dados, setDados] = useState<TercDiagnostico | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api
      .get('/api/terceirizados/diagnostico')
      .then((r) => setDados(r.data))
      .finally(() => setCarregando(false))
  }, [])

  const topSetores = useMemo(
    () => (dados ? dados.por_setor.slice(0, 15) : []),
    [dados],
  )

  return (
    <>
      <div className="resumo-ia">
          <span className="ia-badge">Restrito · Direção</span>
          Diagnóstico consolidado dos terceirizados da ENSP por setor — apoio ao planejamento.
          Dados agregados (sem informações pessoais), da fonte {dados?.fonte ?? 'DIRH/Fiocruz'} ·
          referência {dados?.referencia ?? '—'}.
        </div>

        {dados && (
          <>
            <section className="kpis">
              <KpiCard titulo="Terceirizados (ENSP)" valor={String(dados.total)} sub="postos ativos" tom="azul" />
              <KpiCard titulo="Custo mensal" valor={brl(dados.custo_total)} sub="soma dos postos" tom="roxo" />
              <KpiCard titulo="Setores" valor={String(dados.num_setores)} sub="com terceirizados" tom="verde" />
              <KpiCard
                titulo="Empresas / contratos"
                valor={`${dados.num_empresas} / ${dados.num_contratos}`}
                sub="prestadoras"
                tom="vermelho"
              />
            </section>

            <section className="card" style={{ marginBottom: 18 }}>
              <h2>Terceirizados por setor (principais)</h2>
              <ResponsiveContainer width="100%" height={430}>
                <BarChart
                  layout="vertical"
                  data={topSetores}
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e1d8" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#7c8590' }} />
                  <YAxis
                    type="category"
                    dataKey="setor"
                    width={84}
                    tick={{ fontSize: 12, fill: '#7c8590' }}
                  />
                  <Tooltip formatter={(v: number) => [`${v} terceirizados`, 'Total']} />
                  <Bar dataKey="total" name="Terceirizados" fill="#4a6b82" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="card" style={{ marginBottom: 18 }}>
              <h2>Todos os setores ({dados.por_setor.length})</h2>
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Setor</th>
                    <th>Terceirizados</th>
                    <th>Custo mensal</th>
                    <th>% do custo</th>
                    <th>Principais cargos</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.por_setor.map((s) => (
                    <tr key={s.setor}>
                      <td>
                        <strong>{s.setor}</strong>
                      </td>
                      <td>{s.total}</td>
                      <td>{brlExato(s.custo)}</td>
                      <td>
                        <div className="barra">
                          <div
                            className="barra-fill"
                            style={{ width: `${(s.custo / dados.custo_total) * 100}%` }}
                          />
                        </div>
                        <span className="barra-num">
                          {((s.custo / dados.custo_total) * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="terc-cargos">
                        {s.cargos_top.map((c) => `${c.cargo} (${c.n})`).join(' · ') || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="grid-graficos">
              <div className="card">
                <h2>Por empresa prestadora</h2>
                <table className="tabela">
                  <thead>
                    <tr>
                      <th>Empresa</th>
                      <th>Terceirizados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.por_empresa.map((e) => (
                      <tr key={e.empresa}>
                        <td>{e.empresa}</td>
                        <td>{e.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="card">
                <h2>Cargos mais frequentes</h2>
                <table className="tabela">
                  <thead>
                    <tr>
                      <th>Cargo</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.por_cargo.map((c) => (
                      <tr key={c.cargo}>
                        <td>{c.cargo}</td>
                        <td>{c.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {carregando && <div className="loading-fixo">Carregando…</div>}
    </>
  )
}

/* Página /terceirizados — barra superior + painel. */
export default function TerceirizadosDiagnostico() {
  const { usuario, logout } = useAuth()
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="brand-badge">vddig</span>
          <div>
            <strong>Diagnóstico de Terceirizados</strong>
            <div className="topbar-sub">ENSP · Fiocruz — visão da Direção</div>
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
        <TerceirizadosPainel />
      </main>
    </div>
  )
}
