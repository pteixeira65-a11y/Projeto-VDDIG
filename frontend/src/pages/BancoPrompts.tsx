import { useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import TopNav from '../components/TopNav'

/* ------------------------------------------------------------------ *
 * Banco de Prompts — biblioteca de prompts prontos para o setor,
 * com busca em texto livre e botão de copiar. Dados mockados no arquivo.
 * ------------------------------------------------------------------ */

interface Prompt {
  id: number
  titulo: string
  categoria: string
  texto: string
  dica: string
  tags: string // termos extras p/ busca (sem acento)
}

const PROMPTS: Prompt[] = [
  {
    id: 1,
    titulo: 'Redigir ofício ou memorando',
    categoria: 'Redação',
    texto:
      'Você é um assistente de redação oficial do setor público. Escreva um [ofício/memorando] sobre [assunto], em linguagem formal e objetiva, com no máximo [X] parágrafos. Destinatário: [cargo/setor]. Contexto: [cole o contexto].',
    dica: 'Bom para começar documentos oficiais sem partir do zero.',
    tags: 'oficio memorando documento redacao oficial carta comunicacao formal',
  },
  {
    id: 2,
    titulo: 'Reescrever em linguagem simples',
    categoria: 'Redação',
    texto:
      'Reescreva o texto abaixo em linguagem clara e acessível, sem jargão, mantendo o sentido e os dados. Texto: [cole aqui].',
    dica: 'Deixa comunicados e avisos mais fáceis de entender.',
    tags: 'simplificar clareza acessivel linguagem cidada reescrever',
  },
  {
    id: 3,
    titulo: 'Resumir uma normativa',
    categoria: 'Análise',
    texto:
      'Resuma a norma abaixo em tópicos: (1) o que muda, (2) quem é afetado, (3) prazos, (4) ações necessárias. Norma: [cole o texto].',
    dica: 'Transforma leis e portarias longas em pontos acionáveis.',
    tags: 'resumo normativa lei portaria decreto analise sintese',
  },
  {
    id: 4,
    titulo: 'Extrair pendências de uma ata',
    categoria: 'Análise',
    texto:
      'A partir da ata abaixo, liste as decisões, os responsáveis e os prazos em formato de tabela. Ata: [cole aqui].',
    dica: 'Vira um plano de acompanhamento logo após a reunião.',
    tags: 'ata reuniao pendencias decisoes tarefas responsaveis prazos tabela',
  },
  {
    id: 5,
    titulo: 'Anonimizar dados sensíveis (LGPD)',
    categoria: 'LGPD',
    texto:
      'Revise o texto abaixo e substitua quaisquer dados pessoais (nome, CPF, e-mail, telefone) por marcadores genéricos, preservando o sentido. Aponte o que foi alterado. Texto: [cole aqui].',
    dica: 'Use antes de compartilhar documentos fora do setor.',
    tags: 'lgpd anonimizar dados pessoais cpf privacidade mascarar sensivel',
  },
  {
    id: 6,
    titulo: 'Checar risco de dados pessoais',
    categoria: 'LGPD',
    texto:
      'Analise o texto abaixo e indique se há dados pessoais ou sensíveis segundo a LGPD, classificando o risco (baixo/médio/alto) e sugerindo como mitigar. Texto: [cole aqui].',
    dica: 'Uma verificação rápida de conformidade antes de publicar.',
    tags: 'lgpd risco dados sensiveis conformidade dpo privacidade avaliacao',
  },
  {
    id: 7,
    titulo: 'Transformar objetivo em meta SMART',
    categoria: 'Planejamento',
    texto:
      'Transforme o objetivo abaixo em uma meta SMART (específica, mensurável, atingível, relevante e temporal), sugerindo um indicador e um prazo. Objetivo: [descreva].',
    dica: 'Ajuda a cadastrar metas bem definidas no Espaço Setorial.',
    tags: 'meta smart objetivo indicador prazo planejamento kpi',
  },
  {
    id: 8,
    titulo: 'Plano de ação a partir de uma meta',
    categoria: 'Planejamento',
    texto:
      'Crie um plano de ação para a meta abaixo: etapas, responsáveis sugeridos, prazos e principais riscos. Meta: [descreva].',
    dica: 'Detalha o “como fazer” de uma meta em passos.',
    tags: 'plano de acao etapas cronograma riscos meta planejamento',
  },
  {
    id: 9,
    titulo: 'Levantar boas práticas',
    categoria: 'Pesquisa',
    texto:
      'Levante boas práticas adotadas por órgãos públicos brasileiros sobre [tema], com fontes. Foque em ações aplicáveis a um setor de [área].',
    dica: 'Referências de outros órgãos para embasar decisões.',
    tags: 'boas praticas pesquisa referencia benchmark orgaos publicos fontes',
  },
  {
    id: 10,
    titulo: 'Rascunhar comunicado interno',
    categoria: 'Comunicação',
    texto:
      'Escreva um comunicado interno curto e claro para a equipe do setor sobre [assunto], com tom cordial e um call-to-action ao final.',
    dica: 'Avisos de equipe prontos em segundos.',
    tags: 'comunicado interno equipe aviso mensagem comunicacao',
  },
]

const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function combina(p: Prompt, alvo: string): boolean {
  if (!alvo) return true
  const campos = normalizar(`${p.titulo} ${p.categoria} ${p.texto} ${p.tags}`)
  return normalizar(alvo)
    .split(/\s+/)
    .filter(Boolean)
    .every((parte) => campos.includes(parte))
}

const IconCopiar = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
)

const IconCheck = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function BancoPrompts() {
  const { usuario, logout } = useAuth()
  const [busca, setBusca] = useState('')
  const [copiadoId, setCopiadoId] = useState<number | null>(null)

  const resultados = useMemo(() => PROMPTS.filter((p) => combina(p, busca)), [busca])

  function copiarFallback(texto: string): boolean {
    try {
      const ta = document.createElement('textarea')
      ta.value = texto
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }

  async function copiar(p: Prompt) {
    let ok = false
    try {
      await navigator.clipboard.writeText(p.texto)
      ok = true
    } catch {
      ok = copiarFallback(p.texto)
    }
    if (ok) {
      setCopiadoId(p.id)
      setTimeout(() => setCopiadoId((atual) => (atual === p.id ? null : atual)), 1800)
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="marca"><img src="/adauto-emblema.jpg" alt="" className="marca-emblema" /><span className="marca-plat">Plataforma</span><span className="marca-adauto">Adauto</span></span>
          <div>
            <strong>Banco de Prompts</strong>
            <div className="topbar-sub">ENSP · Fiocruz — prompts prontos para o setor</div>
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
          Prompts prontos para usar com o assistente ou outras IAs no dia a dia do setor. Copie,
          ajuste os campos entre colchetes <code>[assim]</code> e cole na ferramenta. Sempre revise
          o resultado (a decisão é humana).
        </div>

        <div className="bussola-busca">
          <span className="bussola-busca-icone" aria-hidden="true">
            🔍
          </span>
          <input
            autoFocus
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar prompt… ex.: LGPD, resumir norma, meta"
            aria-label="Buscar prompt"
          />
          {busca && (
            <button className="bussola-limpar" onClick={() => setBusca('')} aria-label="Limpar busca">
              ×
            </button>
          )}
        </div>

        <div className="bussola-contagem">
          {resultados.length} {resultados.length === 1 ? 'prompt' : 'prompts'}
          {busca ? ' encontrado(s)' : ' no banco'}
        </div>

        {resultados.length === 0 ? (
          <p className="bussola-vazio">
            Nenhum prompt encontrado para “{busca}”. Tente outra palavra (ex.: “redação”, “análise”,
            “LGPD”).
          </p>
        ) : (
          <div className="prompts-lista">
            {resultados.map((p) => (
              <article key={p.id} className="prompt-card card">
                <div className="prompt-card-topo">
                  <span className="prompt-cat">{p.categoria}</span>
                  <button
                    className={`prompt-copiar${copiadoId === p.id ? ' copiado' : ''}`}
                    onClick={() => copiar(p)}
                  >
                    {copiadoId === p.id ? (
                      <>
                        <IconCheck />
                        Copiado
                      </>
                    ) : (
                      <>
                        <IconCopiar />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                <h2 className="prompt-titulo">{p.titulo}</h2>
                <p className="prompt-texto">{p.texto}</p>
                <p className="prompt-dica">{p.dica}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
