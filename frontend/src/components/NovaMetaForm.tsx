import { FormEvent, useMemo, useState } from 'react'
import { DlpFinding, NovaMeta } from '../api/types'
import { analisarDlp } from '../utils/dlp'

interface Props {
  onSalvar: (dados: NovaMeta) => Promise<void>
  onPedirAjudaDlp: () => void
}

const STATUS_OPCOES = [
  { valor: 'nao_iniciada', rotulo: 'Não iniciada' },
  { valor: 'em_andamento', rotulo: 'Em andamento' },
  { valor: 'concluida', rotulo: 'Concluída' },
  { valor: 'atrasada', rotulo: 'Atrasada' },
]

export default function NovaMetaForm({ onSalvar, onPedirAjudaDlp }: Props) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [status, setStatus] = useState('nao_iniciada')
  const [progresso, setProgresso] = useState(0)
  const [prazo, setPrazo] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [ok, setOk] = useState(false)

  // Camada DLP/LGPD: alerta de conscientização em tempo real (não bloqueia).
  const achados: DlpFinding[] = useMemo(() => analisarDlp(`${titulo} ${descricao}`), [titulo, descricao])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!titulo.trim() || !prazo) return
    setSalvando(true)
    setOk(false)
    try {
      await onSalvar({ titulo, descricao, status, progresso, prazo })
      setTitulo('')
      setDescricao('')
      setStatus('nao_iniciada')
      setProgresso(0)
      setPrazo('')
      setOk(true)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form className="meta-form" onSubmit={onSubmit}>
      <label>
        Título
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Modernizar o pregão eletrônico" />
      </label>
      <label>
        Descrição
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          placeholder="Descreva a meta de forma objetiva (evite dados pessoais)."
        />
      </label>

      <div className="meta-form-linha">
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPCOES.map((s) => (
              <option key={s.valor} value={s.valor}>
                {s.rotulo}
              </option>
            ))}
          </select>
        </label>
        <label>
          Progresso: {progresso}%
          <input type="range" min={0} max={100} value={progresso} onChange={(e) => setProgresso(Number(e.target.value))} />
        </label>
        <label>
          Prazo
          <input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
        </label>
      </div>

      {achados.length > 0 && (
        <div className="dlp-alerta">
          <div className="dlp-cabecalho">
            <span className="dlp-icone">🛡️</span>
            <strong>Atenção à proteção de dados (LGPD)</strong>
          </div>
          <p className="dlp-texto">Identificamos possível conteúdo sensível. Isso não bloqueia o registro, mas vale revisar:</p>
          <ul>
            {achados.map((a, i) => (
              <li key={i}>
                <strong>{a.tipo}:</strong> {a.orientacao}
              </li>
            ))}
          </ul>
          <button type="button" className="dlp-botao" onClick={onPedirAjudaDlp}>
            Falar com o assistente sobre anonimização
          </button>
        </div>
      )}

      <div className="meta-form-acoes">
        <button type="submit" disabled={salvando || !titulo.trim() || !prazo}>
          {salvando ? 'Salvando…' : 'Salvar meta'}
        </button>
        {ok && <span className="meta-ok">✓ Meta cadastrada!</span>}
      </div>
    </form>
  )
}
