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
 *  Parte 2 — Colabora AI (VDDIG) + Dashboard/Panorama
 *  Parte 3 — Blueprints (consultar) + Terceirizados
 *  Parte 4 — Gravação → Ata + Notebook da Direção + Ferramentas de IA
 *  Parte 5 — Mapa da plataforma (visão Direção) + fechamento  ← esta etapa
 * ------------------------------------------------------------------ */

/* Seções do manual, na ordem — alimenta o sumário clicável.
   Cresce a cada parte. */
const SUMARIO: SumarioItem[] = [
  { id: 'cap-intro', num: '•', titulo: 'Apresentação' },
  { id: 'cap-mapa', num: '•', titulo: 'Mapa da plataforma' },
  { id: 'cap-1', num: '1', titulo: 'Colabora AI: a memória da VDDIG' },
  { id: 'cap-2', num: '2', titulo: 'Panorama: a saúde de todos os setores' },
  { id: 'cap-3', num: '3', titulo: 'Blueprints: os mapas de serviço dos setores' },
  { id: 'cap-4', num: '4', titulo: 'Terceirizados: o diagnóstico da ENSP' },
  { id: 'cap-5', num: '5', titulo: 'Gravação → Ata: reuniões viram ata' },
  { id: 'cap-6', num: '6', titulo: 'Notebook da Direção: consultar os relatórios' },
  { id: 'cap-7', num: '7', titulo: 'Ferramentas de IA: escolher a IA certa' },
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

      {/* ----- Mapa da plataforma (visão Direção) ----- */}
      <section id="cap-mapa" className="manual-sec">
        <h2>Mapa da plataforma</h2>
        <p>
          Antes de ver ferramenta por ferramenta, veja como tudo se conecta na Sala de Situação. Em
          resumo: a Direção <strong>guarda</strong> os relatórios da VDDIG, <strong>acompanha</strong>{' '}
          a situação dos 13 setores e, com isso, <strong>decide</strong> — sempre com a proteção da
          LGPD.
        </p>

        <div className="manual-mapa">
          <div className="mapa-trilha">
            <span className="mapa-trilha-rot">Conhecimento da VDDIG</span>
            <div className="mapa-fluxo">
              <div className="mapa-grupo">
                <span className="mapa-ferr">Colabora AI (VDDIG)</span>
                <span className="mapa-ferr">Gravação → Ata</span>
              </div>
              <span className="mapa-seta" aria-hidden="true">→</span>
              <div className="mapa-no mapa-no-destaque">
                <strong>Notebook da Direção</strong>
                <small>a memória da VDDIG — relatórios, atas e notas</small>
              </div>
              <span className="mapa-seta" aria-hidden="true">→</span>
              <div className="mapa-no">
                <strong>Consultar</strong>
                <small>no Colabora AI ou no Notebook, com as fontes</small>
              </div>
            </div>
          </div>

          <div className="mapa-trilha">
            <span className="mapa-trilha-rot">Situação dos setores</span>
            <div className="mapa-fluxo">
              <div className="mapa-no">
                <strong>Os 13 setores</strong>
                <small>cadastram metas, recursos e serviços</small>
              </div>
              <span className="mapa-seta" aria-hidden="true">→</span>
              <div className="mapa-grupo">
                <span className="mapa-ferr">Panorama</span>
                <span className="mapa-ferr">Blueprints</span>
                <span className="mapa-ferr">Terceirizados</span>
              </div>
              <span className="mapa-seta" aria-hidden="true">→</span>
              <div className="mapa-no mapa-no-destaque">
                <strong>Decisão estratégica</strong>
                <small>a Direção enxerga o todo e prioriza</small>
              </div>
            </div>
          </div>

          <div className="mapa-apoio">
            <span className="mapa-trilha-rot">Apoio no dia a dia</span>
            <div className="mapa-apoio-chips">
              <span className="mapa-ferr">Ferramentas de IA</span>
              <span className="mapa-ferr">Banco de Prompts</span>
              <span className="mapa-ferr">Bússola do Saber</span>
              <span className="mapa-ferr">Manual</span>
            </div>
          </div>

          <div className="mapa-lgpd">
            🛡️ Camada LGPD — protege os dados pessoais em toda a plataforma
          </div>
        </div>

        <p className="manual-dica">
          <strong>Dica:</strong> comece pelo <strong>Panorama</strong> para ver quem precisa de
          atenção; depois use os <strong>Blueprints</strong> e o <strong>Notebook da Direção</strong>{' '}
          para aprofundar.
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

      {/* ----- Blueprints (consultar) ----- */}
      <section id="cap-3" className="manual-sec">
        <h2>3. Blueprints: os mapas de serviço dos setores</h2>
        <p>
          A aba <strong>Blueprints</strong> é a vitrine da Direção para os{' '}
          <Hotword termo="blueprint de serviço">
            Um mapa que “abre” um serviço em etapas (colunas) e camadas (linhas): o que o usuário vê,
            o atendimento e os bastidores. Ajuda a enxergar gargalos e melhorias.
          </Hotword>{' '}
          dos 13 setores. Quem <strong>constrói</strong> esses mapas é o{' '}
          <Hotword termo="POLEM">
            Laboratório de Inovação em Gestão Pública — o setor que desenha e revisa os blueprints de
            todos os outros.
          </Hotword>
          ; a Direção os consulta em <strong>modo leitura</strong> (etiqueta “Direção · leitura” no
          topo).
        </p>
        <Print
          arquivo="blueprints-direcao.png"
          legenda="Aba Blueprints (Direção) — a vitrine dos 13 setores"
        />

        <h3 className="manual-subtitulo">A visão geral (infográfico + cartões)</h3>
        <p>
          No topo, um resumo mostra quantos <strong>setores</strong> estão mapeados, quantos mapas
          estão <strong>Validados</strong>, <strong>Em revisão</strong> ou{' '}
          <strong>Em elaboração</strong>, e a <strong>evolução média</strong> do mapeamento. Abaixo,
          cada setor tem um cartão com a sigla, o status e uma barra de progresso.
        </p>

        <h3 className="manual-subtitulo">Abrir o blueprint de um setor</h3>
        <ol className="manual-passos">
          <li>
            Clique em <strong>Ver blueprint →</strong> no cartão do setor.
          </li>
          <li>
            As <strong>colunas</strong> são as etapas do serviço; as <strong>linhas</strong> mostram,
            de cima para baixo: as <strong>evidências</strong>, as <strong>ações</strong> de quem usa
            o serviço, o <strong>atendimento</strong> (o que aparece para o usuário) e os{' '}
            <strong>bastidores</strong> (o que o setor faz por dentro), além dos{' '}
            <strong>sistemas de apoio</strong>. Entre atendimento e bastidores passa a{' '}
            <Hotword termo="linha de visibilidade">
              A divisão entre o que o usuário enxerga e o que acontece internamente no setor. Acima
              dela é o “palco”; abaixo, os bastidores.
            </Hotword>
            .
          </li>
          <li>
            Abaixo do mapa estão os <strong>gargalos</strong>, as{' '}
            <strong>oportunidades de melhoria</strong> e os principais <strong>indicadores</strong>{' '}
            daquele serviço.
          </li>
          <li>
            Para voltar à vitrine, clique em <strong>← Todos os setores</strong>.
          </li>
        </ol>
        <p className="manual-dica">
          <strong>Dica:</strong> os blueprints ajudam a Direção a comparar a maturidade dos serviços
          e a priorizar onde investir esforço de melhoria.
        </p>
      </section>

      {/* ----- Terceirizados ----- */}
      <section id="cap-4" className="manual-sec">
        <h2>4. Terceirizados: o diagnóstico da ENSP</h2>
        <p>
          A aba <strong>Terceirizados</strong> é um{' '}
          <Hotword termo="diagnóstico consolidado">
            Um retrato que soma e organiza, num lugar só, os contratos de terceirizados de toda a
            ENSP — por setor, empresa e cargo — para apoiar o planejamento.
          </Hotword>{' '}
          dos postos terceirizados da ENSP. É uma aba <strong>restrita à Direção</strong> e trabalha
          com{' '}
          <Hotword termo="dados agregados">
            Números somados por grupo (por setor, por empresa, por cargo), sem nomes nem informações
            pessoais de ninguém — em respeito à LGPD.
          </Hotword>{' '}
          da fonte DIRH/Fiocruz.
        </p>
        <Print
          arquivo="terceirizados-direcao.png"
          legenda="Aba Terceirizados — o diagnóstico consolidado da ENSP"
        />

        <h3 className="manual-subtitulo">O que a tela mostra</h3>
        <ul className="manual-passos">
          <li>
            <strong>Quatro indicadores</strong> no topo: total de terceirizados (postos ativos),
            custo mensal, número de setores com terceirizados e quantas empresas/contratos prestam o
            serviço.
          </li>
          <li>
            Um <strong>gráfico</strong> com os setores que mais concentram terceirizados.
          </li>
          <li>
            Uma <strong>tabela por setor</strong> com o total, o custo mensal, a fatia do custo (%) e
            os principais cargos.
          </li>
          <li>
            Duas listas de apoio: <strong>por empresa prestadora</strong> e{' '}
            <strong>cargos mais frequentes</strong>.
          </li>
        </ul>
        <p className="manual-dica">
          <strong>Proteção de dados (LGPD):</strong> por serem dados de pessoas, o diagnóstico só
          mostra números somados por grupo — nunca nomes. Por isso a aba é restrita à Direção.
        </p>
      </section>

      {/* ----- Gravação → Ata ----- */}
      <section id="cap-5" className="manual-sec">
        <h2>5. Gravação → Ata: reuniões viram ata</h2>
        <p>
          A aba <strong>Gravação → Ata</strong> grava a reunião e usa a IA para{' '}
          <Hotword termo="transcrever">
            Passar a fala para texto automaticamente — em vez de alguém digitar tudo o que foi dito.
          </Hotword>{' '}
          o áudio e montar uma{' '}
          <Hotword termo="ata">
            O documento oficial que registra uma reunião: participantes, pauta, decisões,
            responsáveis e prazos.
          </Hotword>{' '}
          já no modelo padrão da VDDIG. É a mesma ferramenta dos setores, aqui para as reuniões de
          gestão da Direção.
        </p>
        <Print
          arquivo="ata-direcao.png"
          legenda="Aba Gravação → Ata — gravar e gerar a ata da VDDIG"
        />

        <h3 className="manual-subtitulo">Passo a passo</h3>
        <ol className="manual-passos">
          <li>
            Abra a aba <strong>Gravação → Ata</strong> (ou o modo <strong>Reunião → Ata</strong> do
            Colabora AI) e clique em <strong>Gravar reunião em tempo real</strong>.
          </li>
          <li>
            Ao terminar, clique em <strong>Parar e transcrever</strong>. A IA transcreve o áudio e
            organiza a ata: data, participantes, pauta, deliberações (com responsáveis e prazos) e
            próximos passos.
          </li>
          <li>
            <strong>Revise</strong> o texto — a decisão é sempre humana. Depois você pode{' '}
            <strong>Exportar ata (PDF)</strong>, <strong>Copiar texto</strong> ou{' '}
            <strong>Salvar no repositório</strong>.
          </li>
          <li>
            Ao salvar, a ata vai para o <strong>Notebook da Direção</strong> e passa a ser
            consultável junto com os demais relatórios.
          </li>
        </ol>
        <p className="manual-dica">
          <strong>Observação:</strong> na fase de testes, a ata aparece preenchida como exemplo. Em
          uso oficial, a IA transcreve o áudio real da reunião.
        </p>
      </section>

      {/* ----- Notebook da Direção ----- */}
      <section id="cap-6" className="manual-sec">
        <h2>6. Notebook da Direção: consultar os relatórios</h2>
        <p>
          O <strong>Notebook da Direção</strong> é a estante digital da VDDIG: reúne os{' '}
          <Hotword termo="relatórios consolidados">
            Documentos que somam a informação de vários setores — o panorama dos setores, o
            consolidado dos blueprints, o diagnóstico de terceirizados e as atas de gestão.
          </Hotword>{' '}
          e deixa você perguntar sobre eles em{' '}
          <Hotword termo="linguagem natural">
            Escrever a pergunta como você falaria com uma pessoa, sem precisar de palavras-chave ou
            comandos técnicos.
          </Hotword>{' '}
          É a mesma base que você alimenta no Colabora AI da Direção e com as atas salvas.
        </p>
        <Print
          arquivo="notebook-direcao.png"
          legenda="Aba Notebook da Direção — os relatórios consolidados da VDDIG"
        />

        <h3 className="manual-subtitulo">Como usar</h3>
        <ol className="manual-passos">
          <li>
            Abra a aba <strong>Notebook da Direção</strong>. No fim da página está a lista dos
            relatórios guardados, com o tipo (documento ou ata) e a data.
          </li>
          <li>
            Para perguntar, escreva no campo de busca e clique em <strong>Perguntar</strong>.
          </li>
          <li>
            A resposta aparece com as <strong>Fontes</strong> — os documentos que a IA usou —, para
            você conferir de onde saiu cada informação.
          </li>
        </ol>
        <p className="manual-dica">
          <strong>Dica:</strong> o Notebook já vem com relatórios consolidados prontos. Você pode
          acrescentar novos documentos pelo <strong>Colabora AI</strong> (modo Curadoria) ou salvando
          uma <strong>Ata</strong>.
        </p>
      </section>

      {/* ----- Ferramentas de IA ----- */}
      <section id="cap-7" className="manual-sec">
        <h2>7. Ferramentas de IA: escolher a IA certa</h2>
        <p>
          A aba <strong>Ferramentas de IA</strong> é uma{' '}
          <Hotword termo="curadoria">
            Uma seleção organizada e avaliada — aqui, das ferramentas de inteligência artificial que
            fazem sentido para o trabalho da VDDIG.
          </Hotword>{' '}
          das IAs disponíveis (como Claude, ChatGPT, Gemini, Perplexity, NotebookLM e Copilot). Cada
          uma vem com um selo: <strong>Ativo</strong>, <strong>Em avaliação</strong> ou{' '}
          <strong>Desativado</strong>.
        </p>
        <Print
          arquivo="ferramentas-direcao.png"
          legenda="Aba Ferramentas de IA — as IAs avaliadas para a VDDIG"
        />

        <h3 className="manual-subtitulo">Como usar</h3>
        <ol className="manual-passos">
          <li>
            Abra a aba <strong>Ferramentas de IA</strong> e veja os cartões das ferramentas
            avaliadas.
          </li>
          <li>
            Clique em <strong>Ver detalhes</strong> para abrir uma ferramenta: o que ela é, para que
            serve e como acessar/usar (passo a passo).
          </li>
          <li>
            Se ela estiver liberada, clique em <strong>Selecionar</strong>. As{' '}
            <strong>desativadas</strong> não podem ser selecionadas.
          </li>
        </ol>
        <p className="manual-dica">
          <strong>Lembre-se:</strong> a escolha passa por avaliação e validação humana — e a decisão
          final sobre qualquer resultado da IA é sempre da equipe.
        </p>
      </section>

      {/* ----- Fechamento ----- */}
      <section className="manual-sec">
        <h2>Para fechar</h2>
        <p>
          Este é o Manual da <strong>Sala de Situação · Direção</strong>. Com ele, a alta
          administração da VDDIG tem, num lugar só, a memória da Vice-Direção, o panorama
          consolidado dos setores, os mapas de serviço, o diagnóstico de terceirizados e as reuniões
          registradas — tudo com o apoio da inteligência artificial e a proteção da LGPD.
        </p>
        <p>
          Na dúvida sobre qualquer termo, clique nas <span className="hotword-exemplo">palavras
          destacadas</span> ou consulte a <strong>Bússola do Saber</strong>. E lembre-se: a
          plataforma organiza e sugere, mas a <strong>decisão é sempre humana</strong>.
        </p>
      </section>
    </ManualShell>
  )
}
