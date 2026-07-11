import { useAuth } from '../auth/AuthContext'
import TopNav from '../components/TopNav'
import { BlueprintsExplorer } from '../blueprints'

/* Vitrine de Blueprints dos setores — acesso da Direção (leitura). */

export default function BlueprintsSetores() {
  const { usuario, logout } = useAuth()
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="marca"><img src="/adauto-emblema.jpg" alt="" className="marca-emblema" /><span className="marca-plat">Plataforma</span><span className="marca-adauto">Adauto</span></span>
          <div>
            <strong>Blueprints dos Setores</strong>
            <div className="topbar-sub">ENSP · Fiocruz — mapa de serviço e evolução de cada setor</div>
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

      <main className="conteudo">
        <BlueprintsExplorer modo="direcao" />
      </main>
    </div>
  )
}
