/**
 * Medidor circular 0–100 del scoring crediticio ajustado al ecosistema Financiera oh!
 * Color según los umbrales de decisión del negocio:
 *  ≥70 APROBADO (verde) · 50–69 OBSERVADO (ámbar) · <50 RECHAZADO (rojo)
 */
export default function ScoreGauge({ score = 0 }) {
  const s = Math.max(0, Math.min(100, Number(score) || 0))

  // Mapeo semántico de decisiones y colores de riesgo premium
  const config = s >= 70 
    ? { color: '#10b981', bg: '#ecfdf5', label: 'APROBADO' } 
    : s >= 50 
      ? { color: '#f59e0b', bg: '#fffbeb', label: 'OBSERVADO' } 
      : { color: '#cc1719', bg: '#fef2f2', label: 'RECHAZADO' }; // Rojo Oh! corporativo

  const size = 150 // Un toque más amplio para mejorar legibilidad interna
  const stroke = 12
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - s / 100)

  return (
    <div style={styles.container}>
      <div style={{ width: size, height: size, position: 'relative' }}>
        <svg width={size} height={size}>
          {/* Anillo base (Pista gris minimalista) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke - 2} // Un poco más delgado que la línea de progreso para dar estética limpia
          />
          
          {/* Anillo activo con progreso fluido */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={config.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />

          {/* Bloque Central de Texto (Métrica + Dictamen) */}
          <g transform={`translate(${size / 2}, ${size / 2 - 4})`}>
            {/* Valor Numérico del Score */}
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="34"
              fontWeight="900"
              fill="#101820" // Negro premium para el número para mejorar el contraste
              style={{ letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums' }}
            >
              {s}
            </text>
            
            {/* Tag o etiqueta del dictamen de riesgo interna */}
            <text
              y="26"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fontWeight="800"
              fill={config.color}
              style={{ letterSpacing: '0.5px' }}
            >
              {config.label}
            </text>
          </g>
        </svg>
      </div>

      {/* Leyenda externa del componente */}
      <span style={{ ...styles.subtitle, backgroundColor: config.bg, color: config.color }}>
        Métrica: Score / 100
      </span>
    </div>
  )
}

const styles = {
  container: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    padding: '10px'
  },
  subtitle: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    transition: 'all 0.3s ease'
  }
}