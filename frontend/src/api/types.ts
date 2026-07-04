export interface Setor {
  id: number
  nome: string
}

export interface Kpis {
  total_metas: number
  metas_concluidas: number
  pct_metas_concluidas: number
  demandas_abertas: number
  demandas_concluidas: number
  valor_previsto: number
  valor_aplicado: number
  pct_recursos_aplicados: number
  metas_em_risco: number
  resumo_gestor: string
}

export interface MetasPorSetor {
  setor: string
  nao_iniciada: number
  em_andamento: number
  concluida: number
  atrasada: number
}

export interface Recurso {
  setor: string
  previsto: number
  aplicado: number
}

export interface DemandaTimeline {
  periodo: string
  concluidas: number
}

export interface MetaRisco {
  titulo: string
  setor: string
  status: string
  progresso: number
  prazo: string
}

export interface Meta {
  id: number
  setor_id: number
  titulo: string
  descricao: string | null
  status: string
  progresso: number
  prazo: string
}

export interface NovaMeta {
  titulo: string
  descricao: string
  status: string
  progresso: number
  prazo: string
  setor_id?: number
}

export interface DlpFinding {
  tipo: string
  orientacao: string
}

export interface SetorMetricas {
  setor_id: number
  setor: string
  total_metas: number
  metas_concluidas: number
  pct_metas_concluidas: number
  metas_em_risco: number
  demandas_abertas: number
  demandas_concluidas: number
  valor_previsto: number
  valor_aplicado: number
  pct_recursos_aplicados: number
  metas_por_status: MetasPorSetor[]
  resumo_gestor: string
}

export interface ChatMsg {
  autor: 'user' | 'bot'
  texto: string
}
