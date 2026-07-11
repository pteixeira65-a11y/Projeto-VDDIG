import { useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'

function saudacaoPorHorario(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

/**
 * Toast de boas-vindas exibido uma única vez logo após o login
 * (não reaparece em refresh/reidratação de sessão). Some sozinho em 6s.
 */
export default function BoasVindas() {
  const { usuario, recemLogado, confirmarSaudacao } = useAuth()

  useEffect(() => {
    if (!recemLogado) return
    const t = setTimeout(confirmarSaudacao, 6000)
    return () => clearTimeout(t)
  }, [recemLogado, confirmarSaudacao])

  if (!recemLogado || !usuario) return null

  const contexto =
    usuario.role === 'estrategico'
      ? 'Você está na Plataforma Adauto — Sala de Situação da Direção.'
      : 'Você está na Plataforma Adauto — seu Espaço Setorial.'

  return (
    <div className="boas-vindas" role="status" aria-live="polite">
      <div className="boas-vindas-icone" aria-hidden="true">
        👋
      </div>
      <div className="boas-vindas-texto">
        <strong>
          {saudacaoPorHorario()}, {usuario.nome}!
        </strong>
        <span>{contexto}</span>
      </div>
      <button
        className="boas-vindas-fechar"
        onClick={confirmarSaudacao}
        aria-label="Fechar aviso de boas-vindas"
      >
        ×
      </button>
    </div>
  )
}
