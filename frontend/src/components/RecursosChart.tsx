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
        <CartesianGrid strokeDasharray="3 3" stroke="#e6e1d8" />
        <XAxis
          dataKey="setor"
          tick={{ fontSize: 11, fill: '#7c8590' }}
          interval={0}
          angle={-35}
          textAnchor="end"
          height={68}
        />
        <YAxis tickFormatter={fmtEixo} tick={{ fontSize: 12, fill: '#7c8590' }} />
        <Tooltip formatter={fmtTooltip} />
        <Legend />
        <Bar dataKey="previsto" name="Previsto" fill="#aec4cf" radius={[3, 3, 0, 0]} />
        <Bar dataKey="aplicado" name="Aplicado" fill="#4a6b82" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
