import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

/**
 * Gráfico de línea premium con línea de referencia e indicadores refinados.
 * data: [{ [xKey]: ..., [yKey]: number }]
 */
export default function GraficoLinea({
  data = [],
  xKey = 'periodomes',
  yKey = 'valor',
  color = '#cc1719', // Por defecto el Rojo Oh!
  refY = null,
  refLabel,
  sufijo = '',
}) {
  if (!data.length) {
    return <p style={styles.noData}>Sin datos para graficar.</p>
  }

  // Tooltip flotante estilizado a medida
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltipContainer}>
          <p style={styles.tooltipLabel}>{`Cierre: ${label}`}</p>
          <div style={styles.tooltipDivider} />
          {payload.map((entry, index) => (
            <div key={index} style={styles.tooltipRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ ...styles.tooltipDot, backgroundColor: entry.color }} />
                <span style={styles.tooltipName}>Ratio Real:</span>
              </div>
              <span style={{ ...styles.tooltipValue, color: entry.color }}>
                {`${entry.value}${sufijo}`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 280, fontFamily: '"Inter", -apple-system, sans-serif' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 15, left: -15, bottom: 0 }}>
          {/* Cuadrícula horizontal tenue */}
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
          
          {/* Eje X limpio */}
          <XAxis 
            dataKey={xKey} 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            dy={8}
            stroke="#64748b"
            style={{ fontWeight: '600' }}
          />
          
          {/* Eje Y limpio con el sufijo % */}
          <YAxis 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            dx={-4}
            stroke="#64748b"
            style={{ fontWeight: '500' }}
            tickFormatter={(v) => `${v}${sufijo}`}
          />
          
          {/* Inyección de nuestro Tooltip premium */}
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
          
          {/* Línea de Tolerancia de Riesgo / Umbral SBS */}
          {refY != null && (
            <ReferenceLine
              y={refY}
              stroke="#ef4444"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              label={{ 
                value: `⚠️ ${refLabel}`, 
                position: 'insideBottomRight', 
                fontSize: 10, 
                fontWeight: '700',
                fill: '#b91c1c',
                style: { backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '4px' }
              }}
            />
          )}
          
          {/* Línea de tendencia estilizada con nodos interactivos suaves */}
          <Line 
            type="monotone" 
            dataKey={yKey} 
            stroke={color} 
            strokeWidth={3} 
            dot={{ r: 3, stroke: '#ffffff', strokeWidth: 1.5, fill: color }} 
            activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2, fill: color }}
            style={{ filter: 'drop-shadow(0px 2px 4px rgba(204, 23, 25, 0.15))' }}
          />
        </LineChart>
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
    padding: '10px 14px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
    fontFamily: '"Inter", sans-serif'
  },
  tooltipLabel: {
    margin: 0,
    fontSize: '11px',
    fontWeight: '800',
    color: '#101820',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  tooltipDivider: {
    height: '1px',
    backgroundColor: '#f1f5f9',
    margin: '6px 0'
  },
  tooltipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    margin: '2px 0'
  },
  tooltipDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  tooltipName: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#64748b'
  },
  tooltipValue: {
    fontSize: '13px',
    fontWeight: '800',
    fontVariantNumeric: 'tabular-nums'
  }
}