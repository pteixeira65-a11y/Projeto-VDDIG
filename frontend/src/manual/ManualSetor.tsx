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
  return (
    <figure className="manual-print">
      {ok ? (
        <img src={`/manual/${arquivo}`} alt={legenda} onError={() => setOk(false)} />
      ) : (
        <div className="manual-print-ph">
          <span className="manual-print-ph-tit">Imagem da tela</span>
          <span className="manual-print-ph-sub">{legenda}</span>
          <span className="manual-print-ph-hint">print a inserir · /public/manual/{arquivo}</span>
        </div>
      )}
      <figcaption>{legenda}</figcaption>
    </figure>
  )
}

export default function ManualSetor() {
  return (
    <div className="manual-wrap">
      <div className="manual-topo no-print">
        <div>
          <h1 className="manual-titulo">Manual do Usuário — Espaço do Setor</h1>
          <p className="manual-sub">
            Um guia simples e direto para você usar a Plataforma Adauto no dia a dia do seu setor.
            Clique nos termos <span className="hotword-exemplo">destacados</span> para ver o que
            significam.
          </p>
        </div>
        <button type="button" className="manual-pdf" onClick={() => window.print()}>
          Exportar PDF
        </button>
      </div>

      <article className="manual-doc">
        {/* ----- Introdução ----- */}
        <section className="manual-sec">
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
        <section className="manual-sec">
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
        <section className="manual-sec">
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

        <p className="manual-continua no-print">Mais seções em breve — este manual está sendo construído por partes.</p>
      </article>
    </div>
  )
}
