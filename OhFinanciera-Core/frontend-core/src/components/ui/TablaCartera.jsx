import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { money, num } from '../../utils/format.js'
import Semaforo from './Semaforo.jsx'

/**
 * Tabla de cartera de un asesor (endpoint /creditos/cartera).
 * Diseñada bajo la línea estética unificada de Financiera oh!
 */
export default function TablaCartera({ cartera = [] }) {
  const navigate = useNavigate()
  const [hoveredRow, setHoveredRow] = useState(null)

  if (!cartera.length) {
    return (
      <div style={styles.emptyContainer}>
        <p style={styles.emptyText}>No hay créditos asignados a esta cartera actualmente.</p>
      </div>
    )
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID Crédito</th>
            <th style={styles.th}>Cliente / Razón Social</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Saldo Capital</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Vigente</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Vencido</th>
            <th style={{ ...styles.th, textAlign: 'center' }}>Días Atraso</th>
            <th style={{ ...styles.th, textAlign: 'center' }}>Calificación</th>
          </tr>
        </thead>
        <tbody>
          {cartera.map((c) => {
            const isHovered = hoveredRow === c.codcuentacredito
            const tieneMora = Number(c.car_ven_capital) > 0
            const atraso = Number(c.diasatrasocredito) || 0

            // Determinación semántica del estado del semáforo
            const estadoSemaforo = atraso > 30 ? 'ROJO' : atraso > 0 ? 'AMARILLO' : 'VERDE'

            // Color de fondo dinámico para la celda o píldora de días de atraso
            const badgeAtrasoStyle = atraso > 30 
              ? { backgroundColor: '#fef2f2', color: '#cc1719', fontWeight: '800' }
              : atraso > 0 
                ? { backgroundColor: '#fffbeb', color: '#b45309', fontWeight: '700' }
                : { backgroundColor: '#f0fdf4', color: '#15803d', fontWeight: '600' };

            return (
              <tr
                key={c.codcuentacredito}
                onMouseEnter={() => setHoveredRow(c.codcuentacredito)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => navigate(`/creditos/${c.codcuentacredito}`)}
                style={{
                  ...styles.tr,
                  backgroundColor: isHovered ? '#f8fafc' : '#ffffff',
                  transform: isHovered ? 'translateX(2px)' : 'none'
                }}
              >
                {/* ID Crédito */}
                <td style={{ ...styles.td, fontFamily: 'monospace', color: '#64748b', fontSize: '12px' }}>
                  {c.codcuentacredito}
                </td>

                {/* Nombre de Cliente */}
                <td style={{ ...styles.td, fontWeight: '700', color: '#101820', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.nomcliente}
                </td>

                {/* Saldo Capital */}
                <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>
                  {money(c.montosaldocapital)}
                </td>

                {/* Tramo Vigente */}
                <td style={{ ...styles.td, textAlign: 'right', color: '#475569', fontVariantNumeric: 'tabular-nums' }}>
                  {money(c.car_vig_capital)}
                </td>

                {/* Tramo Vencido (Resalta en rojo suave si hay deuda pendiente real) */}
                <td style={{ 
                  ...styles.td, 
                  textAlign: 'right', 
                  fontWeight: tieneMora ? '700' : '400',
                  color: tieneMora ? '#cc1719' : '#94a3b8',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {money(c.car_ven_capital)}
                </td>

                {/* Días de Atraso Estilizados */}
                <td style={{ ...styles.td, textAlign: 'center' }}>
                  <span style={{ ...styles.atrasoBadge, ...badgeAtrasoStyle }}>
                    {num(c.diasatrasocredito)} d
                  </span>
                </td>

                {/* Semáforo de Estado */}
                <td style={{ ...styles.td, textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
                    <Semaforo estado={estadoSemaforo} />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Estilos UI de Alta Densidad para Operaciones Financieras ───
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
    backgroundColor: '#f8fafc',
    color: '#475569',
    fontWeight: '800',
    padding: '12px 16px',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #e2e8f0',
    userSelect: 'none'
  },
  tr: {
    cursor: 'pointer',
    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '13px',
    color: '#334155',
    verticalAlign: 'middle'
  },
  atrasoBadge: {
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '6px',
    display: 'inline-block',
    minWidth: '45px',
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums'
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
    fontStyle: 'italic',
    fontFamily: '"Inter", sans-serif'
  }
}