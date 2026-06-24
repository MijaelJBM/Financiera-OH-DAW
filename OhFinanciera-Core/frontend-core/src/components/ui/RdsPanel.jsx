import { useState } from 'react'
import Semaforo from './Semaforo.jsx'
import { money } from '../../utils/format.js'

// Etiquetas y formato de cada ratio del servicio RDS.
const RATIOS = {
  cuota_ingreso: { label: 'Cuota / Ingreso', fmt: (r) => `${r.valor_pct}%`, lim: (r) => `≤${r.apetito}% / ${r.tolerancia}%` },
  deuda_excedente: { label: 'Deuda / Excedente', fmt: (r) => `${r.valor_veces}×`, lim: (r) => `≤${r.apetito}× / ${r.tolerancia}×` },
  cuota_excedente: { label: 'Cuota / Excedente', fmt: (r) => `${r.valor_pct}%`, lim: (r) => `≤${r.apetito}% / ${r.tolerancia}%` },
  n_entidades: { label: 'N.º de Entidades', fmt: (r) => `${r.valor}`, lim: (r) => `≤${r.apetito} / ${r.tolerancia}` },
}

/**
 * Panel de Riesgo de Sobreendeudamiento (servicio svc_rds).
 * Muestra cada ratio con su semáforo y el semáforo global bajo la estética de Financiera oh!
 */
export default function RdsPanel({ rds }) {
  if (!rds) return null
  const entradas = Object.entries(rds.ratios || {})
  
  // Estado para manejar el hover en las filas de la tabla de forma limpia
  const [hoveredRow, setHoveredRow] = useState(null)

  return (
    <div style={styles.panelContainer}>
      
      {/* ─── Bloque Superior: KPIs Globales de Riesgo ─── */}
      <div style={styles.kpiRow}>
        {/* KPI Semáforo Global */}
        <div style={{ ...styles.miniCard, borderLeft: '4px solid #cc1719' }}>
          <div style={styles.kpiLabel}>Semáforo Global RDS</div>
          <div style={styles.kpiValueWrapper}>
            <Semaforo estado={rds.semaforo_global} />
            <span style={styles.statusText}>Dictamen Global</span>
          </div>
        </div>

        {/* KPI Excedente */}
        <div style={styles.miniCard}>
          <div style={styles.kpiLabel}>Excedente Calculado</div>
          <div style={styles.kpiValueBig}>{money(rds.excedente)}</div>
        </div>

        {/* KPI Cuota Total */}
        <div style={styles.miniCard}>
          <div style={styles.kpiLabel}>Cuota Total Declarada</div>
          <div style={{ ...styles.kpiValueBig, color: '#101820' }}>{money(rds.cuota_total)}</div>
        </div>
      </div>

      {/* ─── Bloque Inferior: Tabla Detallada de Ratios ─── */}
      {entradas.length === 0 ? (
        <div style={styles.warningAlert}>
          <strong style={{ color: '#b45309' }}>⚠️ Alerta de Sincronización:</strong> 
          <span style={{ marginLeft: '6px' }}>Sin ratios calculados (faltan datos vigentes de las centrales de riesgo).</span>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Ratio de Admisión</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Valor Evaluado</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Apetito / Tolerancia</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Estado Política</th>
              </tr>
            </thead>
            <tbody>
              {entradas.map(([key, r]) => {
                const cfg = RATIOS[key] || { label: key, fmt: () => '—', lim: () => '—' }
                const isHovered = hoveredRow === key;

                return (
                  <tr 
                    key={key}
                    onMouseEnter={() => setHoveredRow(key)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      ...styles.tr,
                      backgroundColor: isHovered ? '#f8fafc' : '#ffffff'
                    }}
                  >
                    <td style={{ ...styles.td, fontWeight: '700', color: '#101820' }}>{cfg.label}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '800', color: '#cc1719', fontVariantNumeric: 'tabular-nums' }}>
                      {cfg.fmt(r)}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right', color: '#64748b', fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>
                      {cfg.lim(r)}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
                        <Semaforo estado={r.semaforo} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Estilos Premium del Panel RDS ───
const styles = {
  panelContainer: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    width: '100%'
  },
  kpiRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '24px'
  },
  miniCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px 20px',
    flex: '1 1 220px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  kpiLabel: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px'
  },
  kpiValueBig: {
    fontSize: '20px',
    fontWeight: '900',
    color: '#101820',
    letterSpacing: '-0.5px'
  },
  kpiValueWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '2px'
  },
  statusText: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#334155'
  },
  warningAlert: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fef3c7',
    color: '#451a03',
    padding: '16px 20px',
    borderRadius: '12px',
    fontSize: '13px',
    lineHeight: '1.5'
  },
  tableWrapper: {
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff'
  },
  th: {
    backgroundColor: '#f8fafc',
    color: '#475569',
    fontWeight: '800',
    padding: '14px 18px',
    textAlign: 'left',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  td: {
    padding: '14px 18px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '13px',
    color: '#334155',
    verticalAlign: 'middle'
  },
  tr: {
    transition: 'background-color 0.15s ease'
  }
}