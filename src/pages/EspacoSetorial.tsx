import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Meta, NovaMeta, Setor, SetorMetricas } from '../api/types'
import KpiCard from '../components/KpiCard'
import MetasChart from '../components/MetasChart'
import NovaMetaForm from '../components/NovaMetaForm'
import Chatbot from '../components/Chatbot'
import { formatarData } from '../utils/formato'

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const STATUS_ROTULO: Record<string, string> = {
  nao_iniciada: 'Não iniciada',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  atrasada: 'Atrasada',
}

export default function EspacoSetorial() {
  const { usuario, logout } = useAuth()
  const estrategico = usuario?.role === 'estrategico'

  const [setores, setSetores] = useState<Setor[]>([])
  const [setorId, setSetorId] = useState<string>('') // usado apenas pelo perfil estratégico
  const [metricas, setMetricas] = useState<SetorMetricas | null>(null)
  const [metas, setMetas] = useState<Meta[]>([])

  const [chatAberto, setChatAberto] = useState(false)
  const [gatilhoDlp, setGatilhoDlp] = useState(0)

  // Estratégico escolhe o setor; funcionário usa sempre o próprio.
  useEffect(() => {
    if (!estrategico) return
    api.get('/api/setores').then((r) => {
      setSetores(r.data)
      if (r.data[0]) setSetorId(String(r.data[0].id))
    })
  }, [estrategico])

  const carregar = useCallback(() => {
    if (estrategico && !setorId) return
    const p = estrategico && setorId ? { setor_id: Number(setorId) } : {}
    api.get('/api/setor/metricas', { params: p }).then((r) => setMetricas(r.data))
    api.get('/api/setor/metas', { params: p }).then((r) => setMetas(r.data))
  }, [estrategico, setorId])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function salvarMeta(dados: NovaMeta) {
    const corpo = estrategico && setorId ? { ...dados, setor_id: Number(setorId) } : dados
    await api.post('/api/setor/metas', corpo)
    carregar()
  }

  async function removerMeta(id: number) {
    await api.delete(`/api/setor/metas/${id}`)
    carregar()
  }

  function pedirAjudaDlp() {
    setChatAberto(true)
    setGatilhoDlp((g) => g + 1)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="brand-badge">vddig</span>
          <div>
            <strong>Espaço Setorial{metricas ? ` — ${metricas.setor}` : ''}</strong>
            <div className="topbar-sub">ENSP · Fiocruz — metas e métricas do setor</div>
          </div>
        </div>
        <div className="topbar-right">
          {estrategico && (
            <>
              <Link className="link-nav" to="/dashboard">
                ← Dashboard
              </Link>
              <select value={setorId} onChange={(e) => setSetorId(e.target.value)}>
                {setores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
            </>
          )}
          <div className="usuario">
            <span>{usuario?.nome}</span>
            <button className="link" onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="conteudo">
        {metricas && (
          <div className="resumo-ia">
            <span className="ia-badge">IA · resumo</span>
            {metricas.resumo_gestor}
          </div>
        )}

        <section className="kpis">
          <KpiCard
            titulo="Metas concluídas"
            valor={metricas ? `${metricas.pct_metas_concluidas}%` : '—'}
            sub={metricas ? `${metricas.metas_concluidas}/${metricas.total_metas} metas` : ''}
            tom="verde"
          />
          <KpiCard
            titulo="Recursos LOAS aplicados"
            valor={metricas ? `${metricas.pct_recursos_aplicados}%` : '—'}
            sub={metricas ? `${brl(metricas.valor_aplicado)} de ${brl(metricas.valor_previsto)}` : ''}
            tom="azul"
          />
          <KpiCard
            titulo="Demandas em aberto"
            valor={metricas ? String(metricas.demandas_abertas) : '—'}
            sub={metricas ? `${metricas.demandas_concluidas} concluídas` : ''}
            tom="roxo"
          />
          <KpiCard
            titulo="Metas em risco"
            valor={metricas ? String(metricas.metas_em_risco) : '—'}
            sub="atrasadas ou fora do prazo"
            tom="vermelho"
          />
        </section>

        <section className="setor-grid">
          <div className="card">
            <h2>Nova meta</h2>
            <NovaMetaForm onSalvar={salvarMeta} onPedirAjudaDlp={pedirAjudaDlp} />
          </div>

          <div className="card">
            <h2>Status das metas do setor</h2>
            <MetasChart dados={metricas ? metricas.metas_por_status : []} />
          </div>
        </section>

        <section className="card">
          <h2>Metas do setor ({metas.length})</h2>
          {metas.length === 0 ? (
            <p className="vazio">Nenhuma meta cadastrada ainda. Use o formulário acima. 🙂</p>
          ) : (
            <table className="tabela">
              <thead>
                <tr>
                  <th>Meta</th>
                  <th>Status</th>
                  <th>Progresso</th>
                  <th>Prazo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {metas.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <strong>{m.titulo}</strong>
                      {m.descricao && <div className="meta-desc">{m.descricao}</div>}
                    </td>
                    <td>
                      <span className={`tag tag-${m.status}`}>{STATUS_ROTULO[m.status] ?? m.status}</span>
                    </td>
                    <td>
                      <div className="barra">
                        <div className="barra-fill" style={{ width: `${m.progresso}%` }} />
                      </div>
                      <span className="barra-num">{m.progresso}%</span>
                    </td>
                    <td>{formatarData(m.prazo)}</td>
                    <td>
                      <button className="link-excluir" onClick={() => removerMeta(m.id)} title="Excluir meta">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      <Chatbot aberto={chatAberto} onToggle={() => setChatAberto((o) => !o)} gatilhoDlp={gatilhoDlp} />
    </div>
  )
}
