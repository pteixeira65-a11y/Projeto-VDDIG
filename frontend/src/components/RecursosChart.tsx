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
import { Recurso } from '../api/types'

const fmtEixo = (v: number) => `R$ ${(v / 1000).toFixed(0)}k`
const fmtTooltip = (v: number) => `R$ ${v.toLocaleString('pt-BR')}`

export default function RecursosChart({ dados }: { dados: Recurso[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={dados} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="setor" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={fmtEixo} tick={{ fontSize: 12 }} />
        <Tooltip formatter={fmtTooltip} />
        <Legend />
        <Bar dataKey="previsto" name="Previsto" fill="#90caf9" radius={[3, 3, 0, 0]} />
        <Bar dataKey="aplicado" name="Aplicado" fill="#1565c0" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
