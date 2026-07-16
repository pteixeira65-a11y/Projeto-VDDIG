import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Setor } from '../api/types'
import TopNav from '../components/TopNav'

/* ------------------------------------------------------------------ *
 * Conecta VDDIG — publicação editorial institucional (para TODOS os
 * setores e a Direção; fica no menu do topo, sem restrição de papel).
 * Duas seções: Informativo (alertas + avisos, editorial/humano — SECOM)
 * e Quem é quem (setores reais de /api/setores). Design nórdico, acento
 * terracota, com a "trama" (rede de nós) como hero. Avisos são MOCK
 * agora (na agulha) — depois viram uma publicação real mantida pelo SECOM.
 * ------------------------------------------------------------------ */

const SITE_VDDIG = 'https://vddig.ensp.fiocruz.br'
const HOJE = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

/* ---- Ícones nórdicos (traço fino, currentColor) ---- */
const ic = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
const IconRede = () => (<svg viewBox="0 0 24 24" {...ic}><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="M7.6 7.4 11 15M16.4 7.4 13 15M8 6h8" /></svg>)
const IconSino = () => (<svg viewBox="0 0 24 24" {...ic}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>)
const IconPessoas = () => (<svg viewBox="0 0 24 24" {...ic}><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M16 5.5a3 3 0 0 1 0 5.5" /><path d="M17 13.5a5.5 5.5 0 0 1 3.5 5.1" /></svg>)
const IconServico = () => (<svg viewBox="0 0 24 24" {...ic}><path d="M4 21V7l8-4 8 4v14" /><path d="M10 21v-6h4v6" /><path d="M8 10h2M14 10h2M8 13.5h2M14 13.5h2" /></svg>)
const IconElevador = () => (<svg viewBox="0 0 24 24" {...ic}><rect x="6" y="3" width="12" height="18" rx="1.6" /><path d="M9.5 9l2.5-2.5L14.5 9" /><path d="M9.5 15l2.5 2.5 2.5-2.5" /></svg>)
const IconEscudo = () => (<svg viewBox="0 0 24 24" {...ic}><path d="M12 3l7 2.6v5.2c0 4.2-3 7-7 8.9-4-1.9-7-4.7-7-8.9V5.6z" /><path d="M9.2 12l1.9 1.9 3.7-3.9" /></svg>)
const IconBlueprint = () => (<svg viewBox="0 0 24 24" {...ic}><rect x="3" y="4" width="18" height="16" rx="1.6" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="9" x2="9" y2="20" /><line x1="9" y1="14.5" x2="15" y2="14.5" /></svg>)
const IconAlerta = () => (<svg viewBox="0 0 24 24" {...ic}><path d="M12 3.2 21.2 20 H2.8 Z" /><line x1="12" y1="9.5" x2="12" y2="14" /><circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" /></svg>)
const IconSeta = () => (<svg viewBox="0 0 24 24" {...ic}><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></svg>)

/* Conteúdo de exemplo (mock, na agulha — depois publicado pelo SECOM). */
type Cor = 'azul' | 'verde' | 'roxo'
const AVISOS: { id: number; sigla: string; cor: Cor; titulo: string; texto: string; quando: string; Icone: () => JSX.Element; corpo: string[] }[] = [
  {
    id: 1, sigla: 'SEINFRA', cor: 'azul', Icone: IconElevador, quando: 'Sexta-feira',
    titulo: 'Manutenção nos elevadores nesta sexta',
    texto: 'O Serviço de Infraestrutura fará manutenção preventiva nos elevadores do prédio-sede. Prefira as escadas no período.',
    corpo: [
      'Nesta sexta-feira, o Serviço de Infraestrutura (SEINFRA) realizará a manutenção preventiva dos elevadores do prédio-sede, das 8h às 12h.',
      'Durante o período, os elevadores ficarão indisponíveis por intervalos. Recomendamos o uso das escadas e atenção às pessoas com mobilidade reduzida.',
      'Em caso de dúvida, procure o SEINFRA no térreo do prédio-sede.',
    ],
  },
  {
    id: 2, sigla: 'SEBIO', cor: 'verde', Icone: IconEscudo, quando: 'Inscrições abertas',
    titulo: 'Capacitação sobre uso de EPIs',
    texto: 'Inscrições abertas para a capacitação sobre o uso correto de Equipamentos de Proteção Individual.',
    corpo: [
      'O Serviço de Biossegurança (SEBIO) abre inscrições para a capacitação sobre o uso correto de Equipamentos de Proteção Individual (EPIs).',
      'A atividade é voltada a servidores e terceirizados que atuam em áreas laboratoriais e assistenciais. As vagas são limitadas.',
      'Para inscrições e mais informações, procure a equipe do SEBIO.',
    ],
  },
  {
    id: 3, sigla: 'POLEM', cor: 'roxo', Icone: IconBlueprint, quando: 'A confirmar',
    titulo: 'Oficina de Blueprint de serviços',
    texto: 'O POLEM conduz uma oficina prática de construção de blueprints — os mapas de serviço dos setores.',
    corpo: [
      'O POLEM conduz uma oficina prática de construção de blueprints — os mapas de serviço que descrevem etapas, gargalos e oportunidades de melhoria de um processo.',
      'Os participantes sairão com um material de apoio e um primeiro rascunho do blueprint do seu setor.',
      'A data será confirmada e as inscrições divulgadas em breve.',
    ],
  },
]

const ALERTA = {
  titulo: 'Evite a Av. Leopoldo Bulhões',
  meta: 'Campus Manguinhos · situação em curso · Segurança / VDDIG',
  corpo: [
    'Há registro de operação policial e de conflito armado nas imediações do campus de Manguinhos, neste momento.',
    'A Vice-Direção acompanha a situação com a Segurança institucional e emitirá novas orientações assim que possível.',
  ],
  orientacoes: [
    'Evite a Av. Leopoldo Bulhões e as vias de acesso próximas.',
    'Permaneça em local seguro, longe de janelas e áreas abertas.',
    'Aguarde a próxima atualização oficial antes de circular.',
    'Em emergência, procure a Segurança/Brigada da unidade.',
  ],
}

/* Hero: a "trama" (rede de nós) em versão nórdica/chapada. */
function TramaHero() {
  return (
    <div className="conecta-hero" aria-hidden="true">
      <svg viewBox="0 0 1180 116" xmlns="http://www.w3.org/2000/svg">
        <rect width="1180" height="116" fill="#f6efe4" />
        <g stroke="#b06a56" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" fill="none">
          <line x1="150" y1="66" x2="360" y2="40" /><line x1="360" y1="40" x2="560" y2="70" />
          <line x1="560" y1="70" x2="770" y2="42" /><line x1="770" y1="42" x2="980" y2="68" />
          <line x1="560" y1="70" x2="618" y2="92" /><line x1="980" y1="68" x2="1032" y2="46" />
        </g>
        <g fill="#ffffff" stroke="#b06a56" strokeWidth="1.9">
          <circle cx="150" cy="66" r="7" /><circle cx="360" cy="40" r="8" /><circle cx="770" cy="42" r="8" />
          <circle cx="980" cy="68" r="7" /><circle cx="618" cy="92" r="5.5" /><circle cx="1032" cy="46" r="5.5" />
        </g>
        <circle cx="560" cy="70" r="10" fill="#f2e2db" stroke="#b06a56" strokeWidth="2" />
      </svg>
    </div>
  )
}

function SecaoInformativo({ irParaSetores }: { irParaSetores: () => void }) {
  // null = lista; 'alerta' = matéria do alerta; número = matéria de um aviso.
  const [detalhe, setDetalhe] = useState<'alerta' | number | null>(null)

  if (detalhe === 'alerta') {
    return (
      <article className="conecta-materia alerta">
        <button className="conecta-voltar" onClick={() => setDetalhe(null)}><IconSeta /> Voltar ao Informativo</button>
        <span className="conecta-materia-tag red">Alerta de Segurança · Nível 3</span>
        <h2 className="conecta-materia-titulo">{ALERTA.titulo}</h2>
        <div className="conecta-materia-meta">{ALERTA.meta}</div>
        <div className="conecta-materia-corpo">{ALERTA.corpo.map((p, i) => <p key={i}>{p}</p>)}</div>
        <h3>O que fazer</h3>
        <ul>{ALERTA.orientacoes.map((o, i) => <li key={i}>{o}</li>)}</ul>
      </article>
    )
  }

  if (typeof detalhe === 'number') {
    const a = AVISOS.find((x) => x.id === detalhe)
    if (a) {
      return (
        <article className="conecta-materia">
          <button className="conecta-voltar" onClick={() => setDetalhe(null)}><IconSeta /> Voltar ao Informativo</button>
          <span className={`conecta-materia-tag ${a.cor}`}>{a.sigla}</span>
          <h2 className="conecta-materia-titulo">{a.titulo}</h2>
          <div className="conecta-materia-meta">{a.quando}</div>
          <div className="conecta-materia-corpo">{a.corpo.map((p, i) => <p key={i}>{p}</p>)}</div>
        </article>
      )
    }
  }

  return (
    <>
      <article className="conecta-alerta">
        <div className="conecta-alerta-ic"><IconAlerta /></div>
        <div>
          <div className="conecta-alerta-tag">Alerta de Segurança · Nível 3</div>
          <h3>{ALERTA.titulo}</h3>
          <p>Operação policial e registro de conflito armado nas imediações do campus, <strong>neste momento</strong>. Evite a via e permaneça em local seguro até nova orientação.</p>
          <div className="conecta-alerta-meta">{ALERTA.meta}</div>
          <a className="conecta-alerta-mais" href="#" onClick={(e) => { e.preventDefault(); setDetalhe('alerta') }}>Ver orientações de segurança →</a>
        </div>
      </article>

      <div className="conecta-secttl">Avisos dos setores</div>
      <div className="conecta-grid">
        {AVISOS.map((a) => (
          <article key={a.id} className={`conecta-aviso ${a.cor}`}>
            <div className="conecta-aviso-top">
              <span className="conecta-aviso-badge"><a.Icone /></span>
              <span className="conecta-aviso-tag">{a.sigla}</span>
            </div>
            <h4>{a.titulo}</h4>
            <p>{a.texto}</p>
            <div className="conecta-aviso-rod">
              <span className="conecta-aviso-quando">{a.quando}</span>
              <a className="conecta-aviso-mais" href="#" onClick={(e) => { e.preventDefault(); setDetalhe(a.id) }}>Saiba mais →</a>
            </div>
          </article>
        ))}
      </div>

      <button className="conecta-teaser" onClick={irParaSetores}>
        <span className="conecta-teaser-ic"><IconPessoas /></span>
        <span className="conecta-teaser-txt">
          <b>Quem é quem na gestão da VDDIG</b>
          <span>Conheça os setores: o que cada um faz e a quem procurar.</span>
        </span>
        <span className="conecta-teaser-go">Ver setores →</span>
      </button>
    </>
  )
}

function SecaoSetores({ setores, carregando }: { setores: Setor[]; carregando: boolean }) {
  if (carregando) return <p className="vazio">Carregando os setores…</p>
  if (setores.length === 0) return <p className="bussola-vazio">Nenhum setor cadastrado ainda.</p>
  return (
    <div className="conecta-grid">
      {setores.map((s) => (
        <article key={s.id} className="conecta-card">
          <div className="conecta-card-topo">
            <span className="conecta-badge"><IconServico /></span>
            {s.sigla && <span className="conecta-sigla">{s.sigla}</span>}
          </div>
          <h2 className="conecta-nome">{s.nome}</h2>
          {(s.missao || s.objetivos) && <p className="conecta-desc">{s.missao || s.objetivos}</p>}
          <div className="conecta-rodape">
            {s.responsavel && (
              <span className="conecta-quem">A quem procurar: <strong>{s.responsavel}</strong></span>
            )}
            <a className="conecta-link" href={SITE_VDDIG} target="_blank" rel="noopener noreferrer">
              Ver no site da VDDIG ↗
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}

export default function Conecta() {
  const { usuario, logout } = useAuth()
  const [setores, setSetores] = useState<Setor[]>([])
  const [carregando, setCarregando] = useState(true)
  const [secao, setSecao] = useState<'informativo' | 'setores'>('informativo')

  useEffect(() => {
    api.get('/api/setores').then((r) => setSetores(r.data)).catch(() => setSetores([])).finally(() => setCarregando(false))
  }, [])

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="marca"><span className="marca-plat">Plataforma</span><span className="marca-adauto">Adauto</span></span>
          <div>
            <strong>Conecta</strong>
            <div className="topbar-sub">ENSP · Fiocruz — publicação da Vice-Direção</div>
          </div>
        </div>
        <div className="topbar-right">
          <TopNav />
          <div className="usuario">
            <span>{usuario?.nome}</span>
            <button className="link" onClick={logout}>Sair</button>
          </div>
        </div>
      </header>

      <main className="conteudo">
        <div className="conecta-mast">
          <div className="conecta-mast-top"><span>{HOJE}</span><span>Edição · VDDIG</span></div>
          <div className="conecta-brand">
            <span className="conecta-mark"><IconRede /></span>
            <span className="conecta-word">conecta <b>VDDIG</b></span>
          </div>
          <p className="conecta-tag">Portal de setores e serviços da Vice-Direção</p>

          <TramaHero />

          <nav className="conecta-secs">
            <button className={`conecta-sec${secao === 'informativo' ? ' on' : ''}`} onClick={() => setSecao('informativo')}>
              <IconSino /> Informativo <span className="conecta-livedot" />
            </button>
            <button className={`conecta-sec${secao === 'setores' ? ' on' : ''}`} onClick={() => setSecao('setores')}>
              <IconPessoas /> Quem é quem
            </button>
          </nav>
        </div>

        {secao === 'informativo'
          ? <SecaoInformativo irParaSetores={() => setSecao('setores')} />
          : <SecaoSetores setores={setores} carregando={carregando} />}
      </main>
    </div>
  )
}
