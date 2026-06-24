import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Paleta de respaldo refinada (Esmeralda, Rojo Oh!, Ámbar, Azul Slate, Indigo)
const DEFAULT_COLORS = ['#10b981', '#cc1719', '#f59e0b', '#475569', '#6366f1']

/**
 * Gráfico de anillo (Donut Chart) premium para distribución de cartera.
 * data: [{ name, value, color }]
 */
export default function GraficoTorta({ data = [] }) {
  const limpio = data.filter((d) => Number(d.value) > 0)
  
  if (!limpio.length) {
    return <p style={styles.noData}>Sin datos para graficar.</p>
  }

  // Tooltip flotante estilizado a medida con formateo de moneda/porcentaje genérico limpio
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div style={styles.tooltipContainer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...styles.tooltipDot, backgroundColor: entry.payload.color || entry.color }} />
            <span style={styles.tooltipName}>{entry.name}:</span>
          </div>
          <span style={{ ...styles.tooltipValue, color: '#101820' }}>
            {entry.value.toLocaleString('es-PE', { minimumFractionDigits: 0 })}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 300, fontFamily: '"Inter", -apple-system, sans-serif' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Tooltip Premium inyectado */}
          <Tooltip content={<CustomTooltip />} />
          
          <Pie
            data={limpio}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%" // Subido sutilmente para centrar visualmente con la leyenda abajo
            innerRadius={68}  // Transforma la torta pesada en un anillo limpio
            outerRadius={92}
            paddingAngle={2}   // Sutil separación estética entre bloques
            stroke="#ffffff"   // Línea divisoria nítida
            strokeWidth={3}
            style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.02))' }}
          >
            {limpio.map((entry, i) => (
              <Cell 
                key={`cell-${i}`} 
                // Prioriza el color asignado dinámicamente en el modelo (ej: verde/rojo de mora)
                fill={entry.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} 
                style={{ transition: 'all 0.3s ease', outline: 'none', cursor: 'pointer' }}
              />
            ))}
          </Pie>

          {/* Leyenda minimalista */}
          <Legend 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{ bottom: '10px', fontSize: '12px', fontWeight: '600', color: '#475569' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

const styles = {
  noData: {
    color: '#94a3b8',
    fontSize: '14px',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '40px 0',
    fontFamily: '"Inter", sans-serif'
  },
  tooltipContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    backdropFilter: 'blur(8px)',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '8px 12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
    fontFamily: '"Inter", sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  tooltipDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  tooltipName: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b'
  },
  tooltipValue: {
    fontSize: '13px',
    fontWeight: '800',
    fontVariantNumeric: 'tabular-nums'
  }
}