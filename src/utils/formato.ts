/** Formata uma data ISO (YYYY-MM-DD) em pt-BR sem sofrer deslocamento de fuso. */
export function formatarData(iso: string): string {
  if (!iso) return ''
  const somenteData = iso.slice(0, 10)
  return new Date(`${somenteData}T00:00:00`).toLocaleDateString('pt-BR')
}
