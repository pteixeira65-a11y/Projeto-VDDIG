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
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="setor" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="concluida" name="Concluída" stackId="a" fill="#2e7d32" />
        <Bar dataKey="em_andamento" name="Em andamento" stackId="a" fill="#1976d2" />
        <Bar dataKey="atrasada" name="Atrasada" stackId="a" fill="#e53935" />
        <Bar dataKey="nao_iniciada" name="Não iniciada" stackId="a" fill="#9e9e9e" />
      </BarChart>
    </ResponsiveContainer>
  )
}
