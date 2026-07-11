import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Termo } from '../api/types'
import TopNav from '../components/TopNav'

const CATEGORIA_ROTULO: Record<string, string> = {
  normativo: 'Normativo',
  gestao: 'Gestão pública',
  ia: 'IA & Tecnologia',
}

// Remove acentos e caixa para uma busca tolerante.
const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function combina(termo: Termo, alvo: string): boolean {
  if (!alvo) return true
  const campos = normalizar(
    `${termo.termo} ${termo.sigla} ${termo.sinonimos} ${termo.definicao}`,
  )
  // casa se todos os pedaços da busca aparecerem em algum campo
  return normalizar(alvo)
    .split(/\s+/)
    .filter(Boolean)
    .every((parte) => campos.includes(parte))
}

export default function BussolaDoSaber() {
  const { usuario, logout } = useAuth()
  const [params, setParams] = useSearchParams()
  const [termos, setTermos] = useState<Termo[]>([])
  const [busca, setBusca] = useState(params.get('termo') ?? '')

  useEffect(() => {
    api.get('/api/bussola/termos').then((r) => setTermos(r.data))
  }, [])

  // Mantém a URL sincronizada (permite links diretos, ex.: vindo do chat).
  useEffect(() => {
    const atual = params.get('termo') ?? ''
    if (busca !== atual) {
      const p = new URLSearchParams(params)
      if (busca) p.set('termo', busca)
      else p.delete('termo')
      setParams(p, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca])

  const resultados = useMemo(
    () => termos.filter((t) => combina(t, busca)),
    [termos, busca],
  )

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="marca"><span className="marca-plat">Plataforma</span><span className="marca-adauto">Adauto</span></span>
          <div>
            <strong>Bússola do Saber</strong>
            <div className="topbar-sub">ENSP · Fiocruz — glossário em linguagem simples</div>
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
        <div className="bussola-intro">
          Não entendeu uma sigla, norma ou termo de IA? Busque abaixo e receba uma
          explicação curta, sem jargão.
        </div>

        <div className="bussola-busca">
          <span className="bussola-busca-icone" aria-hidden="true">
            🧭
          </span>
          <input
            autoFocus
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Ex.: LOAS, o que é RAG, proteção de dados…"
            aria-label="Buscar termo"
          />
          {busca && (
            <button
              className="bussola-limpar"
              onClick={() => setBusca('')}
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>

        <div className="bussola-contagem">
          {resultados.length} {resultados.length === 1 ? 'termo' : 'termos'}
          {busca ? ' encontrado(s)' : ' no glossário'}
        </div>

        {resultados.length === 0 ? (
          <p className="bussola-vazio">
            Nenhum termo encontrado para “{busca}”. Tente outra palavra ou pergunte ao
            assistente pelo chat 💬.
          </p>
        ) : (
          <div className="bussola-lista">
            {resultados.map((t) => (
              <article key={t.id} className="termo-card card">
                <div className="termo-cabecalho">
                  <h2>
                    {t.termo}
                    {t.sigla && t.sigla !== t.termo && (
                      <span className="termo-sigla">{t.sigla}</span>
                    )}
                  </h2>
                  <span className={`termo-categoria cat-${t.categoria}`}>
                    {CATEGORIA_ROTULO[t.categoria] ?? t.categoria}
                  </span>
                </div>
                <p className="termo-def">{t.definicao}</p>
                {t.exemplo && (
                  <p className="termo-exemplo">
                    <strong>Exemplo:</strong> {t.exemplo}
                  </p>
                )}
                {t.fonte && <p className="termo-fonte">Fonte: {t.fonte}</p>}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
