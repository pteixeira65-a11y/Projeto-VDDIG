import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { MetasPorSetor } from '../api/types'

export default function MetasChart({ dados }: { dados: MetasPorSetor[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={dados} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6e1d8" />
        <XAxis dataKey="setor" tick={{ fontSize: 12, fill: '#7c8590' }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#7c8590' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="concluida" name="Concluída" stackId="a" fill="#6f8f6a" />
        <Bar dataKey="em_andamento" name="Em andamento" stackId="a" fill="#4a6b82" />
        <Bar dataKey="atrasada" name="Atrasada" stackId="a" fill="#b06a56" />
        <Bar dataKey="nao_iniciada" name="Não iniciada" stackId="a" fill="#b5ab9b" />
      </BarChart>
    </ResponsiveContainer>
  )
}
