import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

/* Recuperação de senha em 2 passos: e-mail -> código -> nova senha.
   Protótipo: o código é "enviado" na tela (sem SMTP). Em produção ele vai
   por e-mail e o campo codigo_dev deixa de ser retornado pela API. */
export default function RecuperarSenha() {
  const nav = useNavigate()
  const [etapa, setEtapa] = useState<'email' | 'codigo' | 'pronto'>('email')
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [codigoDev, setCodigoDev] = useState<string | null>(null)
  const [nova, setNova] = useState('')
  const [confirma, setConfirma] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function pedirCodigo(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const r = await api.post('/api/senha/recuperar', { email })
      const dev: string | null = r.data.codigo_dev ?? null
      setCodigoDev(dev)
      if (dev) setCodigo(dev) // pré-preenche na simulação
      setEtapa('codigo')
    } catch {
      setErro('Não foi possível gerar o código. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  async function redefinir(e: FormEvent) {
    e.preventDefault()
    setErro('')
    if (nova.length < 6) {
      setErro('A nova senha deve ter ao menos 6 caracteres.')
      return
    }
    if (nova !== confirma) {
      setErro('As senhas não conferem.')
      return
    }
    setEnviando(true)
    try {
      await api.post('/api/senha/redefinir', { email, codigo, nova_senha: nova })
      setEtapa('pronto')
    } catch (err: any) {
      setErro(err?.response?.data?.detail ?? 'Não foi possível redefinir a senha.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={etapa === 'email' ? pedirCodigo : redefinir}>
        <div className="brand">
          <div className="marca marca-completo">
            <span className="marca-plat">Plataforma</span>
            <span className="marca-adauto">Adauto</span>
          </div>
          <p className="sub">Recuperação de senha</p>
        </div>

        {etapa === 'email' && (
          <>
            <p className="recuperar-passo">
              Informe seu e-mail cadastrado. Enviaremos um código de verificação.
            </p>
            <label>
              E-mail
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
            </label>
            <button disabled={enviando} type="submit">
              {enviando ? 'Enviando…' : 'Enviar código'}
            </button>
          </>
        )}

        {etapa === 'codigo' && (
          <>
            {codigoDev ? (
              <div className="recuperar-dev">
                <strong>Simulação (sem e-mail):</strong> seu código é <b>{codigoDev}</b>. Em produção,
                ele chegaria no seu e-mail.
              </div>
            ) : (
              <p className="recuperar-passo">
                Se o e-mail estiver cadastrado, enviamos um código. Digite-o abaixo.
              </p>
            )}
            <label>
              Código de verificação
              <input value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
            </label>
            <label>
              Nova senha
              <input type="password" value={nova} onChange={(e) => setNova(e.target.value)} required />
            </label>
            <label>
              Confirmar nova senha
              <input type="password" value={confirma} onChange={(e) => setConfirma(e.target.value)} required />
            </label>
            <button disabled={enviando} type="submit">
              {enviando ? 'Salvando…' : 'Redefinir senha'}
            </button>
          </>
        )}

        {etapa === 'pronto' && (
          <div className="recuperar-ok">
            <strong>Senha redefinida!</strong>
            <span>Você já pode entrar com a sua nova senha.</span>
          </div>
        )}

        {erro && <div className="erro">{erro}</div>}

        <button type="button" className="link recuperar-voltar" onClick={() => nav('/login')}>
          ← Voltar ao login
        </button>
      </form>
    </div>
  )
}
