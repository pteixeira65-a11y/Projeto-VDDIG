import { ReactNode, useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { DlpFinding, Setor, SetorMetricas } from '../api/types'
import { analisarDlp } from '../utils/dlp'
import { useChat } from '../chat/ChatContext'
import TopNav from '../components/TopNav'
import KpiCard from '../components/KpiCard'
import MetasChart from '../components/MetasChart'
import { IconDashboard } from '../components/icons'
import { BlueprintsExplorer } from '../blueprints'
import { DashboardPanorama } from './Dashboard'
import { TerceirizadosPainel } from './TerceirizadosDiagnostico'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

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
  const ehDirecao = sigla === 'VDDIG'
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
        Envie documentos internos e informações para a memória {ehDirecao ? 'da VDDIG (Direção)' : `do setor ${sigla}`}. O
        principal input são documentos — protegidos pela camada de LGPD.
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

      {(setor?.missao || setor?.objetivos) && (
        <div className="colab-missao">
          {setor?.missao && (
            <div className="colab-missao-item">
              <span className="colab-missao-rot">Missão</span>
              <p>{setor.missao}</p>
            </div>
          )}
          {setor?.objetivos && (
            <div className="colab-missao-item">
              <span className="colab-missao-rot">Objetivos</span>
              <p>{setor.objetivos}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* Repositório tipo NotebookLM — consulta dos documentos do setor */
function Repositorio({ setor, docs }: { setor: Setor | null; docs: Doc[] }) {
  const [pergunta, setPergunta] = useState('')
  const [pensando, setPensando] = useState(false)
  const [resposta, setResposta] = useState<{ texto: string; fontes: Doc[] } | null>(null)
  const sigla = setor?.sigla || ''
  const ehDirecao = sigla === 'VDDIG'

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
        <IconSearch /> {ehDirecao ? 'Notebook da Direção · NotebookLM' : `Repositório do setor ${sigla} · NotebookLM`}
      </h2>
      <p className="repo-sub">
        {ehDirecao
          ? 'Consulte os relatórios consolidados da VDDIG em linguagem natural.'
          : 'Consulte os documentos do seu setor em linguagem natural.'}{' '}
        {docs.length} documento(s) na base.
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

/* ---------- Mapeamento de Processos (Serviço de Gestão da Qualidade) ---------- */

type Passo = { tipo: 'evento' | 'tarefa'; lane?: string; label: string }
const LANE_CLASSES = ['lane-lab', 'lane-pesq', 'lane-bio', 'lane-qual']

function FluxoBPMN({ steps }: { steps: Passo[] }) {
  const lanes = [...new Set(steps.filter((s) => s.lane).map((s) => s.lane!))]
  const classe = (lane: string) => LANE_CLASSES[lanes.indexOf(lane) % LANE_CLASSES.length]
  return (
    <>
      <div className="bpmn-legenda">
        {lanes.map((l) => (
          <span key={l} className={`bpmn-lane-chip ${classe(l)}`}>{l}</span>
        ))}
      </div>
      <div className="bpmn-scroll">
        <div className="bpmn-flow">
          {steps.map((s, i) => (
            <div key={i} className="bpmn-node-wrap">
              {s.tipo === 'evento' ? (
                <div className="bpmn-evento">{s.label}</div>
              ) : (
                <div className={`bpmn-tarefa ${classe(s.lane!)}`}>
                  <span className="bpmn-lane-tag">{s.lane}</span>
                  {s.label}
                </div>
              )}
              {i < steps.length - 1 && <span className="bpmn-seta">→</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const BACTERIAS_STEPS: Passo[] = [
  { tipo: 'evento', label: 'Início' },
  { tipo: 'tarefa', lane: 'Pesquisador', label: 'Solicitação da análise' },
  { tipo: 'tarefa', lane: 'Laboratório', label: 'Recebimento e registro da amostra' },
  { tipo: 'tarefa', lane: 'Biossegurança', label: 'Triagem e classificação de risco' },
  { tipo: 'tarefa', lane: 'Laboratório', label: 'Processamento em cabine NB-2/NB-3' },
  { tipo: 'tarefa', lane: 'Laboratório', label: 'Cultivo e identificação' },
  { tipo: 'tarefa', lane: 'Laboratório', label: 'Ensaios e caracterização' },
  { tipo: 'tarefa', lane: 'Qualidade', label: 'Registro dos resultados' },
  { tipo: 'tarefa', lane: 'Biossegurança', label: 'Descarte de resíduos (autoclave · PGRSS)' },
  { tipo: 'evento', label: 'Fim' },
]

const EXEMPLOS: { id: string; nome: string; unidade: string; steps: Passo[] }[] = [
  {
    id: 'capacitacao',
    nome: 'Promoção de Curso de Capacitação Interno',
    unidade: 'SGT · Instrutor',
    steps: [
      { tipo: 'evento', label: 'Início' },
      { tipo: 'tarefa', lane: 'SGT', label: 'Solicitar disponibilidade de datas' },
      { tipo: 'tarefa', lane: 'Instrutor', label: 'Fornecer as datas do curso' },
      { tipo: 'tarefa', lane: 'SGT', label: 'Verificar disponibilidade de sala no portal' },
      { tipo: 'tarefa', lane: 'SGT', label: 'Reservar as salas no SEAC' },
      { tipo: 'tarefa', lane: 'SGT', label: 'Informar a confirmação ao instrutor' },
      { tipo: 'tarefa', lane: 'Instrutor', label: 'Preencher o plano de curso' },
      { tipo: 'tarefa', lane: 'SGT', label: 'Elaborar texto de divulgação' },
      { tipo: 'tarefa', lane: 'Instrutor', label: 'Validar a divulgação' },
      { tipo: 'tarefa', lane: 'SGT', label: 'Abrir turma no portal' },
      { tipo: 'evento', label: 'Fim' },
    ],
  },
  {
    id: 'residuos',
    nome: 'Descontaminação de Resíduos (Lab. e Ambulatórios)',
    unidade: 'Laboratórios · Asseio · SGS',
    steps: [
      { tipo: 'evento', label: 'Início' },
      { tipo: 'tarefa', lane: 'Laboratórios', label: 'Preencher ficha de resíduo' },
      { tipo: 'tarefa', lane: 'Laboratórios', label: 'Ensacar o resíduo' },
      { tipo: 'tarefa', lane: 'Asseio', label: 'Transportar os resíduos' },
      { tipo: 'tarefa', lane: 'SGS', label: 'Verificar conformidade de acondicionamento' },
      { tipo: 'tarefa', lane: 'SGS', label: 'Verificar se está em saco autoclavável' },
      { tipo: 'tarefa', lane: 'SGS', label: 'Autoclavar os resíduos' },
      { tipo: 'tarefa', lane: 'SGS', label: 'Reensacar e registrar a saída' },
      { tipo: 'tarefa', lane: 'Asseio', label: 'Encaminhar à guarda de coletores' },
      { tipo: 'evento', label: 'Fim' },
    ],
  },
  {
    id: 'projeto',
    nome: 'Aprovação e captação de recursos de projeto',
    unidade: 'Coordenador · Direção · CAAP',
    steps: [
      { tipo: 'evento', label: 'Início' },
      { tipo: 'tarefa', lane: 'Coordenador', label: 'Solicitar aprovação do projeto' },
      { tipo: 'tarefa', lane: 'Direção', label: 'Aprovar' },
      { tipo: 'tarefa', lane: 'Coordenador', label: 'Elaborar proposta e projeto básico' },
      { tipo: 'tarefa', lane: 'CAAP', label: 'Analisar proposta e projeto básico' },
      { tipo: 'tarefa', lane: 'Coordenador', label: 'Ajustar proposta e projeto básico' },
      { tipo: 'tarefa', lane: 'CAAP', label: 'Encaminhar à Fiotec / Cogeplan' },
      { tipo: 'tarefa', lane: 'CAAP', label: 'Elaborar documentação de abertura' },
      { tipo: 'tarefa', lane: 'CAAP', label: 'Solicitar ao Seprot a abertura' },
      { tipo: 'evento', label: 'Fim' },
    ],
  },
  {
    id: 'bacterias',
    nome: 'Processamento de amostras — bactérias patogênicas',
    unidade: 'DCB (NB-2/NB-3)',
    steps: BACTERIAS_STEPS,
  },
]

const MQ_AUDIOS = [
  { nome: 'Entrevista 1 — Pesquisador responsável.m4a', dur: '18:42' },
  { nome: 'Entrevista 2 — Técnico de laboratório.m4a', dur: '12:15' },
  { nome: 'Entrevista 3 — Biossegurança.m4a', dur: '09:30' },
]

/* Diagnóstico real — Relatório de Validade de Processos (ENSP · Pedro Teixeira · 30/03/2026) */
const DIAG = {
  autor: 'Pedro Teixeira',
  data: '30/03/2026',
  total: 222,
  validos: 67,
  obsoletos: 155,
  porSub: [
    { sub: 'VDE', v: 0, o: 38 },
    { sub: 'SGS', v: 37, o: 0 },
    { sub: 'Antigos', v: 1, o: 36 },
    { sub: 'SGTI', v: 4, o: 21 },
    { sub: 'GESCON', v: 0, o: 18 },
    { sub: 'CESTEH', v: 5, o: 12 },
    { sub: 'SEGEM', v: 12, o: 3 },
    { sub: 'SECOM', v: 7, o: 0 },
    { sub: 'CSEGSF', v: 0, o: 6 },
    { sub: 'SBIO', v: 0, o: 5 },
  ],
}

function Infografico() {
  const pct = Math.round((DIAG.obsoletos / DIAG.total) * 100)
  return (
    <div className="infografico">
      <div className="ig-stats">
        <div className="ig-stat">
          <div className="ig-num">{DIAG.total}</div>
          <div className="ig-lbl">processos mapeados</div>
        </div>
        <div className="ig-stat ok">
          <div className="ig-num">{DIAG.validos}</div>
          <div className="ig-lbl">válidos</div>
        </div>
        <div className="ig-stat alerta">
          <div className="ig-num">{DIAG.obsoletos}</div>
          <div className="ig-lbl">obsoletos ({pct}%)</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3 className="mq-passo">Processos por subunidade — válidos × obsoletos</h3>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart layout="vertical" data={DIAG.porSub} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6e1d8" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#7c8590' }} />
            <YAxis type="category" dataKey="sub" width={70} tick={{ fontSize: 12, fill: '#7c8590' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="v" name="Válidos" stackId="a" fill="#6f8f6a" />
            <Bar dataKey="o" name="Obsoletos" stackId="a" fill="#b06a56" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="ig-insight">
        ⚠️ Cerca de <strong>{pct}% dos processos estão obsoletos</strong> (ciclo de revisão de 2
        anos; corte 30/03/2026). Prioridade: regularizar os <strong>{DIAG.obsoletos} itens</strong>{' '}
        para conformidade (ISO 9001) e segurança jurídica/operacional. Fonte: {DIAG.autor}, {DIAG.data} · via NotebookLM.
      </p>
    </div>
  )
}

function POPDocument() {
  return (
    <>
      <article className="ata-doc">
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
        <h3 className="mq-passo">Fluxograma do processo (Bizagi · BPMN)</h3>
        <FluxoBPMN steps={BACTERIAS_STEPS} />
      </div>
    </>
  )
}

/* Recurso clicável (link que revela o conteúdo — mesmo padrão do infográfico) */
function Recurso({
  titulo,
  sub,
  icone,
  aberto,
  onToggle,
  children,
}: {
  titulo: string
  sub?: string
  icone: ReactNode
  aberto: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className={`mq-recurso${aberto ? ' aberto' : ''}`}>
      <button className="mq-recurso-cab" onClick={onToggle}>
        <span className="mq-recurso-ic">{icone}</span>
        <span className="mq-recurso-tit">
          <strong>{titulo}</strong>
          {sub && <span>{sub}</span>}
        </span>
        <span className="mq-recurso-chev"><IconChevron /></span>
      </button>
      {aberto && <div className="mq-recurso-corpo">{children}</div>}
    </div>
  )
}

function MapeamentoQualidade() {
  const [aberto, setAberto] = useState<string | null>(null)
  const [exemploSel, setExemploSel] = useState(EXEMPLOS[0].id)
  const [verInfografico, setVerInfografico] = useState(false)
  const [audios, setAudios] = useState<{ nome: string; dur: string }[]>([])
  const [estado, setEstado] = useState<'idle' | 'processando' | 'pronto'>('idle')
  const exemplo = EXEMPLOS.find((e) => e.id === exemploSel)!
  const pctObs = Math.round((DIAG.obsoletos / DIAG.total) * 100)
  const toggle = (k: string) => setAberto((a) => (a === k ? null : k))

  return (
    <div className="mq-wrap">
      <div className="bp-head">
        <div>
          <h2 className="bp-titulo"><IconDoc /> Mapeamento de Processos — Qualidade</h2>
          <p className="bp-sub">
            Recursos do mapeamento de processos do setor: modelos da ENSP, documento padrão (POP),
            relatório de diagnóstico e a geração a partir de entrevistas. Clique para abrir.
          </p>
        </div>
        <span className="bp-tag">SGQ · mockup</span>
      </div>

      <Recurso
        titulo="Exemplos de mapeamento de processos"
        sub="ENSP · Bizagi — 4 modelos reais"
        icone={<IconSearch />}
        aberto={aberto === 'exemplos'}
        onToggle={() => toggle('exemplos')}
      >
        <div className="mq-exemplos">
          {EXEMPLOS.map((ex) => (
            <button
              key={ex.id}
              className={`mq-ex-card${ex.id === exemploSel ? ' ativo' : ''}`}
              onClick={() => setExemploSel(ex.id)}
            >
              <strong>{ex.nome}</strong>
              <span>{ex.unidade}</span>
            </button>
          ))}
        </div>
        <FluxoBPMN steps={exemplo.steps} />
      </Recurso>

      <Recurso
        titulo="Documento padrão — POP do Laboratório (DCB)"
        sub="Bactérias patogênicas · NB-2/NB-3"
        icone={<IconDoc />}
        aberto={aberto === 'pop'}
        onToggle={() => toggle('pop')}
      >
        <POPDocument />
      </Recurso>

      <Recurso
        titulo="Relatório de diagnóstico de processos"
        sub={`${DIAG.autor} · ${DIAG.data} · ${DIAG.total} processos`}
        icone={<IconDoc />}
        aberto={aberto === 'relatorio'}
        onToggle={() => toggle('relatorio')}
      >
        <p className="mq-diag-txt">
          <strong>Relatório de Validade de Processos — ENSP (ciclo de 2 anos).</strong> Diagnóstico
          de {DIAG.total} processos: <strong>{DIAG.obsoletos} obsoletos</strong> (~{pctObs}%) e{' '}
          {DIAG.validos} válidos. Fonte: {DIAG.autor}, {DIAG.data} · via NotebookLM.
        </p>
        <button className="mq-link" onClick={() => setVerInfografico((v) => !v)}>
          <IconSearch /> {verInfografico ? 'Ocultar infográfico' : 'Ver infográfico do diagnóstico'}
        </button>
        {verInfografico && <Infografico />}
      </Recurso>

      <Recurso
        titulo="Gerar POP a partir de entrevistas"
        sub="Importar áudios → documento padrão"
        icone={<IconMic />}
        aberto={aberto === 'gerar'}
        onToggle={() => toggle('gerar')}
      >
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
        {estado === 'pronto' && (
          <div style={{ marginTop: 18 }}>
            <POPDocument />
          </div>
        )}
      </Recurso>
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

/* Espaço institucional da Direção (VDDIG) — o Colabora AI da Direção não é
   de um setor, e sim da Vice-Direção como um todo. id negativo = sintético. */
const VDDIG_SETOR: Setor = {
  id: -1,
  nome: 'VDDIG — Vice-Direção de Desenvolvimento Institucional e Gestão',
  sigla: 'VDDIG',
  responsavel: 'Direção',
  missao:
    'Coordenar o desenvolvimento institucional e a gestão da ENSP, integrando os serviços da VDDIG e apoiando a decisão estratégica da Direção.',
  objetivos:
    'Monitorar a saúde dos setores, consolidar relatórios e blueprints e articular o planejamento, o orçamento, as pessoas, a qualidade e a infraestrutura.',
}

/* Relatórios padrão consolidados que ficam no Notebook da Direção. */
const DOCS_VDDIG: Doc[] = [
  { id: 90001, tipo: 'documento', titulo: 'Panorama consolidado dos setores — 2026', texto: 'Saúde das metas dos 13 setores da VDDIG, com semáforo (no prazo / atenção / crítico) e evolução.', data: '09/07/2026' },
  { id: 90002, tipo: 'documento', titulo: 'Blueprints de serviço — consolidado VDDIG', texto: 'Os 13 blueprints de serviço dos setores, com etapas, gargalos e oportunidades.', data: '08/07/2026' },
  { id: 90003, tipo: 'documento', titulo: 'Diagnóstico de terceirizados — ENSP', texto: 'Terceirizados por setor (dados agregados, sem informações pessoais) — apoio ao planejamento.', data: '05/07/2026' },
  { id: 90004, tipo: 'ata', titulo: 'Ata — Reunião de gestão da VDDIG', texto: 'Decisões e encaminhamentos da reunião de acompanhamento dos setores.', data: '02/07/2026' },
]

export default function CuradoriaIAs() {
  const { usuario, logout } = useAuth()
  const [aba, setAba] = useState<
    | 'dashboard'
    | 'colabora'
    | 'ata'
    | 'repo'
    | 'ferramentas'
    | 'blueprint'
    | 'mapeamento'
    | 'blueprints'
    | 'terceirizados'
  >('colabora')
  const [selecionadaId, setSelecionadaId] = useState<string | null>(null)
  const iaSelecionada = IAS.find((ia) => ia.id === selecionadaId)

  const [setores, setSetores] = useState<Setor[]>([])
  const [setorAtivoId, setSetorAtivoId] = useState<number | null>(null)
  const [docs, setDocs] = useState<Record<number, Doc[]>>({})
  const estrategico = usuario?.role === 'estrategico'

  useEffect(() => {
    api.get('/api/setores').then((r) => {
      setSetores(r.data)
      setSetorAtivoId(usuario?.setor_id ?? (estrategico ? VDDIG_SETOR.id : r.data[0]?.id) ?? null)
    })
  }, [usuario, estrategico])

  // Semeia os relatórios consolidados no Notebook da Direção (uma vez).
  useEffect(() => {
    if (estrategico) {
      setDocs((prev) => (prev[VDDIG_SETOR.id] ? prev : { ...prev, [VDDIG_SETOR.id]: DOCS_VDDIG }))
    }
  }, [estrategico])

  const setorAtivo =
    setorAtivoId === VDDIG_SETOR.id ? VDDIG_SETOR : setores.find((s) => s.id === setorAtivoId) ?? null
  const docsSetor = setorAtivoId ? docs[setorAtivoId] ?? [] : []
  const ehPolem = setorAtivo?.sigla === 'POLEM'
  const ehQualidade = setorAtivo?.sigla === 'SGQ'

  // Mantém a aba coerente com o perfil/setor.
  useEffect(() => {
    if (aba === 'blueprint' && !ehPolem) setAba('colabora')
    if (aba === 'mapeamento' && !ehQualidade) setAba('colabora')
    if ((aba === 'blueprints' || aba === 'terceirizados') && !estrategico) setAba('colabora')
  }, [aba, ehPolem, ehQualidade, estrategico])

  function adicionarDoc(d: Omit<Doc, 'id' | 'data'>) {
    if (!setorAtivoId) return
    const novo: Doc = { ...d, id: Date.now(), data: new Date().toLocaleDateString('pt-BR') }
    setDocs((prev) => ({ ...prev, [setorAtivoId]: [novo, ...(prev[setorAtivoId] ?? [])] }))
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="marca"><img src="/adauto-emblema.jpg" alt="" className="marca-emblema" /><span className="marca-plat">Plataforma</span><span className="marca-adauto">Adauto</span></span>
          <div>
            <strong>{estrategico ? 'Sala de Situação · Direção' : 'Colabora AI · Curadoria'}</strong>
            <div className="topbar-sub">
              {estrategico
                ? 'ENSP · Fiocruz — espaço de gestão da Direção'
                : 'ENSP · Fiocruz — espaço de IA do seu setor'}
            </div>
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
          <span className="setor-ativo-label">{estrategico ? 'Espaço' : 'Setor'}</span>
          <strong className="setor-ativo-nome">{setorAtivo?.nome ?? '—'}</strong>
          <span className="setor-ativo-badge">
            {docsSetor.length} no {estrategico ? 'notebook' : 'repositório'}
          </span>
        </div>

        <div className="wkspace-tabs">
          <button
            className={`wkspace-tab${aba === 'colabora' ? ' ativo' : ''}`}
            onClick={() => setAba('colabora')}
          >
            <IconSparkTab /> Colabora AI
          </button>
          <button
            className={`wkspace-tab${aba === 'dashboard' ? ' ativo' : ''}`}
            onClick={() => setAba('dashboard')}
          >
            <IconDashboard /> Dashboard
          </button>
          {estrategico && (
            <button
              className={`wkspace-tab${aba === 'blueprints' ? ' ativo' : ''}`}
              onClick={() => setAba('blueprints')}
            >
              <IconSearch /> Blueprints
            </button>
          )}
          {estrategico && (
            <button
              className={`wkspace-tab${aba === 'terceirizados' ? ' ativo' : ''}`}
              onClick={() => setAba('terceirizados')}
            >
              <IconFolder /> Terceirizados
            </button>
          )}
          {ehPolem && (
            <button
              className={`wkspace-tab${aba === 'blueprint' ? ' ativo' : ''}`}
              onClick={() => setAba('blueprint')}
            >
              <IconSearch /> Blueprints
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
            className={`wkspace-tab${aba === 'ata' ? ' ativo' : ''}`}
            onClick={() => setAba('ata')}
          >
            <IconMic /> Gravação → Ata
          </button>
          <button
            className={`wkspace-tab${aba === 'repo' ? ' ativo' : ''}`}
            onClick={() => setAba('repo')}
          >
            <IconSearch /> {estrategico ? 'Notebook da Direção' : 'Repositório (NotebookLM)'}
          </button>
          <button
            className={`wkspace-tab${aba === 'ferramentas' ? ' ativo' : ''}`}
            onClick={() => setAba('ferramentas')}
          >
            <IconFolder /> Ferramentas de IA
          </button>
        </div>

        {aba === 'dashboard' &&
          (estrategico ? <DashboardPanorama /> : <SetorDashboard setorId={setorAtivoId} />)}
        {aba === 'blueprints' && estrategico && <BlueprintsExplorer modo="direcao" />}
        {aba === 'terceirizados' && estrategico && <TerceirizadosPainel />}
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
        {aba === 'blueprint' && ehPolem && <BlueprintsExplorer modo="polem" />}
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
