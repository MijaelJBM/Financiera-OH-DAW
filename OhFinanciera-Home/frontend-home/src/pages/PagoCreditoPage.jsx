import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Receipt, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { useCreditos, useCuotas } from '../hooks/useCreditos.js'
import { useCuentas } from '../hooks/useCuentas.js'
import { usePagoCuota } from '../hooks/useOperaciones.js'
import { formatDate, toNumber, simboloMoneda } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Alert from '../components/ui/Alert.jsx'
import Comprobante from '../components/ui/Comprobante.jsx'

const AZUL_OH = '#0033A0'
const ROJO_OH = '#cc1719'

export default function PagoCreditoPage() {
  const { cod } = useParams()
  const navigate = useNavigate()
  const { creditos, loading: lc } = useCreditos()
  const { cuentas, loading: lca, recargar: recargarCuentas } = useCuentas('ahorro')

  const [credito, setCredito] = useState(cod || '')
  const [origen, setOrigen] = useState('')
  const [monto, setMonto] = useState('')
  const [paso, setPaso] = useState('form')
  const [validacion, setValidacion] = useState(null)

  useEffect(() => {
    if (!credito && creditos.length === 1) setCredito(creditos[0].codcuentacredito)
  }, [creditos, credito])
  
  useEffect(() => {
    if (!origen && cuentas.length === 1) setOrigen(cuentas[0].codcuentaahorro)
  }, [cuentas, origen])

  const { cuotas, loading: lq, recargar: recargarCuotas } = useCuotas(credito)
  const { run, loading: pagando, error, result, reset } = usePagoCuota()

  const proxima = cuotas.find((c) => !c.pagada)
  const cuentaOrigen = cuentas.find((c) => c.codcuentaahorro === origen)
  const simbolo = cuentaOrigen ? simboloMoneda(cuentaOrigen.moneda) : 'S/'

  useEffect(() => {
    setMonto(proxima ? String(toNumber(proxima.monto_cuota)) : '')
  }, [proxima?.nrocuota, credito])

  const montoAPagar = monto === '' ? toNumber(proxima?.monto_cuota) : toNumber(monto)
  const saldoInsuficiente = cuentaOrigen && montoAPagar > toNumber(cuentaOrigen.saldo)

  const validar = () => {
    if (!credito) return 'Seleccione la Tarjeta oh! o línea a pagar.'
    if (!origen) return 'Seleccione la cuenta de ahorro de la que se debitará el pago.'
    if (!proxima) return 'Este producto no registra cuotas pendientes.'
    if (monto !== '' && toNumber(monto) <= 0) return 'El monto debe ser mayor a cero.'
    if (saldoInsuficiente) return 'Saldo insuficiente en la cuenta de ahorro de origen.'
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
      await run({ codcuentacredito: credito, cuenta_origen: origen, monto: monto === '' ? undefined : toNumber(monto) })
      recargarCuotas()
      recargarCuentas()
    } catch { /* capturado en flag 'error' */ }
  }

  const nuevo = () => { reset(); setPaso('form'); recargarCuotas(); recargarCuentas() }

  useEffect(() => {
    if (!document.getElementById('font-plus-jakarta')) {
      const link = document.createElement('link')
      link.id = 'font-plus-jakarta'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
      document.head.appendChild(link)
    }
  }, [])

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
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      transition: 'color 0.15s ease'
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
    grid2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.25rem',
      marginTop: '0.5rem'
    },
    cuotaBox: {
      backgroundColor: '#f1f5f9',
      borderLeft: `4px solid ${ROJO_OH}`,
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      margin: '0 0 1.5rem 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px'
    },
    dl: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      margin: '1.5rem 0',
      padding: '1rem',
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
    },
    btnPrimary: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      background: ROJO_OH,
      color: '#ffffff',
      border: 'none',
      padding: '10px 20px',
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
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      transition: 'all 0.15s ease'
    },
    hint: {
      fontSize: '12.5px',
      fontWeight: '500',
      color: '#64748b',
      margin: '4px 0 1.25rem 0'
    }
  }

  const cargando = lc || lca

  return (
    <PageLayout
      title={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 }}>
          Pagar mi Tarjeta oh!
        </span>
      }
      subtitle={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Operaciones › Amortizar estados de cuenta
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
            titulo="Pago Realizado Exitosamente"
            mensaje={result.mensaje}
            filas={[
              { label: 'Producto / Tarjeta', value: result.codcuentacredito },
              { label: 'N° de Cuota', value: result.nrocuota },
              { label: 'Monto debitado', value: <strong style={{ color: ROJO_OH }}><Money value={result.monto_pagado} /></strong> },
              { label: 'Cuenta de Ahorro origen', value: result.cuenta_origen || origen },
              { label: 'Código de Operación', value: result.pkoperacion },
              { label: 'Transacción Débito', value: result.pkoperacion_debito_ahorro ?? '—' },
              { label: 'Kardex N°', value: result.codkardex },
            ]}
            acciones={[
              { label: 'Realizar otro pago', onClick: nuevo },
              { label: 'Ir a posición consolidada', primary: true, onClick: () => navigate('/inicio') },
            ]}
          />
        ) : (
          <Card title="Completar los datos del pago" icon={<Receipt size={18} color={ROJO_OH} />}>
            {cargando ? (
              <Loader text="Sincronizando tus estados de cuenta…" />
            ) : creditos.length === 0 ? (
              <Alert tipo="info">No registras líneas de crédito activas con deudas pendientes a la fecha.</Alert>
            ) : paso === 'confirm' ? (
              <div>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>
                  Por favor, confirma que los datos ingresados sean correctos:
                </p>
                {error && <Alert tipo="error">{error}</Alert>}
                
                <div style={styles.dl}>
                  <div style={styles.dlRow}><span style={{fontWeight:'600', color:'#64748b'}}>Tarjeta / Crédito</span><strong style={{color:'#0f172a'}}>{credito}</strong></div>
                  <div style={styles.dlRow}><span style={{fontWeight:'600', color:'#64748b'}}>Cuenta de Débito</span><span style={{color:'#0f172a'}}>{origen} · {cuentaOrigen?.tipo}</span></div>
                  <div style={styles.dlRow}><span style={{fontWeight:'600', color:'#64748b'}}>N° Cuota Evaluada</span><span style={{color:'#0f172a', fontWeight:'600'}}>N° {proxima?.nrocuota}</span></div>
                  <div style={styles.dlRow}><span style={{fontWeight:'600', color:'#64748b'}}>Vencimiento</span><span style={{color:'#0f172a'}}>{formatDate(proxima?.fecha_vencimiento)}</span></div>
                  <div style={{...styles.dlRow, borderBottom:'none', paddingTop:'6px'}}><span style={{fontWeight:'700', color:'#0f172a'}}>Total a abonar</span><strong style={{color: ROJO_OH, fontSize: '16px'}}><Money value={montoAPagar} simbolo={simbolo} /></strong></div>
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
                    <ShieldCheck size={16} /> {pagando ? 'Procesando Abono…' : 'Confirmar Pago'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={irAConfirmar}>
                {validacion && <Alert tipo="warn">{validacion}</Alert>}

                <div style={styles.fieldGroup}>
                  <label htmlFor="credito" style={styles.label}>Elegir Tarjeta oh! o Línea de Crédito</label>
                  <select id="credito" style={styles.select} value={credito} onChange={(e) => setCredito(e.target.value)}>
                    <option value="">— Selecciona un producto —</option>
                    {creditos.map((c) => (
                      <option key={c.codcuentacredito} value={c.codcuentacredito}>
                        {c.codcuentacredito} · Saldo Pendiente: {c.pago_pendiente}
                      </option>
                    ))}
                  </select>
                </div>

                {credito && (
                  lq ? <Loader text="Buscando cuotas en el cronograma…" /> : proxima ? (
                    <div style={styles.cuotaBox}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Próximo Vencimiento</span>
                        <strong style={{ color: '#0f172a', fontSize: '14.5px' }}>Cuota N° {proxima.nrocuota}</strong>
                        <span style={{ fontSize: '12.5px', color: '#64748b' }}>Vence el {formatDate(proxima.fecha_vencimiento)}</span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: ROJO_OH }}>
                        <Money value={proxima.monto_cuota} />
                      </div>
                    </div>
                  ) : (
                    <Alert tipo="success">Este producto no cuenta con amortizaciones pendientes a la fecha. ¡Estás al día!</Alert>
                  )
                )}

                <div style={styles.grid2}>
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
                  
                  <div style={styles.fieldGroup}>
                    <label htmlFor="monto" style={styles.label}>Monto a amortizar ({simbolo})</label>
                    <input 
                      id="monto" 
                      style={styles.input} 
                      type="number" 
                      min="0" 
                      step="0.01"
                      placeholder={proxima ? String(toNumber(proxima.monto_cuota)) : '0.00'}
                      value={monto} 
                      onChange={(e) => setMonto(e.target.value)} 
                    />
                  </div>
                </div>

                {cuentaOrigen && (
                  <p style={styles.hint}>
                    Saldo disponible en tu cuenta: <strong style={{color:'#0f172a'}}><Money value={cuentaOrigen.saldo} simbolo={simbolo} /></strong>
                    {saldoInsuficiente && <span style={{ color: ROJO_OH, fontWeight: '700' }}> · Saldo insuficiente para procesar esta operación</span>}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                  <button 
                    type="submit" 
                    style={{...styles.btnPrimary, opacity: !proxima || saldoInsuficiente ? 0.5 : 1, cursor: !proxima || saldoInsuficiente ? 'not-allowed' : 'pointer'}} 
                    disabled={!proxima || saldoInsuficiente}
                    onMouseEnter={(e) => { if (proxima && !saldoInsuficiente) e.currentTarget.style.backgroundColor = '#b51214' }}
                    onMouseLeave={(e) => { if (proxima && !saldoInsuficiente) e.currentTarget.style.backgroundColor = ROJO_OH }}
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