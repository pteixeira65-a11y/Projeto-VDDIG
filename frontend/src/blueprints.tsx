import { useState } from 'react'
import { IconBlueprint } from './components/icons'

/* ------------------------------------------------------------------ *
 * Blueprints de Serviço dos setores da VDDIG.
 *
 * O POLEM (Laboratório de Inovação em Gestão Pública) constrói os
 * blueprints de todos os setores seguindo a metodologia de Service
 * Blueprint: cada serviço é lido por etapas (colunas) e camadas (linhas):
 *   Evidências · Ações do usuário · Frontstage · Backstage · Sistemas.
 * A Direção consulta os mesmos blueprints em modo leitura.
 * Dados de exemplo (mockup) baseados nas competências reais de cada setor.
 * ------------------------------------------------------------------ */

export type BpRow = { label: string; classe: string; celulas: string[] }
export type BpStatus = 'pronto' | 'revisao' | 'andamento'

export interface Blueprint {
  sigla: string
  nome: string
  sub: string
  status: BpStatus
  progresso: number // 0-100 — evolução do mapeamento
  stages: string[]
  rows: BpRow[]
  gargalos: string[]
  oportunidades: string[]
  indicadores: { k: string; v: string }[]
}

const L = {
  evid: 'Evidências',
  front: 'Atendimento (frontstage)',
  back: 'Bastidores (backstage)',
  apoio: 'Sistemas e apoio',
}

export const BLUEPRINTS: Blueprint[] = [
  /* ---------------- SEPLAN ---------------- */
  {
    sigla: 'SEPLAN',
    nome: 'Planejamento e Desenvolvimento Institucional',
    sub: 'Construção, pactuação e monitoramento do plano institucional.',
    status: 'pronto',
    progresso: 95,
    stages: ['Diretrizes', 'Elaboração do plano', 'Pactuação de metas', 'Monitoramento', 'Avaliação'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Diretrizes da Fiocruz', 'Minuta do plano (PDI)', 'Metas pactuadas', 'Painéis de acompanhamento', 'Relatório de gestão'] },
      { label: 'Ações do setor', classe: 'bp-req', celulas: ['Aponta prioridades', 'Contribui com o plano', 'Assume as metas', 'Reporta o avanço', 'Valida resultados'] },
      { label: L.front, classe: 'bp-front', celulas: ['Alinha diretrizes', 'Conduz oficinas', 'Formaliza a pactuação', 'Consolida indicadores', 'Devolve a análise'] },
      { label: L.back, classe: 'bp-back', celulas: ['Analisa o cenário', 'Estrutura o PDI', 'Desdobra metas por setor', 'Cruza dados de execução', 'Elabora a avaliação'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['Diretoria', 'Planilhas / BI', 'Comitês', 'Setores da VDDIG', 'Fiocruz (sede)'] },
    ],
    gargalos: ['Metas nem sempre desdobradas até o setor.', 'Dados de execução dispersos entre setores.', 'Cultura de monitoramento contínuo ainda incipiente.'],
    oportunidades: ['Painel único de metas e indicadores.', 'Calendário fixo de monitoramento.', 'Integração automática dos dados dos setores.'],
    indicadores: [{ k: 'Metas pactuadas', v: '48' }, { k: 'Ciclo de revisão', v: 'Anual' }, { k: 'Setores no PDI', v: '13' }, { k: 'Etapa mais lenta', v: 'Monitoramento' }],
  },
  /* ---------------- SEOF ---------------- */
  {
    sigla: 'SEOF',
    nome: 'Serviço de Orçamento e Finanças',
    sub: 'Execução orçamentária e financeira, do crédito à prestação de contas.',
    status: 'pronto',
    progresso: 100,
    stages: ['Descentralização', 'Empenho', 'Liquidação', 'Pagamento', 'Prestação de contas'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Crédito no Siafi', 'Nota de empenho', 'Atesto / liquidação', 'Ordem bancária', 'Conformidade contábil'] },
      { label: 'Ações do demandante', classe: 'bp-req', celulas: ['Solicita o recurso', 'Informa a despesa', 'Atesta o recebimento', 'Acompanha o pagamento', 'Presta informações'] },
      { label: L.front, classe: 'bp-front', celulas: ['Orienta a execução', 'Registra o empenho', 'Confere a liquidação', 'Efetua o pagamento', 'Responde à auditoria'] },
      { label: L.back, classe: 'bp-back', celulas: ['Programa o orçamento', 'Classifica a despesa', 'Corrige inconsistências', 'Concilia as contas', 'Registra a conformidade'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['Siafi', 'Tesouro Gerencial', 'SEI', 'Compras / GESCON', 'CGU / TCU'] },
    ],
    gargalos: ['Inconsistências contábeis recorrentes.', 'Prazos apertados no fim do exercício.', 'Dependência de sistemas externos (Siafi).'],
    oportunidades: ['Checklist automático de conformidade.', 'Painel de execução orçamentária em tempo real.', 'Alertas de prazo de pagamento.'],
    indicadores: [{ k: 'Execução do orçamento', v: '92%' }, { k: 'Ordens no mês', v: '~140' }, { k: 'Conformidade', v: 'Em dia' }, { k: 'Etapa mais lenta', v: 'Liquidação' }],
  },
  /* ---------------- GESCON ---------------- */
  {
    sigla: 'GESCON',
    nome: 'Gestão de Contratos Continuados',
    sub: 'Ciclo de vida dos contratos de serviços continuados, do recebimento ao encerramento.',
    status: 'andamento',
    progresso: 70,
    stages: ['Recebimento', 'Análise', 'Fiscalização', 'Aditivo / repactuação', 'Encerramento'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Contrato assinado', 'Mapa de análise', 'Relatórios de fiscalização', 'Termo aditivo', 'Termo de encerramento'] },
      { label: 'Ações do fiscal', classe: 'bp-req', celulas: ['Recebe o contrato', 'Esclarece dúvidas', 'Registra ocorrências', 'Solicita repactuação', 'Confirma o encerramento'] },
      { label: L.front, classe: 'bp-front', celulas: ['Orienta a gestão', 'Explica as cláusulas', 'Capacita os fiscais', 'Analisa reajustes', 'Formaliza o encerramento'] },
      { label: L.back, classe: 'bp-back', celulas: ['Autua o contrato', 'Analisa garantias', 'Controla vigências', 'Instrui aditivos', 'Arquiva o processo'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['SEI', 'Planilha de contratos', 'Jurídico', 'SEOF', 'Compras'] },
    ],
    gargalos: ['Fiscais sobrecarregados e pouco treinados.', 'Prazos de aditivo próximos do vencimento.', 'Informações contratuais dispersas.'],
    oportunidades: ['Painel de vigências com alertas automáticos.', 'Trilha de capacitação de fiscais.', 'Repositório único de contratos.'],
    indicadores: [{ k: 'Contratos ativos', v: '~60' }, { k: 'Fiscais designados', v: '90+' }, { k: 'Aditivos no ano', v: '34' }, { k: 'Etapa crítica', v: 'Fiscalização' }],
  },
  /* ---------------- SEGEM ---------------- */
  {
    sigla: 'SEGEM',
    nome: 'Serviço de Gestão de Materiais',
    sub: 'Gestão centralizada de materiais e EPIs, do recebimento à reposição.',
    status: 'andamento',
    progresso: 60,
    stages: ['Recebimento', 'Armazenamento', 'Requisição', 'Distribuição', 'Reposição'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Nota de entrada', 'Etiqueta / endereçamento', 'Pedido no sistema', 'Comprovante de entrega', 'Ponto de ressuprimento'] },
      { label: 'Ações do requisitante', classe: 'bp-req', celulas: ['Aguarda o material', 'Consulta o estoque', 'Faz a requisição', 'Recebe e confere', 'Sinaliza a necessidade'] },
      { label: L.front, classe: 'bp-front', celulas: ['Confere a entrega', 'Informa a disponibilidade', 'Valida o pedido', 'Entrega o material', 'Orienta a demanda'] },
      { label: L.back, classe: 'bp-back', celulas: ['Registra a entrada', 'Organiza o almoxarifado', 'Separa os itens', 'Baixa do estoque', 'Aciona a compra'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['Sistema de estoque', 'Almoxarifado', 'SEI', 'Setores requisitantes', 'Compras'] },
    ],
    gargalos: ['Rupturas de estoque de itens críticos.', 'Requisições sem previsibilidade.', 'Controle de EPIs ainda manual.'],
    oportunidades: ['Estoque mínimo com alerta automático.', 'Catálogo digital de materiais.', 'Previsão de consumo por setor.'],
    indicadores: [{ k: 'Itens em catálogo', v: '~800' }, { k: 'Requisições/mês', v: '~320' }, { k: 'Ruptura', v: 'Baixa' }, { k: 'Etapa crítica', v: 'Reposição' }],
  },
  /* ---------------- SGPAT ---------------- */
  {
    sigla: 'SGPAT',
    nome: 'Serviço de Gestão do Patrimônio',
    sub: 'Ciclo dos bens móveis e imóveis, da incorporação ao desfazimento.',
    status: 'andamento',
    progresso: 55,
    stages: ['Incorporação', 'Tombamento', 'Inventário', 'Movimentação', 'Baixa / desfazimento'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Termo de recebimento', 'Plaqueta patrimonial', 'Relatório de inventário', 'Termo de transferência', 'Termo de baixa'] },
      { label: 'Ações do usuário', classe: 'bp-req', celulas: ['Recebe o bem', 'Guarda o bem', 'Confirma a localização', 'Solicita a movimentação', 'Solicita o desfazimento'] },
      { label: L.front, classe: 'bp-front', celulas: ['Registra o recebimento', 'Aplica a plaqueta', 'Conduz o inventário', 'Atualiza a carga', 'Formaliza a baixa'] },
      { label: L.back, classe: 'bp-back', celulas: ['Incorpora no sistema', 'Cadastra o bem', 'Concilia divergências', 'Controla a carga por setor', 'Instrui o desfazimento'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['Sistema de patrimônio', 'SEI', 'Comissão de inventário', 'Setores detentores', 'SEOF'] },
    ],
    gargalos: ['Bens sem localização atualizada.', 'Inventário anual trabalhoso e manual.', 'Desfazimento com trâmite longo.'],
    oportunidades: ['Inventário com leitura de QR Code.', 'Painel de carga patrimonial por setor.', 'Fluxo digital de desfazimento.'],
    indicadores: [{ k: 'Bens tombados', v: '~12 mil' }, { k: 'Inventário', v: 'Anual' }, { k: 'Divergências', v: 'Em queda' }, { k: 'Etapa crítica', v: 'Inventário' }],
  },
  /* ---------------- SEINFRA ---------------- */
  {
    sigla: 'SEINFRA',
    nome: 'Serviço de Infraestrutura',
    sub: 'Manutenção predial e de equipamentos, do chamado ao encerramento.',
    status: 'revisao',
    progresso: 85,
    stages: ['Chamado', 'Triagem', 'Programação', 'Execução', 'Verificação'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Ordem de serviço', 'Classificação da demanda', 'Agenda de execução', 'Serviço realizado', 'Aceite do solicitante'] },
      { label: 'Ações do solicitante', classe: 'bp-req', celulas: ['Abre o chamado', 'Descreve o problema', 'Aguarda a programação', 'Acompanha o serviço', 'Confirma a solução'] },
      { label: L.front, classe: 'bp-front', celulas: ['Recebe a solicitação', 'Avalia a urgência', 'Informa o prazo', 'Executa a manutenção', 'Faz a vistoria'] },
      { label: L.back, classe: 'bp-back', celulas: ['Registra a OS', 'Prioriza a fila', 'Aloca equipe e material', 'Aciona terceiros', 'Encerra a OS'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['Sistema de chamados', 'Equipes técnicas', 'Contratos (GESCON)', 'Almoxarifado', 'SEBIO'] },
    ],
    gargalos: ['Chamados sem priorização clara.', 'Manutenção corretiva predomina sobre a preventiva.', 'Dependência de contratos terceirizados.'],
    oportunidades: ['Plano de manutenção preventiva.', 'Painel de chamados por prazo e criticidade.', 'Histórico de manutenção por ativo.'],
    indicadores: [{ k: 'Chamados/mês', v: '~210' }, { k: 'Preventiva', v: '30%' }, { k: 'Tempo médio', v: '~4 dias' }, { k: 'Etapa crítica', v: 'Programação' }],
  },
  /* ---------------- SGT ---------------- */
  {
    sigla: 'SGT',
    nome: 'Serviço de Gestão do Trabalho',
    sub: 'Administração e desenvolvimento de pessoas, da demanda à qualificação.',
    status: 'andamento',
    progresso: 65,
    stages: ['Demanda de pessoal', 'Instrução', 'Registro', 'Acompanhamento', 'Desenvolvimento'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Solicitação do setor', 'Processo instruído', 'Registro no Siape', 'Ficha funcional', 'Plano de capacitação'] },
      { label: 'Ações do servidor', classe: 'bp-req', celulas: ['Apresenta a demanda', 'Envia documentos', 'Confere os dados', 'Atualiza a situação', 'Participa da capacitação'] },
      { label: L.front, classe: 'bp-front', celulas: ['Orienta o servidor', 'Analisa o pedido', 'Confirma o registro', 'Presta atendimento', 'Oferece qualificação'] },
      { label: L.back, classe: 'bp-back', celulas: ['Avalia a viabilidade', 'Instrui o processo', 'Lança no sistema', 'Controla afastamentos', 'Planeja a capacitação'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['Siape / SouGov', 'SEI', 'Coordenação de RH', 'Setores', 'Fiocruz (Cogepe)'] },
    ],
    gargalos: ['Processos de pessoal com muitas idas e vindas.', 'Informações funcionais dispersas.', 'Capacitação sem trilha estruturada.'],
    oportunidades: ['Portal de autoatendimento do servidor.', 'Trilhas de desenvolvimento por área.', 'Painel de força de trabalho por setor.'],
    indicadores: [{ k: 'Servidores atendidos', v: '~600' }, { k: 'Processos/mês', v: '~120' }, { k: 'Capacitações', v: 'Em expansão' }, { k: 'Etapa crítica', v: 'Instrução' }],
  },
  /* ---------------- SGQ ---------------- */
  {
    sigla: 'SGQ',
    nome: 'Serviço de Gestão da Qualidade',
    sub: 'Gestão por processos e padronização, do diagnóstico à melhoria contínua.',
    status: 'revisao',
    progresso: 80,
    stages: ['Diagnóstico', 'Mapeamento', 'Padronização (POP)', 'Auditoria', 'Melhoria contínua'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Relatório de diagnóstico', 'Fluxo mapeado (BPMN)', 'POP publicado', 'Relatório de auditoria', 'Plano de ação'] },
      { label: 'Ações do setor', classe: 'bp-req', celulas: ['Aponta o processo', 'Descreve a rotina', 'Valida o POP', 'Recebe a auditoria', 'Executa as melhorias'] },
      { label: L.front, classe: 'bp-front', celulas: ['Conduz o diagnóstico', 'Entrevista as equipes', 'Formaliza o POP', 'Realiza a auditoria', 'Acompanha o plano'] },
      { label: L.back, classe: 'bp-back', celulas: ['Prioriza processos', 'Desenha o fluxo', 'Estrutura o documento', 'Registra não conformidades', 'Monitora indicadores'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['Bizagi / BPMN', 'NotebookLM', 'Repositório de POPs', 'Comitê da Qualidade', 'Setores'] },
    ],
    gargalos: ['Grande volume de processos obsoletos (~70%).', 'Baixa adesão à padronização.', 'Revisão dos POPs sem periodicidade.'],
    oportunidades: ['Geração de POP a partir de entrevistas.', 'Ciclo de revisão de 2 anos com alertas.', 'Infográfico de validade dos processos.'],
    indicadores: [{ k: 'Processos', v: '222' }, { k: 'Obsoletos', v: '155' }, { k: 'Válidos', v: '67' }, { k: 'Etapa crítica', v: 'Padronização' }],
  },
  /* ---------------- SGS ---------------- */
  {
    sigla: 'SGS',
    nome: 'Serviço de Gestão da Sustentabilidade',
    sub: 'Políticas socioambientais da ENSP, do diagnóstico ao relato.',
    status: 'andamento',
    progresso: 45,
    stages: ['Diagnóstico', 'Metas', 'Ações', 'Monitoramento', 'Relato'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Diagnóstico socioambiental', 'Metas de sustentabilidade', 'Plano de ação', 'Indicadores coletados', 'Relatório de sustentabilidade'] },
      { label: 'Ações do setor', classe: 'bp-req', celulas: ['Fornece dados', 'Assume compromissos', 'Executa as ações', 'Reporta consumo', 'Divulga resultados'] },
      { label: L.front, classe: 'bp-front', celulas: ['Sensibiliza os setores', 'Pactua metas', 'Coordena campanhas', 'Consolida indicadores', 'Comunica o desempenho'] },
      { label: L.back, classe: 'bp-back', celulas: ['Levanta a linha de base', 'Define indicadores', 'Articula parcerias', 'Analisa a evolução', 'Elabora o relato'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['PLS / A3P', 'Planilhas / BI', 'Comissões', 'Setores', 'Fiocruz Saudável'] },
    ],
    gargalos: ['Dados de consumo dispersos e manuais.', 'Cultura de sustentabilidade em construção.', 'Indicadores sem série histórica.'],
    oportunidades: ['Painel de indicadores socioambientais.', 'Metas por setor com acompanhamento.', 'Campanhas de engajamento contínuas.'],
    indicadores: [{ k: 'Metas ativas', v: '18' }, { k: 'Indicadores', v: 'Em estruturação' }, { k: 'Setores engajados', v: 'Crescendo' }, { k: 'Etapa crítica', v: 'Monitoramento' }],
  },
  /* ---------------- SEBIO ---------------- */
  {
    sigla: 'SEBIO',
    nome: 'Serviço de Biossegurança',
    sub: 'Políticas e práticas de biossegurança, do risco à gestão de incidentes.',
    status: 'revisao',
    progresso: 75,
    stages: ['Identificação do risco', 'Norma / orientação', 'Capacitação', 'Inspeção', 'Gestão de incidentes'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Mapa de riscos', 'Norma / POP', 'Certificado de treinamento', 'Relatório de inspeção', 'Registro de incidente'] },
      { label: 'Ações da unidade', classe: 'bp-req', celulas: ['Informa a atividade', 'Adota a norma', 'Capacita a equipe', 'Recebe a inspeção', 'Comunica o incidente'] },
      { label: L.front, classe: 'bp-front', celulas: ['Classifica o risco', 'Orienta a unidade', 'Ministra o treinamento', 'Realiza a inspeção', 'Apoia a resposta'] },
      { label: L.back, classe: 'bp-back', celulas: ['Analisa a atividade', 'Elabora a norma', 'Planeja a capacitação', 'Registra as pendências', 'Investiga a causa'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['CTNBio / Anvisa', 'Manual de biossegurança', 'Comissão de biossegurança', 'Laboratórios', 'SEINFRA'] },
    ],
    gargalos: ['Registro de incidentes ainda informal.', 'Capacitação sem periodicidade fixa.', 'Inspeções concentradas em poucas unidades.'],
    oportunidades: ['Registro digital de incidentes.', 'Calendário de inspeções e treinamentos.', 'Painel de riscos por laboratório.'],
    indicadores: [{ k: 'Laboratórios', v: '~40' }, { k: 'Nível de contenção', v: 'NB-1 a NB-3' }, { k: 'Treinamentos/ano', v: 'Em expansão' }, { k: 'Etapa crítica', v: 'Inspeção' }],
  },
  /* ---------------- POLEM ---------------- */
  {
    sigla: 'POLEM',
    nome: 'Laboratório de Inovação em Gestão Pública',
    sub: 'Experimentação e disseminação de soluções de gestão, da escuta à difusão.',
    status: 'pronto',
    progresso: 100,
    stages: ['Escuta do problema', 'Ideação', 'Prototipagem', 'Experimentação', 'Disseminação'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Problema mapeado', 'Portfólio de ideias', 'Protótipo / mockup', 'Piloto avaliado', 'Boa prática publicada'] },
      { label: 'Ações do setor parceiro', classe: 'bp-req', celulas: ['Traz o desafio', 'Coconstrói ideias', 'Testa o protótipo', 'Roda o piloto', 'Adota a solução'] },
      { label: L.front, classe: 'bp-front', celulas: ['Facilita a escuta', 'Conduz oficinas', 'Apresenta protótipos', 'Acompanha o piloto', 'Compartilha os aprendizados'] },
      { label: L.back, classe: 'bp-back', celulas: ['Analisa o problema', 'Prioriza hipóteses', 'Desenha a solução', 'Mede os resultados', 'Sistematiza a metodologia'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['Métodos ágeis', 'Ferramentas de IA', 'Blueprint / BPMN', 'Setores da VDDIG', 'Rede de laboratórios (GNova)'] },
    ],
    gargalos: ['Soluções piloto que não escalam.', 'Agenda de inovação concorrendo com a rotina.', 'Aprendizados pouco documentados.'],
    oportunidades: ['Vitrine de blueprints e boas práticas.', 'Trilha de inovação para os setores.', 'Banco de soluções reaproveitáveis.'],
    indicadores: [{ k: 'Setores apoiados', v: '13' }, { k: 'Blueprints', v: '13' }, { k: 'Pilotos ativos', v: 'Vários' }, { k: 'Etapa crítica', v: 'Disseminação' }],
  },
  /* ---------------- Compras ---------------- */
  {
    sigla: 'Compras',
    nome: 'Serviço de Compras',
    sub: 'Aquisições e contratações públicas (Lei 14.133/2021), da requisição ao pagamento.',
    status: 'pronto',
    progresso: 100,
    stages: ['Requisição', 'Planejamento', 'Seleção do fornecedor', 'Contratação', 'Execução e fiscalização', 'Pagamento'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Requisição no SEI', 'PCA · ETP · TR', 'Edital / aviso (PNCP)', 'Contrato / ARP', 'Medições e relatórios', 'Nota fiscal · empenho'] },
      { label: 'Ações do requisitante', classe: 'bp-req', celulas: ['Identifica a necessidade', 'Descreve o objeto', 'Acompanha o certame', 'Recebe e atesta', 'Fiscaliza a entrega', 'Solicita o pagamento'] },
      { label: L.front, classe: 'bp-front', celulas: ['Orienta a demanda', 'Valida o TR', 'Publica o certame', 'Formaliza o contrato', 'Apoia a fiscalização', 'Confere a liquidação'] },
      { label: L.back, classe: 'bp-back', celulas: ['Consolida o PCA', 'Pesquisa de preços (IN 65)', 'Conduz licitação/dispensa', 'Elabora minutas', 'Controla prazos e aditivos', 'Instrui o pagamento'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['SEI', 'Comprasnet · PNCP', 'Jurídico (parecer)', 'SIASG', 'Fiscais / gestores', 'SEOF'] },
    ],
    gargalos: ['Pesquisa de preços ainda manual e demorada.', 'Retrabalho na elaboração dos Termos de Referência.', 'Prazos de parecer jurídico pouco previsíveis.', 'PCA com baixa aderência às demandas reais dos setores.'],
    oportunidades: ['Biblioteca de modelos de TR por tipo de objeto.', 'Automação da pesquisa de preços a partir de painéis públicos.', 'Painel de acompanhamento de prazos por etapa.', 'Monitoramento e integração via PNCP.'],
    indicadores: [{ k: 'Tempo médio do processo', v: '~85 dias' }, { k: 'Dispensa × licitação', v: '62% / 38%' }, { k: 'Contratações no ano', v: '128' }, { k: 'Etapa mais lenta', v: 'Planejamento' }],
  },
  /* ---------------- SGTI ---------------- */
  {
    sigla: 'SGTI',
    nome: 'Serviço de Gestão de Tecnologia da Informação',
    sub: 'Infraestrutura e suporte de TI, do chamado à melhoria dos serviços.',
    status: 'andamento',
    progresso: 60,
    stages: ['Chamado', 'Triagem', 'Atendimento', 'Infraestrutura', 'Melhoria / projeto'],
    rows: [
      { label: L.evid, classe: 'bp-evid', celulas: ['Ticket aberto', 'Classificação e prioridade', 'Solução aplicada', 'Serviços de rede estáveis', 'Nova funcionalidade'] },
      { label: 'Ações do usuário', classe: 'bp-req', celulas: ['Abre o chamado', 'Descreve o problema', 'Acompanha o ticket', 'Usa os sistemas', 'Sugere melhorias'] },
      { label: L.front, classe: 'bp-front', celulas: ['Recebe a solicitação', 'Avalia o impacto', 'Resolve (N1/N2)', 'Garante a disponibilidade', 'Entrega o projeto'] },
      { label: L.back, classe: 'bp-back', celulas: ['Registra o ticket', 'Encaminha à equipe', 'Diagnostica a causa', 'Mantém servidores e redes', 'Desenvolve a solução'] },
      { label: L.apoio, classe: 'bp-apoio', celulas: ['Service desk', 'Servidores / rede', 'SEI', 'Setores', 'Cogetic / Fiocruz'] },
    ],
    gargalos: ['Fila de chamados sem SLA claro.', 'Parque tecnológico heterogêneo.', 'Demandas de projeto concorrendo com o suporte.'],
    oportunidades: ['Portal de chamados com SLA e status.', 'Base de conhecimento para autoatendimento.', 'Roadmap de sistemas por prioridade.'],
    indicadores: [{ k: 'Chamados/mês', v: '~380' }, { k: 'Resolvidos no 1º nível', v: '55%' }, { k: 'Disponibilidade', v: '99%' }, { k: 'Etapa crítica', v: 'Atendimento' }],
  },
]

const STATUS_LABEL: Record<BpStatus, string> = {
  pronto: 'Validado',
  revisao: 'Em revisão',
  andamento: 'Em elaboração',
}

/* Ordem e rótulos (plural) usados no resumo visual */
const STATUS_META: { key: BpStatus; label: string }[] = [
  { key: 'pronto', label: 'Validados' },
  { key: 'revisao', label: 'Em revisão' },
  { key: 'andamento', label: 'Em elaboração' },
]

/* ---------- Resumo visual (infográfico) dos 13 setores ---------- */

function InfograficoBlueprints() {
  const total = BLUEPRINTS.length
  const media = Math.round(BLUEPRINTS.reduce((a, b) => a + b.progresso, 0) / total)
  const conta = (k: BpStatus) => BLUEPRINTS.filter((b) => b.status === k).length

  return (
    <div className="bp-info">
      <div className="bp-info-tiles">
        <div className="bp-info-tile bp-info-destaque">
          <div className="bp-info-num">{total}</div>
          <div className="bp-info-lbl">Setores mapeados</div>
        </div>
        {STATUS_META.map((s) => (
          <div key={s.key} className="bp-info-tile">
            <div className={`bp-info-num status-${s.key}`}>{conta(s.key)}</div>
            <div className="bp-info-lbl">
              <span className={`bp-info-dot status-${s.key}`} />
              {s.label}
            </div>
          </div>
        ))}
        <div className="bp-info-tile">
          <div className="bp-info-num">{media}%</div>
          <div className="bp-info-lbl">Evolução média</div>
        </div>
      </div>

      <div className="bp-info-distrib">
        <div className="bp-info-barra" role="img" aria-label="Distribuição dos setores por status">
          {STATUS_META.map((s) => {
            const n = conta(s.key)
            if (!n) return null
            return (
              <div
                key={s.key}
                className={`bp-info-seg status-${s.key}`}
                style={{ width: `${(n / total) * 100}%` }}
                title={`${s.label}: ${n}`}
              >
                {n}
              </div>
            )
          })}
        </div>
        <div className="bp-info-legenda">
          {STATUS_META.map((s) => (
            <span key={s.key} className="bp-info-leg-item">
              <span className={`bp-info-dot status-${s.key}`} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Visualização de um blueprint (etapas × camadas) ---------- */

export function BlueprintView({ bp }: { bp: Blueprint }) {
  const cols = `168px repeat(${bp.stages.length}, minmax(120px, 1fr))`
  return (
    <div className="bp-wrap">
      <div className="bp-head">
        <div>
          <h2 className="bp-titulo">
            <IconBlueprint /> {bp.nome}
          </h2>
          <p className="bp-sub">{bp.sub}</p>
        </div>
        <span className={`bp-tag status-${bp.status}`}>{bp.sigla} · {STATUS_LABEL[bp.status]}</span>
      </div>

      <div className="bp-scroll">
        <div className="bp-grid" style={{ gridTemplateColumns: cols }}>
          <div className="bp-corner">Etapas →</div>
          {bp.stages.map((s) => (
            <div key={s} className="bp-col-head">{s}</div>
          ))}
          {bp.rows.map((row) => (
            <div key={row.label} className={`bp-linha ${row.classe}`}>
              <div className="bp-row-label">{row.label}</div>
              {row.celulas.map((c, i) => (
                <div key={i} className="bp-cell">{c}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="bp-legenda">
        Entre <strong>Atendimento</strong> e <strong>Bastidores</strong> passa a “linha de
        visibilidade”: o que o usuário vê × o que ocorre internamente no setor.
      </p>

      <div className="bp-analise">
        <div className="card bp-analise-card">
          <h3>Gargalos identificados</h3>
          <ul>{bp.gargalos.map((g, i) => <li key={i}>{g}</li>)}</ul>
        </div>
        <div className="card bp-analise-card bp-oport">
          <h3>Oportunidades de melhoria</h3>
          <ul>{bp.oportunidades.map((o, i) => <li key={i}>{o}</li>)}</ul>
        </div>
      </div>

      <div className="bp-indicadores">
        {bp.indicadores.map((ind) => (
          <div key={ind.k} className="bp-ind">
            <div className="bp-ind-v">{ind.v}</div>
            <div className="bp-ind-k">{ind.k}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Painel com todos os setores (grade de cartões) ---------- */

function PainelSetores({ onAbrir }: { onAbrir: (sigla: string) => void }) {
  return (
    <div className="bp-painel">
      {BLUEPRINTS.map((bp) => (
        <button key={bp.sigla} className="bp-setor-card" onClick={() => onAbrir(bp.sigla)}>
          <div className="bp-setor-topo">
            <span className="bp-setor-sigla">{bp.sigla}</span>
            <span className={`bp-status status-${bp.status}`}>{STATUS_LABEL[bp.status]}</span>
          </div>
          <strong className="bp-setor-nome">{bp.nome}</strong>
          <div className="bp-progress" aria-label={`Evolução ${bp.progresso}%`}>
            <div className={`bp-progress-fill status-${bp.status}`} style={{ width: `${bp.progresso}%` }} />
          </div>
          <span className="bp-setor-link">Ver blueprint →</span>
        </button>
      ))}
    </div>
  )
}

/* ---------- Explorador (painel → blueprint) usado pelo POLEM e pela Direção ---------- */

export function BlueprintsExplorer({ modo }: { modo: 'polem' | 'direcao' }) {
  const [sel, setSel] = useState<string | null>(null)
  const bp = sel ? BLUEPRINTS.find((b) => b.sigla === sel) : null

  if (bp) {
    return (
      <div>
        <button className="bp-voltar" onClick={() => setSel(null)}>← Todos os setores</button>
        <BlueprintView bp={bp} />
      </div>
    )
  }

  return (
    <div className="bp-explorer">
      <div className="bp-head">
        <div>
          <h2 className="bp-titulo"><IconBlueprint /> Blueprints dos Setores</h2>
          <p className="bp-sub">
            {modo === 'polem'
              ? 'Estúdio do POLEM — construa e revise o mapa de serviço de cada setor. Clique para abrir.'
              : 'Vitrine da Direção — o mapa de serviço e a evolução de cada setor. Clique para abrir.'}
          </p>
        </div>
        <span className="bp-tag">{modo === 'polem' ? 'POLEM · estúdio' : 'Direção · leitura'}</span>
      </div>
      <InfograficoBlueprints />
      <PainelSetores onAbrir={setSel} />
    </div>
  )
}
