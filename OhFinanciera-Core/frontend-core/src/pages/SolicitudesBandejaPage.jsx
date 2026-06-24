import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Plus, RefreshCw, Search, History, FileText,
  ClipboardList, ClipboardCheck, BadgeCheck, LogOut,
  User, Shield, MapPin, Filter, Layers, HelpCircle, ArrowRight
} from 'lucide-react'
import { useBandeja } from '../hooks/useSolicitudes.js'
import { useAuth } from '../hooks/useAuth.js'
import { ESTADO } from '../utils/permisos.js'
import EstadoSolicitud from '../components/ui/EstadoSolicitud.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money } from '../utils/format.js'

const ROJO_OH = '#cc1719';
const NEGRO_OH = '#101820';
const MAX_LIMIT = 200

const ESTADOS = [
  { v: null, label: 'TODOS' },
  { v: ESTADO.EN_EVALUACION, label: 'En Evaluación' },
  { v: ESTADO.EN_COMITE, label: 'En Comité' },
  { v: ESTADO.APROBADO, label: 'Aprobado' },
  { v: ESTADO.DESEMBOLSADO, label: 'Desembolsado' },
  { v: ESTADO.RECHAZADO, label: 'Rechazado' },
]

export default function SolicitudesBandejaPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    items, resumen, loading, error, recargar,
    estado, setEstado, search, setSearch,
    fecIni, setFecIni, fecFin, setFecFin, limit, setLimit,
  } = useBandeja()

  const [texto, setTexto] = useState('')
  const [sel, setSel] = useState(null)
  const [hoveredRow, setHoveredRow] = useState(null)
  const [focusedInput, setFocusedInput] = useState(null)

  const [searchParams] = useSearchParams()
  useEffect(() => {
    const e = searchParams.get('estado')
    setEstado(e ? Number(e) : null)
  }, [searchParams, setEstado])

  const cnt = (e) => resumen.porEstado[e] || 0
  const hayMas = items.length >= limit && limit < MAX_LIMIT

  function abrir(cod) {
    if (cod) navigate(`/solicitudes/${cod}`)
  }

  return (
    <div style={styles.pageContainer}>
      
      {/* ── Header Principal ── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.brandBadge}>
            <span style={styles.badgeDot} /> CORE DE OTORGAMIENTO
          </div>
          <h1 style={styles.mainTitle}>Bandeja de Flujo de Trabajo</h1>
          <p style={styles.mainSubtitle}>
            Consulta, registra y gestiona las solicitudes de crédito originadas hasta su liquidación y desembolso.
          </p>
        </div>
        
        <button 
          style={styles.btnPrimary} 
          onClick={() => navigate('/solicitudes/nueva')}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b01214'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ROJO_OH}
        >
          <Plus size={18} /> Nueva Solicitud
        </button>
      </div>

      {/* ── Bloque Superior: Paneles de Datos y Filtros ── */}
      <div style={styles.topGrid}>
        
        {/* Ficha de Usuario Sesión */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeaderContainer}>
            <User size={16} color={ROJO_OH} />
            <h3 style={styles.panelTitle}>Operador en Sesión</h3>
          </div>
          <div style={styles.fieldsGrid}>
            <div style={styles.metaDataBlock}>
              <label style={styles.metaLabel}>Usuario</label>
              <span style={styles.metaValue}>{user?.nombre || '—'}</span>
            </div>
            <div style={styles.metaDataBlock}>
              <label style={styles.metaLabel}>Cargo / Rol asignado</label>
              <span style={styles.metaValue}><Shield size={12} style={{marginRight:4, verticalAlign:'-1px'}}/> {user?.rol || '—'}</span>
            </div>
            <div style={styles.metaDataBlock}>
              <label style={styles.metaLabel}>Agencia Origen</label>
              <span style={styles.metaValue}><MapPin size={12} style={{marginRight:4, verticalAlign:'-1px'}}/> {user?.codagencia || '—'}</span>
            </div>
          </div>
        </div>

        {/* Panel de Filtros Estilo Avanzado */}
        <div style={{ ...styles.panelCard, gridColumn: 'span 2' }}>
          <div style={styles.panelHeaderContainer}>
            <Filter size={16} color={ROJO_OH} />
            <h3 style={styles.panelTitle}>Búsqueda Estructurada y Parámetros</h3>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setSearch(texto.trim()) }}
            style={styles.fieldsGrid}
          >
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Estado Operativo</label>
              <select
                value={estado ?? ''}
                onChange={(e) => setEstado(e.target.value === '' ? null : Number(e.target.value))}
                style={styles.selectField}
              >
                {ESTADOS.map((s) => (
                  <option key={s.label} value={s.v ?? ''}>
                    {s.label} {s.v == null ? ` (${resumen.total})` : ` (${cnt(s.v)})`}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Fecha Inicial</label>
              <input type="date" value={fecIni} onChange={(e) => setFecIni(e.target.value)} style={styles.inputField} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Fecha Final</label>
              <input type="date" value={fecFin} onChange={(e) => setFecFin(e.target.value)} style={styles.inputField} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Descriptor o Documento</label>
              <input 
                type="text" 
                value={texto} 
                onChange={(e) => setTexto(e.target.value)} 
                placeholder="Ej. SOL0000123..." 
                style={styles.inputField} 
              />
            </div>

            <div style={{ ...styles.inputGroup, justifyContent: 'flex-end', flexDirection: 'row', gap: '8px', alignItems: 'flex-end' }}>
              <button style={styles.btnActionSearch} type="submit">
                <Search size={15} /> Filtrar
              </button>
              <button style={styles.btnActionRefresh} type="button" onClick={recargar} title="Sincronizar Servidor">
                <RefreshCw size={15} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Ficha de Registro Seleccionado en Tiempo Real ── */}
      <div style={{
        ...styles.panelCard,
        ...(sel ? styles.panelCardSelected : {}),
        marginBottom: '24px'
      }}>
        <div style={styles.panelHeaderContainer}>
          <Layers size={16} color={sel ? '#10b981' : '#64748b'} />
          <h3 style={styles.panelTitle}>Inspección de Registro Clínico / Operación Seleccionada</h3>
        </div>
        <div style={{ ...styles.fieldsGrid, gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div style={styles.metaDataBlock}>
            <label style={styles.metaLabel}>Código Cliente</label>
            <span style={{...styles.metaValue, fontWeight: '700'}}>{sel?.codcliente ?? '—'}</span>
          </div>
          <div style={styles.metaDataBlock}>
            <label style={styles.metaLabel}>Razón Social / Nombre Completo</label>
            <span style={styles.metaValue}>{sel?.nomcliente ?? '—'}</span>
          </div>
          <div style={styles.metaDataBlock}>
            <label style={styles.metaLabel}>Código Interno Solicitud</label>
            <span style={{...styles.metaValue, color: ROJO_OH, fontWeight: '700'}}>{sel?.codsolicitud ?? '—'}</span>
          </div>
          <div style={styles.metaDataBlock}>
            <label style={styles.metaLabel}>Estado Actual Homologado</label>
            <div style={{ marginTop: '4px' }}>
              {sel ? <EstadoSolicitud pkestado={sel.pksolicitudestado} texto={sel.dessolicitudestado} /> : <span style={styles.metaValue}>—</span>}
            </div>
          </div>
        </div>
      </div>

      {search && (
        <div style={styles.infoAlert}>
          <span>Búsqueda indexada activa: “<strong>{search}</strong>”</span>
          <button style={styles.btnClearSearch} onClick={() => { setTexto(''); setSearch('') }}>
            Restaurar Vista
          </button>
        </div>
      )}

      {/* ── Grilla Central de Datos (Tabla Premium) ── */}
      <div style={styles.tableContainer}>
        {loading && <div style={{ padding: 40, textAlign: 'center' }}><Loader texto="Consultando base de datos transaccional..." /></div>}
        {error && <div style={styles.errorAlert}>{error}</div>}

        {!loading && !error && (
          <table style={styles.mainTable}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th style={styles.tableTh}>Código Solicitud</th>
                <th style={styles.tableTh}>Cliente</th>
                <th style={styles.tableTh}>Destino / Motivo</th>
                <th style={styles.tableTh}>Subtipo</th>
                <th style={styles.tableTh}>Apertura</th>
                <th style={{ ...styles.tableTh, textAlign: 'right' }}>Monto Solicitado</th>
                <th style={{ ...styles.tableTh, textAlign: 'center' }}>Plazo (Meses)</th>
                <th style={styles.tableTh}>Estado Sistema</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => {
                const isSelected = sel?.codsolicitud === s.codsolicitud;
                const isHovered = hoveredRow === s.codsolicitud;
                return (
                  <tr
                    key={s.codsolicitud}
                    onMouseEnter={() => setHoveredRow(s.codsolicitud)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => setSel(s)}
                    onDoubleClick={() => abrir(s.codsolicitud)}
                    style={{
                      ...styles.tableRow,
                      ...(isSelected ? styles.tableRowSelected : {}),
                      ...(isHovered && !isSelected ? styles.tableRowHovered : {})
                    }}
                  >
                    <td style={{ ...styles.tableTd, fontWeight: '800', color: ROJO_OH }}>{s.codsolicitud}</td>
                    <td style={{ ...styles.tableTd, fontWeight: '600', color: NEGRO_OH }}>{s.nomcliente}</td>
                    <td style={styles.tableTd}>{s.desmotivosolicitud || '—'}</td>
                    <td style={styles.tableTd}>
                      <span style={styles.typeBadge}>{s.codtiposolicitud || '—'}</span>
                    </td>
                    <td style={styles.tableTd}>{s.fechasolicitudcredito || '—'}</td>
                    <td style={{ ...styles.tableTd, ...styles.numColumn, fontWeight: '700', color: NEGRO_OH }}>
                      {money(s.montosolicitudcredito)}
                    </td>
                    <td style={{ ...styles.tableTd, textAlign: 'center', fontWeight: '600' }}>{s.plazosolicitudcredito ?? '—'}</td>
                    <td style={styles.tableTd}>
                      <EstadoSolicitud pkestado={s.pksolicitudestado} texto={s.dessolicitudestado} />
                    </td>
                  </tr>
                )
              })}
              
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} style={styles.emptyTableState}>
                    <HelpCircle size={24} color="#94a3b8" style={{ marginBottom: '8px' }} />
                    <div>{search ? 'Ningún registro coincide con el patrón de búsqueda estructurado.' : 'No se encontraron solicitudes vigentes bajo los filtros seleccionados.'}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {hayMas && (
          <div style={styles.loadMoreContainer}>
            <button 
              style={styles.btnLoadMore} 
              onClick={() => setLimit(Math.min(limit + 100, MAX_LIMIT))}
            >
              Cargar Siguientes 100 Registros
            </button>
          </div>
        )}
      </div>

      {/* ── Footer / Info de Paginación ── */}
      <div style={styles.footerSummary}>
        Mapeando <strong>{items.length}</strong> de un universo total de <strong>{resumen.total}</strong> solicitudes integradas · <i>Doble clic sobre una fila para abrir el panel de auditoría extendido.</i>
      </div>

      {/* ── Barra de Control Inferior (Toolbar de Acciones) ── */}
      <div style={styles.toolbarFixed}>
        <button
          style={styles.toolBtn}
          disabled={!sel?.codcliente}
          onClick={() => sel?.codcliente && navigate(`/clientes/${sel.codcliente}`)}
        >
          <History size={18} />
          <span>Historial Cliente</span>
        </button>
        
        <button style={styles.toolBtn} disabled title="Módulo RCC no mapeado en el Gateway de microservicios">
          <FileText size={18} />
          <span>Informe RCC</span>
        </button>
        
        <button style={styles.toolBtn} disabled={!sel} onClick={() => abrir(sel?.codsolicitud)}>
          <ClipboardList size={18} />
          <span>Registro Solicitud</span>
        </button>
        
        <button style={styles.toolBtn} disabled={!sel} onClick={() => abrir(sel?.codsolicitud)}>
          <ClipboardCheck size={18} />
          <span>Evaluar Operación</span>
        </button>
        
        <button style={{...styles.toolBtn, borderRight: '1px solid #e2e8f0'}} disabled={!sel} onClick={() => abrir(sel?.codsolicitud)}>
          <BadgeCheck size={18} />
          <span>Pre Aprobar</span>
        </button>
        
        <button 
          style={styles.toolBtnExit} 
          onClick={() => navigate('/dashboard')}
        >
          <LogOut size={18} />
          <span>Salir a Matriz</span>
        </button>
      </div>
    </div>
  )
}

// ─── Estilos de Diseño Corporativo Financiera oh! ───
const styles = {
  pageContainer: {
    padding: '32px 32px 120px 32px',
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
    border: '1px solid #e2e8f0'
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: ROJO_OH
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
  btnPrimary: {
    backgroundColor: ROJO_OH,
    color: '#ffffff',
    border: 'none',
    padding: '12px 22px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 14px rgba(204,23,25,0.2)',
    transition: 'background-color 0.2s ease'
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
    border: '1px solid #e2e8f0',
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
    fontSize: '14px',
    fontWeight: '800',
    color: NEGRO_OH,
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  fieldsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
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
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  inputLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#475569'
  },
  inputField: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '13px',
    color: NEGRO_OH,
    fontWeight: '600',
    outline: 'none',
    transition: 'all 0.15s ease'
  },
  selectField: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '13px',
    color: NEGRO_OH,
    fontWeight: '700',
    outline: 'none'
  },
  btnActionSearch: {
    backgroundColor: NEGRO_OH,
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '11px 16px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  btnActionRefresh: {
    backgroundColor: '#ffffff',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '11px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoAlert: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    color: '#1e40af',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '13px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  btnClearSearch: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#1d4ed8',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
    textDecoration: 'underline'
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
    overflow: 'hidden',
    boxSizing: 'border-box'
  },
  mainTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '13px'
  },
  tableHeadRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  tableTh: {
    padding: '16px 20px',
    fontWeight: '700',
    color: '#475569',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  tableRow: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'all 0.15s ease'
  },
  tableRowHovered: {
    backgroundColor: '#f8fafc',
    transform: 'translateY(-1px)'
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
  emptyTableState: {
    textAlign: 'center',
    padding: '60px',
    color: '#64748b',
    fontWeight: '500'
  },
  loadMoreContainer: {
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc'
  },
  btnLoadMore: {
    backgroundColor: '#ffffff',
    color: NEGRO_OH,
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  footerSummary: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '12px',
    paddingLeft: '4px'
  },
  toolbarFixed: {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '8px',
    display: 'flex',
    gap: '4px',
    boxShadow: '0 20px 25px -5px rgba(16,24,32,0.15), 0 10px 10px -5px rgba(16,24,32,0.04)',
    zIndex: 1000
  },
  toolBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    borderLeft: '1px solid #e2e8f0',
    padding: '10px 18px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    minWidth: '110px',
    transition: 'all 0.15s ease',
    opacity: 1
  },
  toolBtnExit: {
    backgroundColor: '#fef2f2',
    border: 'none',
    borderLeft: '1px solid #fee2e2',
    padding: '10px 18px',
    fontSize: '12px',
    fontWeight: '700',
    color: ROJO_OH,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    minWidth: '110px',
    borderRadius: '10px',
    transition: 'all 0.15s ease'
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    color: '#b91c1c',
    padding: '16px',
    borderRadius: '14px',
    margin: '20px'
  }
};