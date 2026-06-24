import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, FilePlus, ShieldAlert, Sparkles, 
  TrendingUp, CheckCircle, AlertTriangle, ArrowRight, 
  Activity, Layers, Users
} from 'lucide-react'
import { useCrearSolicitud } from '../hooks/useSolicitudes.js'
import { useAuth } from '../hooks/useAuth.js'
import { puede } from '../utils/permisos.js'
import SolicitudForm from '../components/forms/SolicitudForm.jsx'
import ScoreGauge from '../components/ui/ScoreGauge.jsx'
import Semaforo from '../components/ui/Semaforo.jsx'
import RdsPanel from '../components/ui/RdsPanel.jsx'
import RutaAprobacion from '../components/ui/RutaAprobacion.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, pct } from '../utils/format.js'

const ROJO_OH = '#cc1719'
const NEGRO_OH = '#101820'
const GRIS_BORDE = '#e2e8f0'

const DECISION_SEMAFORO = { APROBADO: 'VERDE', OBSERVADO: 'AMARILLO', RECHAZADO: 'ROJO' }

export default function SolicitudNuevaPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { crear, resultado, rechazo, loading, error } = useCrearSolicitud()

  const puedeCrear = puede(user?.rol, 'crear_solicitud')
  const [isHoveredBack, setIsHoveredBack] = useState(false)

  return (
    <div style={styles.pageContainer}>
      
      {/* ── Botón Volver con Micro-interacción ── */}
      <button 
        style={{
          ...styles.btnGhost,
          ...(isHoveredBack ? styles.btnGhostHover : {})
        }} 
        onClick={() => navigate('/solicitudes')}
        onMouseEnter={() => setIsHoveredBack(true)}
        onMouseLeave={() => setIsHoveredBack(false)}
      >
        <ArrowLeft size={16} /> Volver a la Bandeja
      </button>

      {/* ── Header Principal ── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.brandBadge}>
            <span style={styles.badgeDot} /> ORIGINACIÓN TRANSACCIONAL
          </div>
          <h1 style={styles.mainTitle}>Nueva Solicitud de Crédito</h1>
          <p style={styles.mainSubtitle}>
            Políticas e Instructivo <code style={styles.codeSnippet}>MPR-003-CRE</code>: Flujo automatizado de elegibilidad, motor de pre-scoring, matriz RDS y asignación dinámica de ruta de aprobación.
          </p>
        </div>
      </div>

      {/* ── Alerta de Control de Permisos / Regulación de Roles ── */}
      {!puedeCrear && (
        <div style={styles.alertInfo}>
          <ShieldAlert size={20} color="#0284c7" style={{ shrink: 0 }} />
          <div>
            Tu rol actual <strong>{user?.rol || 'No Definido'}</strong> no cuenta con facultades de originación directa en producción. El Gateway denegará la persistencia con un código <code style={styles.codeSnippet}>403 Forbidden</code>. Requieres credenciales de <em>asesor</em> o <em>administrador</em>.
          </div>
        </div>
      )}

      {/* ── Layout Bifurcado de Operación (Formulario vs Motor) ── */}
      <div style={styles.mainGrid}>
        
        {/* Columna Izquierda: Formulario de Entrada */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeaderContainer}>
            <FilePlus size={18} color={ROJO_OH} />
            <h3 style={styles.panelTitle}>Datos de la Operación y Postulante</h3>
          </div>
          
          <div style={styles.formWrapper}>
            <SolicitudForm onSubmit={crear} loading={loading} codasesorDefault={user?.codasesor} />
          </div>

          {error && (
            <div style={styles.alertError}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Columna Derecha: Output en Tiempo Real del Motor de Crédito */}
        <div style={{ ...styles.panelCard, backgroundColor: '#ffffff' }}>
          <div style={styles.panelHeaderContainer}>
            <Sparkles size={18} color="#ee5e00" />
            <h3 style={styles.panelTitle}>Diagnóstico Automático del Motor de Riesgos</h3>
          </div>

          {loading && (
            <div style={styles.loaderContainer}>
              <Loader texto="Ejecutando algoritmos de scoring y validación de listas obligatorias..." />
            </div>
          )}

          {!loading && !resultado && !rechazo && (
            <div style={styles.emptyStateContainer}>
              <Activity size={32} color="#94a3b8" style={{ marginBottom: 12 }} />
              <p style={styles.emptyStateText}>
                Ingresa y procesa los datos del cliente en el panel izquierdo para inicializar el scoring de crédito.
              </p>
            </div>
          )}

          {/* CASO A: Cliente NO sujeto de crédito (HTTP 422 - Rechazo por Políticas Hard) */}
          {rechazo && (
            <div style={styles.resultContainer}>
              <div style={styles.alertError}>
                <AlertTriangle size={18} />
                <div>
                  <strong style={{ display: 'block', marginBottom: 2 }}>Operación Rechazada por Motor</strong>
                  {rechazo.error}
                </div>
              </div>
              
              {rechazo.elegibilidad && (
                <div style={styles.sectionReview}>
                  <h4 style={styles.sectionReviewTitle}>Evaluación de Elegibilidad Primaria</h4>
                  <div style={styles.rowFlexInline}>
                    <Semaforo estado="ROJO" />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: NEGRO_OH }}>
                      Calificación Interna: <span style={styles.highlightBadge}>{rechazo.elegibilidad.calificacion}</span> — {rechazo.elegibilidad.resultado}
                    </span>
                  </div>
                  
                  <ul style={styles.reasonList}>
                    {(rechazo.elegibilidad.motivos || []).map((m, i) => (
                      <li key={i} style={styles.reasonItem}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* CASO B: Solicitud Creada Exitosamente (Evaluación y Scoring Disponible) */}
          {resultado && (
            <div style={styles.resultContainer}>
              <div style={styles.alertSuccess}>
                <CheckCircle size={18} color="#047857" />
                <div style={{ fontSize: '13px', color: '#065f46' }}>
                  Solicitud registrada bajo el código{' '}
                  <strong
                    style={styles.clickableCode}
                    onClick={() => navigate(`/solicitudes/${resultado.codsolicitud}`)}
                  >
                    {resultado.codsolicitud}
                  </strong>{' '}
                  — Estado: <span style={{ textTransform: 'uppercase', fontWeight: '700' }}>{resultado.estado}</span>
                  {resultado.observada && <span style={{ color: '#b45309', display: 'block', marginTop: 4, fontWeight: '600' }}>⚠️ OBSERVADA: Cliente categorizado CPP en SBS</span>}
                </div>
              </div>

              {/* Bloque Scoring */}
              <div style={styles.sectionReview}>
                <h4 style={styles.sectionReviewTitle}><TrendingUp size={14} style={{ marginRight: 6 }} /> Pre-scoring de Comportamiento</h4>
                <div style={styles.scoringLayout}>
                  <ScoreGauge score={resultado.scoring?.score} />
                  <div style={styles.scoringDataBlock}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Semaforo estado={DECISION_SEMAFORO[resultado.scoring?.decision]} />{' '}
                      <strong style={{ fontSize: '15px', color: NEGRO_OH }}>{resultado.scoring?.decision}</strong>
                    </div>
                    <div style={styles.metricRow}>
                      <span style={styles.metricLabel}>TEA Sugerida Base:</span>
                      <strong style={styles.metricValue}>{pct(resultado.scoring?.tea_sugerida)}</strong>
                    </div>
                    <div style={styles.metricRow}>
                      <span style={styles.metricLabel}>Cuota Estimada Mensual:</span>
                      <strong style={{ ...styles.metricValue, color: ROJO_OH }}>{money(resultado.scoring?.cuota_estimada)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloque Elegibilidad */}
              <div style={styles.sectionReview}>
                <h4 style={styles.sectionReviewTitle}><CheckCircle size={14} style={{ marginRight: 6 }} /> Criterios de Elegibilidad</h4>
                <div style={{ ...styles.rowFlexInline, backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
                  <Semaforo estado={resultado.elegibilidad?.resultado === 'APTO' ? 'VERDE' : 'AMARILLO'} />{' '}
                  <span style={{ fontSize: '13px', fontWeight: '600', color: NEGRO_OH }}>
                    Dictamen: <strong>{resultado.elegibilidad?.resultado}</strong> · Calificación: <strong>{resultado.elegibilidad?.calificacion}</strong>
                  </span>
                </div>
                {resultado.elegibilidad?.motivos?.length > 0 && (
                  <ul style={styles.reasonList}>
                    {resultado.elegibilidad.motivos.map((m, i) => (
                      <li key={i} style={styles.reasonItem}>{m}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Bloque RDS */}
              <div style={styles.sectionReview}>
                <h4 style={styles.sectionReviewTitle}><Layers size={14} style={{ marginRight: 6 }} /> Capacidad de Endeudamiento (Mapeo RDS)</h4>
                <RdsPanel rds={resultado.rds} />
              </div>

              {/* Bloque Nivel y Ruta */}
              <div style={styles.sectionReview}>
                <h4 style={styles.sectionReviewTitle}><Users size={14} style={{ marginRight: 6 }} /> Atribución de Autonomía de Aprobación</h4>
                <div style={styles.autonomiaBlock}>
                  <span style={styles.autonomiaBadge}>{resultado.nivel_aprobacion?.codigo || '—'}</span>
                  <span style={styles.autonomiaText}>{resultado.nivel_aprobacion?.descripcion || 'Sin descripción de nivel'}</span>
                </div>
              </div>

              {/* Flujo Gráfico de Ruta */}
              <div style={styles.sectionReview}>
                <h4 style={styles.sectionReviewTitle}>Estaciones Críticas de la Ruta</h4>
                <RutaAprobacion ruta={resultado.ruta_aprobacion} />
              </div>

              {/* Botón de Salida */}
              <button 
                style={styles.btnActionForward} 
                onClick={() => navigate(`/solicitudes/${resultado.codsolicitud}`)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b01214'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ROJO_OH}
              >
                <span>Avanzar al Expediente Digital</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ─── Estilos de Diseño Corporativo Premium Financiera oh! ───
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
    border: '1px solid #e2e8f0',
    color: '#475569',
    padding: '8px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s ease-in-out',
    marginBottom: '24px'
  },
  btnGhostHover: {
    backgroundColor: '#ffffff',
    color: NEGRO_OH,
    borderColor: '#cbd5e1',
    transform: 'translateX(-2px)'
  },
  headerRow: {
    marginBottom: '28px'
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
    gap: '8px',
    letterSpacing: '0.5px',
    marginBottom: '12px',
    border: '1px solid ' + GRIS_BORDE
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: ROJO_OH
  },
  mainTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: NEGRO_OH,
    margin: 0,
    letterSpacing: '-0.5px'
  },
  mainSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '6px 0 0 0',
    lineHeight: '1.5'
  },
  codeSnippet: {
    fontFamily: 'monospace',
    backgroundColor: '#e2e8f0',
    padding: '2px 6px',
    borderRadius: '4px',
    color: '#334155',
    fontWeight: '600',
    fontSize: '12px'
  },
  alertInfo: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    color: '#0369a1',
    padding: '14px 18px',
    borderRadius: '14px',
    fontSize: '13px',
    lineHeight: '1.5',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '28px'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'start'
  },
  panelCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid ' + GRIS_BORDE,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)'
  },
  panelHeaderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '14px'
  },
  panelTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '800',
    color: NEGRO_OH,
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  formWrapper: {
    marginTop: '8px'
  },
  loaderContainer: {
    padding: '40px 0',
    textAlign: 'center'
  },
  emptyStateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center'
  },
  emptyStateText: {
    fontSize: '13px',
    color: '#64748b',
    maxWidth: '280px',
    margin: 0,
    lineHeight: '1.5'
  },
  resultContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  alertError: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    color: '#b91c1c',
    padding: '14px 16px',
    borderRadius: '12px',
    fontSize: '13px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    lineHeight: '1.4'
  },
  alertSuccess: {
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    padding: '16px',
    borderRadius: '14px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    lineHeight: '1.5'
  },
  clickableCode: {
    color: ROJO_OH,
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: '800'
  },
  sectionReview: {
    border: '1px solid #f1f5f9',
    borderRadius: '14px',
    padding: '16px',
    backgroundColor: '#ffffff'
  },
  sectionReviewTitle: {
    margin: '0 0 12px 0',
    fontSize: '12px',
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    display: 'flex',
    alignItems: 'center'
  },
  rowFlexInline: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  highlightBadge: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '700'
  },
  reasonList: {
    margin: '12px 0 0 0',
    paddingLeft: '20px',
    color: '#475569',
    fontSize: '13px'
  },
  reasonItem: {
    marginBottom: '6px',
    lineHeight: '1.4'
  },
  scoringLayout: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '12px'
  },
  scoringDataBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    borderBottom: '1px dashed #e2e8f0',
    paddingBottom: '4px'
  },
  metricLabel: {
    color: '#64748b',
    fontWeight: '500'
  },
  metricValue: {
    color: NEGRO_OH,
    fontWeight: '700'
  },
  autonomiaBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#f8fafc',
    padding: '10px 14px',
    borderRadius: '10px'
  },
  autonomiaBadge: {
    backgroundColor: NEGRO_OH,
    color: '#ffffff',
    fontWeight: '800',
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  autonomiaText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155'
  },
  btnActionForward: {
    backgroundColor: ROJO_OH,
    color: '#ffffff',
    border: 'none',
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 14px rgba(204,23,25,0.2)',
    transition: 'all 0.2s ease',
    marginTop: '10px'
  }
}