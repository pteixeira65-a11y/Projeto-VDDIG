/* ------------------------------------------------------------------ *
 * Gestão de Riscos — aba do setor de Compras.
 * Painel de indicadores de sourcing do PCA 2026 (dados reais do SECOM),
 * no design nórdico da Plataforma Adauto. Demonstração: os números de
 * planejamento vêm do PCA; Saving/Etapas/Fornecedores/Kraljic entram
 * quando as bases do SEI/avaliações forem ligadas.
 * ------------------------------------------------------------------ */

type Barra = { k: string; v: string; pct: number; cor?: string }

const AREAS: Barra[] = [
  { k: 'VDDIG', v: 'R$ 117,2 mi', pct: 100 },
  { k: 'DIR — Direção ENSP', v: 'R$ 116,4 mi', pct: 99 },
  { k: 'VDAL', v: 'R$ 9,9 mi', pct: 8.4 },
  { k: 'SGTI', v: 'R$ 9,7 mi', pct: 8.3 },
  { k: 'CSEGSF', v: 'R$ 8,0 mi', pct: 6.8 },
  { k: 'CESTEH', v: 'R$ 7,9 mi', pct: 6.7 },
]
const SITUACAO: Barra[] = [
  { k: 'Encerrada', v: 'R$ 112,3 mi', pct: 100, cor: 'var(--verde)' },
  { k: 'Preparação', v: 'R$ 109,4 mi', pct: 97, cor: '#c6924b' },
  { k: 'A planejar', v: 'R$ 61,5 mi', pct: 55, cor: 'var(--roxo)' },
  { k: 'Em edição / divulgação', v: 'R$ 6,1 mi', pct: 6, cor: '#b0a69a' },
]
const PRIORIDADE: Barra[] = [
  { k: 'Alto', v: 'R$ 137,6 mi', pct: 100, cor: 'var(--vermelho)' },
  { k: 'Médio', v: 'R$ 34,3 mi', pct: 25, cor: '#c6924b' },
  { k: 'Baixo', v: 'R$ 117,4 mi', pct: 85, cor: 'var(--verde)' },
]
const NAV = ['Painel do PCA 2026', 'Processos', 'Etapas', 'Fornecedores', 'Segmentação de categorias', 'Mapa de Riscos']

/* Logo da Gestão de Riscos — desenhado em SVG (círculo de melhoria contínua
   + seta), no estilo da logomarca. Não depende de arquivo de imagem. */
function GrLogo() {
  return (
    <div className="gr-logo-svg" aria-label="Gestão de Riscos VDDIG">
      <svg width="52" height="52" viewBox="0 0 64 64" role="img" aria-hidden="true">
        <path d="M 47 15 A 22 22 0 1 0 52 26" fill="none" stroke="#22303a" strokeWidth="3" strokeLinecap="round" />
        <path d="M 17 49 A 22 22 0 0 0 26 52" fill="none" stroke="#22303a" strokeWidth="3" strokeLinecap="round" />
        <line x1="17" y1="32" x2="43" y2="32" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" />
        <path d="M 37 26 L 46 32 L 37 38" fill="none" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="gr-logo-txt">
        <strong>Gestão de Riscos</strong>
        <span>VDDIG</span>
      </div>
    </div>
  )
}

function GrBar({ k, v, pct, cor = 'var(--azul)' }: Barra) {
  return (
    <div className="gr-bar">
      <div className="gr-bar-row">
        <span>{k}</span>
        <span className="gr-bar-val">{v}</span>
      </div>
      <div className="gr-track">
        <div className="gr-fill" style={{ width: `${pct}%`, background: cor }} />
      </div>
    </div>
  )
}

export default function GestaoRiscos() {
  return (
    <div className="gr-wrap">
      <div className="gr-head">
        <GrLogo />
        <div className="gr-head-tit">
          <h2>Gestão de Riscos — Compras</h2>
          <p>Indicadores de compras do PCA 2026 · dados reais do SECOM</p>
        </div>
        <span className="bp-tag">Compras · demonstração</span>
      </div>

      <div className="gr-nav">
        {NAV.map((n, i) => (
          <span key={n} className={`gr-navitem${i === 0 ? ' ativo' : ''}`}>{n}</span>
        ))}
      </div>

      <div className="gr-kpis">
        <div className="gr-kpi"><div className="gr-kpi-v">R$ 289,3 mi</div><div className="gr-kpi-l">Valor total do PCA</div></div>
        <div className="gr-kpi"><div className="gr-kpi-v">285</div><div className="gr-kpi-l">Contratações</div></div>
        <div className="gr-kpi"><div className="gr-kpi-v">2.718</div><div className="gr-kpi-l">Itens</div></div>
        <div className="gr-kpi"><div className="gr-kpi-v">14</div><div className="gr-kpi-l">Áreas requisitantes</div></div>
      </div>

      <div className="gr-grid2">
        <div className="gr-card">
          <h3>Valor por área requisitante <small>(top 6)</small></h3>
          {AREAS.map((a) => <GrBar key={a.k} {...a} />)}
        </div>
        <div className="gr-card">
          <h3>Bens × Serviços <small>(por valor)</small></h3>
          <div className="gr-donut-row">
            <div className="gr-donut" style={{ background: 'conic-gradient(var(--azul) 0 85%, var(--verde) 85% 100%)' }}>
              <div className="gr-donut-hole">R$ 289<br />mi</div>
            </div>
            <div className="gr-leg">
              <div><span className="gr-sq" style={{ background: 'var(--azul)' }} /><strong>Serviços</strong> · R$ 247,2 mi (85%)</div>
              <div><span className="gr-sq" style={{ background: 'var(--verde)' }} /><strong>Bens</strong> · R$ 42,1 mi (15%)</div>
              <div className="gr-leg-obs">Em quantidade, Bens são a maioria (2.479 itens); o valor está nos Serviços.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="gr-grid2b">
        <div className="gr-card">
          <h3>Situação da execução <small>(por valor)</small></h3>
          {SITUACAO.map((s) => <GrBar key={s.k} {...s} />)}
        </div>
        <div className="gr-card">
          <h3>Prioridade <small>(por valor)</small></h3>
          {PRIORIDADE.map((p) => <GrBar key={p.k} {...p} />)}
        </div>
      </div>

      <div className="gr-card">
        <h3>Contratações <small>(exemplo — a lista terá busca e filtros)</small></h3>
        <table className="gr-tab">
          <thead>
            <tr><th>Nº</th><th>Título</th><th>Área</th><th>Categoria</th><th style={{ textAlign: 'right' }}>Valor</th></tr>
          </thead>
          <tbody>
            <tr><td>70/2026</td><td>Revisão e tradução de textos</td><td>CSP</td><td>Serviços</td><td style={{ textAlign: 'right' }}>R$ 595.810</td></tr>
            <tr><td colSpan={5} className="gr-tab-mais">… e mais 284 contratações</td></tr>
          </tbody>
        </table>
      </div>

      <div className="gr-aviso">
        <strong>Sobre a demonstração:</strong> os números vêm do <strong>PCA 2026</strong> (planejamento). As telas de{' '}
        <strong>Economia, Etapas, Fornecedores e Segmentação de categorias</strong> entram quando ligarmos as bases do
        SEI e das avaliações — aqui elas aparecem no menu para mostrar a visão completa.
      </div>
    </div>
  )
}
