import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet, ListChecks, ChevronDown, RefreshCw,
  Send, CreditCard, FileText, Briefcase, Calendar, ChevronRight
} from 'lucide-react'
import { useCuentas } from '../hooks/useCuentas.js'
import { useDetalleAhorro } from '../hooks/useMovimientos.js'
import { simboloMoneda, formatTEA, toNumber } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Badge from '../components/ui/Badge.jsx'
import Money from '../components/ui/Money.jsx'
import Alert from '../components/ui/Alert.jsx'
import DetalleAhorro from '../components/cuentas/DetalleAhorro.jsx'

const AZUL_OH = '#0033A0'
const ROJO_OH = '#cc1719'

const obtenerInfoComercial = (cuenta, indice) => {
  if (indice % 2 === 0) {
    return {
      tag: 'Depósito a Plazo Fijo',
      descripcion: 'Abre tu cuenta 100% digital y haz crecer tus fondos con nuestra tasa de interés preferencial.',
      colorBadge: '#f59e0b', 
      teaSimulada: '7.25%',
      icon: Calendar
    };
  }
  
  return {
    tag: 'Cuenta CTS',
    descripcion: 'Abre o traslada tu CTS con nosotros y gana mucho más con una súper tasa de interés garantizada.',
    colorBadge: ROJO_OH, 
    teaSimulada: '6.50%',
    icon: Briefcase
  };
};

export default function CuentasAhorroPage() {
  const { cuentas, loading, error, recargar } = useCuentas('ahorro')
  const navigate = useNavigate()
  const [abierta, setAbierta] = useState(null)

  const total = cuentas.reduce((s, c) => s + toNumber(c.saldo), 0)

  useEffect(() => {
    if (!document.getElementById('font-plus-jakarta')) {
      const link = document.createElement('link')
      link.id = 'font-plus-jakarta'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  // Lista de acciones corregida con etiquetas idénticas a tus requerimientos
  const acciones = [
    { icon: CreditCard, label: 'Pagar Tarjeta', to: '/operaciones/pago-credito', color: ROJO_OH },
    { icon: Send, label: 'Transferencias', to: '/operaciones/transferencia', color: '#10b981' },
    { icon: FileText, label: 'Pagar en Tiendas', to: '/operaciones/pago-servicios', color: '#f59e0b' },
  ]

  const styles = {
    container: {
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      letterSpacing: '-0.01em'
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
      transition: 'all 0.15s ease'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px 12px 4px 12px',
      marginTop: '16px',
      borderTop: '2px dashed #e2e8f0',
      fontSize: '14px',
      fontWeight: '700',
      color: '#0f172a'
    },
    emptyState: {
      padding: '2rem 0',
      color: '#64748b',
      fontSize: '14px',
      textAlign: 'center',
      margin: 0
    },
    // Estilos para el nuevo panel lateral nativo e independiente
    sidebarCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
      width: '100%',
      boxSizing: 'border-box'
    },
    sidebarTitle: {
      fontSize: '14px',
      fontWeight: '800',
      color: '#1e293b',
      margin: '0 0 16px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    sidebarList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    sidebarBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '12px 14px',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'left'
    },
    iconWrapper: (color) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: `${color}10`,
      color: color,
      flexShrink: 0
    })
  }

  // Construcción nativa del panel lateral para asegurar los textos exactos
  const lateralOperaciones = (
    <div style={styles.sidebarCard}>
      <h3 style={styles.sidebarTitle}>Operaciones Rápidas</h3>
      <div style={styles.sidebarList}>
        {acciones.map((acc, i) => {
          const IconComp = acc.icon
          return (
            <button
              key={i}
              style={styles.sidebarBtn}
              onClick={() => navigate(acc.to)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = AZUL_OH
                e.currentTarget.style.backgroundColor = '#ffffff'
                e.currentTarget.style.transform = 'translateX(2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0'
                e.currentTarget.style.backgroundColor = '#f8fafc'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={styles.iconWrapper(acc.color)}>
                  <IconComp size={15} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                  {acc.label}
                </span>
              </div>
              <ChevronRight size={14} color="#94a3b8" />
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <PageLayout
      title={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 }}>
          Mis Cuentas de Ahorro
        </span>
      }
      subtitle="Cuentas › Mis productos"
      actions={
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
      }
      aside={lateralOperaciones} // 👈 Inyectamos el componente lateral corregido aquí
    >
      <div style={styles.container}>
        {error && <Alert tipo="error">{error}</Alert>}

        <Card title="Cuentas e Inversiones Disponibles" icon={<Wallet size={18} color={AZUL_OH} />}>
          {loading ? (
            <Loader text="Cargando cuentas de ahorro…" />
          ) : cuentas.length === 0 ? (
            <p style={styles.emptyState}>No registra cuentas de ahorro asociadas a su usuario.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cuentas.map((c, index) => (
                <CuentaItem
                  key={c.codcuentaahorro}
                  cuenta={c}
                  index={index}
                  abierta={abierta === c.codcuentaahorro}
                  onToggle={() => setAbierta(abierta === c.codcuentaahorro ? null : c.codcuentaahorro)}
                  onMovimientos={() => navigate(`/cuentas/ahorro/${c.codcuentaahorro}/movimientos`)}
                />
              ))}
              
              <div style={styles.totalRow}>
                <span style={{ fontWeight: '600', color: '#64748b' }}>Saldo disponible total</span>
                <span style={{ color: AZUL_OH, fontSize: '18px', fontWeight: '800' }}><Money value={total} /></span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  )
}

function CuentaItem({ cuenta, index, abierta, onToggle, onMovimientos }) {
  const simbolo = simboloMoneda(cuenta.moneda)
  const { detalle, loading, error } = useDetalleAhorro(abierta ? cuenta.codcuentaahorro : null)
  
  const infoComercial = obtenerInfoComercial(cuenta, index);
  const IconoDinamico = infoComercial.icon;

  const itemStyles = {
    cardWrapper: {
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      backgroundColor: abierta ? '#f8fafc' : '#ffffff',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      boxShadow: abierta ? '0 4px 12px rgba(0, 51, 160, 0.04)' : 'none'
    },
    head: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px',
      flexWrap: 'wrap',
      gap: '12px'
    },
    mainSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    },
    iconBox: {
      width: '42px',
      height: '42px',
      borderRadius: '12px',
      backgroundColor: `${infoComercial.colorBadge}12`,
      color: infoComercial.colorBadge,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    metaBlock: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px'
    },
    accNumber: {
      fontSize: '15px',
      fontWeight: '700',
      color: '#1e293b'
    },
    accSub: {
      fontSize: '12.5px',
      fontWeight: '500',
      color: '#64748b'
    },
    badgeTipo: {
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '700',
      backgroundColor: `${infoComercial.colorBadge}15`,
      color: infoComercial.colorBadge,
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
      marginTop: '4px',
      alignSelf: 'flex-start'
    },
    descripcionText: {
      fontSize: '12px',
      color: '#64748b',
      lineHeight: '1.4',
      margin: '0 0 12px 0',
      padding: '0 18px',
      fontWeight: '500'
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      flexWrap: 'wrap'
    },
    balanceBlock: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px'
    },
    btnGroup: {
      display: 'flex',
      gap: '8px'
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
      transition: 'all 0.15s ease'
    }
  }

  return (
    <div style={itemWrapperStyle(abierta, itemStyles.cardWrapper)}>
      <div style={itemStyles.head}>
        
        <div style={itemStyles.mainSection}>
          <div style={itemStyles.iconBox}>
            <IconoDinamico size={20} />
          </div>
          <div style={itemStyles.metaBlock}>
            <strong style={itemStyles.accNumber}>Cuenta · · · · {cuenta.codcuentaahorro.slice(-4)}</strong>
            <span style={itemStyles.accSub}>
              {cuenta.moneda === 'PEN' ? 'Soles (PEN)' : 'Dólares (USD)'} · <span style={{ fontWeight: '700', color: infoComercial.colorBadge }}>TEA {infoComercial.teaSimulada}</span>
            </span>
            <span style={itemStyles.badgeTipo}>{infoComercial.tag}</span>
          </div>
        </div>

        <div style={itemStyles.rightSection}>
          <div style={itemStyles.balanceBlock}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
              <Money value={cuenta.saldo} simbolo={simbolo} />
            </span>
            <Badge estado={cuenta.estado} />
          </div>
          
          <div style={itemStyles.btnGroup}>
            <button 
              style={itemStyles.actionBtn} 
              onClick={onMovimientos}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = AZUL_OH
                e.currentTarget.style.color = AZUL_OH
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1'
                e.currentTarget.style.color = '#475569'
              }}
            >
              <ListChecks size={13} /> Movimientos
            </button>
            
            <button 
              style={itemStyles.actionBtn} 
              onClick={onToggle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
              }}
            >
              Ver detalle 
              <ChevronDown 
                size={14} 
                style={{ 
                  transform: abierta ? 'rotate(180deg)' : 'rotate(0deg)', 
                  transition: 'transform 0.2s ease',
                  color: abierta ? ROJO_OH : '#64748b'
                }} 
              />
            </button>
          </div>
        </div>

      </div>

      <p style={itemStyles.descripcionText}>{infoComercial.descripcion}</p>
      
      {abierta && (
        <div style={{ padding: '4px 16px 16px 16px', borderTop: '1px dashed #e2e8f0' }}>
          <DetalleAhorro detalle={detalle} loading={loading} error={error} />
        </div>
      )}
    </div>
  )
}

function itemWrapperStyle(abierta, baseStyles) {
  if (abierta) {
    return { ...baseStyles, borderColor: AZUL_OH }
  }
  return baseStyles
}