import { useState } from 'react'
import { money } from '../../utils/format.js'

/**
 * Plan de pagos (cronograma de cuotas) de un crédito.
 * Optimizado para operaciones de Financiera oh! con estados semánticos visuales.
 */
export default function TablaCronograma({ cronograma = [] }) {
  const [hoveredRow, setHoveredRow] = useState(null)

  if (!cronograma.length) {
    return (
      <div style={styles.emptyContainer}>
        <p style={styles.emptyText}>Sin cronograma de pagos disponible para este crédito.</p>
      </div>
    )
  }

  // Helper interno para formatear y estilizar dinámicamente los estados de la cuota
  const renderEstadoBadge = (estado) => {
    if (!estado) return <span style={{ color: '#94a3b8' }}>—</span>

    const est = estado.trim().toUpperCase()
    let badgeStyle = { backgroundColor: '#f1f5f9', color: '#475569' } // Por defecto / Otros

    if (est === 'CANCELADO' || est === 'PAGADO') {
      badgeStyle = { backgroundColor: '#e6f4ea', color: '#137333', fontWeight: '700' }
    } else if (est === 'VENCIDO' || est === 'MORA') {
      badgeStyle = { backgroundColor: '#fef2f2', color: '#cc1719', fontWeight: '800' } // Rojo Oh!
    } else if (est === 'VIGENTE' || est === 'PENDIENTE') {
      badgeStyle = { backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }
    }

    return (
      <span style={{ ...styles.badge, ...badgeStyle }}>
        {est}
      </span>
    )
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, width: '50px', textAlign: 'center' }}>N.º</th>
            <th style={styles.th}>Vencimiento</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Capital</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Interés</th>
            <th style={{ ...styles.th, textAlign: 'right', backgroundColor: '#f8fafc', color: '#0f172a' }}>Cuota Total</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Saldo Restante</th>
            <th style={{ ...styles.th, width: '120px', textAlign: 'center' }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {cronograma.map((q) => {
            const isHovered = hoveredRow === q.nrocuota
            
            return (
              <tr 
                key={q.nrocuota}
                onMouseEnter={() => setHoveredRow(q.nrocuota)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  ...styles.tr,
                  backgroundColor: isHovered ? '#f8fafc' : '#ffffff'
                }}
              >
                {/* Número de cuota */}
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '700', color: '#64748b' }}>
                  {q.nrocuota}
                </td>

                {/* Fecha de Vencimiento */}
                <td style={{ ...styles.td, color: '#334155', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }}>
                  {q.fechavencimientopagocuota}
                </td>

                {/* Monto Capital */}
                <td style={{ ...styles.td, textAlign: 'right', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
                  {money(q.montocapitalprogramado)}
                </td>

                {/* Monto Interés */}
                <td style={{ ...styles.td, textAlign: 'right', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
                  {money(q.montointeresprogramado)}
                </td>

                {/* Cuota Total (Resaltada estéticamente por ser la métrica clave de caja) */}
                <td style={{ 
                  ...styles.td, 
                  textAlign: 'right', 
                  fontWeight: '800', 
                  color: '#101820',
                  backgroundColor: isHovered ? '#f1f5f9' : '#f8fafc',
                  fontVariantNumeric: 'tabular-nums',
                  borderLeft: '1px solid #e2e8f0',
                  borderRight: '1px solid #e2e8f0'
                }}>
                  {money(q.montocuota)}
                </td>

                {/* Saldo Amortizado */}
                <td style={{ ...styles.td, textAlign: 'right', fontWeight: '500', color: '#475569', fontVariantNumeric: 'tabular-nums' }}>
                  {money(q.montosaldo)}
                </td>

                {/* Badge de Estado del Pago */}
                <td style={{ ...styles.td, textAlign: 'center' }}>
                  {renderEstadoBadge(q.codestadocuota)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Estilos de Alta Fidelidad para Cronogramas ───
const styles = {
  tableContainer: {
    width: '100%',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    textAlign: 'left'
  },
  th: {
    backgroundColor: '#ffffff',
    color: '#475569',
    fontWeight: '800',
    padding: '14px 16px',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #e2e8f0',
    userSelect: 'none'
  },
  tr: {
    transition: 'background-color 0.15s ease'
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '13px',
    color: '#334155',
    verticalAlign: 'middle'
  },
  badge: {
    fontSize: '10px',
    padding: '4px 8px',
    borderRadius: '6px',
    display: 'inline-block',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    textAlign: 'center',
    minWidth: '85px'
  },
  emptyContainer: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f8fafc',
    border: '1px dashed #cbd5e1',
    borderRadius: '12px'
  },
  emptyText: {
    color: '#64748b',
    fontSize: '14px',
    fontStyle: 'italic'
  }
}