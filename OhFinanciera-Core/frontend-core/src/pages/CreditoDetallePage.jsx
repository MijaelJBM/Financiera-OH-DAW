import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, CalendarDays, AlertTriangle, User, TrendingUp } from 'lucide-react'
import { useCreditoDetalle } from '../hooks/useCreditos.js'
import TablaCronograma from '../components/ui/TablaCronograma.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, num, pct } from '../utils/format.js'

const ROJO_OH = '#cc1719'
const NEGRO_OH = '#101820'
const GRIS_BORDE = '#e2e8f0'

export default function CreditoDetallePage() {
  const { codcuentacredito } = useParams()
  const navigate = useNavigate()
  const { detalle, cronograma, loading, error } = useCreditoDetalle(codcuentacredito)

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={{ ...styles.panelCard, textAlign: 'center', padding: 60 }}>
          <Loader texto="Consultando maestro de créditos y tablas de amortización contable..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.pageContainer}>
        <button 
          style={styles.btnGhost} 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Volver a Cartera
        </button>
        <div style={styles.errorAlert}>
          <AlertTriangle size={16} style={{ marginRight: 8, flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  if (!detalle) return null

  // Mapeo estructurado para renderizado scannable
  const infoEstructural = [
    { label: 'Titular / Razón Social', value: detalle.nomcliente, highlight: false },
    { label: 'Documento de Identidad', value: detalle.numerodocumentoidentidad, highlight: false },
    { label: 'Monto Aprobado', value: money(detalle.montoaprobadocredito), highlight: true },
    { label: 'N° de Cuotas Pactadas', value: num(detalle.nrocuotaaprobado), highlight: false },
    { label: 'Tasa Interés Compensatoria', value: pct(detalle.tasainterescompensatoria), highlight: false },
    { label: 'Fecha de Aprobación', value: detalle.fechaaprobacioncredito, highlight: false },
    { label: 'Saldo Capital', value: money(detalle.montosaldocapital), highlight: false },
    { label: 'Saldo Interés acumulado', value: money(detalle.montosaldointeres), highlight: false },
    { label: 'Saldo Total Exposición Cliente', value: money(detalle.montosaldocliente), highlight: true },
  ]

  const tieneAtraso = detalle.diasatrasocredito > 0

  return (
    <div style={styles.pageContainer}>
      
      {/* ── Botón de Retorno Operativo ── */}
      <div style={{ marginBottom: '24px' }}>
        <button 
          style={styles.btnGhost} 
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={16} /> Volver a control de cartera
        </button>
      </div>

      {/* ── Header Principal del Crédito ── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.brandBadge}>
            <span style={styles.badgeDot} /> <FileText size={12} style={{ marginRight: 4 }} /> AUDITORÍA EXTENDIDA DE OPERACIÓN
          </div>
          <h1 style={styles.mainTitle}>Crédito {detalle.codcuentacredito}</h1>
          <p style={styles.mainSubtitle}>
            Titular de la Cuenta: <strong>{detalle.nomcliente}</strong>
          </p>
        </div>

        {/* Alerta de Riesgo Dinámica */}
        <div style={{
          ...styles.atrasoCardBadge,
          backgroundColor: tieneAtraso ? '#fef2f2' : '#f0fdf4',
          borderColor: tieneAtraso ? '#fca5a5' : '#bbf7d0',
          color: tieneAtraso ? ROJO_OH : '#16a34a'
        }}>
          <div>
            <div style={styles.atrasoLabel}>Días de Atraso Sistema</div>
            <div style={styles.atrasoValue}>{num(detalle.diasatrasocredito)} días</div>
          </div>
        </div>
      </div>

      {/* ── Grilla Central de Datos de Auditoría ── */}
      <div style={styles.mainGrid}>
        
        {/* Panel Izquierdo: Ficha Estructurada del Crédito */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeaderContainer}>
            <User size={16} color={ROJO_OH} />
            <h3 style={styles.panelTitle}>Estructura Financiera del Activo</h3>
          </div>
          
          <div style={styles.dataListContainer}>
            {infoEstructural.map((item, index) => (
              <div key={index} style={styles.dataListRow}>
                <span style={styles.dataLabel}>{item.label}</span>
                <span style={{
                  ...styles.dataValue,
                  color: item.highlight ? ROJO_OH : NEGRO_OH,
                  fontWeight: item.highlight ? '800' : '600'
                }}>
                  {item.value ?? '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Derecho: Tabla Remota de Cronograma de Pagos */}
        <div style={styles.tableCard}>
          <div style={{ ...styles.panelHeaderContainer, padding: '24px 24px 10px 24px', border: 'none', marginBottom: 0 }}>
            <CalendarDays size={16} color={ROJO_OH} />
            <h3 style={styles.panelTitle}>Cronograma General de Pagos y Amortización</h3>
          </div>
          <div style={styles.tableWrapper}>
            <TablaCronograma cronograma={cronograma} />
          </div>
        </div>

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
  btnGhost: {
    backgroundColor: 'transparent',
    color: '#475569',
    border: '1px solid ' + GRIS_BORDE,
    padding: '10px 16px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s ease'
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
    margin: '6px 0 0 0'
  },
  atrasoCardBadge: {
    border: '1px solid',
    padding: '12px 24px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
    textAlign: 'right'
  },
  atrasoLabel: {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    opacity: 0.8
  },
  atrasoValue: {
    fontSize: '20px',
    fontWeight: '900',
    letterSpacing: '-0.5px'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.3fr',
    gap: '24px',
    alignItems: 'start'
  },
  panelCard: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '24px',
    border: '1px solid ' + GRIS_BORDE,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)'
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    border: '1px solid ' + GRIS_BORDE,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
    overflow: 'hidden'
  },
  panelHeaderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
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
  dataListContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  dataListRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f8fafc',
    fontSize: '13px'
  },
  dataLabel: {
    color: '#64748b',
    fontWeight: '600'
  },
  dataValue: {
    textAlign: 'right'
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto'
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    color: '#b91c1c',
    padding: '16px 20px',
    borderRadius: '14px',
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '500'
  }
}