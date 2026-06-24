import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet, CreditCard, Send, FilePlus2, FileText,
  PiggyBank, ChevronRight, TrendingDown, TrendingUp, UserCheck
} from 'lucide-react'
import { useHBAuth } from '../hooks/useHBAuth.js'
import { useCuentas } from '../hooks/useCuentas.js'
import { useCreditos } from '../hooks/useCreditos.js'
import { simboloMoneda, toNumber } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Money from '../components/ui/Money.jsx'
import Badge from '../components/ui/Badge.jsx'
import Loader from '../components/ui/Loader.jsx'

const AZUL_OH = '#0033A0'
const ROJO_OH = '#cc1719'

export default function HomePage() {
  const { user } = useHBAuth()
  const navigate = useNavigate()
  const { cuentas, loading: lc } = useCuentas('ahorro')
  const { creditos, loading: lk } = useCreditos()

  const totalAhorro = cuentas.reduce((s, c) => s + toNumber(c.saldo), 0)
  const totalDeuda = creditos.reduce((s, c) => s + toNumber(c.pago_pendiente), 0)

  // Extraemos dinámicamente los ingresos reales que nos manda tu backend en la solicitud
  // Buscamos si viene 'ingreso_real', 'montoingresoneto' o 'montodeingreso' en el objeto del crédito o del usuario
  // Extraemos ambos montos buscando en el usuario o en la respuesta de créditos
  const ingresoBruto = toNumber(user?.montodeingreso)
  const ingresoNeto = toNumber(user?.montoingresoneto)

  useEffect(() => {
    if (!document.getElementById('font-plus-jakarta')) {
      const link = document.createElement('link')
      link.id = 'font-plus-jakarta'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  const accesosRapidos = [
    { icon: CreditCard, label: 'Pagar Tarjeta', sub: 'Línea de crédito', to: '/operaciones/pago-credito', color: ROJO_OH },
    { icon: FilePlus2, label: 'Préstamo Efectivo', sub: 'Desembolso ya', to: '/creditos/solicitar', color: AZUL_OH },
    { icon: Send, label: 'Transferencias', sub: 'A otras cuentas', to: '/operaciones/transferencia', color: '#10b981' },
    { icon: FileText, label: 'Pagar en Tiendas', sub: 'Intercorp y socios', to: '/operaciones/pago-servicios', color: '#f59e0b' },
  ]

  const styles = {
    container: {
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      letterSpacing: '-0.01em',
      maxWidth: '850px',
      margin: '0 auto'
    },
    welcomeRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '1.75rem',
    },
    welcomeBox: {
      flex: '1',
      minWidth: '280px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#0f172a',
      margin: '0 0 6px 0',
      letterSpacing: '-0.025em'
    },
    subtitle: {
      fontSize: '14.5px',
      fontWeight: '500',
      color: '#64748b',
      margin: 0
    },
    
    // --- TARJETA DE PERFIL FINANCIERO DECLARADO ---
    profileCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '12px 20px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.01)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      minWidth: '280px'
    },
    profileIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      backgroundColor: '#e6f4ea',
      color: '#137333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },

    frecuentesSection: {
      marginBottom: '2rem'
    },
    containerFrecuentes: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
    },
    sectionHeading: {
      fontSize: '15px',
      fontWeight: '800',
      color: '#1e293b',
      margin: '0 0 16px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.03em'
    },
    gridFrecuentes: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '12px'
    },
    btnFrecuente: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 14px',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '14px',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    circuloIcono: (color) => ({
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
    }),

    kpisContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    },
    kpiCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
    },
    kpiIcon: (bg, color) => ({
      width: '46px',
      height: '46px',
      borderRadius: '12px',
      backgroundColor: bg,
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }),
    kpiLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '11px',
      fontWeight: '700',
      color: '#64748b',
      marginBottom: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    kpiValue: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#0f172a',
      display: 'block',
      letterSpacing: '-0.02em'
    },
    kpiMeta: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#94a3b8'
    },
    linkInline: {
      background: 'none',
      border: 'none',
      color: AZUL_OH,
      fontSize: '13px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2px',
      padding: 0
    },
    prodList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column'
    },
    prodItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 0',
      borderBottom: '1px solid #f1f5f9',
      cursor: 'pointer',
      transition: 'all 0.15s ease'
    },
    prodTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0 0 0',
      marginTop: '8px',
      borderTop: '2px dashed #e2e8f0',
      fontSize: '14px',
      fontWeight: '700',
      color: '#0f172a'
    },
    emptyState: {
      padding: '1.5rem 0',
      color: '#64748b',
      fontSize: '14px',
      textAlign: 'center',
      margin: 0
    }
  }

  return (
    <PageLayout>
      <div style={styles.container}>
        
        {/* Cabecera optimizada con Grid Flexible para incluir Ingresos al costado derecho */}
        <div style={styles.welcomeRow}>
          <div style={styles.welcomeBox}>
            <h1 style={styles.title}>¡Hola {primerNombre(user?.nombre)}!</h1>
            <p style={styles.subtitle}>Tu posición consolidada hoy en Financiera oh!</p>
          </div>

        <div style={styles.profileCard}>
            <div style={styles.profileIcon}>
              <UserCheck size={20} />
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
                  Ingreso Bruto
                </span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#475569' }}>
                  <Money value={ingresoBruto} />
                </span>
              </div>
              
              <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '24px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#137333', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
                  Ingreso Neto
                </span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#137333' }}>
                  <Money value={ingresoNeto} />
                </span>
              </div>
            </div>
          </div>
        </div>
          


        {/* SECCIÓN: Operaciones Frecuentes */}
        <div style={styles.frecuentesSection}>
          <div style={styles.containerFrecuentes}>
            <h3 style={styles.sectionHeading}>Operaciones Rápidas</h3>
            <div style={styles.gridFrecuentes}>
              {accesosRapidos.map((acc, index) => {
                const IconComp = acc.icon
                return (
                  <button
                    key={index}
                    style={styles.btnFrecuente}
                    onClick={() => navigate(acc.to)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.backgroundColor = '#ffffff'
                      e.currentTarget.style.borderColor = AZUL_OH
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 51, 160, 0.06)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.backgroundColor = '#f8fafc'
                      e.currentTarget.style.borderColor = '#e2e8f0'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={styles.circuloIcono(acc.color)}>
                      <IconComp size={16} strokeWidth={2.5} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{acc.label}</span>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>{acc.sub}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Indicadores Resumen (KPIs) */}
        <div style={styles.kpisContainer}>
          <div style={styles.kpiCard}>
            <div style={styles.kpiIcon(`${ROJO_OH}12`, ROJO_OH)}>
              <CreditCard size={22} />
            </div>
            <div>
              <span style={styles.kpiLabel}><TrendingDown size={13} color={ROJO_OH} /> Deuda de Tarjetas</span>
              <span style={styles.kpiValue}><Money value={totalDeuda} /></span>
              <small style={styles.kpiMeta}>{creditos.length} pasivo(s) cargado(s)</small>
            </div>
          </div>

          <div style={styles.kpiCard}>
            <div style={styles.kpiIcon(`${AZUL_OH}12`, AZUL_OH)}>
              <PiggyBank size={22} />
            </div>
            <div>
              <span style={styles.kpiLabel}><TrendingUp size={13} color="#10b981" /> Fondos en Ahorros</span>
              <span style={styles.kpiValue}><Money value={totalAhorro} /></span>
              <small style={styles.kpiMeta}>{cuentas.length} cuenta(s) activa(s)</small>
            </div>
          </div>
        </div>

        {/* Bloque 1: Tarjetas y Créditos */}
        <Card 
          title="Mis Tarjetas oh! & Créditos" 
          icon={<CreditCard size={18} color={ROJO_OH} />}
          actions={<button style={styles.linkInline} onClick={() => navigate('/cuentas/credito')}>Ver detalles <ChevronRight size={14} /></button>}
        >
          {lk ? <Loader text="Consultando líneas..." /> : creditos.length === 0 ? (
            <p style={styles.emptyState}>No registras tarjetas de crédito ni líneas activas.</p>
          ) : (
            <ul style={styles.prodList}>
              {creditos.map((c) => (
                <li 
                  key={c.codcuentacredito} 
                  style={styles.prodItem} 
                  onClick={() => navigate(`/cuentas/credito/${c.codcuentacredito}/cuotas`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.paddingLeft = '6px'
                    e.currentTarget.style.backgroundColor = '#f8fafc'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.paddingLeft = '0px'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: '4px' }}>
                    <strong style={{ fontSize: '14.5px', fontWeight: '600', color: '#1e293b' }}>{c.codcuentacredito}</strong>
                    <small style={{ fontSize: '12.5px', fontWeight: '500', color: '#64748b' }}>Línea de Consumo · <Badge estado={c.calificacion || 'Normal'} tone={c.dias_atraso > 0 ? 'red' : undefined} /></small>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '4px' }}>
                    <strong style={{ fontSize: '16px', fontWeight: '700', color: ROJO_OH }}>
                      <Money value={c.pago_pendiente} />
                    </strong>
                    <ChevronRight size={16} color="#94a3b8" />
                  </div>
                </li>
              ))}
              <li style={styles.prodTotal}>
                <span style={{ fontWeight: '600', color: '#64748b' }}>Total a pagar consolidado</span>
                <span style={{ color: ROJO_OH, fontSize: '18px', fontWeight: '800' }}><Money value={totalDeuda} /></span>
              </li>
            </ul>
          )}
        </Card>

        <div style={{ height: '1.5rem' }} />

        {/* Bloque 2: Cuentas de Ahorro */}
        <Card 
          title="Mis Cuentas de Ahorro" 
          icon={<Wallet size={18} color={AZUL_OH} />}
          actions={<button style={styles.linkInline} onClick={() => navigate('/cuentas/ahorro')}>Ver todo <ChevronRight size={14} /></button>}
        >
          {lc ? <Loader text="Sincronizando fondos..." /> : cuentas.length === 0 ? (
            <p style={styles.emptyState}>No registras cuentas de ahorro vigentes.</p>
          ) : (
            <ul style={styles.prodList}>
              {cuentas.map((c) => (
                <li 
                  key={c.codcuentaahorro} 
                  style={styles.prodItem} 
                  onClick={() => navigate(`/cuentas/ahorro/${c.codcuentaahorro}/movimientos`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.paddingLeft = '6px'
                    e.currentTarget.style.backgroundColor = '#f8fafc'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.paddingLeft = '0px'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: '4px' }}>
                    <strong style={{ fontSize: '14.5px', fontWeight: '600', color: '#1e293b' }}>{c.codcuentaahorro}</strong>
                    <small style={{ fontSize: '12.5px', fontWeight: '500', color: '#64748b' }}>{c.tipo} · <Badge estado={c.estado} /></small>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '4px' }}>
                    <strong style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
                      <Money value={c.saldo} simbolo={simboloMoneda(c.moneda)} />
                    </strong>
                    <ChevronRight size={16} color="#94a3b8" />
                  </div>
                </li>
              ))}
              <li style={styles.prodTotal}>
                <span style={{ fontWeight: '600', color: '#64748b' }}>Saldo disponible total</span>
                <span style={{ color: AZUL_OH, fontSize: '18px', fontWeight: '800' }}><Money value={totalAhorro} /></span>
              </li>
            </ul>
          )}
        </Card>

      </div>
    </PageLayout>
  )
}

function primerNombre(nombre) {
  if (!nombre) return 'Cliente'
  const parts = nombre.split(',')
  const np = (parts[1] || parts[0]).trim().split(/\s+/)[0]
  return np || 'Cliente'
}