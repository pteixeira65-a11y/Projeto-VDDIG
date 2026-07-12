import { Hotword, ManualShell, SumarioItem } from './kit'

/* ------------------------------------------------------------------ *
 * Manual do Usuário — Sala de Situação · Direção.
 * Nível estratégico/consolidado: reúne a visão de todos os setores para
 * a alta administração da VDDIG. Reaproveita a casca (capa, sumário,
 * hotwords, Exportar PDF) do kit compartilhado (./kit), como o Manual
 * do Setor.
 *
 * Construção incremental (por partes, 1 commit cada):
 *  Parte 1 — casca + Apresentação  ← esta etapa
 *  Parte 2 — Colabora AI (VDDIG) + Dashboard/Panorama
 *  Parte 3 — Blueprints (consultar) + Terceirizados
 *  Parte 4 — Gravação → Ata + Notebook da Direção + Ferramentas de IA
 *  Parte 5 — Mapa da plataforma (visão Direção) + fechamento
 * ------------------------------------------------------------------ */

/* Seções do manual, na ordem — alimenta o sumário clicável.
   Cresce a cada parte. */
const SUMARIO: SumarioItem[] = [{ id: 'cap-intro', num: '•', titulo: 'Apresentação' }]

export default function ManualDirecao() {
  return (
    <ManualShell subtitulo="Sala de Situação · Direção" sumario={SUMARIO}>
      {/* ----- Apresentação ----- */}
      <section id="cap-intro" className="manual-sec">
        <h2>Bem-vindo(a) à Sala de Situação</h2>
        <p>
          A <strong>Sala de Situação</strong> é o espaço estratégico da{' '}
          <Hotword termo="VDDIG">
            Vice-Direção de Desenvolvimento Institucional e Gestão da ENSP/Fiocruz.
          </Hotword>{' '}
          Enquanto cada setor cuida do seu dia a dia no próprio espaço, aqui a Direção enxerga{' '}
          <strong>todos os setores juntos</strong>: metas, recursos, serviços e riscos, num{' '}
          <Hotword termo="panorama consolidado">
            Uma visão que soma e organiza as informações dos 13 setores da VDDIG num lugar só, para
            apoiar as decisões da alta administração.
          </Hotword>{' '}
          — para decidir com o quadro completo à frente.
        </p>
        <p>
          Este manual mostra, passo a passo, as ferramentas da Sala de Situação: onde ver os números
          da VDDIG inteira, consultar os mapas de serviço dos setores, acompanhar os contratos
          terceirizados, registrar reuniões e conversar com a memória da Direção — sempre com o apoio
          da inteligência artificial e a proteção da{' '}
          <Hotword termo="LGPD">
            Lei Geral de Proteção de Dados — a plataforma tem uma camada que ajuda a não expor dados
            pessoais indevidamente.
          </Hotword>
        </p>
        <p>
          Você pode ler na tela ou <strong>exportar em PDF</strong> (botão no topo) para imprimir ou
          guardar. Ao longo do texto, clique nas <span className="hotword-exemplo">palavras
          destacadas</span> para ver o que significam.
        </p>
        <p className="manual-dica">
          <strong>Observação:</strong> há um manual separado para os setores — o{' '}
          <strong>Manual do Espaço do Setor</strong>. Este aqui é o da Direção, com a visão
          consolidada que só a alta administração acompanha.
        </p>
      </section>
    </ManualShell>
  )
}
