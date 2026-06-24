import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FilePlus2, ArrowLeft, Clock } from 'lucide-react'
import { useSolicitudCredito } from '../hooks/useOperaciones.js'
import { toNumber } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Money from '../components/ui/Money.jsx'
import Badge from '../components/ui/Badge.jsx'
import Alert from '../components/ui/Alert.jsx'

const AZUL_OH = '#0033A0'
const ROJO_OH = '#cc1719'

const ACTIVIDADES = [
  { cod: '0111', label: '0111 — Cultivo de cereales (excepto arroz)' },
  { cod: '4711', label: '4711 — Comercio minorista (bodega/abarrotes)' },
  { cod: '4771', label: '4771 — Comercio minorista de prendas de vestir' },
  { cod: '4520', label: '4520 — Mantenimiento y reparación de vehículos' },
  { cod: '5610', label: '5610 — Restaurantes y servicio de comidas' },
  { cod: '4100', label: '4100 — Construcción de edificios' },
  { cod: '4923', label: '4923 — Transporte de carga por carretera' },
  { cod: '9601', label: '9601 — Lavado y limpieza de prendas' },
]

export default function SolicitarCreditoPage() {
  const navigate = useNavigate()
  const { run, loading, error, result, reset } = useSolicitudCredito()
  const [validacion, setValidacion] = useState(null)

  const [form, setForm] = useState({
    montosolicitud: '',
    plazo: '',
    codtipocredito: 'CO',
    codactividadeconomica: '0111',
    montoingresoneto: '',
  })

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    if (!document.getElementById('font-plus-jakarta')) {
      const link = document.createElement('link')
      link.id = 'font-plus-jakarta'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setValidacion(null)

    const monto = toNumber(form.montosolicitud)
    const plazo = parseInt(form.plazo, 10)
    const ingreso = toNumber(form.montoingresoneto)

    if (monto <= 0) { setValidacion('Ingrese un monto de solicitud válido.'); return }
    if (!plazo || plazo <= 0) { setValidacion('Ingrese un plazo (número de cuotas) válido.'); return }
    if (ingreso <= 0) { setValidacion('Ingrese su ingreso neto mensual.'); return }
    if (!form.codactividadeconomica) { setValidacion('Seleccione una actividad económica.'); return }

    try {
      await run({
        montosolicitud: monto,
        plazo,
        codtipocredito: form.codtipocredito,
        codactividadeconomica: form.codactividadeconomica,
        montoingresoneto: ingreso,
      })
    } catch { /* Mensaje de error controlado en hook */ }
  }

  const nuevaSolicitud = () => {
    reset()
    setForm({ montosolicitud: '', plazo: '', codtipocredito: 'CO', codactividadeconomica: '0111', montoingresoneto: '' })
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
      fontFamily: '"Plus Jakarta Sans", sans-serif'
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
      background: AZUL_OH,
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
    comprobanteBox: {
      padding: '0.5rem'
    }
  }

  return (
    <PageLayout
      title={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 }}>
          Solicitar Efectivo Ahora
        </span>
      }
      subtitle={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Créditos › Evaluación inmediata 100% digital
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
          <Card title="Solicitud Procesada" icon={<FilePlus2 size={18} color={AZUL_OH} />}>
            <div style={styles.comprobanteBox}>
              <p style={{ fontSize: '15px', color: '#1e293b', fontWeight: '500', marginTop: 0 }}>{result.mensaje}</p>
              
              <div style={styles.dl}>
                <div style={styles.dlRow}><span style={{fontWeight:'600', color:'#64748b'}}>Código de solicitud</span><strong style={{color:'#0f172a'}}>{result.codsolicitud}</strong></div>
                <div style={styles.dlRow}><span style={{fontWeight:'600', color:'#64748b'}}>Estado de evaluación</span><span><Badge estado={result.estado} /></span></div>
                <div style={styles.dlRow}><span style={{fontWeight:'600', color:'#64748b'}}>Monto solicitado</span><strong style={{color:AZUL_OH}}><Money value={result.montosolicitud} /></strong></div>
                <div style={{...styles.dlRow, borderBottom:'none'}}><span style={{fontWeight:'600', color:'#64748b'}}>Plazo elegido</span><span style={{color:'#0f172a', fontWeight:'600'}}>{result.plazo} meses</span></div>
              </div>
              
              <p style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b45309', backgroundColor: '#fef3c7', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '500', margin: '1rem 0' }}>
                <Clock size={16} /> Nuestra plataforma está evaluando tus datos comerciales en tiempo real. Te enviaremos una notificación confirmando la activación.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button style={styles.btnSecondary} onClick={nuevaSolicitud}>Simular otro monto</button>
              <button style={styles.btnPrimary} onClick={() => navigate('/inicio')}>Ir a Posición Consolidada</button>
            </div>
          </Card>
        ) : (
          <Card title="Simula tu financiamiento al instante" icon={<FilePlus2 size={18} color={AZUL_OH} />}>
            {error && <Alert tipo="error">{error}</Alert>}
            {validacion && <Alert tipo="warn">{validacion}</Alert>}

            <form onSubmit={onSubmit} style={{ marginTop: '0.5rem' }}>
              <div style={styles.grid2}>
                <div style={styles.fieldGroup}>
                  <label htmlFor="monto" style={styles.label}>Monto a solicitar (S/)</label>
                  <input id="monto" style={styles.input} type="number" min="1" step="0.01"
                    placeholder="0.00" value={form.montosolicitud} onChange={setF('montosolicitud')} />
                </div>
                <div style={styles.fieldGroup}>
                  <label htmlFor="plazo" style={styles.label}>Plazo de amortización (meses)</label>
                  <input id="plazo" style={styles.input} type="number" min="1" step="1"
                    placeholder="12" value={form.plazo} onChange={setF('plazo')} />
                </div>
              </div>

              <div style={styles.grid2}>
                <div style={styles.fieldGroup}>
                  <label htmlFor="tipo" style={styles.label}>Producto de Financiamiento</label>
                  <select id="tipo" style={styles.select} value={form.codtipocredito} onChange={setF('codtipocredito')}>
                    <option value="CO">Crédito Efectivo / Préstamo Personal</option>
                    <option value="ME">Crédito Efectivo Negocios</option>
                  </select>
                </div>
                <div style={styles.fieldGroup}>
                  <label htmlFor="ingreso" style={styles.label}>Ingresos netos mensuales (S/)</label>
                  <input id="ingreso" style={styles.input} type="number" min="0" step="0.01"
                    placeholder="0.00" value={form.montoingresoneto} onChange={setF('montoingresoneto')} />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="actividad" style={styles.label}>Giro Comercial o Actividad Económica</label>
                <select id="actividad" style={styles.select} value={form.codactividadeconomica} onChange={setF('codactividadeconomica')}>
                  {ACTIVIDADES.map((a) => (
                    <option key={a.cod} value={a.cod}>{a.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button 
                  type="submit" 
                  style={styles.btnPrimary} 
                  disabled={loading}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002675'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = AZUL_OH}
                >
                  <FilePlus2 size={15} />
                  {loading ? 'Evaluando perfil…' : 'Solicitar Crédito'}
                </button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}