import { useState, useMemo } from 'react'
import { useCartera } from '../hooks/useCreditos.js'
import { useAuth } from '../hooks/useAuth.js'
import KpiCard from '../components/ui/KpiCard.jsx'
import GraficoTorta from '../components/ui/GraficoTorta.jsx'
import Gauge from '../components/ui/Gauge.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, num, pct } from '../utils/format.js'
import { 
  Briefcase, ShieldAlert, Award, 
  Layers, Calendar, CreditCard, User, AlertCircle 
} from 'lucide-react'

const ROJO_OH = '#cc1719';
const NEGRO_OH = '#101820';

const PRODUCTO = {
  ME: { nombre: 'Microempresa', color: '#e2132b' },
  PE: { nombre: 'Pequeña empresa', color: '#f7941e' },
  CO: { nombre: 'Consumo', color: '#8e24aa' },
}
const prodInfo = (cod) => PRODUCTO[cod] || { nombre: String(cod ?? '—'), color: '#64748b' }

const PERIODO_DEFAULT = '202512'

const CALIF = {
  0: { nombre: 'Normal', color: '#10b981' },
  1: { nombre: 'CPP', color: '#f59e0b' },
  2: { nombre: 'Deficiente', color: '#ef4444' },
  3: { nombre: 'Dudoso', color: '#b91c1c' },
  4: { nombre: 'Pérdida', color: '#7a0d18' },
}
const califInfo = (cod) => CALIF[cod] || { nombre: String(cod ?? '—'), color: '#64748b' }

export default function MiCarteraDashboard() {
  const { user } = useAuth()
  const [periodomes, setPeriodomes] = useState(PERIODO_DEFAULT)
  const [meta, setMeta] = useState('')
  const [isFilterFocused, setIsFilterFocused] = useState(false)
  const [isMetaFocused, setIsMetaFocused] = useState(false)
  const [hoveredRow, setHoveredRow] = useState(null)

  const { cartera, loading, error } = useCartera(user?.pkasesor, periodomes)

  const kpis = useMemo(() => {
    let total = 0
    let vigente = 0
    let vencida = 0
    let enMora = 0
    const clientes = new Set()
    for (const c of cartera) {
      total += Number(c.montosaldocapital || 0)
      vigente += Number(c.car_vig_capital || 0)
      vencida += Number(c.car_ven_capital || 0)
      if (Number(c.diasatrasocredito || 0) > 0) enMora += 1
      clientes.add(c.numerodocumentoidentidad || c.nomcliente)
    }
    return {
      total,
      vigente,
      vencida,
      ratio: total > 0 ? (vencida / total) * 100 : 0,
      nCreditos: cartera.length,
      nClientes: clientes.size,
      enMora,
    }
  }, [cartera])

  const porCalif = useMemo(() => {
    const m = {}
    for (const c of cartera) {
      const k = c.calificacion ?? '—'
      m[k] = (m[k] || 0) + Number(c.montosaldocapital || 0)
    }
    return Object.entries(m)
      .map(([cod, monto]) => ({ cod, monto }))
      .sort((a, b) => b.monto - a.monto)
  }, [cartera])
  const maxCalif = Math.max(1, ...porCalif.map((x) => x.monto))

  const porProducto = useMemo(() => {
    const m = {}
    for (const c of cartera) {
      const k = c.codtipocredito ?? '—'
      m[k] = (m[k] || 0) + Number(c.car_ven_capital || 0)
    }
    return Object.entries(m)
      .map(([cod, monto]) => ({ cod, monto }))
      .sort((a, b) => b.monto - a.monto)
  }, [cartera])
  const maxProd = Math.max(1, ...porProducto.map((x) => x.monto))
  const hayTipoProducto = porProducto.some((p) => p.cod && p.cod !== '—')

  const dataComposicion = [
    { name: 'Vigente', value: kpis.vigente, color: '#10b981' },
    { name: 'Vencida', value: kpis.vencida, color: '#ef4444' },
  ]

  const metaNum = Number(meta) || 0
  const cumplimiento = metaNum > 0 ? (kpis.total / metaNum) * 100 : 0

  return (
    <div style={styles.dashboardContainer}>
      
      {/* ─── Encabezado de Alta Gama ─── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.brandBadge}>
            <span style={styles.badgeDot} /> MI PORTAFOLIO DE ASESOR
          </div>
          <h1 style={styles.mainTitle}>Mi Cartera</h1>
          <p style={styles.mainSubtitle}>
            Indicadores de riesgo y colocación bajo tu gestión directa
            {user?.codasesor && ` · Código Asesor ${user.codasesor}`}.
          </p>
        </div>
        
        {/* Selector de periodo premium */}
        <div style={{
          ...styles.filterCard,
          ...(isFilterFocused ? styles.filterCardFocused : {})
        }}>
          <div style={styles.filterIconBox}>
            <Calendar size={15} color={ROJO_OH} strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.filterLabel}>Período de Análisis</label>
            <input 
              type="text" 
              value={periodomes} 
              onChange={(e) => setPeriodomes(e.target.value)} 
              onFocus={() => setIsFilterFocused(true)}
              onBlur={() => setIsFilterFocused(false)}
              style={styles.filterInput}
              placeholder="AAAAMM"
            />
          </div>
        </div>
      </div>

      {/* Alerta si el usuario no tiene código de asesor */}
      {!user?.pkasesor && (
        <div style={styles.infoAlert}>
          <AlertCircle size={18} style={{ shrink: 0 }} />
          <div>
            <strong>Restricción de perfil:</strong> Tu usuario actual no tiene vinculada una cartera comercial en el Core Bancario.
          </div>
        </div>
      )}

      {user?.pkasesor && loading && (
        <div style={styles.centerCard}>
          <Loader texto="Analizando registros de tu cartera comercial..." />
        </div>
      )}

      {user?.pkasesor && error && <div style={styles.errorAlert}>{error}</div>}

      {user?.pkasesor && !loading && !error && (
        <>
          {/* ─── Bloque 1: Tarjetas de KPIs Corporativos ─── */}
          <div style={styles.kpiGrid}>
            <div style={styles.customKpiCard}><KpiCard label="Mi Cartera Total" valor={money(kpis.total)} icon={<Layers size={16} />} /></div>
            <div style={{...styles.customKpiCard, borderLeft: '4px solid #10b981'}}><KpiCard label="Vigente" valor={money(kpis.vigente)} color="#10b981" /></div>
            <div style={{...styles.customKpiCard, borderLeft: '4px solid #ef4444'}}><KpiCard label="Vencida" valor={money(kpis.vencida)} color="#ef4444" /></div>
            <div style={{...styles.customKpiCard, borderLeft: '4px solid #f59e0b'}}><KpiCard label="Ratio de Mora" valor={pct(kpis.ratio)} color="#f59e0b" icon={<ShieldAlert size={16} />} /></div>
            <div style={styles.customKpiCard}><KpiCard label="N° Créditos" valor={num(kpis.nCreditos)} icon={<CreditCard size={16} />} /></div>
            <div style={styles.customKpiCard}><KpiCard label="Clientes Únicos" valor={num(kpis.nClientes)} icon={<User size={16} />} /></div>
          </div>

          {/* ─── Bloque 2: Composición y Medidor de Cumplimiento de Meta ─── */}
          <div style={styles.chartsGrid}>
            <div style={styles.chartCard}>
              <div style={styles.chartHeaderContainer}>
                <h3 style={styles.chartTitle}>Composición de la Cartera</h3>
                <p style={styles.chartSubtitle}>Distribución porcentual de capital en riesgo</p>
              </div>
              <div style={styles.chartWrapper}>
                {kpis.total > 0 ? (
                  <GraficoTorta data={dataComposicion} />
                ) : (
                  <p style={styles.noData}>Sin saldos en la cartera activa.</p>
                )}
              </div>
            </div>

            <div style={styles.chartCard}>
              <div style={styles.chartHeaderContainer}>
                <h3 style={styles.chartTitle}>Cumplimiento de Meta</h3>
                <p style={styles.chartSubtitle}>Progreso versus objetivo comercial asignado</p>
              </div>
              
              {/* Input de meta de colocaciones rediseñado estilo fintech */}
              <div style={{ 
                ...styles.metaInputGroup, 
                ...(isMetaFocused ? styles.metaInputGroupFocused : {}) 
              }}>
                <label style={styles.metaLabel}>Definir Objetivo Mensual (S/)</label>
                <input 
                  type="number" 
                  value={meta} 
                  onChange={(e) => setMeta(e.target.value)} 
                  onFocus={() => setIsMetaFocused(true)}
                  onBlur={() => setIsMetaFocused(false)}
                  placeholder="Ej. 600000" 
                  style={styles.metaInputField}
                />
              </div>

              <div style={styles.gaugeContainer}>
                {metaNum > 0 ? (
                  <Gauge value={cumplimiento} sublabel={`Colocado ${money(kpis.total)} de ${money(metaNum)}`} />
                ) : (
                  <div style={styles.emptyGaugeFallback}>
                    <Award size={28} color="#94a3b8" style={{ marginBottom: '8px' }} />
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                      Ingresa una meta numérica en el campo superior para calcular el indicador de eficiencia.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Bloque 3: Calificaciones y Segmentación de Productos con Barras Premium ─── */}
          <div style={styles.chartsGrid}>
            
            {/* Tarjeta de Calificación de Riesgo */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeaderContainer}>
                <h3 style={styles.chartTitle}>Cartera por Calificación SBS</h3>
                <p style={styles.chartSubtitle}>Provisiones obligatorias según tramos de atraso</p>
              </div>
              {porCalif.length === 0 ? (
                <div style={styles.chartWrapper}><p style={styles.noData}>Sin registros de calificación.</p></div>
              ) : (
                <div style={styles.barListContainer}>
                  {porCalif.map((x) => {
                    const info = califInfo(x.cod)
                    return (
                      <div style={styles.premiumBarRow} key={x.cod}>
                        <div style={styles.barMetaInfo}>
                          <span style={styles.premiumBarLabel}>{info.nombre}</span>
                          <span style={styles.premiumBarValue}>{money(x.monto)}</span>
                        </div>
                        <div style={styles.premiumTrack}>
                          <div style={{
                            height: '100%',
                            borderRadius: '6px',
                            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            width: `${(x.monto / maxCalif) * 100}%`, 
                            background: info.color
                          }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Tarjeta de Cartera Vencida por Tipo de Producto */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeaderContainer}>
                <h3 style={styles.chartTitle}>Cartera Vencida por Producto</h3>
                <p style={styles.chartSubtitle}>Fuga de rentabilidad mapeada por líneas comerciales</p>
              </div>
              {!hayTipoProducto ? (
                <div style={styles.backendFallbackCard}>
                  <Briefcase size={24} color={ROJO_OH} style={{ marginBottom: 10 }} />
                  <p style={{ margin: 0, fontWeight: '700', color: NEGRO_OH, fontSize: '13px' }}>Campo en desarrollo</p>
                  <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '12px', textAlign: 'center' }}>
                    Requiere el mapeo estructural de la variable <code>codtipocredito</code> en el API de origen de datos.
                  </p>
                </div>
              ) : (
                <div style={styles.barListContainer}>
                  {porProducto.map((x) => {
                    const info = prodInfo(x.cod)
                    return (
                      <div style={styles.premiumBarRow} key={x.cod}>
                        <div style={styles.barMetaInfo}>
                          <span style={styles.premiumBarLabel}>{info.nombre}</span>
                          <span style={{ ...styles.premiumBarValue, color: ROJO_OH }}>{money(x.monto)}</span>
                        </div>
                        <div style={styles.premiumTrack}>
                          <div style={{
                            height: '100%',
                            borderRadius: '6px',
                            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            width: `${(x.monto / maxProd) * 100}%`, 
                            background: `linear-gradient(90deg, ${info.color}cc, ${info.color})`
                          }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  )
}

// ─── Arquitectura de Estilos Corporativos Financiera oh! (Asesores) ───
const styles = {
  dashboardContainer: {
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
    gap: '8px',
    letterSpacing: '0.5px',
    marginBottom: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: ROJO_OH
  },
  mainTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: NEGRO_OH,
    margin: 0,
    letterSpacing: '-0.8px'
  },
  mainSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '6px 0 0 0',
    fontWeight: '400'
  },
  filterCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '10px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    boxShadow: '0 4px 12px rgba(16,24,32,0.02)',
    minWidth: '250px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  filterCardFocused: {
    borderColor: NEGRO_OH,
    boxShadow: `0 0 0 4px rgba(16,24,32,0.06)`
  },
  filterIconBox: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #f1f5f9'
  },
  filterLabel: {
    display: 'block',
    fontSize: '10px',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  filterInput: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontWeight: '700',
    color: NEGRO_OH,
    width: '100%',
    padding: '2px 0 0 0',
    backgroundColor: 'transparent'
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '18px',
    marginBottom: '32px'
  },
  customKpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '6px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgba(16,24,32,0.02)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  },
  chartHeaderContainer: {
    paddingBottom: '16px',
    marginBottom: '8px'
  },
  chartTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '800',
    color: NEGRO_OH,
    letterSpacing: '-0.3px'
  },
  chartSubtitle: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#64748b'
  },
  chartWrapper: {
    flex: 1,
    minHeight: '260px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  metaInputGroup: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '8px 16px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.15s ease-in-out',
    marginBottom: '16px'
  },
  metaInputGroupFocused: {
    borderColor: ROJO_OH,
    backgroundColor: '#ffffff',
    boxShadow: `0 0 0 3px ${ROJO_OH}15`
  },
  metaLabel: {
    fontSize: '9px',
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.4px'
  },
  metaInputField: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '15px',
    fontWeight: '700',
    color: NEGRO_OH,
    marginTop: '2px',
    width: '100%'
  },
  gaugeContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px'
  },
  emptyGaugeFallback: {
    textAlign: 'center',
    maxWidth: '280px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  barListContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '8px',
    flex: 1,
    justifyContent: 'center'
  },
  premiumBarRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  barMetaInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  premiumBarLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#334155'
  },
  premiumBarValue: {
    fontSize: '13px',
    fontWeight: '800',
    fontVariantNumeric: 'tabular-nums',
    color: NEGRO_OH
  },
  premiumTrack: {
    height: '10px',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  backendFallbackCard: {
    flex: 1,
    backgroundColor: '#fafafa',
    border: '2px dashed #e2e8f0',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    marginTop: '12px'
  },
  noData: {
    color: '#94a3b8',
    fontSize: '13px',
    fontStyle: 'italic',
    fontWeight: '500'
  },
  infoAlert: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    color: '#1e40af',
    padding: '16px',
    borderRadius: '14px',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    color: '#b91c1c',
    padding: '16px',
    borderRadius: '14px',
    fontSize: '13px',
    marginBottom: '24px'
  },
  centerCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '60px',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
  }
};