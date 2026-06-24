import { useState } from 'react'
import { Briefcase, User, Calendar, Filter, AlertCircle, RefreshCw } from 'lucide-react'
import { useCartera } from '../hooks/useCreditos.js'
import { useAuth } from '../hooks/useAuth.js'
import TablaCartera from '../components/ui/TablaCartera.jsx'
import Loader from '../components/ui/Loader.jsx'

const ROJO_OH = '#cc1719'
const NEGRO_OH = '#101820'
const GRIS_BORDE = '#e2e8f0'
const PERIODO_DEFAULT = '202512'

export default function CarteraPage() {
  const { user } = useAuth()
  
  // El pkasesor viene del login; queda editable por si una jefatura consulta otra cartera.
  const [pkasesor, setPkasesor] = useState(String(user?.pkasesor ?? ''))
  const [periodomes, setPeriodomes] = useState(PERIODO_DEFAULT)

  const { cartera, loading, error } = useCartera(pkasesor, periodomes)

  return (
    <div style={styles.pageContainer}>
      
      {/* ── Header Principal ── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.brandBadge}>
            <span style={styles.badgeDot} /> <Briefcase size={12} style={{ marginRight: 4 }} /> CONSULTA DE ACTIVOS
          </div>
          <h1 style={styles.mainTitle}>Cartera del Asesor</h1>
          <p style={styles.mainSubtitle}>
            Créditos asignados priorizados por días de atraso cronológico (mayor riesgo e impacto en aprovisionamiento primero).
            {user?.codasesor && ` · Código Operativo: ${user.codasesor}`}
          </p>
        </div>
      </div>

      {/* ── Panel de Filtros Estructurados (Búsqueda por Parámetros) ── */}
      <div style={styles.panelCard}>
        <div style={styles.panelHeaderContainer}>
          <Filter size={16} color={ROJO_OH} />
          <h3 style={styles.panelTitle}>Parámetros de Segmentación de Cartera</h3>
        </div>
        
        <div style={styles.fieldsGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>
              <User size={11} style={{ marginRight: 4, verticalAlign: '-1px' }} /> PK Único del Asesor
            </label>
            <input
              type="number"
              value={pkasesor}
              onChange={(e) => setPkasesor(e.target.value)}
              placeholder="Ej. 31"
              style={styles.inputField}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>
              <Calendar size={11} style={{ marginRight: 4, verticalAlign: '-1px' }} /> Período Contable / Comercial (AAAAMM)
            </label>
            <input
              type="text"
              value={periodomes}
              onChange={(e) => setPeriodomes(e.target.value)}
              style={styles.inputField}
            />
          </div>
        </div>
      </div>

      {/* ── Contenedor de la Tabla Transaccional Premium ── */}
      <div style={styles.tableContainer}>
        {loading && (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <Loader texto="Consultando base de datos analítica de saldos e histórico de cartera…" />
          </div>
        )}
        
        {error && (
          <div style={styles.errorAlert}>
            <AlertCircle size={16} style={{ marginRight: 8, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        
        {!loading && !error && (
          <div style={styles.tableWrapper}>
            {/* Se asume que TablaCartera inyectará las filas de manera agnóstica; 
                el contenedor ya maneja la consistencia visual */}
            <TablaCartera cartera={cartera} />
          </div>
        )}
      </div>

      {/* ── Footer Informativo / Auditoría de Carga ── */}
      <div style={styles.footerSummary}>
        Mapeando entorno transaccional para el asesor <strong>{pkasesor || '—'}</strong> en el periodo contable contiguo <strong>{periodomes}</strong>.
      </div>
    </div>
  )
}

// ─── Estilos de Diseño Corporativo Financiera oh! ───
const styles = {
  pageContainer: {
    padding: '32px',
    backgroundColor: '#f6f8fa',
    minHeight: '100vh',
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    boxSizing: 'border-box'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
    marginBottom: '32px'
  },
  brandBadge: {
    backgroundColor: '#ffffff',
    color: '#475569',
    padding: '6px 14px',
    borderRadius: '100px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    letterSpacing: '0.5px',
    marginBottom: '12px',
    border: '1px solid ' + GRIS_BORDE
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: ROJO_OH,
    marginRight: '6px'
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: NEGRO_OH,
    margin: 0,
    letterSpacing: '-0.6px'
  },
  mainSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '6px 0 0 0',
    lineHeight: '1.5'
  },
  panelCard: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '24px',
    border: '1px solid ' + GRIS_BORDE,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
    marginBottom: '24px',
    transition: 'all 0.2s ease-in-out'
  },
  panelHeaderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '18px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '10px'
  },
  panelTitle: {
    margin: 0,
    fontSize: '13px',
    fontWeight: '800',
    color: NEGRO_OH,
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  fieldsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  inputLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#475569',
    display: 'flex',
    alignItems: 'center'
  },
  inputField: {
    backgroundColor: '#f8fafc',
    border: '1px solid ' + GRIS_BORDE,
    borderRadius: '10px',
    padding: '11px 14px',
    fontSize: '13px',
    color: NEGRO_OH,
    fontWeight: '600',
    outline: 'none',
    transition: 'all 0.15s ease',
    width: '100%',
    boxSizing: 'border-box'
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1px solid ' + GRIS_BORDE,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
    overflow: 'hidden'
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto'
  },
  footerSummary: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '12px',
    paddingLeft: '4px'
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    color: '#b91c1c',
    padding: '16px 20px',
    borderRadius: '14px',
    margin: '24px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '500'
  }
}