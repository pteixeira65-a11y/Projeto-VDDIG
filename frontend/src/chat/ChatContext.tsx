import { createContext, useContext, useState, ReactNode } from 'react'

/* Estado global do assistente (robozinho): permite que ele fique disponível
   em todas as telas e que qualquer página dispare a ajuda de LGPD/DLP. */

interface ChatCtx {
  aberto: boolean
  gatilhoDlp: number
  toggle: () => void
  fechar: () => void
  pedirAjudaDlp: () => void
}

const Ctx = createContext<ChatCtx>(null as unknown as ChatCtx)
export const useChat = () => useContext(Ctx)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false)
  const [gatilhoDlp, setGatilhoDlp] = useState(0)

  const toggle = () => setAberto((o) => !o)
  const fechar = () => setAberto(false)
  const pedirAjudaDlp = () => {
    setAberto(true)
    setGatilhoDlp((g) => g + 1)
  }

  return (
    <Ctx.Provider value={{ aberto, gatilhoDlp, toggle, fechar, pedirAjudaDlp }}>
      {children}
    </Ctx.Provider>
  )
}
