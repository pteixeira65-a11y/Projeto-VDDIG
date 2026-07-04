export default function KpiCard({
  titulo,
  valor,
  sub,
  tom,
}: {
  titulo: string
  valor: string
  sub?: string
  tom?: string
}) {
  return (
    <div className={`kpi kpi-${tom ?? 'neutro'}`}>
      <div className="kpi-titulo">{titulo}</div>
      <div className="kpi-valor">{valor}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  )
}
