import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DemandaTimeline } from '../api/types'

export default function DemandasChart({ dados }: { dados: DemandaTimeline[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={dados} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6e1d8" />
        <XAxis dataKey="periodo" tick={{ fontSize: 12, fill: '#7c8590' }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#7c8590' }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="concluidas"
          name="Demandas concluídas"
          stroke="#8a7c9a"
          strokeWidth={2}
          dot={{ r: 3, fill: '#8a7c9a' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
