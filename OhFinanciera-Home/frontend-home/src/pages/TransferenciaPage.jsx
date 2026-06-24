import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { useCuentas } from '../hooks/useCuentas.js'
import { useTransferencia } from '../hooks/useOperaciones.js'
import { simboloMoneda, toNumber } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Alert from '../components/ui/Alert.jsx'
import Comprobante from '../components/ui/Comprobante.jsx'

const AZUL_OH = '#0033A0'
const ROJO_OH = '#cc1719'

export default function TransferenciaPage() {
  const navigate = useNavigate()
  const { cuentas, loading } = useCuentas('ahorro')
  const { run, loading: enviando, error, result, reset } = useTransferencia()

  const [paso, setPaso] = useState('form')
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [monto, setMonto] = useState('')
  const [validacion, setValidacion] = useState(null)

  const cuentaOrigen = cuentas.find((c) => c.codcuentaahorro === origen)
  const cuentaDestino = cuentas.find((c) => c.codcuentaahorro === destino)
  const simbolo = cuentaOrigen ? simboloMoneda(cuentaOrigen.moneda) : 'S/'
  const destinos = useMemo(() => cuentas.filter((c) => c.codcuentaahorro !== origen), [cuentas, origen])

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
    if (!origen || !destino) return 'Seleccione la cuenta de origen y destino.'
    if (origen === destino) return 'La cuenta de origen y destino no pueden ser la misma.'
    const m = toNumber(monto)
    if (m <= 0) return 'Ingrese un monto válido mayor a cero.'
    if (cuentaOrigen && m > toNumber(cuentaOrigen.saldo)) return 'El monto supera el saldo disponible de la cuenta de origen.'
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
      await run({ cuenta_origen: origen, cuenta_destino: destino, monto: toNumber(monto) })
    } catch { /* Error capturado en flag 'error' */ }
  }

  const nueva = () => {
    reset(); setPaso('form'); setMonto('')
  }

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
    hint: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#64748b',
      margin: '-0.25rem 0 1.25rem 0'
    }
  }

  return (
    <PageLayout
      title={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 }}>
          Transferencias Propias
        </span>
      }
      subtitle={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Operaciones › Mover fondos al instante
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
            titulo="Transferencia Realizada"
            mensaje={result.mensaje}
            filas={[
              { label: 'Cuenta de origen', value: result.cuenta_origen },
              { label: 'Cuenta de destino', value: result.cuenta_destino },
              { label: 'Monto transferido', value: <strong style={{ color: AZUL_OH }}><Money value={result.monto} simbolo={simbolo} /></strong> },
              { label: 'N° Operación Débito', value: result.pkoperacion_debito },
              { label: 'N° Operación Crédito', value: result.pkoperacion_credito },
            ]}
            acciones={[
              { label: 'Transferir otra vez', onClick: nueva },
              { label: 'Ver mis cuentas', primary: true, onClick: () => navigate('/cuentas/ahorro') },
            ]}
          />
        ) : (
          <Card title="Detalle de las cuentas" icon={<Send size={18} color={AZUL_OH} />}>
            {loading ? (
              <Loader text="Sincronizando tus cuentas de ahorro…" />
            ) : cuentas.length < 2 ? (
              <Alert tipo="info">Necesitas registrar al menos dos cuentas de ahorro activas para realizar transferencias entre cuentas propias.</Alert>
            ) : paso === 'confirm' ? (
              <div>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>
                  Por favor, verifica los importes antes de autorizar el envío:
                </p>
                {error && <Alert tipo="error">{error}</Alert>}

                <div style={styles.dl}>
                  <div style={styles.dlRow}><span style={{fontWeight:'600', color:'#64748b'}}>Desde (Cuenta Origen)</span><span style={{color:'#0f172a'}}>{origen} · {cuentaOrigen?.tipo}</span></div>
                  <div style={styles.dlRow}><span style={{fontWeight:'600', color:'#64748b'}}>Hacia (Cuenta Destino)</span><span style={{color:'#0f172a'}}>{destino} · {cuentaDestino?.tipo}</span></div>
                  <div style={{...styles.dlRow, borderBottom:'none', paddingTop:'6px'}}><span style={{fontWeight:'700', color:'#0f172a'}}>Monto a transferir</span><strong style={{color: AZUL_OH, fontSize: '16px'}}><Money value={monto} simbolo={simbolo} /></strong></div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button style={styles.btnSecondary} onClick={() => setPaso('form')} disabled={enviando}>Modificar</button>
                  <button 
                    style={styles.btnPrimary} 
                    onClick={confirmar} 
                    disabled={enviando}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b51214'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ROJO_OH}
                  >
                    <ShieldCheck size={16} /> {enviando ? 'Enviando fondos…' : 'Confirmar transferencia'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={irAConfirmar} style={{ marginTop: '0.5rem' }}>
                {validacion && <Alert tipo="warn">{validacion}</Alert>}

                <div style={styles.grid2}>
                  <div style={styles.fieldGroup}>
                    <label htmlFor="origen" style={styles.label}>Cuenta de origen (Débito)</label>
                    <select 
                      id="origen" 
                      style={styles.select} 
                      value={origen}
                      onChange={(e) => { setOrigen(e.target.value); if (e.target.value === destino) setDestino('') }}
                    >
                      <option value="">— Selecciona una cuenta —</option>
                      {cuentas.map((c) => (
                        <option key={c.codcuentaahorro} value={c.codcuentaahorro}>
                          {c.codcuentaahorro} · {c.tipo} · ({simboloMoneda(c.moneda)}{c.saldo})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.fieldGroup}>
                    <label htmlFor="destino" style={styles.label}>Cuenta de destino (Crédito)</label>
                    <select 
                      id="destino" 
                      style={styles.select} 
                      value={destino}
                      onChange={(e) => setDestino(e.target.value)} 
                      disabled={!origen}
                    >
                      <option value="">— Selecciona una cuenta —</option>
                      {destinos.map((c) => (
                        <option key={c.codcuentaahorro} value={c.codcuentaahorro}>
                          {c.codcuentaahorro} · {c.tipo} · ({simboloMoneda(c.moneda)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {cuentaOrigen && (
                  <p style={styles.hint}>
                    Saldo disponible en origen: <strong style={{color:'#0f172a'}}><Money value={cuentaOrigen.saldo} simbolo={simbolo} /></strong>
                  </p>
                )}

                <div style={styles.fieldGroup}>
                  <label htmlFor="monto" style={styles.label}>Monto a enviar ({simbolo})</label>
                  <input 
                    id="monto" 
                    style={styles.input} 
                    type="number" 
                    min="0.01" 
                    step="0.01"
                    placeholder="0.00" 
                    value={monto} 
                    onChange={(e) => setMonto(e.target.value)} 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button 
                    type="submit" 
                    style={styles.btnPrimary}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b51214'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ROJO_OH}
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