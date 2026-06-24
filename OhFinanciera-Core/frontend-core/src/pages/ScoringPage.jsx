import { useState } from 'react'
import { 
  BarChart3, FileSpreadsheet, ShieldCheck, 
  AlertTriangle, Percent, Landmark, Info 
} from 'lucide-react'
import { useScoring } from '../hooks/useScoring.js'
import { useAuth } from '../hooks/useAuth.js'
import ScoringForm from '../components/forms/ScoringForm.jsx'
import ScoreGauge from '../components/ui/ScoreGauge.jsx'
import Semaforo from '../components/ui/Semaforo.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, pct } from '../utils/format.js'

const ROJO_OH = '#cc1719'
const NEGRO_OH = '#101820'
const GRIS_BORDE = '#e2e8f0'

const DECISION_SEMAFORO = {
  APROBADO: 'VERDE',
  OBSERVADO: 'AMARILLO',
  RECHAZADO: 'ROJO',
}

const FACTORES = [
  { key: 'capacidad_pago', label: 'Capacidad de pago calculada', max: 40 },
  { key: 'historial', label: 'Historial crediticio en Burós (BD)', max: 30 },
  { key: 'sector_economico', label: 'Riesgo del Sector Económico', max: 20 },
  { key: 'plazo', label: 'Exposición por Plazo Solicitado', max: 10 },
]

export default function ScoringPage() {
  const { user } = useAuth()
  const { resultado, loading, error, evaluar } = useScoring()

  return (
    <div style={styles.pageContainer}>
      
      {/* ── Header Principal ── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.brandBadge}>
            <span style={styles.badgeDot} /> MOTOR DE DECISIÓN SUBSISTÉMICO
          </div>
          <h1 style={styles.mainTitle}>Scoring Crediticio Parametrizado</h1>
          <p style={styles.mainSubtitle}>
            Simulación y evaluación en tiempo real de solicitudes de crédito. Cálculos automáticos de riesgo de pérdida, tasa (TEA) sugerida por perfil y cuotas de amortización.
          </p>
        </div>
      </div>

      {/* ── Layout Dividido en Paneles Autónomos ── */}
      <div style={styles.mainGrid}>
        
        {/* Lado Izquierdo: Formulario Transaccional de Entrada */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeaderContainer}>
            <FileSpreadsheet size={18} color={ROJO_OH} />
            <h3 style={styles.panelTitle}>Parámetros de la Solicitud bajo Análisis</h3>
          </div>
          
          <div style={styles.formWrapper}>
            <ScoringForm
              onSubmit={evaluar}
              loading={loading}
              codasesorDefault={user?.codasesor}
            />
          </div>

          {error && (
            <div style={styles.alertError}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Lado Derecho: Dashboard Analítico de Resultados */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeaderContainer}>
            <BarChart3 size={18} color="#2563eb" />
            <h3 style={styles.panelTitle}>Dictamen y Métricas de Riesgo</h3>
          </div>

          {loading && (
            <div style={styles.loaderContainer}>
              <Loader texto="Consumiendo variables macroeconómicas e indexando score del solicitante..." />
            </div>
          )}

          {!loading && !resultado && (
            <div style={styles.emptyStateContainer}>
              <Info size={32} color="#94a3b8" style={{ marginBottom: 12 }} />
              <p style={styles.emptyStateText}>
                Define las variables financieras del postulante y presiona el botón <strong style={{ color: NEGRO_OH }}>Evaluar</strong> para procesar el dictamen regulatorio.
              </p>
            </div>
          )}

          {resultado && (
            <div style={styles.resultContainer}>
              
              {/* Bloque Principal del Score Gauge */}
              <div style={styles.scoreHeroBlock}>
                <ScoreGauge score={resultado.score} />
                
                <div style={styles.scoreDataColumn}>
                  <div style={styles.badgeDecisionRow}>
                    <Semaforo estado={DECISION_SEMAFORO[resultado.decision]} />
                    <span style={styles.decisionText}>{resultado.decision}</span>
                  </div>
                  
                  <div style={styles.metricCard}>
                    <div style={styles.metricItem}>
                      <span style={styles.metricLabel}><Percent size={13} style={styles.iconMargin} /> TEA sugerida comercial</span>
                      <strong style={styles.metricValue}>{pct(resultado.tea_sugerida)}</strong>
                    </div>
                    <div style={{ ...styles.metricItem, border: 0, paddingBottom: 0 }}>
                      <span style={styles.metricLabel}><Landmark size={13} style={styles.iconMargin} /> Cuota estimada mensual</span>
                      <strong style={{ ...styles.metricValue, color: ROJO_OH }}>{money(resultado.cuota_estimada)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección de Desglose de Factores Matemáticos */}
              <div style={styles.sectionDivider}>
                <h4 style={styles.sectionSubTitle}>Desglose de Vectores de Puntuación</h4>
                
                <div style={styles.factoresContainer}>
                  {FACTORES.map((f) => {
                    const puntajeObtenido = resultado.detalle_score?.[f.key]?.puntaje ?? 0;
                    const porcentajeBarra = Math.min((puntajeObtenido / f.max) * 100, 100);
                    
                    return (
                      <div key={f.key} style={styles.factorRow}>
                        <div style={styles.factorMetaRow}>
                          <span style={styles.factorLabel}>{f.label}</span>
                          <span style={styles.factorScoreText}>
                            <strong style={{ color: NEGRO_OH }}>{puntajeObtenido}</strong> <span style={{ color: '#94a3b8' }}>/ {f.max} pts</span>
                          </span>
                        </div>
                        
                        {/* Control Gráfico de la Barra de Progreso */}
                        <div style={styles.progressTrack}>
                          <div 
                            style={{ 
                              ...styles.progressFill, 
                              width: `${porcentajeBarra}%`,
                              backgroundColor: puntajeObtenido === 0 ? '#cbd5e1' : porcentajeBarra < 50 ? '#f59e0b' : '#10b981'
                            }} 
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sección Condicional de Observaciones de Riesgo */}
              {resultado.observaciones?.length > 0 && (
                <div style={styles.observacionesBlock}>
                  <h4 style={{ ...styles.sectionSubTitle, color: '#9a3412', marginBottom: '10px' }}>
                    <AlertTriangle size={14} style={{ marginRight: 6, verticalAlign: '-1px' }} /> Alertas tempranas detectadas
                  </h4>
                  <ul style={styles.obsList}>
                    {resultado.observaciones.map((o, i) => (
                      <li key={i} style={styles.obsItem}>{o}</li>
                    ))}
                  </ul>
                </div>
              )}

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
  headerRow: {
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
    lineHeight: '1.5',
    maxWidth: '800px'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '28px',
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
    fontSize: '13px',
    fontWeight: '800',
    color: NEGRO_OH,
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  formWrapper: {
    marginTop: '4px'
  },
  loaderContainer: {
    padding: '60px 0',
    textAlign: 'center'
  },
  emptyStateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 20px',
    textAlign: 'center'
  },
  emptyStateText: {
    fontSize: '13px',
    color: '#64748b',
    maxWidth: '300px',
    margin: 0,
    lineHeight: '1.5'
  },
  resultContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
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
    marginTop: '16px',
    fontWeight: '600'
  },
  scoreHeroBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '28px',
    flexWrap: 'wrap',
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #f1f5f9'
  },
  scoreDataColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    flex: 1,
    minWidth: '180px'
  },
  badgeDecisionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    padding: '6px 12px',
    borderRadius: '8px',
    width: 'fit-content',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    border: '1px solid #e2e8f0'
  },
  decisionText: {
    fontSize: '15px',
    fontWeight: '800',
    color: NEGRO_OH,
    letterSpacing: '0.3px'
  },
  metricCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    borderBottom: '1px dashed #e2e8f0',
    paddingBottom: '8px'
  },
  metricLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center'
  },
  iconMargin: {
    marginRight: '4px'
  },
  metricValue: {
    fontSize: '16px',
    fontWeight: '800',
    color: NEGRO_OH
  },
  sectionDivider: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px'
  },
  sectionSubTitle: {
    margin: '0 0 16px 0',
    fontSize: '12px',
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  factoresContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  factorRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  factorMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px'
  },
  factorLabel: {
    color: '#475569',
    fontWeight: '600'
  },
  factorScoreText: {
    fontSize: '12px'
  },
  progressTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: '#f1f5f9',
    borderRadius: '100px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '100px',
    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  observacionesBlock: {
    backgroundColor: '#fff7ed',
    border: '1px solid #ffedd5',
    borderRadius: '14px',
    padding: '16px'
  },
  obsList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#c2410c',
    fontSize: '13px'
  },
  obsItem: {
    marginBottom: '6px',
    lineHeight: '1.4',
    fontWeight: '500'
  }
}