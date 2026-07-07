/* Ícones nórdicos em linha fina (traço limpo, cantos arredondados).
   Herdam a cor via `currentColor`. */

type IconProps = { className?: string }

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const IconDashboard = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="3" y="3" width="7" height="9" rx="1.2" />
    <rect x="14" y="3" width="7" height="5" rx="1.2" />
    <rect x="14" y="12" width="7" height="9" rx="1.2" />
    <rect x="3" y="16" width="7" height="5" rx="1.2" />
  </svg>
)

export const IconSetor = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7 V5.5 A2 2 0 0 1 10 3.5 h4 a2 2 0 0 1 2 2 V7" />
    <line x1="3" y1="12.5" x2="21" y2="12.5" />
  </svg>
)

export const IconPrompt = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <polyline points="7.5 10 10 12.5 7.5 15" />
    <line x1="12.5" y1="15" x2="16.5" y2="15" />
  </svg>
)

export const IconCuradoria = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 4 L13.1 9.4 L18 11 L13.1 12.6 L12 18 L10.9 12.6 L6 11 L10.9 9.4 Z" />
    <path d="M18.5 4.2 L19 6 L20.8 6.5 L19 7 L18.5 8.8 L18 7 L16.2 6.5 L18 6 Z" />
  </svg>
)

export const IconBussola = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.8 8.2 L10.6 10.6 L8.2 15.8 L13.4 13.4 Z" />
  </svg>
)

export const IconTerceirizados = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19 a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.2 a3 3 0 0 1 0 5.6" />
    <path d="M17 13.5 a5.5 5.5 0 0 1 3.5 5.1" />
  </svg>
)
