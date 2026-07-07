import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { DlpFinding, Setor } from '../api/types'
import { analisarDlp } from '../utils/dlp'
import { useChat } from '../chat/ChatContext'
import TopNav from '../components/TopNav'

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

function Organizador() {
  const [setores, setSetores] = useState<Setor[]>([])
  const [aberto, setAberto] = useState<number | null>(null)
  const [notas, setNotas] = useState<Record<number, string>>({})
  const [setorSel, setSetorSel] = useState<number | ''>('')
  const [entrada, setEntrada] = useState('')
  const { pedirAjudaDlp } = useChat()

  useEffect(() => {
    api.get('/api/setores').then((r) => {
      setSetores(r.data)
      if (r.data[0]) setSetorSel(r.data[0].id)
    })
  }, [])

  const achadosEntrada: DlpFinding[] = analisarDlp(entrada)

  function adicionar() {
    const txt = entrada.trim()
    if (!txt || !setorSel) return
    setNotas((n) => ({
      ...n,
      [setorSel]: n[setorSel] ? `${n[setorSel]}\n\n${txt}` : txt,
    }))
    setAberto(Number(setorSel))
    setEntrada('')
  }

  return (
    <>
      {/* Interface estilo Gemini — Colabora AI, para entrada de informações por setor */}
      <div className="colabhero-wrap">
        <div className="colabhero-logo">
          <span className="colabhero-mark">
            <IconSparkTab />
          </span>
          <span className="colabhero-nome">Colabora AI</span>
        </div>
        <h2 className="colabhero-titulo">Por onde começamos?</h2>
        <p className="colabhero-sub">
          Adicione informações, documentos internos ou conteúdos da IA à memória de cada setor.
        </p>

        <div className="colabhero-input">
          <select
            value={setorSel}
            onChange={(e) => setSetorSel(Number(e.target.value))}
            aria-label="Setor de destino"
          >
            {setores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.sigla || s.nome}
              </option>
            ))}
          </select>
          <input
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') adicionar()
            }}
            placeholder="Adicione uma informação ou cole um documento do setor…"
          />
          <button
            className="colabhero-enviar"
            onClick={adicionar}
            disabled={!entrada.trim() || !setorSel}
            aria-label="Adicionar ao setor"
          >
            <IconSend />
          </button>
        </div>
        <AlertaDlp achados={achadosEntrada} onAjuda={pedirAjudaDlp} />
      </div>

      <p className="org-intro">
        Memória de gestão por setor — os documentos internos ficam organizados aqui, com uma
        camada de proteção (LGPD) que aciona o assistente se houver dados sensíveis. Salvo
        neste navegador (protótipo).
      </p>
      {setores.map((s) => {
        const isOpen = aberto === s.id
        const rotulo = s.sigla || s.nome
        const achados: DlpFinding[] = isOpen ? analisarDlp(notas[s.id] ?? '') : []
        return (
          <div key={s.id} className={`org-item${isOpen ? ' aberto' : ''}`}>
            <button className="org-cab" onClick={() => setAberto(isOpen ? null : s.id)}>
              <span className="org-ic">
                <IconFolder />
              </span>
              <span>
                <span className="org-sigla">{rotulo}</span>
                {s.sigla && <span className="org-nome"> · {s.nome}</span>}
              </span>
              <span className="org-chev">
                <IconChevron />
              </span>
            </button>
            {isOpen && (
              <div className="org-corpo">
                <textarea
                  value={notas[s.id] ?? ''}
                  onChange={(e) => setNotas((n) => ({ ...n, [s.id]: e.target.value }))}
                  placeholder={`Cole um documento interno ou anote o conteúdo do setor ${rotulo}…`}
                />
                <AlertaDlp achados={achados} onAjuda={pedirAjudaDlp} />
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

/* ---------- Reunião → Ata (transcrição simulada) ---------- */

type EstadoGrav = 'idle' | 'gravando' | 'processando' | 'pronto'
const ONDA = Array.from({ length: 32 })

function ReuniaoAta() {
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
      {estado === 'pronto' && <Ata />}
    </>
  )
}

function Ata() {
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
        <button className="ata-btn">Salvar no Organizador</button>
      </div>
    </article>
  )
}

/* ---------- Componente raiz (workspace com abas) ---------- */

export default function CuradoriaIAs() {
  const { usuario, logout } = useAuth()
  const [aba, setAba] = useState<'ferramentas' | 'organizador' | 'ata'>('organizador')
  const [selecionadaId, setSelecionadaId] = useState<string | null>(null)
  const iaSelecionada = IAS.find((ia) => ia.id === selecionadaId)

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="brand-badge">vddig</span>
          <div>
            <strong>Curadoria</strong>
            <div className="topbar-sub">ENSP · Fiocruz — curadoria de IA e apoio à gestão</div>
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
        <div className="wkspace-tabs">
          <button
            className={`wkspace-tab${aba === 'organizador' ? ' ativo' : ''}`}
            onClick={() => setAba('organizador')}
          >
            <IconSparkTab /> Colabora AI · por setor
          </button>
          <button
            className={`wkspace-tab${aba === 'ata' ? ' ativo' : ''}`}
            onClick={() => setAba('ata')}
          >
            <IconMic /> Reunião → Ata
          </button>
          <button
            className={`wkspace-tab${aba === 'ferramentas' ? ' ativo' : ''}`}
            onClick={() => setAba('ferramentas')}
          >
            <IconFolder /> Ferramentas de IA
          </button>
        </div>

        {aba === 'ferramentas' &&
          (iaSelecionada ? (
            <DetalheIA ia={iaSelecionada} onVoltar={() => setSelecionadaId(null)} />
          ) : (
            <ListaCuradoria onAbrir={setSelecionadaId} />
          ))}
        {aba === 'organizador' && <Organizador />}
        {aba === 'ata' && <ReuniaoAta />}
      </main>
    </div>
  )
}
