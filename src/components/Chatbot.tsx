import { FormEvent, useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import { ChatMsg } from '../api/types'

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
  const fimRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, aberto])

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
        💬
      </button>
    )
  }

  return (
    <div className="chat-janela">
      <header className="chat-topo">
        <div>
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
            {m.texto}
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
