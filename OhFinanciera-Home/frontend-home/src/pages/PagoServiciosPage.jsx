import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, ArrowLeft, ArrowRight, ShieldCheck, ShoppingBag, ShoppingCart, ShieldAlert, Laptop, Pill, Home } from 'lucide-react'
import { useCuentas } from '../hooks/useCuentas.js'
import { usePagoServicio, useServicios } from '../hooks/useOperaciones.js'
import { toNumber, simboloMoneda } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Alert from '../components/ui/Alert.jsx'
import Comprobante from '../components/ui/Comprobante.jsx'

const AZUL_OH = '#0033A0'
const ROJO_OH = '#cc1719'

// Mapeamos los códigos rígidos de la BD a la identidad de las tiendas asociadas
const TIENDAS_ECOLOGY = {
  LUZ: { nombre: 'PlazaVea / Makro', icon: ShoppingCart, color: ROJO_OH },
  AGUA: { nombre: 'Oechsle', icon: ShoppingBag, color: '#ff007f' },
  TEL: { nombre: 'Promart Homecenter', icon: Home, color: '#f7941e' },
  CABLE: { icon: Laptop, color: '#00a9a5' }, // Se mantiene el nombre dinámico si viene de BD
  GAS: { nombre: 'Inkafarma / Mifarma', icon: Pill, color: '#005dd6' },
  MUNI: { icon: ShieldAlert, color: '#4caf50' }
}

export default function PagoServiciosPage() {
  const navigate = useNavigate()
  const { cuentas, loading: lca, recargar: recargarCuentas } = useCuentas('ahorro')
  const { servicios, loading: ls, error: errServ } = useServicios()
  const { run, loading: pagando, error, result, reset } = usePagoServicio()

  const [paso, setPaso] = useState('form')
  const [codservicio, setCodservicio] = useState('')
  const [codsuministro, setCodsuministro] = useState('')
  const [origen, setOrigen] = useState('')
  const [monto, setMonto] = useState('')
  const [validacion, setValidacion] = useState(null)

  const serv = servicios.find((s) => s.codservicio === codservicio) || null
  const cuentaOrigen = cuentas.find((c) => c.codcuentaahorro === origen)
  const simbolo = cuentaOrigen ? simboloMoneda(cuentaOrigen.moneda) : 'S/'
  const saldoInsuficiente = cuentaOrigen && toNumber(monto) > toNumber(cuentaOrigen.saldo)

  useEffect(() => {
    if (!document.getElementById('font-plus-jakarta')) {
      const link = document.createElement('link')
      link.id = 'font-plus-jakarta'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  const validar = () => {
    if (!codservicio) return 'Seleccione la tienda o establecimiento comercial.'
    if (!codsuministro.trim()) return 'Ingrese el número de boleta, recibo o compra.'
    if (!origen) return 'Seleccione la cuenta de ahorros desde la que desea pagar.'
    if (toNumber(monto) <= 0) return 'Ingrese un monto de pago válido mayor a cero.'
    if (saldoInsuficiente) return 'Saldo insuficiente en la cuenta de ahorros seleccionada.'
    return null
  }

  const irAConfirmar = (e) => {
    e.preventDefault()
    const v = validar()
    setValidacion(v)
    if (!v) setPaso('confirm')
  }

  const confirmar = async () => {
    try {
      await run({ cuenta_origen: origen, codservicio, codsuministro: codsuministro.trim(), monto: toNumber(monto) })
      recargarCuentas()
    } catch { /* Error capturado por el hook */ }
  }

  const nuevo = () => { reset(); setPaso('form'); setCodservicio(''); setCodsuministro(''); setMonto('') }

  const styles = {
    container: {
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      letterSpacing: '-0.01em'
    },
    backBtn: {
      background: 'none',
      border: 'none',
      color: '#475569',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '0 0 1.25rem 0',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    },
    sectionLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '10px'
    },
    gridTiendas: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '12px',
      marginBottom: '1.5rem'
    },
    tiendaCard: (isSelected) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      border: isSelected ? `2px solid ${AZUL_OH}` : '1px solid #cbd5e1',
      backgroundColor: isSelected ? 'rgba(0, 51, 160, 0.02)' : '#ffffff',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      transition: 'all 0.15s ease',
    }),
    iconBox: (color) => ({
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      backgroundColor: `${color}12`,
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }),
    grid2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.25rem'
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      marginBottom: '1.25rem'
    },
    label: {
      fontSize: '13.5px',
      fontWeight: '700',
      color: '#334155'
    },
    input: {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '10px',
      border: '1px solid #cbd5e1',
      fontSize: '14px',
      fontWeight: '600',
      color: '#0f172a',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      outline: 'none',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '10px',
      border: '1px solid #cbd5e1',
      backgroundColor: '#f8fafc',
      fontSize: '14px',
      fontWeight: '500',
      color: '#0f172a',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      outline: 'none'
    },
    hint: {
      fontSize: '12.5px',
      fontWeight: '500',
      color: '#64748b',
      margin: '4px 0 1.25rem 0'
    },
    btnPrimary: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      background: ROJO_OH,
      color: '#ffffff',
      border: 'none',
      padding: '10px 24px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      transition: 'all 0.15s ease'
    },
    btnSecondary: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      background: '#f1f5f9',
      color: '#475569',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    },
    dl: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      margin: '1.5rem 0',
      padding: '1.25rem',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    dlRow: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: '8px',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '14px'
    }
  }

  // Obtiene los datos comerciales estilizados de la tienda
  const getTiendaMeta = (s) => {
    const config = TIENDAS_ECOLOGY[s.codservicio] || { nombre: s.nombre, icon: FileText, color: '#64748b' }
    return {
      nombre: config.nombre || s.nombre,
      icon: config.icon,
      color: config.color
    }
  }

  return (
    <PageLayout
      title={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 }}>
          Pagar en Tiendas y Establecimientos
        </span>
      }
      subtitle={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Operaciones › Liquidar compras del Grupo Intercorp y aliados
        </span>
      }
    >
      <div style={styles.container}>
        <button 
          style={styles.backBtn} 
          onClick={() => navigate('/operaciones')}
          onMouseEnter={(e) => e.currentTarget.style.color = ROJO_OH}
          onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
        >
          <ArrowLeft size={14} /> Volver a Operaciones
        </button>

        {result ? (
          <Comprobante
            titulo="Pago de Establecimiento Exitoso"
            mensaje={result.mensaje}
            filas={[
              { label: 'Comercio / Tienda', value: getTiendaMeta({ codservicio: result.codservicio, nombre: result.servicio }).nombre },
              { label: 'N° de Boleta / Compra', value: result.codsuministro },
              { label: 'Cuenta de Ahorros origen', value: result.cuenta_origen },
              { label: 'Monto Total Pagado', value: <strong style={{ color: ROJO_OH }}><Money value={result.monto} simbolo={simbolo} /></strong> },
              { label: 'Código de Operación', value: result.pkoperacion },
              { label: 'Kardex N°', value: result.codkardex },
            ]}
            acciones={[
              { label: 'Registrar otro pago', onClick: nuevo },
              { label: 'Ir a posición consolidada', primary: true, onClick: () => navigate('/inicio') },
            ]}
          />
        ) : (
          <Card title="Detalles del Comprobante" icon={<FileText size={18} color={AZUL_OH} />}>
            {lca || ls ? (
              <Loader text="Conectando con las redes de las tiendas…" />
            ) : paso === 'confirm' ? (
              <div>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>
                  Por favor, confirma el pago antes de procesar:
                </p>
                {error && <Alert tipo="error">{error}</Alert>}
                
                <div style={styles.dl}>
                  <div style={styles.dlRow}>
                    <span style={{fontWeight:'600', color:'#64748b'}}>Establecimiento</span>
                    <strong style={{color:'#0f172a'}}>{getTiendaMeta(serv).nombre}</strong>
                  </div>
                  <div style={styles.dlRow}>
                    <span style={{fontWeight:'600', color:'#64748b'}}>N° de Boleta / Recibo</span>
                    <span style={{color:'#0f172a', fontWeight:'600'}}>{codsuministro}</span>
                  </div>
                  <div style={styles.dlRow}>
                    <span style={{fontWeight:'600', color:'#64748b'}}>Pagar desde</span>
                    <span style={{color:'#0f172a'}}>{origen} · {cuentaOrigen?.tipo}</span>
                  </div>
                  <div style={{...styles.dlRow, borderBottom:'none', paddingTop:'6px'}}>
                    <span style={{fontWeight:'700', color:'#0f172a'}}>Importe a abonar</span>
                    <strong style={{color: ROJO_OH, fontSize: '16px'}}><Money value={monto} simbolo={simbolo} /></strong>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button style={styles.btnSecondary} onClick={() => setPaso('form')} disabled={pagando}>Modificar</button>
                  <button 
                    style={styles.btnPrimary} 
                    onClick={confirmar} 
                    disabled={pagando}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b51214'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ROJO_OH}
                  >
                    <ShieldCheck size={16} /> {pagando ? 'Procesando Transacción…' : 'Confirmar Pago'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={irAConfirmar}>
                {errServ && <Alert tipo="error">{errServ}</Alert>}
                {validacion && <Alert tipo="warn">{validacion}</Alert>}

                <label style={styles.sectionLabel}>Selecciona el Establecimiento o Alianza</label>
                <div style={styles.gridTiendas}>
                  {servicios.map((s) => {
                    const meta = getTiendaMeta(s)
                    const Icon = meta.icon
                    const isSelected = codservicio === s.codservicio
                    return (
                      <button 
                        type="button" 
                        key={s.codservicio}
                        style={styles.tiendaCard(isSelected)}
                        onClick={() => setCodservicio(s.codservicio)}
                        onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.borderColor = AZUL_OH }}
                        onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.borderColor = '#cbd5e1' }}
                      >
                        <div style={styles.iconBox(meta.color)}>
                          <Icon size={20} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ fontSize: '14px', color: '#0f172a' }}>{meta.nombre}</strong>
                          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Código: {s.codservicio}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div style={styles.grid2}>
                  <div style={styles.fieldGroup}>
                    <label htmlFor="suministro" style={styles.label}>N° de Boleta, Compra o Recibo</label>
                    <input id="suministro" style={styles.input} placeholder="Ej. 102948573"
                      value={codsuministro} onChange={(e) => setCodsuministro(e.target.value)} />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label htmlFor="monto" style={styles.label}>Monto a pagar ({simbolo})</label>
                    <input id="monto" style={styles.input} type="number" min="0.01" step="0.01"
                      placeholder="0.00" value={monto} onChange={(e) => setMonto(e.target.value)} />
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <label htmlFor="origen" style={styles.label}>Pagar desde cuenta de ahorros</label>
                  <select id="origen" style={styles.select} value={origen} onChange={(e) => setOrigen(e.target.value)}>
                    <option value="">— Selecciona una cuenta —</option>
                    {cuentas.map((c) => (
                      <option key={c.codcuentaahorro} value={c.codcuentaahorro}>
                        {c.codcuentaahorro} · {c.tipo} · ({simboloMoneda(c.moneda)}{c.saldo})
                      </option>
                    ))}
                  </select>
                </div>
                
                {cuentaOrigen && (
                  <p style={styles.hint}>
                    Saldo disponible: <strong style={{color:'#0f172a'}}><Money value={cuentaOrigen.saldo} simbolo={simbolo} /></strong>
                    {saldoInsuficiente && <span style={{ color: ROJO_OH, fontWeight: '700' }}> · Saldo insuficiente para completar la transacción</span>}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button 
                    type="submit" 
                    style={{...styles.btnPrimary, opacity: cuentas.length === 0 || saldoInsuficiente ? 0.5 : 1, cursor: cuentas.length === 0 || saldoInsuficiente ? 'not-allowed' : 'pointer'}} 
                    disabled={cuentas.length === 0 || saldoInsuficiente}
                    onMouseEnter={(e) => { if (cuentas.length > 0 && !saldoInsuficiente) e.currentTarget.style.backgroundColor = '#b51214' }}
                    onMouseLeave={(e) => { if (cuentas.length > 0 && !saldoInsuficiente) e.currentTarget.style.backgroundColor = ROJO_OH }}
                  >
                    Continuar <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            )}
          </Card>
        )}
      </div>
    </PageLayout>
  )
}