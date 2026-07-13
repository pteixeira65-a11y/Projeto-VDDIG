import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Setor } from '../api/types'
import TopNav from '../components/TopNav'

/* ------------------------------------------------------------------ *
 * Conecta VDDIG — porta de entrada institucional: quem é quem na gestão.
 * Lista os setores reais da plataforma (/api/setores): o que cada um faz
 * e a quem procurar. Espaço editorial (dono humano: SECOM/cada setor);
 * a Duca não se mistura aqui. Acento terracota (--vermelho).
 * ------------------------------------------------------------------ */

const SITE_VDDIG = 'https://vddig.ensp.fiocruz.br'

/* Ícone genérico de "serviço/setor" (prédio) no badge dos cartões. */
const IconServico = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 21V7l8-4 8 4v14" />
    <path d="M10 21v-6h4v6" />
    <path d="M8 10h2M14 10h2M8 13.5h2M14 13.5h2" />
  </svg>
)

export default function Conecta() {
  const { usuario, logout } = useAuth()
  const [setores, setSetores] = useState<Setor[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api
      .get('/api/setores')
      .then((r) => setSetores(r.data))
      .catch(() => setSetores([]))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="marca">
            <span className="marca-plat">Plataforma</span>
            <span className="marca-adauto">Adauto</span>
          </span>
          <div>
            <strong>Conecta · VDDIG</strong>
            <div className="topbar-sub">ENSP · Fiocruz — quem é quem na gestão</div>
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
        <div className="conecta-head">
          <div className="conecta-eyebrow">Portal de setores e serviços</div>
          <h1 className="conecta-titulo">Quem é quem na gestão da VDDIG</h1>
          <p className="conecta-sub">
            Cada setor, o que ele faz e a quem procurar — para que qualquer pessoa da ENSP saiba
            exatamente onde bater.
          </p>
        </div>

        {carregando ? (
          <p className="vazio">Carregando os setores…</p>
        ) : setores.length === 0 ? (
          <p className="bussola-vazio">Nenhum setor cadastrado ainda.</p>
        ) : (
          <div className="conecta-grid">
            {setores.map((s) => (
              <article key={s.id} className="conecta-card">
                <div className="conecta-card-topo">
                  <span className="conecta-badge">
                    <IconServico />
                  </span>
                  {s.sigla && <span className="conecta-sigla">{s.sigla}</span>}
                </div>
                <h2 className="conecta-nome">{s.nome}</h2>
                {(s.missao || s.objetivos) && (
                  <p className="conecta-desc">{s.missao || s.objetivos}</p>
                )}
                <div className="conecta-rodape">
                  {s.responsavel && (
                    <span className="conecta-quem">
                      A quem procurar: <strong>{s.responsavel}</strong>
                    </span>
                  )}
                  <a
                    className="conecta-link"
                    href={SITE_VDDIG}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver no site da VDDIG ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
