import { Hotword, ManualShell, Print, SumarioItem } from './kit'

/* ------------------------------------------------------------------ *
 * Manual do Usuário — Sala de Situação · Direção.
 * Nível estratégico/consolidado: reúne a visão de todos os setores para
 * a alta administração da VDDIG. Reaproveita a casca (capa, sumário,
 * hotwords, Exportar PDF) do kit compartilhado (./kit), como o Manual
 * do Setor.
 *
 * Construção incremental (por partes, 1 commit cada):
 *  Parte 1 — casca + Apresentação
 *  Parte 2 — Colabora AI (VDDIG) + Dashboard/Panorama  ← esta etapa
 *  Parte 3 — Blueprints (consultar) + Terceirizados
 *  Parte 4 — Gravação → Ata + Notebook da Direção + Ferramentas de IA
 *  Parte 5 — Mapa da plataforma (visão Direção) + fechamento
 * ------------------------------------------------------------------ */

/* Seções do manual, na ordem — alimenta o sumário clicável.
   Cresce a cada parte. */
const SUMARIO: SumarioItem[] = [
  { id: 'cap-intro', num: '•', titulo: 'Apresentação' },
  { id: 'cap-1', num: '1', titulo: 'Colabora AI: a memória da VDDIG' },
  { id: 'cap-2', num: '2', titulo: 'Panorama: a saúde de todos os setores' },
]

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
          consolidada que só a alta administração acompanha. A forma de <strong>entrar</strong> na
          plataforma é a mesma dos setores (e-mail e senha na tela de acesso).
        </p>
      </section>

      {/* ----- Colabora AI (VDDIG) ----- */}
      <section id="cap-1" className="manual-sec">
        <h2>1. Colabora AI: a memória da VDDIG</h2>
        <p>
          Ao entrar na <strong>Sala de Situação</strong>, a primeira aba é o{' '}
          <Hotword termo="Colabora AI">
            A tela de abertura da Direção — um assistente de inteligência artificial que organiza os
            documentos e as informações da VDDIG e responde perguntas sobre eles.
          </Hotword>
          . É por aqui que a Direção alimenta e conversa com a{' '}
          <Hotword termo="memória da VDDIG">
            O conjunto de documentos, relatórios consolidados e atas da Vice-Direção. Tudo fica no
            Notebook da Direção e é protegido pela camada de LGPD. É diferente da memória de cada
            setor: aqui ficam os documentos da própria VDDIG.
          </Hotword>
          .
        </p>
        <p>
          O campo do meio (“Adicione um documento ou informação do setor…”) é onde você digita. Ao
          lado dele há o botão <strong>+</strong> (para anexar), o seletor de <strong>modo</strong> e
          o acesso à <strong>gravação de reunião</strong>.
        </p>
        <Print
          arquivo="colabora-direcao.png"
          legenda="Colabora AI da Direção — a aba de abertura da Sala de Situação"
        />

        <h3 className="manual-subtitulo">Os três modos</h3>
        <p>
          À direita do campo há um botão que troca o <strong>modo</strong> de trabalho. Clique nele e
          escolha:
        </p>
        <ul className="manual-passos">
          <li>
            <strong>Curadoria</strong> — o modo padrão. Serve para <em>guardar</em>: você anexa um
            documento ou digita uma nota, e ela entra na memória da VDDIG (aparece depois no{' '}
            <strong>Notebook da Direção</strong>).
          </li>
          <li>
            <strong>Consulta</strong> — serve para <em>perguntar</em> aos documentos já guardados. A
            resposta vem citando as <strong>fontes</strong> (os documentos usados).
          </li>
          <li>
            <strong>Reunião → Ata</strong> — abre a gravação de reunião, que a IA transcreve e
            transforma em ata (o mesmo que a aba <strong>Gravação → Ata</strong>).
          </li>
        </ul>

        <h3 className="manual-subtitulo">Guardar um documento (modo Curadoria)</h3>
        <ol className="manual-passos">
          <li>
            Confira que o modo está em <strong>Curadoria</strong>.
          </li>
          <li>
            Clique no botão <strong>+</strong> e escolha <strong>Enviar arquivos</strong>,{' '}
            <strong>Adicionar do Drive</strong> ou <strong>Mais uploads</strong>.
          </li>
          <li>
            Para guardar uma informação rápida (sem arquivo), digite o texto no campo e tecle{' '}
            <strong>Enter</strong> — ela vira uma nota na memória da VDDIG.
          </li>
        </ol>

        <h3 className="manual-subtitulo">Perguntar aos documentos (modo Consulta)</h3>
        <ol className="manual-passos">
          <li>
            Troque o modo para <strong>Consulta</strong>.
          </li>
          <li>
            Escreva a pergunta no campo (ex.: “Quais setores estão com metas em risco?”) e tecle{' '}
            <strong>Enter</strong>.
          </li>
          <li>
            A resposta aparece abaixo, com os <strong>documentos usados como fonte</strong>, para
            você conferir de onde veio a informação.
          </li>
        </ol>

        <p className="manual-dica">
          <strong>Proteção de dados (LGPD):</strong> se você digitar algo com dado pessoal (como um
          CPF), a plataforma mostra um aviso e oferece ajuda para{' '}
          <Hotword termo="anonimizar">
            Trocar os dados que identificam uma pessoa por algo genérico (ex.: “o servidor” em vez do
            nome), para que a informação possa ser usada sem expor ninguém.
          </Hotword>{' '}
          antes de guardar. Na Direção isso é ainda mais importante, porque os relatórios reúnem
          informações de muitos setores.
        </p>
      </section>

      {/* ----- Panorama (Dashboard consolidado) ----- */}
      <section id="cap-2" className="manual-sec">
        <h2>2. Panorama: a saúde de todos os setores</h2>
        <p>
          A aba <strong>Dashboard</strong> da Direção não mostra um setor só — mostra o{' '}
          <Hotword termo="Panorama dos setores">
            Uma visão consolidada com a situação dos 13 setores da VDDIG lado a lado, para a Direção
            ver de relance quem está no prazo e quem precisa de atenção.
          </Hotword>
          , com a etiqueta <strong>Direção · consolidado</strong> no topo. É a fotografia da VDDIG
          inteira.
        </p>
        <Print
          arquivo="panorama-direcao.png"
          legenda="Aba Dashboard da Direção — o panorama consolidado dos setores"
        />

        <h3 className="manual-subtitulo">O resumo no topo (infográfico)</h3>
        <p>
          A primeira faixa resume tudo em números: quantos <strong>setores</strong> existem, quantos
          estão em cada situação e a porcentagem geral de <strong>metas concluídas</strong>. A
          barrinha colorida ao lado mostra a mesma divisão de forma visual. As três situações seguem
          um <Hotword termo="semáforo">
            Um código de cores simples para a saúde do setor: verde quando está tudo no prazo,
            amarelo para atenção e vermelho para o que está crítico.
          </Hotword>:
        </p>
        <ul className="manual-passos">
          <li>
            <strong>No prazo</strong> (verde) — o setor não tem metas em risco.
          </li>
          <li>
            <strong>Atenção</strong> (amarelo) — o setor tem 1 ou 2 metas em risco.
          </li>
          <li>
            <strong>Crítico</strong> (vermelho) — o setor tem 3 ou mais metas em risco.
          </li>
        </ul>

        <h3 className="manual-subtitulo">Os cartões dos setores</h3>
        <p>
          Abaixo do resumo, cada setor tem um cartão com a <strong>sigla</strong>, o{' '}
          <strong>status</strong> (No prazo, Atenção ou Crítico), a porcentagem de metas concluídas,
          quantas estão <strong>em risco</strong> e uma barra de progresso. É o mapa rápido de para
          onde olhar primeiro.
        </p>

        <h3 className="manual-subtitulo">Abrir o dashboard de um setor</h3>
        <ol className="manual-passos">
          <li>
            Clique em <strong>Ver dashboard →</strong> no cartão do setor que você quer examinar.
          </li>
          <li>
            Abre o <strong>dashboard detalhado</strong> daquele setor: missão e objetivos, um{' '}
            <strong>resumo escrito pela IA</strong>, os quatro indicadores (metas concluídas,
            recursos LOAS aplicados, demandas em aberto e metas em risco) e os gráficos de metas,
            recursos, demandas e riscos.
          </li>
          <li>
            Para voltar à visão geral, clique em <strong>← Todos os setores</strong>.
          </li>
        </ol>

        <p className="manual-dica">
          <strong>Dica:</strong> o Panorama é só leitura — a fotografia se monta sozinha a partir das
          metas e recursos que cada setor cadastra. A Direção acompanha; quem atualiza os números é
          cada setor, no seu espaço.
        </p>
      </section>
    </ManualShell>
  )
}
