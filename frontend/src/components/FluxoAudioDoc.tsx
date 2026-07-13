/* ------------------------------------------------------------------ *
 * Fluxo "do áudio ao documento" — figura nórdica nativa (SVG).
 * Duas entradas (gravar reunião OU importar áudio de entrevistas) →
 * transcrever → validar (etapa humana) → gerar ata / mapeamento / relatório.
 * Reutilizado na abertura da aba "Gravação → Ata" e no Manual (nítido no PDF).
 * ------------------------------------------------------------------ */
export default function FluxoAudioDoc() {
  return (
    <div
      className="fluxo-doc"
      role="group"
      aria-label="Fluxo: gravar ou importar áudio, transcrever, validar e gerar documento"
    >
      <svg viewBox="0 0 1000 470" xmlns="http://www.w3.org/2000/svg" role="img">
        <title>Fluxo do áudio ao documento</title>
        <desc>Gravar reunião ou importar áudio de entrevistas, transcrever, validar (etapa humana) e gerar ata, mapeamento de processo ou relatório.</desc>
        <defs>
          <marker id="fluxoArw" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#4a6b82" />
          </marker>
        </defs>

        <rect x="6" y="6" width="988" height="458" rx="26" fill="#f2e9d6" stroke="#e7dabf" />

        <text x="42" y="50" fontSize="23" fontWeight="700" fill="#33495a">Do áudio ao documento</text>
        <text x="958" y="50" textAnchor="end" fontSize="15" fontWeight="700"><tspan fill="#124f63">Plataforma </tspan><tspan fill="#e07a2b">Adauto</tspan></text>

        <g transform="translate(28,70)" fill="none" stroke="#9aa9b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
          <path d="M4 5h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" strokeDasharray="2.5 2.5" />
          <circle cx="9" cy="10.5" r="0.9" fill="#9aa9b2" stroke="none" /><circle cx="12.5" cy="10.5" r="0.9" fill="#9aa9b2" stroke="none" /><circle cx="16" cy="10.5" r="0.9" fill="#9aa9b2" stroke="none" />
        </g>
        <g transform="translate(292,118)" fill="none" stroke="#e07a2b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0-4 10c.7.7 1.1 1.4 1 2h6c-.1-.6.3-1.3 1-2a6 6 0 0 0-4-10Z" />
          <line x1="9.5" y1="19" x2="14.5" y2="19" /><line x1="10.5" y1="21.5" x2="13.5" y2="21.5" />
        </g>
        <g transform="translate(500,118)" fill="none" stroke="#9aa9b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3.4" />
          <path d="M12 4.5v-2 M12 21.5v-2 M4.5 12h-2 M21.5 12h-2 M6.2 6.2l-1.4-1.4 M18.9 18.9l-1.4-1.4 M17.8 6.2l1.4-1.4 M5.1 18.9l1.4-1.4" />
        </g>
        <g transform="translate(684,150)" fill="none" stroke="#4a6b82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="7" width="10" height="10" rx="2" />
          <path d="M10 4v3 M14 4v3 M10 17v3 M14 17v3 M4 10h3 M4 14h3 M17 10h3 M17 14h3" />
          <text x="12" y="14.6" fontSize="5.4" fontWeight="700" fill="#4a6b82" stroke="none" textAnchor="middle">AI</text>
        </g>

        <text x="117" y="140" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="1.5" fill="#9aa9b2">ENTRADA</text>

        <path d="M192,190 C224,190 226,214 248,224" stroke="#4a6b82" strokeWidth="2.2" strokeDasharray="5 6" fill="none" markerEnd="url(#fluxoArw)" />
        <path d="M192,288 C224,288 226,264 248,254" stroke="#4a6b82" strokeWidth="2.2" strokeDasharray="5 6" fill="none" markerEnd="url(#fluxoArw)" />
        <path d="M400,239 H458" stroke="#4a6b82" strokeWidth="2.2" strokeDasharray="5 6" fill="none" markerEnd="url(#fluxoArw)" />
        <path d="M608,239 H646" stroke="#4a6b82" strokeWidth="2.2" strokeDasharray="5 6" fill="none" markerEnd="url(#fluxoArw)" />
        <path d="M744,239 C772,239 776,157 796,157" stroke="#4a6b82" strokeWidth="2" strokeDasharray="5 6" fill="none" markerEnd="url(#fluxoArw)" />
        <path d="M744,239 H796" stroke="#4a6b82" strokeWidth="2" strokeDasharray="5 6" fill="none" markerEnd="url(#fluxoArw)" />
        <path d="M744,239 C772,239 776,321 796,321" stroke="#4a6b82" strokeWidth="2" strokeDasharray="5 6" fill="none" markerEnd="url(#fluxoArw)" />

        <g transform="translate(42,148)">
          <rect width="150" height="84" rx="14" fill="#fff" stroke="#e6e1d8" />
          <path d="M0,14 A14,14 0 0 1 14,0 H136 A14,14 0 0 1 150,14 V26 H0 Z" fill="#4a6b82" />
          <circle cx="16" cy="13" r="2.3" fill="#fff" opacity="0.9" /><circle cx="26" cy="13" r="2.3" fill="#fff" opacity="0.9" /><circle cx="36" cy="13" r="2.3" fill="#fff" opacity="0.9" />
          <g transform="translate(75,46) scale(1.2) translate(-12,-12)" fill="none" stroke="#4a6b82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0" /><line x1="12" y1="17" x2="12" y2="21" />
          </g>
          <text x="75" y="74" textAnchor="middle" fontSize="13" fontWeight="700" fill="#33495a">Gravar</text>
        </g>

        <g transform="translate(42,246)">
          <rect width="150" height="84" rx="14" fill="#fff" stroke="#e6e1d8" />
          <path d="M0,14 A14,14 0 0 1 14,0 H136 A14,14 0 0 1 150,14 V26 H0 Z" fill="#4a6b82" />
          <circle cx="16" cy="13" r="2.3" fill="#fff" opacity="0.9" /><circle cx="26" cy="13" r="2.3" fill="#fff" opacity="0.9" /><circle cx="36" cy="13" r="2.3" fill="#fff" opacity="0.9" />
          <g transform="translate(75,45) scale(1.2) translate(-12,-12)" fill="none" stroke="#4a6b82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v9" /><polyline points="8.5 8.5 12 12 15.5 8.5" /><path d="M5 14v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
          </g>
          <text x="75" y="74" textAnchor="middle" fontSize="13" fontWeight="700" fill="#33495a">Importar áudio</text>
        </g>
        <text x="117" y="348" textAnchor="middle" fontSize="12" fill="#7c8590">entrevistas gravadas</text>

        <g transform="translate(250,180)">
          <rect width="150" height="118" rx="14" fill="#ffffff" stroke="#e6e1d8" />
          <path d="M0,14 A14,14 0 0 1 14,0 H136 A14,14 0 0 1 150,14 V26 H0 Z" fill="#4a6b82" />
          <circle cx="16" cy="13" r="2.3" fill="#fff" opacity="0.9" /><circle cx="26" cy="13" r="2.3" fill="#fff" opacity="0.9" /><circle cx="36" cy="13" r="2.3" fill="#fff" opacity="0.9" />
          <g transform="translate(75,58) scale(1.5) translate(-12,-12)" fill="none" stroke="#4a6b82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="8" width="12" height="9" rx="3" /><line x1="12" y1="4" x2="12" y2="8" /><circle cx="12" cy="3.3" r="1.1" /><circle cx="9.6" cy="12.5" r="1.1" /><circle cx="14.4" cy="12.5" r="1.1" /><line x1="4" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="20" y2="12" />
          </g>
          <text x="75" y="104" textAnchor="middle" fontSize="15" fontWeight="700" fill="#33495a">Transcrever</text>
        </g>
        <text x="325" y="316" textAnchor="middle" fontSize="12" fill="#7c8590">IA · no seu computador</text>

        <g transform="translate(458,180)">
          <rect width="150" height="118" rx="14" fill="#ffffff" stroke="#cfdac6" />
          <path d="M0,14 A14,14 0 0 1 14,0 H136 A14,14 0 0 1 150,14 V26 H0 Z" fill="#6f8f6a" />
          <circle cx="16" cy="13" r="2.3" fill="#fff" opacity="0.9" /><circle cx="26" cy="13" r="2.3" fill="#fff" opacity="0.9" /><circle cx="36" cy="13" r="2.3" fill="#fff" opacity="0.9" />
          <g transform="translate(75,57) scale(1.55) translate(-12,-12)" fill="none" stroke="#6f8f6a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8.5" /><polyline points="8 12 11 15 16 9" />
          </g>
          <text x="75" y="104" textAnchor="middle" fontSize="15" fontWeight="700" fill="#4e6b48">Validar</text>
        </g>
        <text x="533" y="316" textAnchor="middle" fontSize="12" fill="#7c8590">você confere o texto</text>

        <rect x="650" y="219" width="94" height="40" rx="20" fill="#4a6b82" />
        <g transform="translate(672,239) scale(0.82) translate(-12,-12)" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h8l4 4v14H6Z" /><polyline points="14 3 14 7 18 7" />
        </g>
        <text x="692" y="244" fontSize="14" fontWeight="700" fill="#fff">Gerar</text>

        <g transform="translate(798,137)">
          <rect width="190" height="40" rx="12" fill="#fff" stroke="#e6e1d8" />
          <rect x="8" y="7" width="4" height="26" rx="2" fill="#4a6b82" />
          <g transform="translate(30,20) scale(0.78) translate(-12,-12)" fill="none" stroke="#4a6b82" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h8l4 4v14H6Z" /><polyline points="14 3 14 7 18 7" /></g>
          <text x="48" y="24.5" fontSize="13" fontWeight="700" fill="#33495a">Ata de reunião</text>
        </g>
        <g transform="translate(798,219)">
          <rect width="190" height="40" rx="12" fill="#fff" stroke="#e6e1d8" />
          <rect x="8" y="7" width="4" height="26" rx="2" fill="#8a7c9a" />
          <g transform="translate(30,20) scale(0.78) translate(-12,-12)" fill="none" stroke="#8a7c9a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h8l4 4v14H6Z" /><polyline points="14 3 14 7 18 7" /></g>
          <text x="48" y="24.5" fontSize="12.5" fontWeight="700" fill="#33495a">Mapeamento de processo</text>
        </g>
        <g transform="translate(798,301)">
          <rect width="190" height="40" rx="12" fill="#fff" stroke="#e6e1d8" />
          <rect x="8" y="7" width="4" height="26" rx="2" fill="#b06a56" />
          <g transform="translate(30,20) scale(0.78) translate(-12,-12)" fill="none" stroke="#b06a56" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h8l4 4v14H6Z" /><polyline points="14 3 14 7 18 7" /></g>
          <text x="48" y="24.5" fontSize="13" fontWeight="700" fill="#33495a">Relatório</text>
        </g>

        <g transform="translate(42,432)">
          <circle cx="6" cy="-4" r="5" fill="#6f8f6a" />
          <text x="18" y="0" fontSize="12.5" fill="#7c8590">Verde = etapa com validação humana · o áudio é descartado após a transcrição</text>
        </g>
      </svg>
    </div>
  )
}
