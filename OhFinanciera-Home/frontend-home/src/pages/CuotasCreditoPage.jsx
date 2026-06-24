import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Receipt, RefreshCw } from 'lucide-react'
import { useCuotas } from '../hooks/useCreditos.js'
import { formatDate } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Tabla from '../components/ui/Tabla.jsx'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Badge from '../components/ui/Badge.jsx'
import Alert from '../components/ui/Alert.jsx'

const AZUL_OH = '#0033A0'
const ROJO_OH = '#cc1719'

export default function CuotasCreditoPage() {
  const { cod } = useParams()
  const navigate = useNavigate()
  const { cuotas, loading, error, recargar } = useCuotas(cod)

  const proxima = cuotas.find((c) => !c.pagada)

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
    actionsWrapper: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    refreshBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'rgba(0, 51, 160, 0.05)',
      color: AZUL_OH,
      border: 'none',
      padding: '8px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      transition: 'all 0.15s ease'
    },
    payBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: ROJO_OH,
      color: '#ffffff',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '700',
      cursor: 'pointer',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      transition: 'all 0.15s ease',
      boxShadow: '0 2px 4px rgba(204, 23, 25, 0.15)'
    }
  }

  const columns = [
    { key: 'nrocuota', header: 'N° Cuota', render: (c) => <strong style={{ color: '#0f172a' }}>{c.nrocuota}</strong> },
    { key: 'fecha_vencimiento', header: 'Vencimiento', render: (c) => formatDate(c.fecha_vencimiento) },
    { key: 'monto_cuota', header: 'Monto Cuota', align: 'right', render: (c) => <Money value={c.monto_cuota} /> },
    { key: 'monto_saldo', header: 'Saldo de Deuda', align: 'right', render: (c) => <Money value={c.monto_saldo} /> },
    { key: 'dias_atraso', header: 'Días Atraso', align: 'center', render: (c) => (c.dias_atraso > 0 ? <Badge estado={`${c.dias_atraso}`} tone="red" /> : '0') },
    { key: 'estado', header: 'Estado', render: (c) => <Badge estado={c.pagada ? 'Pagada' : (c.estado === '02' ? 'Vencida' : 'Vigente')} /> },
  ]

  return (
    <PageLayout
      title={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 }}>
          Cronograma de Cuotas
        </span>
      }
      subtitle={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Tarjeta oh! & Créditos › Cuenta {cod}
        </span>
      }
      actions={
        <div style={styles.actionsWrapper}>
          <button 
            style={styles.refreshBtn} 
            onClick={recargar} 
            disabled={loading}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 51, 160, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 51, 160, 0.05)'}
          >
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> 
            Actualizar
          </button>
          
          {/* Se modificó la ruta del redireccionamiento para unificar con el panel general de operaciones */}
          <button 
            style={{...styles.payBtn, opacity: !proxima ? 0.5 : 1, cursor: !proxima ? 'not-allowed' : 'pointer'}} 
            onClick={() => navigate('/operaciones/pago-credito')} 
            disabled={!proxima}
            onMouseEnter={(e) => { if(proxima) e.currentTarget.style.backgroundColor = '#b51214' }}
            onMouseLeave={(e) => { if(proxima) e.currentTarget.style.backgroundColor = ROJO_OH }}
          >
            <Receipt size={13} /> Pagar próxima cuota
          </button>
        </div>
      }
    >
      <div style={styles.container}>
        
        {/* Botón de Retorno */}
        <button 
          style={styles.backBtn} 
          onClick={() => navigate('/cuentas/credito')}
          onMouseEnter={(e) => e.currentTarget.style.color = ROJO_OH}
          onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
        >
          <ArrowLeft size={14} /> Volver a Tarjetas y Créditos
        </button>

        {error && <Alert tipo="error">{error}</Alert>}

        {/* Alerta de Pago de Cuota Pendiente */}
        {proxima && (
          <Alert tipo="info">
            Próxima cuota pendiente: <strong style={{ color: '#0f172a' }}>N° {proxima.nrocuota}</strong> · Vence el{' '}
            <strong>{formatDate(proxima.fecha_vencimiento)}</strong> · Monto a abonar:{' '}
            <strong style={{ color: ROJO_OH }}><Money value={proxima.monto_cuota} /></strong>
          </Alert>
        )}

        <div style={{ height: '0.75rem' }} />

        {/* Tabla del Cronograma */}
        <Card title="Detalle del Financiamiento" icon={<CalendarDays size={18} color={AZUL_OH} />}>
          {loading ? (
            <Loader text="Cargando cronograma de pagos…" />
          ) : (
            <Tabla 
              columns={columns} 
              rows={cuotas} 
              rowKey={(c) => c.nrocuota}
              emptyText="Este crédito no registra cuotas pendientes o la cuenta fue cancelada." 
            />
          )}
        </Card>
      </div>
    </PageLayout>
  )
}