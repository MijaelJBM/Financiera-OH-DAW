import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

/**
 * Gráfico de barras premium para la evolución histórica.
 * data: [{ periodomes, saldo_real, meta, ... }]
 */
export default function GraficoBarras({ data = [], xKey = 'periodomes', barras = [] }) {
  if (!data.length) {
    return <p style={styles.noData}>Sin datos para graficar.</p>
  }

  // Componente personalizado para el Tooltip Flotante (SaaS Premium)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltipContainer}>
          <p style={styles.tooltipLabel}>{`Período: ${label}`}</p>
          <div style={styles.tooltipDivider} />
          {payload.map((entry, index) => (
            <div key={index} style={styles.tooltipRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ ...styles.tooltipDot, backgroundColor: entry.color }} />
                <span style={styles.tooltipName}>{entry.name}:</span>
              </div>
              <span style={{ ...styles.tooltipValue, color: entry.color }}>
                {entry.value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 0 })}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 300, fontFamily: '"Inter", -apple-system, sans-serif' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 15, right: 10, left: -10, bottom: 0 }}
          barGap={4}
        >
          {/* Cuadrícula horizontal muy sutil */}
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
          
          {/* Eje X estilizado */}
          <XAxis 
            dataKey={xKey} 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            dy={8}
            stroke="#64748b"
            style={{ fontWeight: '600' }}
          />
          
          {/* Eje Y estilizado con formateo abreviado si es necesario */}
          <YAxis 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            dx={-4}
            stroke="#64748b"
            style={{ fontWeight: '500' }}
            tickFormatter={(value) => 
              value >= 1e6 ? `${(value / 1e6).toFixed(1)}M` : value >= 1e3 ? `${(value / 1e3).toFixed(0)}k` : value
            }
          />
          
          {/* Tooltip Premium inyectado */}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.6 }} />
          
          {/* Leyenda minimalista */}
          <Legend 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{ paddingTop: '16px', fontSize: '12px', fontWeight: '600', color: '#475569' }}
          />
          
          {/* Mapeo de barras optimizado */}
          {barras.map((b) => (
            <Bar 
              key={b.key} 
              dataKey={b.key} 
              name={b.label} 
              fill={b.color} 
              radius={[6, 6, 0, 0]} 
              barSize={20} // Más delgadas y sofisticadas
              style={{ transition: 'all 0.3s ease' }}
            />
          ))}
        </BarChart>
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
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(8px)',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '12px 14px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
    fontFamily: '"Inter", sans-serif'
  },
  tooltipLabel: {
    margin: 0,
    fontSize: '12px',
    fontWeight: '800',
    color: '#101820',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  tooltipDivider: {
    height: '1px',
    backgroundColor: '#f1f5f9',
    margin: '8px 0'
  },
  tooltipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    margin: '4px 0'
  },
  tooltipDot: {
    width: '7px',
    height: '7px',
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
    fontWeight: '700',
    fontVariantNumeric: 'tabular-nums'
  }
}