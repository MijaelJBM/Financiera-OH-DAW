/**
 * Medidor semicircular de cumplimiento (0–100%+) con diseño premium y zonas de color.
 * según el semáforo de metas: ≥90 verde · 70–89 ámbar · <70 rojo.
 *
 * @param {{value:number, sublabel?:string}} props  value = % de cumplimiento
 */
export default function Gauge({ value = 0, sublabel }) {
  const v = Math.max(0, value)
  
  // Paleta de colores refinada (SaaS Premium)
  const color = v >= 90 ? '#10b981' : v >= 70 ? '#f59e0b' : '#cc1719' // Rojo Oh!, Ámbar y Esmeralda moderno

  const R = 80
  const len = Math.PI * R // longitud del semicírculo
  const frac = Math.min(v, 100) / 100

  return (
    <div style={styles.container}>
      <svg width="220" height="132" viewBox="0 0 200 120" style={{ overflow: 'visible' }}>
        {/* Definición de filtros para el efecto de brillo sutil */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Arco de fondo (Track) más fino y limpio */}
        <path 
          d="M20 100 A80 80 0 0 1 180 100" 
          fill="none" 
          stroke="#f1f5f9" 
          strokeWidth="10" 
          strokeLinecap="round" 
        />
        
        {/* Sombra/Brillo sutil del arco de progreso (Solo si hay progreso) */}
        {frac > 0 && (
          <path
            d="M20 100 A80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - frac)}
            opacity="0.15"
            filter="url(#glow)"
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        )}

        {/* Arco de progreso principal */}
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - frac)}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        
        {/* Texto del porcentaje central estilizado */}
        <text 
          x="100" 
          y="95" 
          textAnchor="middle" 
          style={{
            fontSize: '32px',
            fontWeight: '900',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            letterSpacing: '-1px',
            fill: '#101820', // Texto principal oscuro neutral, el color va en el progreso
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {Math.round(v)}%
        </text>
      </svg>
      
      {/* Subetiqueta modernizada */}
      {sublabel && (
        <div style={styles.sublabel}>
          {sublabel}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '10px',
    display: 'inline-block'
  },
  sublabel: {
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '2px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    letterSpacing: '0.2px',
    textTransform: 'uppercase',
    opacity: 0.8
  }
}