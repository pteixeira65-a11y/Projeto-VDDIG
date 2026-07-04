import { DlpFinding } from '../api/types'

// Detecção client-side (espelha o backend) para alerta instantâneo de conscientização.
const PADROES: { tipo: string; regex: RegExp; orientacao: string }[] = [
  {
    tipo: 'CPF',
    regex: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
    orientacao: 'Evite registrar CPF. Se precisar identificar alguém, use as iniciais ou um código interno.',
  },
  {
    tipo: 'CNPJ',
    regex: /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/,
    orientacao: 'Só inclua o CNPJ completo se for essencial ao registro.',
  },
  {
    tipo: 'E-mail pessoal',
    regex: /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/,
    orientacao: 'E-mails são dados pessoais (LGPD). Prefira referenciar o canal ou o setor oficial.',
  },
  {
    tipo: 'Telefone',
    regex: /\b\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}\b/,
    orientacao: 'Telefone é dado pessoal — não registre se não for necessário para a demanda.',
  },
]

const PALAVRAS: Record<string, string> = {
  sigiloso: 'Conteúdo marcado como sigiloso: confirme se ele pode constar neste registro.',
  confidencial: 'Conteúdo confidencial: avalie o nível de acesso antes de salvar.',
  senha: 'Nunca registre senhas em texto livre — isso expõe a instituição.',
  salário: 'Dados de remuneração são sensíveis — anonimize sempre que possível.',
  salario: 'Dados de remuneração são sensíveis — anonimize sempre que possível.',
}

export function analisarDlp(texto: string): DlpFinding[] {
  if (!texto) return []
  const achados: DlpFinding[] = []
  for (const p of PADROES) {
    if (p.regex.test(texto)) achados.push({ tipo: p.tipo, orientacao: p.orientacao })
  }
  const baixo = texto.toLowerCase()
  for (const palavra of Object.keys(PALAVRAS)) {
    if (baixo.includes(palavra)) {
      achados.push({ tipo: `Termo sensível: "${palavra}"`, orientacao: PALAVRAS[palavra] })
    }
  }
  return achados
}
