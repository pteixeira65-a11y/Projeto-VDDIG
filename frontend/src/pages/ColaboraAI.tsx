import { FormEvent, useEffect, useRef, useState } from 'react'
import './colabora.css'

/* ------------------------------------------------------------------ *
 * Colabora AI — protótipo de dashboard de gestão da VDDIG (Fiocruz/ENSP).
 * Curadoria (chat) + Organizador por setor + Transcrição -> Ata.
 * Estética minimalista: pastel + azul petróleo + laranja vibrante.
 * Lógica de IA/transcrição simulada (estado de carregamento + exemplo).
 * ------------------------------------------------------------------ */

/* ---- Ícones nórdicos (traço fino) ---- */
const ic = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}
const IconFolder = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...ic}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </svg>
)
const IconChevron = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...ic}>
    <polyline points="9 6 15 12 9 18" />
  </svg>
)
const IconSpark = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...ic}>
    <path d="M12 4 L13.2 9.4 L18.5 11 L13.2 12.6 L12 18 L10.8 12.6 L5.5 11 L10.8 9.4 Z" />
  </svg>
)
const IconChat = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...ic}>
    <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
  </svg>
)
const IconMic = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...ic}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M6 11a6 6 0 0 0 12 0" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)
const IconStop = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...ic}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
)
const IconSend = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...ic}>
    <path d="M4 12l16-7-7 16-2-6-7-3Z" />
  </svg>
)
const IconDoc = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...ic}>
    <path d="M6 3h8l4 4v14H6Z" />
    <polyline points="14 3 14 7 18 7" />
  </svg>
)

const SETORES = [
  'SEPLAN', 'SEOF', 'GESCON', 'SEGEM', 'SGPAT', 'SEINFRA',
  'SGT', 'SGQ', 'SGS', 'SEBIO', 'Compras', 'SGTI',
]

const ONDA = Array.from({ length: 32 })

function Logo() {
  return (
    <div className="colab-logo">
      <div className="colab-logo-mark">
        <IconSpark s={20} />
      </div>
      <div className="colab-logo-txt">
        <strong>Colabora AI</strong>
        <span>Gestão VDDIG · ENSP/Fiocruz</span>
      </div>
    </div>
  )
}

/* ---------- Organizador por setor (sidebar) ---------- */
function Organizador() {
  const [aberto, setAberto] = useState<string | null>('SEPLAN')
  const [notas, setNotas] = useState<Record<string, string>>({})
  return (
    <aside className="colab-sidebar">
      <div className="colab-side-titulo">
        <IconFolder /> Organizador por setor
      </div>
      {SETORES.map((s) => {
        const isOpen = aberto === s
        return (
          <div key={s} className={`colab-setor${isOpen ? ' aberto' : ''}`}>
            <button
              className="colab-setor-cab"
              onClick={() => setAberto(isOpen ? null : s)}
            >
              <span className="colab-setor-ic">
                <IconFolder />
              </span>
              <span className="colab-setor-sigla">{s}</span>
              <span className="colab-chev">
                <IconChevron s={15} />
              </span>
            </button>
            {isOpen && (
              <div className="colab-setor-corpo">
                <textarea
                  value={notas[s] ?? ''}
                  onChange={(e) => setNotas((n) => ({ ...n, [s]: e.target.value }))}
                  placeholder={`Organize aqui as informações do setor ${s} geradas pela IA…`}
                />
              </div>
            )}
          </div>
        )
      })}
    </aside>
  )
}

/* ---------- Curadoria (chat) ---------- */
interface Msg { autor: 'user' | 'bot'; texto: string }
function Curadoria() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [texto, setTexto] = useState('')
  const [pensando, setPensando] = useState(false)
  const fim = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, pensando])

  function enviar(e: FormEvent) {
    e.preventDefault()
    const p = texto.trim()
    if (!p || pensando) return
    setMsgs((m) => [...m, { autor: 'user', texto: p }])
    setTexto('')
    setPensando(true)
    setTimeout(() => {
      setPensando(false)
      setMsgs((m) => [
        ...m,
        {
          autor: 'bot',
          texto:
            'Organizei o conteúdo e sugeri um encaminhamento. Salvei um resumo no ' +
            'Organizador do setor correspondente. Quer que eu transforme isto em uma ' +
            'minuta ou em itens de pauta para a próxima reunião?',
        },
      ])
    }, 1100)
  }

  return (
    <div className="colab-tab-area">
      <div className="colab-chat">
        {msgs.length === 0 && !pensando && (
          <div className="colab-chat-vazio">
            <h2>Por onde começamos?</h2>
            <p>
              Peça ao Colabora AI para resumir documentos, redigir minutas ou organizar
              informações por setor da VDDIG.
            </p>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`colab-msg ${m.autor}`}>
            {m.texto}
          </div>
        ))}
        {pensando && <div className="colab-msg bot pensando">Colabora AI está pensando…</div>}
        <div ref={fim} />
      </div>
      <form className="colab-entrada" onSubmit={enviar}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Peça ao Colabora AI"
        />
        <button className="colab-btn-enviar" type="submit" disabled={!texto.trim() || pensando}>
          <IconSend />
        </button>
      </form>
    </div>
  )
}

/* ---------- Transcrição -> Ata ---------- */
type EstadoGrav = 'idle' | 'gravando' | 'processando' | 'pronto'
function Transcricao() {
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

  function iniciar() {
    setSeg(0)
    setEstado('gravando')
  }
  function parar() {
    setEstado('processando')
    setTimeout(() => setEstado('pronto'), 2400)
  }
  function novaGravacao() {
    setSeg(0)
    setEstado('idle')
  }

  return (
    <div className="colab-tab-area">
      <div className="colab-transc">
        <div className="colab-gravador">
          {estado === 'idle' && (
            <>
              <button className="colab-rec-btn" onClick={iniciar}>
                <IconMic /> Gravar reunião em tempo real
              </button>
              <span className="colab-rec-dica">
                A IA transcreve e formata automaticamente na Ata padrão da VDDIG.
              </span>
            </>
          )}

          {estado === 'gravando' && (
            <>
              <div className="colab-wave">
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
              <button className="colab-rec-btn gravando" onClick={parar}>
                <IconStop /> Parar e transcrever · {mmss}
              </button>
            </>
          )}

          {estado === 'processando' && (
            <div className="colab-processando">
              <span className="colab-spinner" />
              Transcrevendo o áudio e formatando a ata…
            </div>
          )}

          {estado === 'pronto' && (
            <button className="colab-rec-btn" onClick={novaGravacao}>
              <IconMic /> Nova gravação
            </button>
          )}
        </div>

        {estado === 'pronto' && <Ata />}
      </div>
    </div>
  )
}

function Ata() {
  return (
    <article className="colab-ata">
      <div className="colab-ata-cab">
        <div className="colab-logo-ph">FIOCRUZ</div>
        <div className="colab-ata-cab-tit">
          <strong>Fundação Oswaldo Cruz — ENSP</strong>
          <span>Vice-Direção de Desenvolvimento Institucional e Gestão (VDDIG)</span>
        </div>
        <div className="colab-logo-ph">ENSP</div>
      </div>

      <h1>ATA DE REUNIÃO</h1>

      <div className="colab-ata-grid">
        <div><b>Data:</b> 07/07/2026</div>
        <div><b>Horário:</b> 10h00 – 11h20</div>
        <div><b>Local:</b> Sala de reuniões da VDDIG / videoconferência</div>
        <div><b>Nº da ata:</b> 014/2026</div>
        <div><b>Modalidade:</b> Híbrida</div>
        <div><b>Secretariado por:</b> Colabora AI (transcrição automática)</div>
      </div>

      <h3>Participantes</h3>
      <p>Representantes de SEPLAN, SEOF, GESCON e SGTI; convidados dos serviços de Compras e SGPAT.</p>

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
        <li>SGTI apresentará plano de suporte (help desk) na próxima reunião — resp. Marcus Vinicius Del Sarto.</li>
      </ul>

      <h3>Próximos passos</h3>
      <p>Nova reunião em 21/07/2026. A minuta segue para validação humana antes da publicação.</p>

      <div className="colab-ata-acoes">
        <button className="colab-btn primario"><IconDoc /> Exportar ata (PDF)</button>
        <button className="colab-btn">Copiar texto</button>
        <button className="colab-btn">Salvar no Organizador</button>
      </div>
    </article>
  )
}

/* ---------- App do protótipo ---------- */
export default function ColaboraAI() {
  const [aba, setAba] = useState<'curadoria' | 'reuniao'>('curadoria')
  return (
    <div className="colabora-app">
      <header className="colab-header">
        <Logo />
        <span className="colab-header-tag">Protótipo · uso interno</span>
      </header>

      <div className="colab-body">
        <Organizador />
        <main className="colab-main">
          <div className="colab-tabs">
            <button
              className={`colab-tab${aba === 'curadoria' ? ' ativo' : ''}`}
              onClick={() => setAba('curadoria')}
            >
              <IconChat /> Curadoria
            </button>
            <button
              className={`colab-tab${aba === 'reuniao' ? ' ativo' : ''}`}
              onClick={() => setAba('reuniao')}
            >
              <IconMic s={16} /> Reunião → Ata
            </button>
          </div>
          {aba === 'curadoria' ? <Curadoria /> : <Transcricao />}
        </main>
      </div>
    </div>
  )
}
