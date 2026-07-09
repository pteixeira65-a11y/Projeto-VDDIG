import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { DlpFinding, Setor, SetorMetricas } from '../api/types'
import { analisarDlp } from '../utils/dlp'
import { useChat } from '../chat/ChatContext'
import TopNav from '../components/TopNav'
import KpiCard from '../components/KpiCard'
import MetasChart from '../components/MetasChart'
import { IconDashboard } from '../components/icons'

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

/* ------------------------------------------------------------------ *
 * Curadoria de IAs — aba de avaliação de ferramentas de IA do setor.
 * Lista (grid de cards) <-> detalhe da IA, via estado interno.
 * Dados mockados abaixo. Estilo nórdico (usa o CSS da plataforma).
 * ------------------------------------------------------------------ */

type Status = 'ativo' | 'em_avaliacao' | 'desativado'

interface IA {
  id: string
  nome: string
  status: Status
  resumo: string // o que é, em linguagem simples
  casosUso: string[] // para que serve no contexto do setor
  comoUsar: string[] // passo a passo curto
  Pictograma: (p: { className?: string }) => JSX.Element
}

/* ---------- Pictogramas geométricos originais (não são logos de marca) ---------- */

const svgPicto = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const PictoClaude = ({ className }: { className?: string }) => (
  <svg {...svgPicto} className={className}>
    <circle cx="12" cy="12" r="2.4" />
    <line x1="12" y1="2.5" x2="12" y2="6.5" />
    <line x1="12" y1="17.5" x2="12" y2="21.5" />
    <line x1="2.5" y1="12" x2="6.5" y2="12" />
    <line x1="17.5" y1="12" x2="21.5" y2="12" />
    <line x1="5.5" y1="5.5" x2="8.3" y2="8.3" />
    <line x1="15.7" y1="15.7" x2="18.5" y2="18.5" />
    <line x1="18.5" y1="5.5" x2="15.7" y2="8.3" />
    <line x1="8.3" y1="15.7" x2="5.5" y2="18.5" />
  </svg>
)

const PictoPerplexity = ({ className }: { className?: string }) => (
  <svg {...svgPicto} className={className}>
    <circle cx="12" cy="12" r="7.5" />
    <circle cx="12" cy="12" r="3.4" />
    <line x1="12" y1="2" x2="12" y2="8.6" />
    <line x1="12" y1="15.4" x2="12" y2="22" />
  </svg>
)

const PictoChatGPT = ({ className }: { className?: string }) => (
  <svg {...svgPicto} className={className}>
    <polygon points="12,3 19,7.5 19,16.5 12,21 5,16.5 5,7.5" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const PictoGemini = ({ className }: { className?: string }) => (
  <svg {...svgPicto} className={className}>
    <path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z" />
  </svg>
)

const PictoNotebookLM = ({ className }: { className?: string }) => (
  <svg {...svgPicto} className={className}>
    <rect x="5" y="4" width="14" height="16" rx="2" />
    <line x1="9" y1="4" x2="9" y2="20" />
    <line x1="12" y1="9" x2="16" y2="9" />
    <line x1="12" y1="12.5" x2="16" y2="12.5" />
    <line x1="12" y1="16" x2="16" y2="16" />
  </svg>
)

const PictoCopilot = ({ className }: { className?: string }) => (
  <svg {...svgPicto} className={className}>
    <path d="M7 5 L17 5 L12 13.5 Z" />
    <path d="M9 19 L19 19 L14 10.5 Z" />
  </svg>
)

/* ---------- Ícones auxiliares em linha fina ---------- */

const iconBase = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const IconSeta = () => (
  <svg {...iconBase}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const IconChevron = () => (
  <svg {...iconBase}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const IconCheck = () => (
  <svg {...iconBase}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconFolder = () => (
  <svg {...iconBase}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </svg>
)

const IconMic = () => (
  <svg {...iconBase}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M6 11a6 6 0 0 0 12 0" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

const IconStop = () => (
  <svg {...iconBase}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
)

const IconDoc = () => (
  <svg {...iconBase}>
    <path d="M6 3h8l4 4v14H6Z" />
    <polyline points="14 3 14 7 18 7" />
  </svg>
)

const IconSparkTab = () => (
  <svg {...iconBase}>
    <path d="M12 4 L13.2 9.4 L18 11 L13.2 12.6 L12 18 L10.8 12.6 L6 11 L10.8 9.4 Z" />
  </svg>
)

const IconSend = () => (
  <svg {...iconBase}>
    <path d="M4 12l16-7-7 16-2-6-7-3Z" />
  </svg>
)

const IconPlus = () => (
  <svg {...iconBase}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const IconSearch = () => (
  <svg {...iconBase}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const IconChevronDown = () => (
  <svg {...iconBase}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

/* ---------- Dados mockados ---------- */

const IAS: IA[] = [
  {
    id: 'claude',
    nome: 'Claude',
    status: 'ativo',
    Pictograma: PictoClaude,
    resumo:
      'Assistente de IA da Anthropic, forte em escrita cuidadosa, análise de documentos longos e raciocínio passo a passo.',
    casosUso: [
      'Redigir minutas de ofícios, memorandos e pareceres do setor.',
      'Resumir normativas extensas e destacar os pontos que exigem ação.',
      'Revisar textos com atenção a dados sensíveis (LGPD) antes do envio.',
    ],
    comoUsar: [
      'Acesse o aplicativo/console autorizado pela instituição.',
      'Descreva a tarefa em linguagem natural, colando o contexto necessário.',
      'Revise a resposta e ajuste — a decisão final é sempre humana.',
    ],
  },
  {
    id: 'perplexity',
    nome: 'Perplexity',
    status: 'em_avaliacao',
    Pictograma: PictoPerplexity,
    resumo:
      'Buscador com IA que responde perguntas em texto corrido citando as fontes consultadas na web.',
    casosUso: [
      'Pesquisar legislação e referências atualizadas com a fonte à mão.',
      'Checar rapidamente dados para fundamentar pareceres.',
      'Levantar boas práticas adotadas por outros órgãos públicos.',
    ],
    comoUsar: [
      'Abra o Perplexity no navegador.',
      'Faça a pergunta de forma direta.',
      'Confira sempre as fontes citadas antes de usar a informação.',
    ],
  },
  {
    id: 'chatgpt',
    nome: 'ChatGPT',
    status: 'ativo',
    Pictograma: PictoChatGPT,
    resumo:
      'Assistente de IA da OpenAI para conversas, redação de textos e apoio geral do dia a dia.',
    casosUso: [
      'Rascunhar comunicados internos e respostas padronizadas.',
      'Gerar checklists e roteiros de processos do setor.',
      'Tirar dúvidas rápidas de redação e organização.',
    ],
    comoUsar: [
      'Acesse com a conta institucional autorizada.',
      'Escreva o pedido descrevendo o objetivo.',
      'Refine o resultado conversando e valide antes de publicar.',
    ],
  },
  {
    id: 'gemini',
    nome: 'Gemini',
    status: 'em_avaliacao',
    Pictograma: PictoGemini,
    resumo:
      'IA do Google integrada ao Workspace (Documentos, Gmail e Drive), útil dentro do fluxo já existente.',
    casosUso: [
      'Resumir e-mails longos e threads de reuniões.',
      'Apoiar a organização e as fórmulas em planilhas.',
      'Redigir e reescrever diretamente no Google Docs.',
    ],
    comoUsar: [
      'Verifique se o Gemini está ativado no Workspace da instituição.',
      'Use o painel do Gemini dentro dos aplicativos Google.',
      'Valide o conteúdo gerado antes de compartilhar.',
    ],
  },
  {
    id: 'notebooklm',
    nome: 'NotebookLM',
    status: 'em_avaliacao',
    Pictograma: PictoNotebookLM,
    resumo:
      'Ferramenta do Google que responde com base apenas nos documentos que você envia — reduz respostas inventadas.',
    casosUso: [
      'Criar um “assistente” das normativas e manuais do setor.',
      'Perguntar sobre procedimentos internos e receber a citação exata.',
      'Gerar resumos e guias a partir da base documental da área.',
    ],
    comoUsar: [
      'Crie um novo notebook.',
      'Envie os documentos oficiais do setor como fontes.',
      'Pergunte e confira as citações que apontam para os trechos originais.',
    ],
  },
  {
    // 6ª ferramenta — nome a confirmar (sugestão: Microsoft Copilot,
    // pela integração ao Office 365). Ajuste id/nome se optar por outra.
    id: 'copilot',
    nome: 'Microsoft Copilot',
    status: 'desativado',
    Pictograma: PictoCopilot,
    resumo:
      'IA da Microsoft integrada ao Office 365 (Word, Excel, Teams e Outlook), dentro das ferramentas já usadas.',
    casosUso: [
      'Redigir e formatar documentos no Word.',
      'Analisar e resumir dados em planilhas do Excel.',
      'Resumir reuniões e pendências no Teams.',
    ],
    comoUsar: [
      'Confirme se há licença Copilot ativa para o usuário.',
      'Use o botão Copilot dentro de cada aplicativo do Office.',
      'Revise o resultado antes de enviar ou registrar.',
    ],
  },
]

const STATUS_ROTULO: Record<Status, string> = {
  ativo: 'Ativo',
  em_avaliacao: 'Em avaliação',
  desativado: 'Desativado',
}

const BadgeStatus = ({ status }: { status: Status }) => (
  <span className={`curad-status st-${status}`}>{STATUS_ROTULO[status]}</span>
)

/* ---------- Página de detalhe da IA ---------- */

function DetalheIA({ ia, onVoltar }: { ia: IA; onVoltar: () => void }) {
  const [selecionada, setSelecionada] = useState(false)
  const { Pictograma } = ia
  const desativada = ia.status === 'desativado'

  return (
    <>
      <button className="curad-voltar" onClick={onVoltar}>
        <IconSeta />
        Voltar para a curadoria
      </button>

      <header className="curad-detalhe-cabecalho">
        <div className="curad-picto grande">
          <Pictograma className="curad-picto-svg" />
        </div>
        <div>
          <h1 className="curad-detalhe-titulo">{ia.nome}</h1>
          <BadgeStatus status={ia.status} />
        </div>
      </header>

      <div className="curad-secoes">
        <section className="card">
          <h2>O que é</h2>
          <p className="curad-texto">{ia.resumo}</p>
        </section>

        <section className="card">
          <h2>Para que serve no setor</h2>
          <ul className="curad-lista">
            {ia.casosUso.map((caso, i) => (
              <li key={i}>{caso}</li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Como acessar / usar</h2>
          <ol className="curad-passos">
            {ia.comoUsar.map((passo, i) => (
              <li key={i}>
                <span className="curad-passo-num">{i + 1}</span>
                {passo}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="curad-acao">
        <button
          className={`curad-selecionar${selecionada ? ' selecionada' : ''}`}
          onClick={() => setSelecionada((s) => !s)}
          disabled={desativada}
        >
          {selecionada ? (
            <>
              <IconCheck />
              Selecionada para o setor
            </>
          ) : (
            'Selecionar para o setor'
          )}
        </button>
        {desativada && (
          <span className="curad-indisponivel">Indisponível — ferramenta desativada.</span>
        )}
      </div>
    </>
  )
}

/* ---------- Listagem (grid de cards) ---------- */

function ListaCuradoria({ onAbrir }: { onAbrir: (id: string) => void }) {
  return (
    <>
      <div className="curad-intro">
        Conheça cada ferramenta de IA avaliada, veja para que serve no seu contexto e escolha
        a mais adequada. A seleção passa por avaliação e validação humana.
      </div>

      <div className="curad-grid">
        {IAS.map((ia) => {
          const { Pictograma } = ia
          return (
            <button key={ia.id} className="curad-card" onClick={() => onAbrir(ia.id)}>
              <div className="curad-card-topo">
                <div className="curad-picto">
                  <Pictograma className="curad-picto-svg" />
                </div>
                <BadgeStatus status={ia.status} />
              </div>
              <div>
                <h2 className="curad-card-nome">{ia.nome}</h2>
                <p className="curad-card-resumo">{ia.resumo}</p>
              </div>
              <span className="curad-ver">
                Ver detalhes
                <IconChevron />
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}

/* ---------- Organizador por setor (mock local, todos os setores) ---------- */

function AlertaDlp({ achados, onAjuda }: { achados: DlpFinding[]; onAjuda: () => void }) {
  if (achados.length === 0) return null
  return (
    <div className="dlp-alerta" style={{ marginTop: 12 }}>
      <div className="dlp-cabecalho">
        <span>🛡️</span>
        <strong>Atenção à proteção de dados (LGPD)</strong>
      </div>
      <p className="dlp-texto">
        Detectamos possível dado sensível. Revise antes de registrar:
      </p>
      <ul>
        {achados.map((a, i) => (
          <li key={i}>
            <strong>{a.tipo}:</strong> {a.orientacao}
          </li>
        ))}
      </ul>
      <button type="button" className="dlp-botao" onClick={onAjuda}>
        Falar com o assistente sobre anonimização
      </button>
    </div>
  )
}

interface Doc {
  id: number
  tipo: 'documento' | 'nota' | 'ata'
  titulo: string
  texto: string
  data: string
}

/* Modos do Colabora AI — equivalente ao seletor de modelo do Gemini */
const MODOS = [
  { id: 'curadoria', nome: 'Curadoria', sub: 'Organizar informações' },
  { id: 'consulta', nome: 'Consulta', sub: 'Perguntar aos documentos' },
  { id: 'ata', nome: 'Reunião → Ata', sub: 'Gravar e gerar ata' },
] as const
type ModoId = (typeof MODOS)[number]['id']

/* Entrada estilo Gemini — Colabora AI do setor (+ anexar, modo, microfone) */
function ColaboraInput({
  setor,
  docs,
  onAdd,
  onGravar,
  onFerramentas,
}: {
  setor: Setor | null
  docs: Doc[]
  onAdd: (d: Omit<Doc, 'id' | 'data'>) => void
  onGravar: () => void
  onFerramentas: () => void
}) {
  const [entrada, setEntrada] = useState('')
  const [menu, setMenu] = useState(false)
  const [menuModo, setMenuModo] = useState(false)
  const [modo, setModo] = useState<ModoId>('curadoria')
  const [resposta, setResposta] = useState<{ pergunta: string; texto: string; fontes: Doc[] } | null>(null)
  const { pedirAjudaDlp } = useChat()
  const achados: DlpFinding[] = analisarDlp(entrada)
  const sigla = setor?.sigla || ''
  const modoAtual = MODOS.find((m) => m.id === modo)!

  function enviar() {
    const txt = entrada.trim()
    if (!txt) return
    if (modo === 'consulta') {
      setResposta({
        pergunta: txt,
        texto: docs.length
          ? `Com base nos documentos do setor ${sigla}, consolidei os pontos relacionados a "${txt}". ` +
            '(Resposta simulada — o RAG real usará a Claude API sobre a base do setor.)'
          : 'Ainda não há documentos neste setor. Envie documentos no modo Curadoria ou gere uma Ata.',
        fontes: docs.slice(0, 2),
      })
      setEntrada('')
    } else {
      onAdd({ tipo: 'nota', titulo: txt.slice(0, 52) + (txt.length > 52 ? '…' : ''), texto: txt })
      setEntrada('')
    }
  }

  function anexar(nome: string) {
    onAdd({ tipo: 'documento', titulo: nome, texto: `Documento interno "${nome}" enviado ao repositório do setor ${sigla}.` })
    setMenu(false)
  }

  function escolherModo(id: ModoId) {
    setMenuModo(false)
    if (id === 'ata') {
      onGravar()
      return
    }
    setModo(id)
    setResposta(null)
  }

  return (
    <div className="colabhero-wrap">
      <div className="colabhero-logo">
        <span className="colabhero-mark">
          <IconSparkTab />
        </span>
        <span className="colabhero-nome">Colabora AI</span>
      </div>
      <h2 className="colabhero-titulo">Por onde começamos?</h2>
      <p className="colabhero-sub">
        Envie documentos internos e informações para a memória do setor {sigla}. O principal
        input são documentos — protegidos pela camada de LGPD.
      </p>

      <div className="colabhero-input">
        <div className="colab-mais">
          <button className="colab-mais-btn" onClick={() => setMenu((m) => !m)} aria-label="Anexar">
            {menu ? <span className="colab-x">×</span> : <IconPlus />}
          </button>
          {menu && (
            <div className="colab-mais-menu">
              <button onClick={() => anexar('Ofício 042-2026.pdf')}>
                <IconDoc /> Enviar arquivos
              </button>
              <button onClick={() => anexar('Planilha do setor.xlsx')}>
                <IconFolder /> Adicionar do Drive
              </button>
              <button onClick={() => anexar('Documento digitalizado.pdf')}>
                <IconPlus /> Mais uploads
              </button>
              <div className="colab-menu-divisor" />
              <button onClick={() => { setMenu(false); onGravar() }}>
                <IconMic /> Gravar reunião
              </button>
              <button onClick={() => { setMenu(false); onFerramentas() }}>
                <IconFolder /> Mais ferramentas
              </button>
            </div>
          )}
        </div>

        <input
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') enviar()
          }}
          placeholder={
            modo === 'consulta'
              ? 'Pergunte aos documentos do setor…'
              : 'Adicione um documento ou informação do setor…'
          }
        />

        <div className="colab-modo">
          <button className="colab-modo-btn" onClick={() => setMenuModo((m) => !m)}>
            {modoAtual.nome}
            <IconChevronDown />
          </button>
          {menuModo && (
            <div className="colab-modo-menu">
              {MODOS.map((m) => (
                <button key={m.id} onClick={() => escolherModo(m.id)} className={m.id === modo ? 'ativo' : ''}>
                  <span>
                    <strong>{m.nome}</strong>
                    <small>{m.sub}</small>
                  </span>
                  {m.id === modo && <IconCheck />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="colab-mic" onClick={onGravar} aria-label="Gravar áudio">
          <IconMic />
        </button>
        <button className="colabhero-enviar" onClick={enviar} disabled={!entrada.trim()} aria-label="Enviar">
          {modo === 'consulta' ? <IconSearch /> : <IconSend />}
        </button>
      </div>
      <AlertaDlp achados={achados} onAjuda={pedirAjudaDlp} />

      {resposta && (
        <div className="colab-resposta">
          <div className="colab-resposta-q">{resposta.pergunta}</div>
          <p>{resposta.texto}</p>
          {resposta.fontes.length > 0 && (
            <div className="repo-fontes">
              <span className="repo-fontes-tit">Fontes:</span>
              {resposta.fontes.map((f) => (
                <span key={f.id} className="repo-fonte-chip">
                  <IconDoc /> {f.titulo}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="colab-sugestoes">
        <button onClick={() => setEntrada('Resuma os principais pontos da última reunião do setor.')}>
          Resumir última reunião
        </button>
        <button onClick={() => setEntrada('Liste as pendências e os responsáveis do setor.')}>
          Listar pendências
        </button>
        <button onClick={onGravar}>Gravar uma reunião</button>
      </div>
    </div>
  )
}

/* Repositório tipo NotebookLM — consulta dos documentos do setor */
function Repositorio({ setor, docs }: { setor: Setor | null; docs: Doc[] }) {
  const [pergunta, setPergunta] = useState('')
  const [pensando, setPensando] = useState(false)
  const [resposta, setResposta] = useState<{ texto: string; fontes: Doc[] } | null>(null)
  const sigla = setor?.sigla || ''

  function consultar() {
    const q = pergunta.trim()
    if (!q || pensando) return
    setPensando(true)
    setResposta(null)
    setTimeout(() => {
      setPensando(false)
      setResposta({
        texto: docs.length
          ? `Com base nos documentos do setor ${sigla}, encontrei registros relacionados a "${q}". ` +
            'Consolidei os pontos principais abaixo, citando as fontes. (Resposta simulada — o RAG ' +
            'real usará a Claude API sobre a base documental do setor.)'
          : 'Ainda não há documentos neste repositório. Envie documentos na aba Colabora AI ou gere uma Ata.',
        fontes: docs.slice(0, 2),
      })
    }, 1100)
  }

  return (
    <div className="repo-wrap">
      <h2 className="repo-titulo">
        <IconSearch /> Repositório do setor {sigla} · NotebookLM
      </h2>
      <p className="repo-sub">
        Consulte os documentos do seu setor em linguagem natural. {docs.length} documento(s) na base.
      </p>

      <div className="repo-busca">
        <span className="repo-busca-ic">
          <IconSearch />
        </span>
        <input
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') consultar()
          }}
          placeholder="Pergunte aos documentos do setor…"
        />
        <button className="repo-perguntar" onClick={consultar} disabled={!pergunta.trim() || pensando}>
          Perguntar
        </button>
      </div>

      {pensando && (
        <div className="repo-pensando">
          <span className="rec-spin" /> Consultando a base do setor…
        </div>
      )}
      {resposta && (
        <div className="repo-resposta">
          <p>{resposta.texto}</p>
          {resposta.fontes.length > 0 && (
            <div className="repo-fontes">
              <span className="repo-fontes-tit">Fontes:</span>
              {resposta.fontes.map((f) => (
                <span key={f.id} className="repo-fonte-chip">
                  <IconDoc /> {f.titulo}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="repo-lista">
        {docs.length === 0 ? (
          <p className="bussola-vazio">
            Nenhum documento ainda. Envie na aba <strong>Colabora AI</strong> ou gere uma{' '}
            <strong>Ata</strong>.
          </p>
        ) : (
          docs.map((d) => (
            <div key={d.id} className="repo-doc">
              <span className={`repo-doc-tipo tipo-${d.tipo}`}>{d.tipo}</span>
              <div className="repo-doc-info">
                <strong>{d.titulo}</strong>
                <p>{d.texto}</p>
              </div>
              <span className="repo-doc-data">{d.data}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ---------- Reunião → Ata (transcrição simulada) ---------- */

type EstadoGrav = 'idle' | 'gravando' | 'processando' | 'pronto'
const ONDA = Array.from({ length: 32 })

function ReuniaoAta({ onSalvar }: { onSalvar: (titulo: string, texto: string) => void }) {
  const [estado, setEstado] = useState<EstadoGrav>('idle')
  const [seg, setSeg] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (estado === 'gravando') {
      timer.current = window.setInterval(() => setSeg((s) => s + 1), 1000)
    } else if (timer.current) {
      clearInterval(timer.current)
    }
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [estado])

  const mmss = `${String(Math.floor(seg / 60)).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`

  return (
    <>
      <div className="rec-box">
        {estado === 'idle' && (
          <>
            <button className="rec-btn" onClick={() => { setSeg(0); setEstado('gravando') }}>
              <IconMic /> Gravar reunião em tempo real
            </button>
            <span className="rec-dica">
              A IA transcreve e formata automaticamente na Ata padrão da VDDIG.
            </span>
          </>
        )}
        {estado === 'gravando' && (
          <>
            <div className="rec-wave">
              {ONDA.map((_, i) => (
                <span
                  key={i}
                  style={{
                    animationDelay: `${(i % 8) * 0.09}s`,
                    animationDuration: `${0.7 + (i % 5) * 0.12}s`,
                  }}
                />
              ))}
            </div>
            <button className="rec-btn gravando" onClick={() => { setEstado('processando'); setTimeout(() => setEstado('pronto'), 2400) }}>
              <IconStop /> Parar e transcrever · {mmss}
            </button>
          </>
        )}
        {estado === 'processando' && (
          <div className="rec-proc">
            <span className="rec-spin" /> Transcrevendo o áudio e formatando a ata…
          </div>
        )}
        {estado === 'pronto' && (
          <button className="rec-btn" onClick={() => { setSeg(0); setEstado('idle') }}>
            <IconMic /> Nova gravação
          </button>
        )}
      </div>
      {estado === 'pronto' && <Ata onSalvar={onSalvar} />}
    </>
  )
}

function Ata({ onSalvar }: { onSalvar: (titulo: string, texto: string) => void }) {
  const [salvo, setSalvo] = useState(false)
  return (
    <article className="ata-doc">
      <div className="ata-cab">
        <div className="ata-logo">FIOCRUZ</div>
        <div className="ata-cab-tit">
          <strong>Fundação Oswaldo Cruz — ENSP</strong>
          <span>Vice-Direção de Desenvolvimento Institucional e Gestão (VDDIG)</span>
        </div>
        <div className="ata-logo">ENSP</div>
      </div>

      <h1>ATA DE REUNIÃO</h1>

      <div className="ata-grid">
        <div><b>Data:</b> 07/07/2026</div>
        <div><b>Horário:</b> 10h00 – 11h20</div>
        <div><b>Local:</b> Sala da VDDIG / videoconferência</div>
        <div><b>Nº da ata:</b> 014/2026</div>
        <div><b>Modalidade:</b> Híbrida</div>
        <div><b>Secretariado por:</b> Assistente (transcrição automática)</div>
      </div>

      <h3>Participantes</h3>
      <p>Representantes de SEPLAN, SEOF, GESCON e SGTI; convidados de Compras e SGPAT.</p>

      <h3>Pauta</h3>
      <ul>
        <li>Consolidação do Plano de Contratações Anual (PCA) 2026.</li>
        <li>Andamento das metas setoriais em risco.</li>
        <li>Diagnóstico de terceirizados por setor.</li>
      </ul>

      <h3>Deliberações e encaminhamentos</h3>
      <ul>
        <li>SEPLAN consolidará os indicadores até <b>18/07</b> — resp. Rodrigo Sá de Alverga.</li>
        <li>Compras revisará o PCA com as áreas requisitantes — resp. Tatiana Moreira da Silva.</li>
        <li>SGTI apresentará o plano de help desk na próxima reunião — resp. Marcus Vinicius Del Sarto.</li>
      </ul>

      <h3>Próximos passos</h3>
      <p>Nova reunião em 21/07/2026. A minuta segue para validação humana antes da publicação.</p>

      <div className="ata-acoes">
        <button className="ata-btn primario"><IconDoc /> Exportar ata (PDF)</button>
        <button className="ata-btn">Copiar texto</button>
        <button
          className="ata-btn"
          onClick={() => {
            onSalvar(
              `Ata de reunião · ${new Date().toLocaleDateString('pt-BR')}`,
              'Ata de reunião da VDDIG com pauta, deliberações e encaminhamentos (gerada pela transcrição).',
            )
            setSalvo(true)
          }}
        >
          {salvo ? '✓ Salvo no repositório' : 'Salvar no repositório'}
        </button>
      </div>
    </article>
  )
}

/* ---------- Blueprint do Serviço de Compras (análise do POLEM) ---------- */

const BP_STAGES = [
  'Requisição',
  'Planejamento',
  'Seleção do fornecedor',
  'Contratação',
  'Execução e fiscalização',
  'Pagamento',
]

const BP_ROWS: { label: string; classe: string; celulas: string[] }[] = [
  {
    label: 'Evidências',
    classe: 'bp-evid',
    celulas: ['Requisição no SEI', 'PCA · ETP · TR', 'Edital / aviso (PNCP)', 'Contrato / ARP', 'Medições e relatórios', 'Nota fiscal · empenho'],
  },
  {
    label: 'Ações do requisitante',
    classe: 'bp-req',
    celulas: ['Identifica a necessidade', 'Descreve o objeto', 'Acompanha o certame', 'Recebe e atesta', 'Fiscaliza a entrega', 'Solicita o pagamento'],
  },
  {
    label: 'Atendimento (frontstage)',
    classe: 'bp-front',
    celulas: ['Orienta a demanda', 'Valida o TR', 'Publica o certame', 'Formaliza o contrato', 'Apoia a fiscalização', 'Confere a liquidação'],
  },
  {
    label: 'Bastidores (backstage)',
    classe: 'bp-back',
    celulas: ['Consolida o PCA', 'Pesquisa de preços (IN 65)', 'Conduz licitação/dispensa', 'Elabora minutas', 'Controla prazos e aditivos', 'Instrui o pagamento'],
  },
  {
    label: 'Sistemas e apoio',
    classe: 'bp-apoio',
    celulas: ['SEI', 'Comprasnet · PNCP', 'Jurídico (parecer)', 'SIASG', 'Fiscais / gestores', 'SEOF'],
  },
]

const BP_GARGALOS = [
  'Pesquisa de preços ainda manual e demorada.',
  'Retrabalho na elaboração dos Termos de Referência.',
  'Prazos de parecer jurídico pouco previsíveis.',
  'PCA com baixa aderência às demandas reais dos setores.',
]

const BP_OPORTUNIDADES = [
  'Biblioteca de modelos de TR por tipo de objeto.',
  'Automação da pesquisa de preços a partir de painéis públicos.',
  'Painel de acompanhamento de prazos por etapa do processo.',
  'Monitoramento e integração via PNCP.',
]

const BP_INDICADORES = [
  { k: 'Tempo médio do processo', v: '~85 dias' },
  { k: 'Dispensa × licitação', v: '62% / 38%' },
  { k: 'Contratações no ano', v: '128' },
  { k: 'Etapa mais lenta', v: 'Planejamento' },
]

function BlueprintCompras() {
  return (
    <div className="bp-wrap">
      <div className="bp-head">
        <div>
          <h2 className="bp-titulo">
            <IconSearch /> Blueprint do Serviço de Compras
          </h2>
          <p className="bp-sub">
            Mapa do serviço (Lei 14.133/2021) por etapa e camada — análise do POLEM ·
            Laboratório de Inovação em Gestão Pública.
          </p>
        </div>
        <span className="bp-tag">POLEM · mockup</span>
      </div>

      <div className="bp-scroll">
        <div className="bp-grid">
          <div className="bp-corner">Etapas →</div>
          {BP_STAGES.map((s) => (
            <div key={s} className="bp-col-head">{s}</div>
          ))}
          {BP_ROWS.map((row) => (
            <div key={row.label} className={`bp-linha ${row.classe}`}>
              <div className="bp-row-label">{row.label}</div>
              {row.celulas.map((c, i) => (
                <div key={i} className="bp-cell">{c}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="bp-legenda">
        Entre <strong>Atendimento</strong> e <strong>Bastidores</strong> passa a “linha de
        visibilidade”: o que o requisitante vê × o que ocorre internamente na Compras.
      </p>

      <div className="bp-analise">
        <div className="card bp-analise-card">
          <h3>Gargalos identificados</h3>
          <ul>
            {BP_GARGALOS.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        </div>
        <div className="card bp-analise-card bp-oport">
          <h3>Oportunidades de melhoria</h3>
          <ul>
            {BP_OPORTUNIDADES.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>
      </div>

      <div className="bp-indicadores">
        {BP_INDICADORES.map((ind) => (
          <div key={ind.k} className="bp-ind">
            <div className="bp-ind-v">{ind.v}</div>
            <div className="bp-ind-k">{ind.k}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Mapeamento de Processos → POP (Serviço de Gestão da Qualidade) ---------- */

const MQ_AUDIOS = [
  { nome: 'Entrevista 1 — Pesquisador responsável.m4a', dur: '18:42' },
  { nome: 'Entrevista 2 — Técnico de laboratório.m4a', dur: '12:15' },
  { nome: 'Entrevista 3 — Biossegurança.m4a', dur: '09:30' },
]

const MQ_LANES: Record<string, { nome: string; classe: string }> = {
  pesq: { nome: 'Pesquisador', classe: 'lane-pesq' },
  lab: { nome: 'Laboratório', classe: 'lane-lab' },
  bio: { nome: 'Biossegurança', classe: 'lane-bio' },
  qual: { nome: 'Qualidade', classe: 'lane-qual' },
}

const MQ_STEPS: { tipo: 'evento' | 'tarefa'; lane?: string; label: string }[] = [
  { tipo: 'evento', label: 'Início' },
  { tipo: 'tarefa', lane: 'pesq', label: 'Solicitação da análise' },
  { tipo: 'tarefa', lane: 'lab', label: 'Recebimento e registro da amostra' },
  { tipo: 'tarefa', lane: 'bio', label: 'Triagem e classificação de risco' },
  { tipo: 'tarefa', lane: 'lab', label: 'Processamento em cabine NB-2/NB-3' },
  { tipo: 'tarefa', lane: 'lab', label: 'Cultivo e identificação' },
  { tipo: 'tarefa', lane: 'lab', label: 'Ensaios e caracterização' },
  { tipo: 'tarefa', lane: 'qual', label: 'Registro dos resultados' },
  { tipo: 'tarefa', lane: 'bio', label: 'Descarte de resíduos (autoclave · PGRSS)' },
  { tipo: 'evento', label: 'Fim' },
]

function MapeamentoQualidade() {
  const [audios, setAudios] = useState<{ nome: string; dur: string }[]>([])
  const [estado, setEstado] = useState<'idle' | 'processando' | 'pronto'>('idle')

  return (
    <div className="mq-wrap">
      <div className="bp-head">
        <div>
          <h2 className="bp-titulo">
            <IconDoc /> Mapeamento de Processos → Documento da Qualidade
          </h2>
          <p className="bp-sub">
            Importe os áudios das entrevistas de mapeamento e gere um documento padrão (POP)
            conforme as diretrizes de qualidade da Fiocruz.
          </p>
        </div>
        <span className="bp-tag">SGQ · mockup</span>
      </div>

      <div className="card mq-import">
        <h3 className="mq-passo">1 · Entrevistas do mapeamento (áudio)</h3>
        {audios.length === 0 ? (
          <div className="mq-drop">
            <IconMic />
            <p>Importe os áudios das entrevistas (pesquisadores, técnicos, biossegurança).</p>
            <button className="rec-btn" onClick={() => setAudios(MQ_AUDIOS)}>
              Importar entrevistas (exemplo)
            </button>
          </div>
        ) : (
          <>
            <ul className="mq-audios">
              {audios.map((a, i) => (
                <li key={i}>
                  <span className="mq-audio-ic"><IconMic /></span>
                  <span className="mq-audio-nome">{a.nome}</span>
                  <span className="mq-audio-dur">{a.dur}</span>
                </li>
              ))}
            </ul>
            {estado === 'idle' && (
              <button
                className="rec-btn"
                onClick={() => { setEstado('processando'); setTimeout(() => setEstado('pronto'), 2600) }}
              >
                <IconDoc /> Transformar em documento padrão da Qualidade
              </button>
            )}
            {estado === 'processando' && (
              <div className="rec-proc">
                <span className="rec-spin" /> Transcrevendo as entrevistas e estruturando o POP…
              </div>
            )}
          </>
        )}
      </div>

      {estado === 'pronto' && (
        <>
          <article className="ata-doc" style={{ marginTop: 18 }}>
            <div className="ata-cab">
              <div className="ata-logo">FIOCRUZ</div>
              <div className="ata-cab-tit">
                <strong>Fundação Oswaldo Cruz — ENSP · Departamento de Ciências Biológicas</strong>
                <span>Serviço de Gestão da Qualidade (SGQ)</span>
              </div>
              <div className="ata-logo">ENSP</div>
            </div>

            <h1>POP — Processamento de amostras para pesquisa em bactérias patogênicas</h1>

            <div className="ata-grid">
              <div><b>Código:</b> POP-DCB-014</div>
              <div><b>Versão:</b> 01</div>
              <div><b>Data:</b> 09/07/2026</div>
              <div><b>Contenção:</b> NB-2 / NB-3</div>
              <div><b>Elaborado por:</b> SGQ (a partir das entrevistas)</div>
              <div><b>Aprovado por:</b> Chefia do DCB</div>
            </div>

            <h3>1. Objetivo</h3>
            <p>Padronizar o recebimento, o processamento, a análise e o descarte de amostras em pesquisa com bactérias patogênicas, assegurando biossegurança e rastreabilidade.</p>

            <h3>2. Campo de aplicação</h3>
            <p>Laboratório de pesquisa em bactérias patogênicas do Departamento de Ciências Biológicas (DCB) da ENSP/Fiocruz.</p>

            <h3>3. Definições e siglas</h3>
            <p>NB-2/NB-3 (níveis de biossegurança); CSB (cabine de segurança biológica); PGRSS (Plano de Gerenciamento de Resíduos de Serviços de Saúde); EPI (equipamento de proteção individual).</p>

            <h3>4. Responsabilidades</h3>
            <ul>
              <li><b>Pesquisador:</b> solicitar a análise e definir o objetivo do ensaio.</li>
              <li><b>Laboratório:</b> receber, processar, cultivar e caracterizar as amostras.</li>
              <li><b>Biossegurança:</b> classificar o risco e validar o descarte.</li>
              <li><b>Qualidade (SGQ):</b> manter o POP, os registros e a rastreabilidade.</li>
            </ul>

            <h3>5. Descrição do processo</h3>
            <ul>
              <li>Solicitação e recebimento da amostra, com registro de origem.</li>
              <li>Triagem e classificação de risco biológico.</li>
              <li>Processamento em cabine de segurança biológica (NB-2/NB-3) com EPIs.</li>
              <li>Cultivo, identificação e ensaios de caracterização.</li>
              <li>Registro dos resultados e emissão do laudo.</li>
              <li>Descarte de resíduos por autoclavagem, conforme o PGRSS.</li>
            </ul>

            <h3>6. Registros e referências</h3>
            <p>Ficha de recebimento, registro de cultivo, laudo e registro de descarte. Referências: RDC/ANVISA, Manual de Biossegurança da Fiocruz, normas da CTNBio e ABNT NBR ISO 9001.</p>

            <div className="ata-acoes">
              <button className="ata-btn primario"><IconDoc /> Exportar POP (PDF)</button>
              <button className="ata-btn">Salvar no repositório</button>
              <button className="ata-btn">Enviar para revisão</button>
            </div>
          </article>

          <div className="card mq-fluxo" style={{ marginTop: 18 }}>
            <h3 className="mq-passo">Fluxograma do processo (exemplo Bizagi · BPMN)</h3>
            <div className="bpmn-legenda">
              {Object.values(MQ_LANES).map((l) => (
                <span key={l.nome} className={`bpmn-lane-chip ${l.classe}`}>{l.nome}</span>
              ))}
            </div>
            <div className="bpmn-scroll">
              <div className="bpmn-flow">
                {MQ_STEPS.map((s, i) => (
                  <div key={i} className="bpmn-node-wrap">
                    {s.tipo === 'evento' ? (
                      <div className="bpmn-evento">{s.label}</div>
                    ) : (
                      <div className={`bpmn-tarefa ${MQ_LANES[s.lane!].classe}`}>
                        <span className="bpmn-lane-tag">{MQ_LANES[s.lane!].nome}</span>
                        {s.label}
                      </div>
                    )}
                    {i < MQ_STEPS.length - 1 && <span className="bpmn-seta">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ---------- Dashboard do setor (métricas) ---------- */

function SetorDashboard({ setorId }: { setorId: number | null }) {
  const [m, setM] = useState<SetorMetricas | null>(null)

  useEffect(() => {
    if (!setorId) return
    setM(null)
    api.get('/api/setor/metricas', { params: { setor_id: setorId } }).then((r) => setM(r.data))
  }, [setorId])

  if (!m) return <p className="vazio">Carregando métricas do setor…</p>

  return (
    <>
      <div className="resumo-ia">
        <span className="ia-badge">IA · resumo</span>
        {m.resumo_gestor}
      </div>

      {(m.missao || m.objetivos) && (
        <section className="setor-sobre card">
          <h2>Missão e objetivos — {m.setor}</h2>
          {m.responsavel && <p className="setor-responsavel">Responsável: {m.responsavel}</p>}
          <div className="setor-sobre-grid">
            {m.missao && (
              <div className="setor-sobre-item">
                <span className="setor-sobre-rotulo">Missão</span>
                <p>{m.missao}</p>
              </div>
            )}
            {m.objetivos && (
              <div className="setor-sobre-item">
                <span className="setor-sobre-rotulo">Objetivos</span>
                <p>{m.objetivos}</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="kpis">
        <KpiCard titulo="Metas concluídas" valor={`${m.pct_metas_concluidas}%`} sub={`${m.metas_concluidas}/${m.total_metas} metas`} tom="verde" />
        <KpiCard titulo="Recursos LOAS aplicados" valor={`${m.pct_recursos_aplicados}%`} sub={`${brl(m.valor_aplicado)} de ${brl(m.valor_previsto)}`} tom="azul" />
        <KpiCard titulo="Demandas em aberto" valor={String(m.demandas_abertas)} sub={`${m.demandas_concluidas} concluídas`} tom="roxo" />
        <KpiCard titulo="Metas em risco" valor={String(m.metas_em_risco)} sub="atrasadas ou fora do prazo" tom="vermelho" />
      </section>

      <section className="card">
        <h2>Status das metas do setor</h2>
        <MetasChart dados={m.metas_por_status} />
      </section>
    </>
  )
}

/* ---------- Componente raiz (workspace com abas) ---------- */

export default function CuradoriaIAs() {
  const { usuario, logout } = useAuth()
  const [aba, setAba] = useState<
    'dashboard' | 'colabora' | 'ata' | 'repo' | 'ferramentas' | 'blueprint' | 'mapeamento'
  >('dashboard')
  const [selecionadaId, setSelecionadaId] = useState<string | null>(null)
  const iaSelecionada = IAS.find((ia) => ia.id === selecionadaId)

  const [setores, setSetores] = useState<Setor[]>([])
  const [setorAtivoId, setSetorAtivoId] = useState<number | null>(null)
  const [docs, setDocs] = useState<Record<number, Doc[]>>({})
  const estrategico = usuario?.role === 'estrategico'

  useEffect(() => {
    api.get('/api/setores').then((r) => {
      setSetores(r.data)
      setSetorAtivoId(usuario?.setor_id ?? r.data[0]?.id ?? null)
    })
  }, [usuario])

  const setorAtivo = setores.find((s) => s.id === setorAtivoId) ?? null
  const docsSetor = setorAtivoId ? docs[setorAtivoId] ?? [] : []
  const ehPolem = setorAtivo?.sigla === 'POLEM'
  const ehQualidade = setorAtivo?.sigla === 'SGQ'

  // Abas específicas de setor (Blueprint no POLEM, Mapeamento no SGQ):
  // ao trocar de setor, volta para o Dashboard.
  useEffect(() => {
    if (aba === 'blueprint' && !ehPolem) setAba('dashboard')
    if (aba === 'mapeamento' && !ehQualidade) setAba('dashboard')
  }, [aba, ehPolem, ehQualidade])

  function adicionarDoc(d: Omit<Doc, 'id' | 'data'>) {
    if (!setorAtivoId) return
    const novo: Doc = { ...d, id: Date.now(), data: new Date().toLocaleDateString('pt-BR') }
    setDocs((prev) => ({ ...prev, [setorAtivoId]: [novo, ...(prev[setorAtivoId] ?? [])] }))
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="brand-badge">vddig</span>
          <div>
            <strong>Colabora AI · Curadoria</strong>
            <div className="topbar-sub">ENSP · Fiocruz — espaço de IA do seu setor</div>
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

      <main className="conteudo curad">
        <div className="setor-ativo-bar">
          <span className="setor-ativo-label">Setor</span>
          {estrategico ? (
            <select
              className="setor-ativo-sel"
              value={setorAtivoId ?? ''}
              onChange={(e) => setSetorAtivoId(Number(e.target.value))}
            >
              {setores.map((s) => (
                <option key={s.id} value={s.id}>
                  {(s.sigla ? s.sigla + ' — ' : '') + s.nome}
                </option>
              ))}
            </select>
          ) : (
            <strong className="setor-ativo-nome">{setorAtivo?.nome ?? '—'}</strong>
          )}
          <span className="setor-ativo-badge">{docsSetor.length} no repositório</span>
        </div>

        <div className="wkspace-tabs">
          <button
            className={`wkspace-tab${aba === 'dashboard' ? ' ativo' : ''}`}
            onClick={() => setAba('dashboard')}
          >
            <IconDashboard /> Dashboard
          </button>
          {ehPolem && (
            <button
              className={`wkspace-tab${aba === 'blueprint' ? ' ativo' : ''}`}
              onClick={() => setAba('blueprint')}
            >
              <IconSearch /> Blueprint · Compras
            </button>
          )}
          {ehQualidade && (
            <button
              className={`wkspace-tab${aba === 'mapeamento' ? ' ativo' : ''}`}
              onClick={() => setAba('mapeamento')}
            >
              <IconDoc /> Mapeamento · Qualidade
            </button>
          )}
          <button
            className={`wkspace-tab${aba === 'colabora' ? ' ativo' : ''}`}
            onClick={() => setAba('colabora')}
          >
            <IconSparkTab /> Colabora AI
          </button>
          <button
            className={`wkspace-tab${aba === 'ata' ? ' ativo' : ''}`}
            onClick={() => setAba('ata')}
          >
            <IconMic /> Gravação → Ata
          </button>
          <button
            className={`wkspace-tab${aba === 'repo' ? ' ativo' : ''}`}
            onClick={() => setAba('repo')}
          >
            <IconSearch /> Repositório (NotebookLM)
          </button>
          <button
            className={`wkspace-tab${aba === 'ferramentas' ? ' ativo' : ''}`}
            onClick={() => setAba('ferramentas')}
          >
            <IconFolder /> Ferramentas de IA
          </button>
        </div>

        {aba === 'dashboard' && <SetorDashboard setorId={setorAtivoId} />}
        {aba === 'colabora' && (
          <ColaboraInput
            setor={setorAtivo}
            docs={docsSetor}
            onAdd={adicionarDoc}
            onGravar={() => setAba('ata')}
            onFerramentas={() => setAba('ferramentas')}
          />
        )}
        {aba === 'ata' && (
          <ReuniaoAta
            onSalvar={(titulo, texto) => {
              adicionarDoc({ tipo: 'ata', titulo, texto })
              setAba('repo')
            }}
          />
        )}
        {aba === 'repo' && <Repositorio setor={setorAtivo} docs={docsSetor} />}
        {aba === 'blueprint' && ehPolem && <BlueprintCompras />}
        {aba === 'mapeamento' && ehQualidade && <MapeamentoQualidade />}
        {aba === 'ferramentas' &&
          (iaSelecionada ? (
            <DetalheIA ia={iaSelecionada} onVoltar={() => setSelecionadaId(null)} />
          ) : (
            <ListaCuradoria onAbrir={setSelecionadaId} />
          ))}
      </main>
    </div>
  )
}
