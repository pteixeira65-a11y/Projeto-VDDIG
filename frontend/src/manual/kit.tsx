import { ReactNode, useState } from 'react'

/* ------------------------------------------------------------------ *
 * Kit compartilhado dos manuais (Setor e Direção).
 * Reúne os pedaços comuns — hotwords, prints, logos e a "casca"
 * (barra Exportar PDF + capa + sumário) — para os dois manuais usarem
 * o mesmo, sem duplicar código. O que muda de um manual para o outro
 * é só o subtítulo da capa, o sumário e o conteúdo (children).
 * ------------------------------------------------------------------ */

/* Termo destacado que revela a definição ao clicar (estilo Bússola do Saber). */
export function Hotword({ termo, children }: { termo: string; children: ReactNode }) {
  const [aberto, setAberto] = useState(false)
  return (
    <span className="hotword-wrap">
      <button
        type="button"
        className={`hotword${aberto ? ' aberto' : ''}`}
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
      >
        {termo}
      </button>
      {aberto && <span className="hotword-def">{children}</span>}
    </span>
  )
}

/* Print de uma tela: mostra a imagem real se existir em /public/manual/,
   senão um espaço reservado com a legenda (a inserir depois). */
export function Print({ arquivo, legenda }: { arquivo: string; legenda: string }) {
  const [ok, setOk] = useState(true)
  const [zoom, setZoom] = useState(false)
  return (
    <figure className="manual-print">
      {ok ? (
        <button type="button" className="manual-print-btn" onClick={() => setZoom(true)}>
          <img src={`/manual/${arquivo}`} alt={legenda} onError={() => setOk(false)} />
        </button>
      ) : (
        <div className="manual-print-ph">
          <span className="manual-print-ph-tit">Imagem da tela</span>
          <span className="manual-print-ph-sub">{legenda}</span>
          <span className="manual-print-ph-hint">print a inserir · /public/manual/{arquivo}</span>
        </div>
      )}
      <figcaption>
        {legenda}
        {ok && <span className="manual-print-zoom"> · clique para ampliar</span>}
      </figcaption>
      {zoom && ok && (
        <div
          className="manual-lightbox no-print"
          role="dialog"
          aria-label={legenda}
          onClick={() => setZoom(false)}
        >
          <img src={`/manual/${arquivo}`} alt={legenda} />
        </div>
      )}
    </figure>
  )
}

/* Logotipo institucional da capa — usa a imagem real se existir em
   /public/manual/, senão cai para um selo tipográfico (nunca quebra). */
function LogoInst({ arquivo, sigla, nome }: { arquivo: string; sigla: string; nome: string }) {
  const [ok, setOk] = useState(true)
  return ok ? (
    <img
      className="manual-logo-inst"
      src={`/manual/${arquivo}`}
      alt={nome}
      title={nome}
      onError={() => setOk(false)}
    />
  ) : (
    <span className="manual-selo" title={nome}>
      {sigla}
    </span>
  )
}

/* Um item do sumário clicável. */
export type SumarioItem = { id: string; num: string; titulo: string }

/* A "casca" de um manual: barra Exportar PDF + capa institucional +
   sumário clicável, e depois o conteúdo (children = as seções).
   O subtítulo e o sumário são passados por quem usa. */
export function ManualShell({
  subtitulo,
  sumario,
  children,
}: {
  subtitulo: string
  sumario: SumarioItem[]
  children: ReactNode
}) {
  const irPara = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="manual-wrap">
      <div className="manual-barra no-print">
        <button type="button" className="manual-pdf" onClick={() => window.print()}>
          Exportar PDF
        </button>
      </div>

      {/* ----- Capa ----- */}
      <section className="manual-capa">
        <div className="manual-capa-logos">
          <LogoInst arquivo="logo-fiocruz.png" sigla="FIOCRUZ" nome="Fundação Oswaldo Cruz" />
          <LogoInst
            arquivo="logo-ensp.png"
            sigla="ENSP"
            nome="Escola Nacional de Saúde Pública Sergio Arouca"
          />
        </div>
        <span className="marca marca-completo">
          <span className="marca-plat">Plataforma</span>
          <span className="marca-adauto">Adauto</span>
        </span>
        <h1 className="manual-capa-titulo">Manual do Usuário</h1>
        <p className="manual-capa-sub">{subtitulo}</p>
        <p className="manual-capa-nomes">
          Fundação Oswaldo Cruz · Escola Nacional de Saúde Pública Sergio Arouca
          <br />
          Vice-Direção de Desenvolvimento Institucional e Gestão (VDDIG)
        </p>
        <p className="manual-capa-ano">2026</p>
        <button
          type="button"
          className="manual-capa-btn no-print"
          onClick={() => irPara('manual-sumario')}
        >
          Abrir o manual ↓
        </button>
      </section>

      {/* ----- Sumário ----- */}
      <nav id="manual-sumario" className="manual-sumario">
        <h2>Conteúdo</h2>
        <ol>
          {sumario.map((s) => (
            <li key={s.id}>
              <button type="button" onClick={() => irPara(s.id)}>
                <span className="manual-sumario-num">{s.num}</span>
                <span>{s.titulo}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="manual-sumario-dica">
          Dica: clique nas palavras <span className="hotword-exemplo">destacadas</span> ao longo do
          manual para ver o que significam.
        </p>
      </nav>

      <article className="manual-doc">{children}</article>
    </div>
  )
}
