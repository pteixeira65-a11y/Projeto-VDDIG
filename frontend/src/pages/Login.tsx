import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { rotaPadrao } from '../App'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('servidor.compras@ensp.fiocruz.br')
  const [senha, setSenha] = useState('fiocruz123')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [logoOk, setLogoOk] = useState(true)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const usuario = await login(email, senha)
      nav(rotaPadrao(usuario.role))
    } catch {
      setErro('Email ou senha inválidos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="brand">
          <img
            src="/adauto-logo.jpg"
            alt="Plataforma Adauto — Plataforma de Gestão da VDDIG, ENSP"
            className="marca-logo"
            onError={() => setLogoOk(false)}
            style={{ display: logoOk ? 'block' : 'none' }}
          />
          {!logoOk && (
            <>
              <div className="marca marca-completo">
                <span className="marca-plat">Plataforma</span>
                <span className="marca-adauto">Adauto</span>
              </div>
              <p className="sub">Plataforma de Gestão da VDDIG · ENSP/Fiocruz</p>
            </>
          )}
        </div>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoFocus />
        </label>
        <label>
          Senha
          <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" />
        </label>
        {erro && <div className="erro">{erro}</div>}
        <button disabled={enviando} type="submit">
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
        <button type="button" className="link esqueci-senha" onClick={() => nav('/recuperar-senha')}>
          Esqueci minha senha
        </button>
        <p className="dica">
          Setor: servidor.compras@ensp.fiocruz.br
          <br />
          Estratégico: direcao@ensp.fiocruz.br
          <br />
          Senha: fiocruz123
        </p>
      </form>
    </div>
  )
}
