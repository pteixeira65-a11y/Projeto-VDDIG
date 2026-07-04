import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('servidor.compras@ensp.fiocruz.br')
  const [senha, setSenha] = useState('fiocruz123')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const usuario = await login(email, senha)
      nav(usuario.role === 'estrategico' ? '/dashboard' : '/setor')
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
          <span className="brand-badge">vddig</span>
          <h1>Ecossistema de Gestão</h1>
          <p className="sub">ENSP · Fiocruz — Visão Estratégica</p>
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
