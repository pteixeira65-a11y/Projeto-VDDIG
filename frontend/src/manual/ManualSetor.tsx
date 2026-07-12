import { ReactNode, useState } from 'react'

/* ------------------------------------------------------------------ *
 * Manual do Usuário — Espaço do Setor.
 * Linguagem simples e dialógica, passo a passo, com "hotwords" (termos
 * que abrem a explicação ao clicar) e espaços reservados para prints
 * reais (que o usuário insere em /public/manual/). Botão Exportar PDF
 * usa a impressão do navegador (Salvar como PDF).
 *
 * Construção incremental: começa por Introdução + Primeiro acesso.
 * ------------------------------------------------------------------ */

/* Termo destacado que revela a definição ao clicar (estilo Bússola do Saber). */
function Hotword({ termo, children }: { termo: string; children: ReactNode }) {
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
function Print({ arquivo, legenda }: { arquivo: string; legenda: string }) {
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

/* Seções do manual, na ordem — alimenta o sumário clicável. */
const SUMARIO = [
  { id: 'cap-intro', num: '•', titulo: 'Apresentação' },
  { id: 'cap-1', num: '1', titulo: 'Primeiro acesso: como entrar' },
  { id: 'cap-2', num: '2', titulo: 'Esqueci minha senha' },
  { id: 'cap-3', num: '3', titulo: 'Colabora AI: o coração do seu setor' },
]

export default function ManualSetor() {
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
        <p className="manual-capa-sub">Espaço do Setor</p>
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
          {SUMARIO.map((s) => (
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

      <article className="manual-doc">
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

        <p className="manual-continua no-print">Mais seções em breve — este manual está sendo construído por partes.</p>
      </article>
    </div>
  )
}
