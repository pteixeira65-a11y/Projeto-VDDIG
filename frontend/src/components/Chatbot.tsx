import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { ChatMsg } from '../api/types'
import RobotIcon from './RobotIcon'

const escaparRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

interface Props {
  aberto: boolean
  onToggle: () => void
  gatilhoDlp: number
}

const BOAS_VINDAS: ChatMsg = {
  autor: 'bot',
  texto: 'Olá! Sou o assistente do Espaço Setorial. Posso ajudar a cadastrar metas, entender os status/métricas e orientar sobre proteção de dados (LGPD). Sobre o que você tem dúvida?',
}

const PERGUNTAS_RAPIDAS = [
  'Como faço para criar uma meta?',
  'O que significa cada status?',
  'Quando uma meta fica em risco?',
]

export default function Chatbot({ aberto, onToggle, gatilhoDlp }: Props) {
  const [mensagens, setMensagens] = useState<ChatMsg[]>([BOAS_VINDAS])
  const [texto, setTexto] = useState('')
  const [pensando, setPensando] = useState(false)
  const [siglas, setSiglas] = useState<string[]>([])
  const fimRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, aberto])

  // Siglas do glossário para tornar termos clicáveis nas respostas da IA.
  useEffect(() => {
    api
      .get('/api/bussola/termos')
      .then((r) => setSiglas(r.data.map((t: { sigla: string }) => t.sigla).filter(Boolean)))
      .catch(() => setSiglas([]))
  }, [])

  const regexSiglas = useMemo(
    () => (siglas.length ? new RegExp(`\\b(${siglas.map(escaparRegex).join('|')})\\b`, 'g') : null),
    [siglas],
  )

  // Quebra o texto do bot, transformando siglas conhecidas em links para a Bússola.
  function renderResposta(texto: string): ReactNode {
    if (!regexSiglas) return texto
    const partes = texto.split(regexSiglas)
    return partes.map((parte, i) =>
      siglas.includes(parte) ? (
        <button
          key={i}
          type="button"
          className="termo-inline"
          title={`Ver "${parte}" na Bússola do Saber`}
          onClick={() => navigate(`/bussola?termo=${encodeURIComponent(parte)}`)}
        >
          {parte}
        </button>
      ) : (
        parte
      ),
    )
  }

  // Gatilho da camada DLP: abre e injeta orientação de anonimização.
  useEffect(() => {
    if (gatilhoDlp > 0) {
      enviar('Preciso de ajuda para tratar dados sensíveis na minha meta (LGPD).', 'dlp')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatilhoDlp])

  async function enviar(pergunta: string, contexto?: string) {
    const p = pergunta.trim()
    if (!p || pensando) return
    setMensagens((m) => [...m, { autor: 'user', texto: p }])
    setTexto('')
    setPensando(true)
    try {
      const r = await api.post('/api/chat', { mensagem: p, contexto })
      setMensagens((m) => [...m, { autor: 'bot', texto: r.data.resposta }])
    } catch {
      setMensagens((m) => [...m, { autor: 'bot', texto: 'Não consegui responder agora. Tente novamente.' }])
    } finally {
      setPensando(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    enviar(texto)
  }

  if (!aberto) {
    return (
      <button className="chat-fab" onClick={onToggle} aria-label="Abrir assistente">
        <RobotIcon size={30} />
      </button>
    )
  }

  return (
    <div className="chat-janela">
      <header className="chat-topo">
        <div className="chat-titulo">
          <RobotIcon size={20} />
          <strong>Assistente</strong>
          <span className="chat-badge">IA</span>
        </div>
        <button className="chat-fechar" onClick={onToggle} aria-label="Fechar">
          ×
        </button>
      </header>

      <div className="chat-corpo">
        {mensagens.map((m, i) => (
          <div key={i} className={`chat-msg chat-${m.autor}`}>
            {m.autor === 'bot' ? renderResposta(m.texto) : m.texto}
          </div>
        ))}
        {pensando && <div className="chat-msg chat-bot chat-pensando">digitando…</div>}
        <div ref={fimRef} />
      </div>

      <div className="chat-rapidas">
        {PERGUNTAS_RAPIDAS.map((q) => (
          <button key={q} type="button" onClick={() => enviar(q)} disabled={pensando}>
            {q}
          </button>
        ))}
      </div>

      <form className="chat-entrada" onSubmit={onSubmit}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva sua dúvida…"
        />
        <button type="submit" disabled={pensando || !texto.trim()}>
          Enviar
        </button>
      </form>
    </div>
  )
}
