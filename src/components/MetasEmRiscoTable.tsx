import { MetaRisco } from '../api/types'
import { formatarData } from '../utils/formato'

const rotulo: Record<string, string> = {
  atrasada: 'Atrasada',
  em_andamento: 'Em andamento',
  nao_iniciada: 'Não iniciada',
}

export default function MetasEmRiscoTable({ dados }: { dados: MetaRisco[] }) {
  if (!dados.length) return <p className="vazio">Nenhuma meta em risco. 🎉</p>
  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>Meta</th>
          <th>Setor</th>
          <th>Status</th>
          <th>Progresso</th>
          <th>Prazo</th>
        </tr>
      </thead>
      <tbody>
        {dados.map((m, i) => (
          <tr key={i}>
            <td>{m.titulo}</td>
            <td>{m.setor}</td>
            <td>
              <span className="tag tag-risco">{rotulo[m.status] ?? m.status}</span>
            </td>
            <td>
              <div className="barra">
                <div className="barra-fill" style={{ width: `${m.progresso}%` }} />
              </div>
              <span className="barra-num">{m.progresso}%</span>
            </td>
            <td>{formatarData(m.prazo)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
