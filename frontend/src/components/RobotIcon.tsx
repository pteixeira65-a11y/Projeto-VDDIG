/**
 * Robozinho em estilo nórdico: traço limpo, minimalista e arredondado.
 * Usa `currentColor`, então herda a cor do elemento pai.
 */
export default function RobotIcon({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* antena */}
      <circle cx="12" cy="2.4" r="1" fill="currentColor" stroke="none" />
      <line x1="12" y1="3.4" x2="12" y2="5.6" />
      {/* cabeça */}
      <rect x="4.5" y="5.6" width="15" height="12" rx="4.2" />
      {/* orelhas */}
      <line x1="4.5" y1="10.2" x2="2.6" y2="10.2" />
      <line x1="19.5" y1="10.2" x2="21.4" y2="10.2" />
      {/* olhos */}
      <circle cx="9.5" cy="10.8" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="10.8" r="1.15" fill="currentColor" stroke="none" />
      {/* boca */}
      <path d="M9.6 14.2 h4.8" />
    </svg>
  )
}
