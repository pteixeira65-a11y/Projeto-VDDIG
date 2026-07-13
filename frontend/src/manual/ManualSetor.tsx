import { Hotword, ManualShell, Print, SumarioItem } from './kit'
import FluxoAudioDoc from '../components/FluxoAudioDoc'

/* ------------------------------------------------------------------ *
 * Manual do Usuário — Espaço do Setor.
 * Linguagem simples e dialógica, passo a passo, com "hotwords" (termos
 * que abrem a explicação ao clicar) e espaços reservados para prints
 * reais (que o usuário insere em /public/manual/). Botão Exportar PDF
 * usa a impressão do navegador (Salvar como PDF).
 *
 * A "casca" (capa, sumário, barra PDF) e os componentes Hotword/Print
 * vêm do kit compartilhado (./kit), reusado também pelo Manual da Direção.
 * ------------------------------------------------------------------ */

/* Seções do manual, na ordem — alimenta o sumário clicável. */
const SUMARIO: SumarioItem[] = [
  { id: 'cap-intro', num: '•', titulo: 'Apresentação' },
  { id: 'cap-mapa', num: '•', titulo: 'Mapa da plataforma' },
  { id: 'cap-1', num: '1', titulo: 'Primeiro acesso: como entrar' },
  { id: 'cap-2', num: '2', titulo: 'Esqueci minha senha' },
  { id: 'cap-3', num: '3', titulo: 'Colabora AI: o coração do seu setor' },
  { id: 'cap-4', num: '4', titulo: 'Dashboard: os números do seu setor' },
  { id: 'cap-5', num: '5', titulo: 'Gravação → Ata: reuniões viram ata' },
  { id: 'cap-6', num: '6', titulo: 'Repositório: consultar os documentos' },
  { id: 'cap-7', num: '7', titulo: 'Ferramentas de IA: escolher a IA certa' },
  { id: 'cap-8', num: '8', titulo: 'Banco de Prompts: pedidos prontos' },
  { id: 'cap-9', num: '9', titulo: 'Bússola do Saber: glossário sem juridiquês' },
  { id: 'cap-10', num: '10', titulo: 'Espaço Setorial: cadastrar e acompanhar metas' },
  { id: 'cap-11', num: '11', titulo: 'Blueprints de serviço (alguns setores)' },
  { id: 'cap-12', num: '12', titulo: 'Mapeamento de Processos · Qualidade (SGQ)' },
]

export default function ManualSetor() {
  return (
    <ManualShell subtitulo="Espaço do Setor" sumario={SUMARIO}>
        {/* ----- Introdução ----- */}
        <section id="cap-intro" className="manual-sec">
          <h2>Bem-vindo(a) à Plataforma Adauto</h2>
          <p>
            A <strong>Plataforma Adauto</strong> é o ambiente de gestão da{' '}
            <Hotword termo="VDDIG">
              Vice-Direção de Desenvolvimento Institucional e Gestão da ENSP/Fiocruz.
            </Hotword>{' '}
            No seu espaço de setor, você encontra as ferramentas para organizar documentos,
            registrar reuniões, acompanhar as metas e usar a inteligência artificial com apoio da{' '}
            <Hotword termo="LGPD">
              Lei Geral de Proteção de Dados — a plataforma tem uma camada que ajuda a não expor
              dados pessoais indevidamente.
            </Hotword>
          </p>
          <p>
            Este manual mostra, passo a passo, como fazer cada coisa. Você pode ler na tela ou{' '}
            <strong>exportar em PDF</strong> (botão no topo) para imprimir ou guardar.
          </p>
        </section>

        {/* ----- Mapa da plataforma ----- */}
        <section id="cap-mapa" className="manual-sec">
          <h2>Mapa da plataforma</h2>
          <p>
            Antes de ver ferramenta por ferramenta, veja como tudo se conecta. Em resumo: você{' '}
            <strong>guarda</strong> informações, elas viram a <strong>memória do setor</strong>, e a
            partir dela você <strong>consulta</strong> e <strong>acompanha</strong> — sempre com a
            proteção da LGPD.
          </p>

          <div className="manual-mapa">
            <div className="mapa-trilha">
              <span className="mapa-trilha-rot">Conhecimento do setor</span>
              <div className="mapa-fluxo">
                <div className="mapa-grupo">
                  <span className="mapa-ferr">Colabora AI</span>
                  <span className="mapa-ferr">Gravação → Ata</span>
                </div>
                <span className="mapa-seta" aria-hidden="true">→</span>
                <div className="mapa-no mapa-no-destaque">
                  <strong>Repositório</strong>
                  <small>a memória do setor — documentos, notas e atas</small>
                </div>
                <span className="mapa-seta" aria-hidden="true">→</span>
                <div className="mapa-no">
                  <strong>Consultar</strong>
                  <small>no Colabora AI ou no Repositório, com as fontes</small>
                </div>
              </div>
            </div>

            <div className="mapa-trilha">
              <span className="mapa-trilha-rot">Metas do setor</span>
              <div className="mapa-fluxo">
                <div className="mapa-no">
                  <strong>Espaço Setorial</strong>
                  <small>cadastrar e atualizar metas</small>
                </div>
                <span className="mapa-seta" aria-hidden="true">→</span>
                <div className="mapa-no">
                  <strong>Dashboard</strong>
                  <small>os números do setor, automáticos</small>
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
            <strong>Dica:</strong> na dúvida de por onde começar, vá ao <strong>Colabora AI</strong> —
            é a porta de entrada do setor.
          </p>
        </section>

        {/* ----- Primeiro acesso ----- */}
        <section id="cap-1" className="manual-sec">
          <h2>1. Primeiro acesso: como entrar</h2>
          <ol className="manual-passos">
            <li>
              Abra a plataforma no navegador (o endereço é fornecido pela sua equipe de TI).
            </li>
            <li>
              Digite o seu <strong>e-mail</strong> institucional no campo <em>E-mail</em>.
            </li>
            <li>
              Digite a sua <strong>senha</strong> no campo <em>Senha</em>.
            </li>
            <li>
              Clique em <strong>Entrar</strong>. Pronto — você cai direto no espaço do seu setor,
              com uma mensagem de boas-vindas.
            </li>
          </ol>
          <Print arquivo="login.png" legenda="Tela de acesso da Plataforma Adauto" />
          <p className="manual-dica">
            <strong>Dica:</strong> a senha diferencia maiúsculas de minúsculas. Se não conseguir
            entrar, confira se o <em>Caps Lock</em> não está ligado.
          </p>
        </section>

        {/* ----- Esqueci a senha ----- */}
        <section id="cap-2" className="manual-sec">
          <h2>2. Esqueci minha senha</h2>
          <p>Se você não lembra a senha, é simples recuperar:</p>
          <ol className="manual-passos">
            <li>
              Na tela de acesso, clique em <strong>“Esqueci minha senha”</strong>.
            </li>
            <li>
              Informe o seu <strong>e-mail</strong> e clique em <strong>Enviar código</strong>.
            </li>
            <li>
              Você receberá um{' '}
              <Hotword termo="código de verificação">
                Uma sequência de 6 números, válida por 15 minutos, que confirma que o pedido é
                mesmo seu.
              </Hotword>{' '}
              Digite-o no campo indicado.
            </li>
            <li>
              Crie uma <strong>nova senha</strong> (mínimo de 6 caracteres), repita para confirmar
              e clique em <strong>Redefinir senha</strong>.
            </li>
            <li>
              Volte ao login e entre com a nova senha.
            </li>
          </ol>
          <Print arquivo="recuperar-senha.png" legenda="Tela de recuperação de senha" />
          <p className="manual-dica">
            <strong>Observação:</strong> por enquanto o código aparece na própria tela (fase de
            testes). Quando a plataforma estiver em uso oficial, ele chegará no seu e-mail.
          </p>
        </section>

        {/* ----- Colabora AI ----- */}
        <section id="cap-3" className="manual-sec">
          <h2>3. Colabora AI: o coração do seu setor</h2>
          <p>
            A partir daqui, cada seção explica uma aba (ferramenta) do seu espaço. Começamos pela
            principal: o{' '}
            <Hotword termo="Colabora AI">
              É a tela de abertura do seu setor — um assistente de inteligência artificial que
              organiza os documentos e as informações da sua área e responde perguntas sobre eles.
            </Hotword>{' '}
            É por aqui que você alimenta e conversa com a{' '}
            <Hotword termo="memória do setor">
              O conjunto de documentos, atas e anotações que você vai guardando. Tudo fica no
              Repositório do setor e é protegido pela camada de LGPD.
            </Hotword>
            .
          </p>
          <p>
            O campo do meio (“Adicione um documento ou informação do setor…”) é onde você digita.
            Ao lado dele há três controles importantes: o botão <strong>+</strong> (para anexar), o
            seletor de <strong>modo</strong> e o <strong>microfone</strong>.
          </p>
          <Print arquivo="colabora-ai.png" legenda="Tela do Colabora AI — a aba principal do setor" />

          <h3 className="manual-subtitulo">Os três modos</h3>
          <p>
            No canto direito do campo há um botão que troca o <strong>modo</strong> de trabalho.
            Clique nele e escolha:
          </p>
          <ul className="manual-passos">
            <li>
              <strong>Curadoria</strong> — o modo padrão. Serve para <em>guardar</em> informações:
              você anexa um documento ou digita uma nota, e ela entra na memória do setor.
            </li>
            <li>
              <strong>Consulta</strong> — serve para <em>perguntar</em> aos documentos já guardados.
              A resposta vem citando as fontes (os documentos usados).
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
              <strong>Enter</strong> — ela vira uma nota na memória do setor.
            </li>
            <li>
              Tudo o que você guarda aqui aparece depois na aba{' '}
              <strong>Repositório (NotebookLM)</strong>.
            </li>
          </ol>

          <h3 className="manual-subtitulo">Perguntar aos documentos (modo Consulta)</h3>
          <ol className="manual-passos">
            <li>
              Troque o modo para <strong>Consulta</strong>.
            </li>
            <li>
              Escreva a pergunta no campo (ex.: “Quais são as pendências do setor?”) e clique na{' '}
              <strong>lupa</strong> (ou tecle Enter).
            </li>
            <li>
              A resposta aparece logo abaixo, com os <strong>documentos usados como fonte</strong>{' '}
              listados — assim você confere de onde veio a informação.
            </li>
          </ol>

          <p className="manual-dica">
            <strong>Atalhos:</strong> abaixo do campo há botões prontos como{' '}
            <em>Resumir última reunião</em> e <em>Listar pendências</em>. Clicar já preenche a
            pergunta para você. O <strong>microfone</strong> permite gravar em vez de digitar.
          </p>

          <p className="manual-dica">
            <strong>Proteção de dados (LGPD):</strong> se você digitar algo com dado pessoal
            sensível (como um CPF), a plataforma mostra um aviso e oferece ajuda para{' '}
            <Hotword termo="anonimizar">
              Trocar os dados que identificam uma pessoa por algo genérico (ex.: “o servidor” em vez
              do nome), para que a informação possa ser usada sem expor ninguém.
            </Hotword>{' '}
            antes de guardar. Sempre revise antes de registrar.
          </p>
        </section>

        {/* ----- Dashboard ----- */}
        <section id="cap-4" className="manual-sec">
          <h2>4. Dashboard: os números do seu setor</h2>
          <p>
            O{' '}
            <Hotword termo="Dashboard">
              Um painel que reúne, num lugar só, os números mais importantes do seu setor — metas,
              recursos e demandas — para você ver a situação de relance, sem abrir planilha.
            </Hotword>{' '}
            fica na aba <strong>Dashboard</strong>. Diferente do Colabora AI (onde você guarda e
            pergunta coisas), aqui você só <em>consulta</em>: é a fotografia de como o setor está
            hoje. Os dados vêm das metas e recursos cadastrados — você não precisa preencher nada
            nesta tela.
          </p>
          <Print arquivo="dashboard.png" legenda="Aba Dashboard — os indicadores do seu setor" />

          <h3 className="manual-subtitulo">O resumo da IA (no topo)</h3>
          <p>
            A primeira faixa, com a etiqueta <strong>IA · resumo</strong>, é um pequeno texto que a
            inteligência artificial escreve lendo os números do setor. Serve para você entender a
            situação em uma frase, antes de olhar os detalhes. Logo abaixo aparecem a{' '}
            <strong>missão</strong> e os <strong>objetivos</strong> do setor, para dar contexto.
          </p>

          <h3 className="manual-subtitulo">Os quatro indicadores</h3>
          <p>
            No meio da tela há quatro cartões coloridos. Cada um é um{' '}
            <Hotword termo="indicador">
              Um número que resume como está indo uma coisa importante — por exemplo, a porcentagem
              de metas já concluídas. Serve para acompanhar sem precisar ler tudo.
            </Hotword>
            :
          </p>
          <ul className="manual-passos">
            <li>
              <strong>Metas concluídas</strong> — a porcentagem de metas já finalizadas (e quantas
              de quantas, ex.: 8/12).
            </li>
            <li>
              <strong>Recursos LOAS aplicados</strong> — quanto da{' '}
              <Hotword termo="verba LOAS">
                A verba que o setor administra e presta contas. O cartão mostra quanto do valor
                previsto para o ano já foi de fato aplicado.
              </Hotword>{' '}
              já foi usado, em porcentagem e em reais.
            </li>
            <li>
              <strong>Demandas em aberto</strong> — quantos pedidos ou tarefas ainda estão em
              andamento (e quantos já foram concluídos).
            </li>
            <li>
              <strong>Metas em risco</strong> — quantas metas estão{' '}
              <Hotword termo="em risco">
                Metas atrasadas ou que já passaram (ou estão perto de passar) do prazo previsto. É o
                que costuma pedir atenção primeiro.
              </Hotword>
              . Quando esse número está alto, é sinal de alerta.
            </li>
          </ul>

          <h3 className="manual-subtitulo">O gráfico das metas</h3>
          <p>
            Por fim, o quadro <strong>“Status das metas do setor”</strong> mostra, em barras, quantas
            metas estão concluídas, em andamento ou atrasadas. É a mesma informação dos cartões, só
            que visual — bom para perceber tendências de relance.
          </p>

          <p className="manual-dica">
            <strong>Dica:</strong> o Dashboard é só leitura. Para mudar os números (concluir uma
            meta, registrar um recurso aplicado), a atualização é feita nos cadastros do setor — o
            painel reflete isso automaticamente.
          </p>
        </section>

        {/* ----- Gravação → Ata ----- */}
        <section id="cap-5" className="manual-sec">
          <h2>5. Gravação → Ata: reuniões viram ata</h2>
          <p>
            A aba <strong>Gravação → Ata</strong> registra a fala — <strong>gravando a reunião ao
            vivo</strong> ou <strong>importando o áudio de uma entrevista</strong> já gravada — e usa
            a IA para{' '}
            <Hotword termo="transcrever">
              Passar a fala para texto automaticamente — em vez de você digitar tudo o que foi dito.
            </Hotword>{' '}
            o áudio. Você <strong>revisa o texto</strong> (validação humana) e a plataforma monta a{' '}
            <Hotword termo="ata">
              O documento oficial que registra uma reunião: participantes, pauta, decisões,
              responsáveis e prazos.
            </Hotword>{' '}
            no modelo padrão da VDDIG, com o timbre Fiocruz/ENSP.
          </p>

          <h3 className="manual-subtitulo">Como funciona, em um olhar</h3>
          <FluxoAudioDoc />

          <Print arquivo="gravacao-ata.png" legenda="Aba Gravação → Ata — gravar ou importar áudio e gerar a ata" />

          <h3 className="manual-subtitulo">Passo a passo</h3>
          <ol className="manual-passos">
            <li>
              Abra a aba <strong>Gravação → Ata</strong>.
            </li>
            <li>
              Escolha a entrada: <strong>Gravar reunião ao vivo</strong> (grava pelo microfone) ou{' '}
              <strong>Enviar áudio (entrevista)</strong> para transcrever um arquivo já gravado.
            </li>
            <li>
              A IA <strong>transcreve o áudio</strong> — localmente, no computador. O texto aparece
              numa <strong>caixa editável</strong>.
            </li>
            <li>
              <strong>Validação humana:</strong> revise e corrija a transcrição e confira o{' '}
              <strong>setor</strong>. Nada vira registro oficial sem a sua conferência.
            </li>
            <li>
              Clique em <strong>Gerar ata</strong>: a plataforma monta a ata no modelo da VDDIG, com o
              timbre Fiocruz/ENSP. Depois você pode <strong>Exportar (PDF)</strong>,{' '}
              <strong>Copiar texto</strong> ou <strong>Salvar no repositório</strong>.
            </li>
            <li>
              Ao salvar, a ata vai para o <strong>Repositório</strong> do setor e passa a ser
              consultável junto com os demais documentos.
            </li>
          </ol>
          <p className="manual-dica">
            <strong>Observação:</strong> na demonstração, a transcrição vem de um exemplo. Em uso
            oficial, a IA transcreve o <strong>áudio real</strong> — 100% no computador, e o áudio é{' '}
            <strong>descartado</strong> após a transcrição (só o texto é guardado).
          </p>
        </section>

        {/* ----- Repositório (NotebookLM) ----- */}
        <section id="cap-6" className="manual-sec">
          <h2>6. Repositório: consultar os documentos do setor</h2>
          <p>
            O <strong>Repositório (NotebookLM)</strong> é a estante digital do setor: reúne tudo o
            que você guardou — documentos, notas e atas — e deixa você perguntar sobre eles em{' '}
            <Hotword termo="linguagem natural">
              Escrever a pergunta como você falaria com uma pessoa, sem precisar de palavras-chave ou
              comandos técnicos.
            </Hotword>
            . É a mesma base que você alimenta no Colabora AI e com as atas salvas.
          </p>
          <Print
            arquivo="repositorio.png"
            legenda="Aba Repositório (NotebookLM) — a base de documentos do setor"
          />

          <h3 className="manual-subtitulo">Como usar</h3>
          <ol className="manual-passos">
            <li>
              Abra a aba <strong>Repositório (NotebookLM)</strong>. No fim da página está a lista de
              tudo que o setor guardou, com o tipo (documento, nota ou ata) e a data.
            </li>
            <li>
              Para perguntar, escreva no campo <em>“Pergunte aos documentos do setor…”</em> e clique
              em <strong>Perguntar</strong>.
            </li>
            <li>
              A resposta aparece com as <strong>Fontes</strong> — os documentos que a IA usou —, para
              você conferir de onde saiu cada informação.
            </li>
          </ol>
          <p className="manual-dica">
            <strong>Dica:</strong> se o repositório estiver vazio, guarde documentos primeiro no{' '}
            <strong>Colabora AI</strong> (modo Curadoria) ou gere uma <strong>Ata</strong>.
          </p>
        </section>

        {/* ----- Ferramentas de IA ----- */}
        <section id="cap-7" className="manual-sec">
          <h2>7. Ferramentas de IA: escolher a IA certa</h2>
          <p>
            A aba <strong>Ferramentas de IA</strong> é uma{' '}
            <Hotword termo="curadoria">
              Uma seleção organizada e avaliada — aqui, das ferramentas de inteligência artificial
              que fazem sentido para o trabalho do setor.
            </Hotword>{' '}
            das IAs disponíveis (como Claude, ChatGPT, Gemini, Perplexity, NotebookLM e Copilot).
            Cada uma vem com um selo: <strong>Ativo</strong>, <strong>Em avaliação</strong> ou{' '}
            <strong>Desativado</strong>.
          </p>
          <Print
            arquivo="ferramentas-ia.png"
            legenda="Aba Ferramentas de IA — as IAs avaliadas para o setor"
          />

          <h3 className="manual-subtitulo">Como usar</h3>
          <ol className="manual-passos">
            <li>
              Abra a aba <strong>Ferramentas de IA</strong> e veja os cartões das ferramentas
              avaliadas.
            </li>
            <li>
              Clique em <strong>Ver detalhes</strong> para abrir uma ferramenta: o que ela é, para
              que serve no setor e como acessar/usar (passo a passo).
            </li>
            <li>
              Se ela estiver liberada, clique em <strong>Selecionar para o setor</strong>. As{' '}
              <strong>desativadas</strong> não podem ser selecionadas.
            </li>
          </ol>
          <p className="manual-dica">
            <strong>Lembre-se:</strong> a escolha passa por avaliação e validação humana — e a
            decisão final sobre qualquer resultado da IA é sempre sua.
          </p>
        </section>

        {/* ----- Banco de Prompts ----- */}
        <section id="cap-8" className="manual-sec">
          <h2>8. Banco de Prompts: pedidos prontos para a IA</h2>
          <p>
            No menu do topo, <strong>Prompts</strong> abre o Banco de Prompts: uma biblioteca de{' '}
            <Hotword termo="prompts">
              Prompt é o texto do pedido que você faz a uma IA. Um bom prompt, claro e com contexto,
              leva a uma resposta melhor.
            </Hotword>{' '}
            prontos para o dia a dia — redigir ofícios, resumir normas, anonimizar dados, criar metas
            e mais.
          </p>
          <Print
            arquivo="banco-prompts.png"
            legenda="Banco de Prompts — modelos prontos, com busca e botão copiar"
          />

          <h3 className="manual-subtitulo">Como usar</h3>
          <ol className="manual-passos">
            <li>
              No topo, abra <strong>Prompts</strong>.
            </li>
            <li>
              Busque por uma palavra (ex.: <em>LGPD</em>, <em>resumir norma</em>, <em>meta</em>) ou
              role a lista. Cada cartão tem a categoria, o texto e uma dica de quando usar.
            </li>
            <li>
              Clique em <strong>Copiar</strong> e cole o prompt na ferramenta de IA.
            </li>
            <li>
              Troque os campos entre colchetes <code>[assim]</code> pelas suas informações e envie.
            </li>
          </ol>
          <p className="manual-dica">
            <strong>Dica:</strong> sempre revise o resultado antes de usar — o prompt é um ponto de
            partida, não a palavra final.
          </p>
        </section>

        {/* ----- Bússola do Saber ----- */}
        <section id="cap-9" className="manual-sec">
          <h2>9. Bússola do Saber: o glossário sem juridiquês</h2>
          <p>
            A <strong>Bússola do Saber</strong> (menu <strong>Bússola</strong>, no topo) é um{' '}
            <Hotword termo="glossário">
              Uma lista de termos com o significado de cada um. O da Bússola é escrito em linguagem
              simples, com exemplo e fonte.
            </Hotword>{' '}
            de siglas, normas e termos de IA, explicados em poucas linhas. É a mesma ideia das
            palavras destacadas deste manual.
          </p>
          <Print arquivo="bussola.png" legenda="Bússola do Saber — busca de termos em linguagem simples" />

          <h3 className="manual-subtitulo">Como usar</h3>
          <ol className="manual-passos">
            <li>
              Abra a <strong>Bússola</strong> no menu do topo.
            </li>
            <li>
              Digite a sigla, a norma ou o termo (ex.: <em>LOAS</em>, <em>RAG</em>,{' '}
              <em>proteção de dados</em>). A busca ignora acentos e maiúsculas.
            </li>
            <li>
              Leia a explicação, o <strong>exemplo</strong> e a <strong>fonte</strong>. Os termos vêm
              separados por categoria (Normativo, Gestão pública, IA e Tecnologia).
            </li>
          </ol>
        </section>

        {/* ----- Espaço Setorial ----- */}
        <section id="cap-10" className="manual-sec">
          <h2>10. Espaço Setorial: cadastrar e acompanhar metas</h2>
          <p>
            O <strong>Espaço Setorial</strong> (menu <strong>Setor</strong>, no topo) é onde o setor
            cadastra e acompanha suas <strong>metas</strong>. É daqui que saem os números do{' '}
            <strong>Dashboard</strong>: quando você cria ou atualiza uma meta aqui, o painel se
            ajusta sozinho.
          </p>
          <Print
            arquivo="espaco-setorial.png"
            legenda="Espaço Setorial — metas, indicadores e cadastro"
          />

          <h3 className="manual-subtitulo">Como usar</h3>
          <ol className="manual-passos">
            <li>
              Abra <strong>Setor</strong> no menu do topo. No alto aparecem a missão, os objetivos e
              os quatro indicadores do setor (os mesmos do Dashboard).
            </li>
            <li>
              No cartão <strong>Nova meta</strong>, preencha os campos e salve — a meta entra na
              lista.
            </li>
            <li>
              Na tabela <strong>Metas do setor</strong>, acompanhe o <strong>status</strong>, o{' '}
              <strong>progresso</strong> e o <strong>prazo</strong> de cada meta. O botão{' '}
              <strong>Excluir</strong> remove uma meta.
            </li>
          </ol>
          <p className="manual-dica">
            <strong>Proteção de dados (LGPD):</strong> se você escrever um dado pessoal no texto da
            meta, a plataforma avisa e oferece ajuda para anonimizar antes de salvar.
          </p>
        </section>

        {/* ----- Blueprints (só alguns setores) ----- */}
        <section id="cap-11" className="manual-sec">
          <h2>
            11. Blueprints de serviço{' '}
            <span className="manual-opcional">(alguns setores)</span>
          </h2>
          <p>
            Algumas abas só aparecem em setores específicos. A aba <strong>Blueprints</strong> fica
            no espaço do <strong>POLEM</strong> (Laboratório de Inovação em Gestão Pública), que
            constrói o{' '}
            <Hotword termo="blueprint de serviço">
              Um mapa que “abre” um serviço em etapas (colunas) e camadas (linhas): o que o usuário
              vê, o atendimento e os bastidores. Ajuda a enxergar gargalos e melhorias.
            </Hotword>{' '}
            de cada um dos 13 setores da VDDIG.
          </p>
          <Print arquivo="blueprints.png" legenda="Aba Blueprints — o mapa de serviço dos setores (POLEM)" />

          <h3 className="manual-subtitulo">Como usar</h3>
          <ol className="manual-passos">
            <li>
              Abra a aba <strong>Blueprints</strong>. O painel mostra os 13 setores, cada um com o{' '}
              <strong>status</strong> (Validado, Em revisão ou Em elaboração) e a evolução do mapa.
            </li>
            <li>
              Clique em um setor para abrir o blueprint. As <strong>colunas</strong> são as etapas do
              serviço; as <strong>linhas</strong> mostram, de cima para baixo, as evidências, as
              ações do usuário, o atendimento e os bastidores.
            </li>
            <li>
              Abaixo do mapa você encontra os <strong>gargalos</strong>, as{' '}
              <strong>oportunidades de melhoria</strong> e os principais <strong>indicadores</strong>.
            </li>
          </ol>
        </section>

        {/* ----- Mapeamento · Qualidade (só o SGQ) ----- */}
        <section id="cap-12" className="manual-sec">
          <h2>
            12. Mapeamento de Processos · Qualidade{' '}
            <span className="manual-opcional">(SGQ)</span>
          </h2>
          <p>
            A aba <strong>Mapeamento · Qualidade</strong> aparece no espaço do <strong>SGQ</strong>{' '}
            (Serviço de Gestão da Qualidade). Reúne os recursos para padronizar processos: modelos,
            documento padrão (
            <Hotword termo="POP">
              Procedimento Operacional Padrão — o documento que descreve, passo a passo, como uma
              tarefa deve ser feita, para todos fazerem do mesmo jeito.
            </Hotword>
            ), diagnóstico e geração a partir de entrevistas.
          </p>
          <Print
            arquivo="mapeamento-qualidade.png"
            legenda="Aba Mapeamento · Qualidade — recursos de processos do SGQ"
          />

          <h3 className="manual-subtitulo">O que há em cada recurso</h3>
          <ul className="manual-passos">
            <li>
              <strong>Exemplos de mapeamento</strong> — fluxogramas prontos (padrão{' '}
              <Hotword termo="BPMN">
                Uma forma padronizada de desenhar processos com caixinhas e setas, mostrando quem faz
                o quê e em que ordem.
              </Hotword>
              ) de processos reais da ENSP.
            </li>
            <li>
              <strong>Documento padrão (POP)</strong> — um modelo de procedimento pronto para
              consultar.
            </li>
            <li>
              <strong>Relatório de diagnóstico</strong> — a situação dos processos do setor, com um
              infográfico (quantos estão válidos e quantos obsoletos).
            </li>
            <li>
              <strong>Gerar POP a partir de entrevistas</strong> — você importa os áudios das
              entrevistas e a IA monta o documento padrão.
            </li>
          </ul>
          <p className="manual-dica">
            <strong>Dica:</strong> clique em cada recurso para abri-lo ou recolhê-lo.
          </p>
        </section>

        <p className="manual-continua no-print">
          Este é o fim do Manual do Setor. Em uma próxima etapa entra o{' '}
          <strong>mapa da plataforma</strong> — um diagrama que mostra, de relance, como todas essas
          ferramentas se conectam.
        </p>
    </ManualShell>
  )
}
