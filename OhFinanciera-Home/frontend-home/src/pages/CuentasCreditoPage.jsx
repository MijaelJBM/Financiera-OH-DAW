import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, ListChecks, RefreshCw, Receipt, FilePlus2, ChevronRight, Clock } from 'lucide-react'
import hbApi from '../services/hb_api.js'
import { useCreditos } from '../hooks/useCreditos.js'
import { formatDate, toNumber } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Tabla from '../components/ui/Tabla.jsx'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Badge from '../components/ui/Badge.jsx'
import Alert from '../components/ui/Alert.jsx'

const AZUL_OH = '#0033A0'
const ROJO_OH = '#cc1719'

export default function CuentasCreditoPage() {
  // Traemos "recargar" del hook original para forzar la actualización de la tabla de arriba
  const { creditos, loading: loadingCreditos, error: errorCreditos, recargar } = useCreditos()
  const navigate = useNavigate()

  const [solicitudes, setSolicitudes] = useState([])
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true)
  const [errorSolicitudes, setErrorSolicitudes] = useState(null)

  const totalDeuda = creditos.reduce((s, c) => s + toNumber(c.pago_pendiente || c.pago_total), 0)

  const cargarSolicitudesDesdePestaña = async () => {
    try {
      setLoadingSolicitudes(true)
      const response = await hbApi.get('/creditos/mis-solicitudes')
      setSolicitudes(Array.isArray(response.data) ? response.data : [])
      setErrorSolicitudes(null)
    } catch (err) {
      setErrorSolicitudes(err.response?.data?.detail || 'No se pudieron cargar las solicitudes.')
      setSolicitudes([])
    } finally {
      setLoadingSolicitudes(false)
    }
  }

  // Ejecuta la carga inicial de ambos componentes al entrar a la página
  useEffect(() => {
    if (!document.getElementById('font-plus-jakarta')) {
      const link = document.createElement('link')
      link.id = 'font-plus-jakarta'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
      document.head.appendChild(link)
    }

    cargarSolicitudesDesdePestaña()
    if (typeof recargar === 'function') {
      recargar()
    }
  }, [])

  // Manejador del botón actualizar: fuerza al hook original a ir al backend de nuevo
  const manejarRecargarTodo = async () => {
    if (typeof recargar === 'function') {
      await recargar() // Llama a GET /cuentas/credito real
    }
    await cargarSolicitudesDesdePestaña() // Llama a GET /creditos/mis-solicitudes real
  }

  const acciones = [
    { icon: CreditCard, label: 'Pagar mi Tarjeta oh!', to: '/operaciones/pago-tarjeta', color: ROJO_OH },
    { icon: Receipt, label: 'Pagar mi Crédito', to: '/operaciones/pago-credito', color: AZUL_OH },
    { icon: FilePlus2, label: 'Efectivo Ahora', to: '/prestamos', color: '#10b981' },
  ]

  const styles = {
    container: {
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      letterSpacing: '-0.01em',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
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
    cellProd: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    },
    actionBtn: {
      background: '#ffffff',
      border: '1px solid #cbd5e1',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '12.5px',
      fontWeight: '600',
      color: '#475569',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      transition: 'all 0.15s ease'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 12px 4px 12px',
      marginTop: '16px',
      borderTop: '2px dashed #e2e8f0',
      fontSize: '14px',
      fontWeight: '700',
      color: '#0f172a'
    },
    customAsideContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    },
    asideTitle: {
      fontWeight: '800',
      margin: '0 0 16px 0',
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
      fontSize: '12px',
      color: '#64748b'
    },
    asideList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    asideRowBtn: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      backgroundColor: '#f8fafc',
      border: '1px solid #f1f5f9',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'left'
    },
    iconWrapper: (bgIcon) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      backgroundColor: `${bgIcon}10`,
      color: bgIcon,
      marginRight: '12px',
      flexShrink: 0
    }),
    labelWrapper: {
      fontSize: '13.5px',
      fontWeight: '700',
      color: '#334155',
      flexGrow: 1
    }
  }

  const columnsCreditos = [
    { 
      key: 'codcuentacredito', 
      header: 'Producto y Número', 
      render: (r) => (
        <div style={styles.cellProd}>
          <strong style={{ color: '#1e293b', fontSize: '14px' }}>
            {r.codcuentacredito || r.cod_cuenta_credito || 'CRE-ACTIVO'}
          </strong>
          <small style={{ color: '#64748b', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase' }}>
            Línea de Consumo
          </small>
        </div>
      ) 
    },
    { 
      key: 'fecha_desembolso', 
      header: 'APERTURA / DESEMBOLSO', 
      render: (r) => formatDate(r.fecha_desembolso || r.fecha_desembolso_credito) 
    },
    { 
      key: 'saldo_capital', 
      header: 'SALDO CAPITAL', 
      align: 'right', 
      render: (r) => <Money value={r.saldo_capital || r.saldo_capital_credito} /> 
    },
    { 
      key: 'pago_pendiente', 
      header: 'TOTAL PENDIENTE', 
      align: 'right', 
      render: (r) => (
        <strong style={{ color: ROJO_OH }}>
          <Money value={r.pago_pendiente || r.pago_total || 0} />
        </strong>
      ) 
    },
    { 
      key: 'dias_atraso', 
      header: 'DÍAS ATRASO', 
      align: 'center', 
      render: (r) => ((r.dias_atraso || r.dias_mora) > 0 ? <Badge estado={`${r.dias_atraso || r.dias_mora}`} tone="red" /> : '0') 
    },
    { 
      key: 'calificacion', 
      header: 'CALIFICACIÓN', 
      render: (r) => <Badge estado={r.calificacion || 'Normal'} tone={(r.dias_atraso || r.dias_mora) > 0 ? 'red' : undefined} /> 
    },
    { 
      key: 'cuotas', 
      header: '', 
      align: 'center', 
      render: (r) => (
        <button 
          style={styles.actionBtn} 
          onClick={() => navigate(`/cuentas/credito/${r.codcuentacredito || r.cod_cuenta_credito}/cuotas`)}
        >
          <ListChecks size={13} /> Ver cuotas
        </button>
      ) 
    },
  ]

  const columnsSolicitudes = [
    { 
      key: 'codsolicitud', 
      header: 'Código Solicitud', 
      render: (r) => <strong style={{ color: AZUL_OH }}>{r.codsolicitud}</strong> 
    },
    { key: 'fechasolicitud', header: 'Fecha de Registro', render: (r) => formatDate(r.fechasolicitud) },
    { key: 'montosolicitado', header: 'Monto Solicitado', render: (r) => <Money value={r.montosolicitado} /> },
    { key: 'plazo', header: 'Plazo', align: 'center', render: (r) => `${r.plazo} meses` },
    { 
      key: 'estado', 
      header: 'Estado de Evaluación', 
      render: (r) => (
        <Badge 
          estado={r.estado || 'En Evaluación'} 
          tone={r.estado === 'Aprobado' ? 'green' : 'yellow'} 
        />
      ) 
    },
    
  ]

  return (
    <PageLayout
      title={<span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 }}>Mis Tarjetas oh! & Créditos</span>}
      subtitle={<span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Tarjetas y Líneas › Mis productos</span>}
      actions={
        <button style={styles.refreshBtn} onClick={manejarRecargarTodo} disabled={loadingCreditos || loadingSolicitudes}>
          <RefreshCw size={13} /> Actualizar
        </button>
      }
      aside={
        <div style={styles.customAsideContainer}>
          <h3 style={styles.asideTitle}>Operaciones Disponibles</h3>
          <div style={styles.asideList}>
            {acciones.map((acc, idx) => {
              const IconComponent = acc.icon
              return (
                <button key={idx} onClick={() => navigate(acc.to)} style={styles.asideRowBtn}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={styles.iconWrapper(acc.color)}><IconComponent size={18} /></div>
                    <span style={styles.labelWrapper}>{acc.label}</span>
                  </div>
                  <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                </button>
              )
            })}
          </div>
        </div>
      }
    >
      <div style={styles.container}>
        {errorCreditos && <Alert tipo="error">{errorCreditos}</Alert>}
        {errorSolicitudes && <Alert tipo="error">{errorSolicitudes}</Alert>}

        <Card title="Estados de Cuenta Activos" icon={<CreditCard size={18} color={ROJO_OH} />}>
          {loadingCreditos ? (
            <Loader text="Cargando líneas y créditos vigentes…" />
          ) : (
            <>
              <Tabla 
                columns={columnsCreditos} 
                rows={creditos} 
                rowKey={(r) => r.codcuentacredito || r.cod_cuenta_credito || Math.random().toString()}
                emptyText="No registra tarjetas ni créditos vigentes a la fecha." 
              />
              {creditos.length > 0 && (
                <div style={styles.totalRow}>
                  <span style={{ fontWeight: '600', color: '#64748b' }}>Total a pagar consolidado</span>
                  <span style={{ color: ROJO_OH, fontSize: '18px', fontWeight: '800' }}><Money value={totalDeuda} /></span>
                </div>
              )}
            </>
          )}
        </Card>

        <Card title="Solicitudes en Proceso de Evaluación" icon={<Clock size={18} color={AZUL_OH} />}>
          {loadingSolicitudes ? (
            <Loader text="Buscando solicitudes en trámite..." />
          ) : (
            <Tabla 
              columns={columnsSolicitudes} 
              rows={solicitudes} 
              rowKey={(r) => r.codsolicitud}
              emptyText="No tienes solicitudes de crédito pendientes en este momento." 
            />
          )}
        </Card>
      </div>
    </PageLayout>
  )
}