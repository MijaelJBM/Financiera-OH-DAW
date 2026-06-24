import { useState } from 'react'
import { 
  AlertTriangle, RefreshCw, Gavel, Ban, 
  History, User, Clock, ShieldAlert, X, ChevronRight, 
  Filter, Layers, ArrowRight, HelpCircle
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { puede, BANDAS_MORA, BANDA_INFO, UMBRAL_JUDICIAL, UMBRAL_CASTIGO } from '../utils/permisos.js'
import { useResumenMora, useCarteraMora, useTiposGestion, useGestiones } from '../hooks/useRecuperaciones.js'
import { pasarJudicial, castigarCredito } from '../services/svc_recuperaciones.js'
import KpiCard from '../components/ui/KpiCard.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, num, fecha } from '../utils/format.js'

const ROJO_OH = '#cc1719'
const NEGRO_OH = '#101820'
const GRIS_BORDE = '#e2e8f0'

export default function RecuperacionesPage() {
  const { user } = useAuth()
  const { resumen, loading: loadingResumen, recargar: recargarResumen } = useResumenMora()
  const { cartera, banda, setBanda, loading: loadingCartera, error, recargar: recargarCartera } = useCarteraMora(null)
  
  const [gestionCod, setGestionCod] = useState(null)
  const [sel, setSel] = useState(null) // Ficha de inspección en tiempo real
  const [hoveredRow, setHoveredRow] = useState(null)

  const puedeGestionar = puede(user?.rol, 'gestionar_cobranza')
  const puedeJudicial = puede(user?.rol, 'derivar_judicial')
  const puedeCastigar = puede(user?.rol, 'castigar_credito')
  const hayAcciones = puedeGestionar || puedeJudicial || puedeCastigar

  const porBanda = {}
  for (const b of resumen?.por_banda || []) porBanda[b.banda] = b

  const refrescar = () => { 
    recargarResumen(); 
    recargarCartera();
    setSel(null);
  }

  return (
    <div style={styles.pageContainer}>
      
      {/* ── Header Principal ── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.brandBadge}>
            <span style={styles.badgeDot} /> <ShieldAlert size={12} style={{ marginRight: 4 }} /> RECUPERACIONES Y COBRANZA COACTIVA
          </div>
          <h1 style={styles.mainTitle}>Bandeja de Gestión de Mora</h1>
          <p style={styles.mainSubtitle}>
            Monitoreo de tramos de atraso, ejecución de cobranza estructurada y derivación a carteras judiciales o castigos.
          </p>
        </div>
        
        <button 
          style={styles.btnActionRefresh} 
          onClick={refrescar}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
        >
          <RefreshCw size={15} /> Sincronizar Servidor
        </button>
      </div>

      {/* ── Bloque Superior: Operador y KPIs Resumen ── */}
      <div style={styles.topGrid}>
        
        {/* Ficha de Usuario Sesión */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeaderContainer}>
            <User size={16} color={ROJO_OH} />
            <h3 style={styles.panelTitle}>Especialista de Riesgos</h3>
          </div>
          <div style={styles.fieldsGrid}>
            <div style={styles.metaDataBlock}>
              <label style={styles.metaLabel}>Analista</label>
              <span style={styles.metaValue}>{user?.nombre || '—'}</span>
            </div>
            <div style={styles.metaDataBlock}>
              <label style={styles.metaLabel}>Rol Asignado</label>
              <span style={styles.metaValue}>{user?.rol || '—'}</span>
            </div>
          </div>
        </div>

        {/* KPIs Grid Integrado */}
        <div style={{ ...styles.panelCard, gridColumn: 'span 2', padding: '16px 24px' }}>
          <div style={styles.panelHeaderContainer}>
            <Filter size={16} color={ROJO_OH} />
            <h3 style={styles.panelTitle}>Distribución General por Tramos de Atraso</h3>
          </div>
          {loadingResumen ? <div style={{ minHeight: '64px', display: 'flex', alignItems: 'center' }}><Loader /></div> : (
            <div style={styles.kpiGrid}>
              {BANDAS_MORA.map((b) => {
                const r = porBanda[b.cod]
                return (
                  <div key={b.cod} style={{ ...styles.kpiMiniCard, borderLeft: `4px solid ${b.color}` }}>
                    <span style={styles.kpiMiniLabel}>{b.label}</span>
                    <span style={styles.kpiMiniValue}>{money(r?.saldo || 0)}</span>
                    <span style={styles.kpiMiniSub}>{num(r?.n_creditos || 0)} créditos</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Ficha de Registro Seleccionado (Inspección Rápida) ── */}
      <div style={{
        ...styles.panelCard,
        ...(sel ? styles.panelCardSelected : {}),
        marginBottom: '24px'
      }}>
        <div style={styles.panelHeaderContainer}>
          <Layers size={16} color={sel ? '#10b981' : '#64748b'} />
          <h3 style={styles.panelTitle}>Inspección de Cuenta de Crédito Seleccionada</h3>
        </div>
        <div style={{ ...styles.fieldsGrid, gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div style={styles.metaDataBlock}>
            <label style={styles.metaLabel}>Código Crédito</label>
            <span style={{ ...styles.metaValue, color: ROJO_OH, fontWeight: '800' }}>{sel?.codcuentacredito ?? '—'}</span>
          </div>
          <div style={styles.metaDataBlock}>
            <label style={styles.metaLabel}>Titular de la Cuenta</label>
            <span style={styles.metaValue}>{sel?.nomcliente ?? '—'}</span>
          </div>
          <div style={styles.metaDataBlock}>
            <label style={styles.metaLabel}>Días en Mora</label>
            <span style={{ 
              ...styles.metaValue, 
              fontWeight: '800',
              color: sel?.diasatrasocredito > 90 ? ROJO_OH : NEGRO_OH 
            }}>
              {sel ? `${sel.diasatrasocredito} días` : '—'}
            </span>
          </div>
          <div style={styles.metaDataBlock}>
            <label style={styles.metaLabel}>Saldo Capital Expuesto</label>
            <span style={{ ...styles.metaValue, fontWeight: '700' }}>{sel ? money(sel.montosaldocapital) : '—'}</span>
          </div>
        </div>
      </div>

      {/* ── Tabla Principal Premium de Cartera ── */}
      <div style={styles.tableContainer}>
        {/* Sistema de Pestañas / Filtro de Bandas */}
        <div style={styles.tabsRow}>
          <button style={banda === null ? styles.tabActive : styles.tab} onClick={() => { setBanda(null); setSel(null); }}>
            Todas las Cuentas
          </button>
          {BANDAS_MORA.map(b => (
            <button 
              key={b.cod} 
              style={banda === b.cod ? { ...styles.tabActive, color: b.color, borderBottomColor: b.color } : styles.tab} 
              onClick={() => { setBanda(b.cod); setSel(null); }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {loadingCartera ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <Loader texto="Consultando saldos y tramos de mora en tiempo real..." />
          </div>
        ) : error ? (
          <div style={styles.errorAlert}>{error}</div>
        ) : (
          <table style={styles.mainTable}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th style={styles.tableTh}>N° Crédito</th>
                <th style={styles.tableTh}>Titular / Cliente</th>
                <th style={{ ...styles.tableTh, textAlign: 'center' }}>Días Atraso</th>
                <th style={{ ...styles.tableTh, textAlign: 'right' }}>Saldo Capital</th>
                <th style={styles.tableTh}>Tramo Banda</th>
                <th style={styles.tableTh}>Estado Legal</th>
                {hayAcciones && <th style={{ ...styles.tableTh, textAlign: 'center' }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {cartera.map(c => {
                const isSelected = sel?.codcuentacredito === c.codcuentacredito;
                const isHovered = hoveredRow === c.codcuentacredito;
                return (
                  <tr
                    key={c.codcuentacredito}
                    onMouseEnter={() => setHoveredRow(c.codcuentacredito)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => setSel(c)}
                    style={{
                      ...styles.tableRow,
                      ...(isSelected ? styles.tableRowSelected : {}),
                      ...(isHovered && !isSelected ? styles.tableRowHovered : {})
                    }}
                  >
                    <td style={{ ...styles.tableTd, fontWeight: '800', color: ROJO_OH }}>
                      {c.codcuentacredito}
                    </td>
                    <td style={styles.tableTd}>
                      <div style={{ fontWeight: '600', color: NEGRO_OH }}>{c.nomcliente}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{c.codcliente}</div>
                    </td>
                    <td style={{ 
                      ...styles.tableTd, 
                      textAlign: 'center', 
                      fontWeight: c.diasatrasocredito > 90 ? '800' : '600',
                      color: c.diasatrasocredito > 90 ? ROJO_OH : NEGRO_OH
                    }}>
                      {c.diasatrasocredito}
                    </td>
                    <td style={{ ...styles.tableTd, ...styles.numColumn, fontWeight: '700', color: NEGRO_OH }}>
                      {money(c.montosaldocapital)}
                    </td>
                    <td style={styles.tableTd}>
                      <span style={styles.typeBadge}>
                        {BANDA_INFO[c.banda]?.label || '—'}
                      </span>
                    </td>
                    <td style={styles.tableTd}>
                      {c.flagjudicial === 'S' ? (
                        <span style={styles.badgeJudicial}><Gavel size={11}/> Judicial</span>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Sujeto a Mora</span>
                      )}
                    </td>
                    {hayAcciones && (
                      <td style={{ ...styles.tableTd, textAlign: 'center' }}>
                        <button 
                          style={styles.btnMini} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setGestionCod(c.codcuentacredito);
                          }}
                        >
                          Gestionar <ChevronRight size={12} style={{ marginLeft: 2 }} />
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}

              {cartera.length === 0 && (
                <tr>
                  <td colSpan={hayAcciones ? 7 : 6} style={styles.emptyTableState}>
                    <HelpCircle size={24} color="#94a3b8" style={{ marginBottom: '8px' }} />
                    <div>No se registran créditos en mora vigentes bajo este tramo de banda.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Footer de Resumen ── */}
      <div style={styles.footerSummary}>
        Universo transaccional activo: Mostrando <strong>{cartera.length}</strong> operaciones de crédito recuperables · <i>Selecciona una fila para mapear la cuenta en el inspector.</i>
      </div>

      {gestionCod && <GestionModal cod={gestionCod} onClose={() => setGestionCod(null)} />}
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
    margin: '6px 0 0 0'
  },
  topGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '20px',
    marginBottom: '20px'
  },
  panelCard: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '24px',
    border: '1px solid ' + GRIS_BORDE,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
    transition: 'all 0.2s ease-in-out'
  },
  panelCardSelected: {
    borderColor: '#10b981',
    boxShadow: '0 4px 20px rgba(16,185,129,0.04)'
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '16px'
  },
  metaDataBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  metaLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8'
  },
  metaValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: NEGRO_OH
  },
  btnActionRefresh: {
    backgroundColor: '#ffffff',
    color: '#64748b',
    border: '1px solid ' + GRIS_BORDE,
    borderRadius: '10px',
    padding: '11px 16px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s ease'
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginTop: '4px'
  },
  kpiMiniCard: {
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  kpiMiniLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '700'
  },
  kpiMiniValue: {
    fontSize: '15px',
    fontWeight: '800',
    color: NEGRO_OH
  },
  kpiMiniSub: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1px solid ' + GRIS_BORDE,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
    overflow: 'hidden'
  },
  tabsRow: {
    display: 'flex',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid ' + GRIS_BORDE,
    padding: '0 12px'
  },
  tab: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '16px 20px',
    color: '#64748b',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.15s ease'
  },
  tabActive: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '16px 20px',
    color: ROJO_OH,
    fontWeight: '800',
    fontSize: '13px',
    cursor: 'pointer',
    borderBottom: '2px solid ' + ROJO_OH
  },
  mainTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '13px'
  },
  tableHeadRow: {
    borderBottom: '1px solid ' + GRIS_BORDE
  },
  tableTh: {
    padding: '16px 20px',
    fontWeight: '700',
    color: '#475569',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  tableRow: {
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  tableRowHovered: {
    backgroundColor: '#f8fafc'
  },
  tableRowSelected: {
    backgroundColor: '#eefcf6',
    borderBottom: '1px solid #a7f3d0'
  },
  tableTd: {
    padding: '16px 20px',
    color: '#475569',
    verticalAlign: 'middle'
  },
  numColumn: {
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums'
  },
  typeBadge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700'
  },
  badgeJudicial: {
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '6px',
    backgroundColor: '#fef2f2',
    color: ROJO_OH,
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  btnMini: {
    backgroundColor: NEGRO_OH,
    color: '#ffffff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(16,24,32,0.08)'
  },
  emptyTableState: {
    textAlign: 'center',
    padding: '60px',
    color: '#64748b',
    fontWeight: '500'
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
    padding: '16px',
    borderRadius: '14px',
    margin: '20px'
  }
}