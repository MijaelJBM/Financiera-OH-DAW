import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ShieldCheck, User, Lock, LogIn, 
  Activity, CheckCircle, Zap, ArrowUpRight 
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'

const ROJO_OH = '#cc1719';

export default function HomePage() {
  const navigate = useNavigate()
  const { loading, error, iniciarSesion } = useAuth()

  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [recordar, setRecordar] = useState(true)
  const [olvido, setOlvido] = useState(false)

  // Estados para simular datos en tiempo real y dar dinamismo
  const [opsContador, setOpsContador] = useState(14250)
  const [hoveredCard, setHoveredCard] = useState(null)

  // Pequeño efecto para simular que el core está procesando transacciones en vivo
  useEffect(() => {
    const interval = setInterval(() => {
      setOpsContador(prev => prev + Math.floor(Math.random() * 4) + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  function submit(e) {
    e.preventDefault()
    iniciarSesion(dni.trim(), password)
  }

  return (
    <div style={styles.container}>
      <div style={styles.franjaSuperior} />

      <header style={styles.header}>
        <div style={styles.logoContainer} onClick={() => navigate('/')}>
          <span style={styles.logoText}>oh!</span>
          <span style={styles.logoSubtext}>Core Bancario</span>
        </div>
        <span style={styles.headerBadge}>
          <span style={styles.pulseDot} /> Canal Interno de Agencias
        </span>
      </header>

      <main style={styles.mainSplit}>
        
        {/* ───────── Columna Izquierda: Panel Dinámico "Live Core Dashboard" ───────── */}
        <section style={styles.leftPanel}>
          <div style={styles.liveBadge}>
            <Activity size={14} style={{ marginRight: '6px' }} /> CORE EN VIVO
          </div>
          
          <h1 style={styles.panelTitle}>
            Gestiona las operaciones de financiera <span style={{ color: ROJO_OH }}>oh!</span> <br />
          </h1>
          
          <p style={styles.panelSubtitle}>
            Monitorea, procesa y aprueba solicitudes de tarjetas de crédito, cuentas de ahorro y disposición de efectivo con respuesta en menos de 60 segundos.
          </p>

          {/* Métrica viva que se actualiza sola */}
          <div style={styles.liveMetricsContainer}>
            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>Transacciones del Día</span>
              <span style={styles.metricValue}>{opsContador.toLocaleString('es-PE')}</span>
            </div>
            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>Eficiencia del Motor</span>
              <span style={{ ...styles.metricValue, color: '#2b9348' }}>99.98%</span>
            </div>
          </div>

          {/* Tarjetas interactivas */}
          <div style={styles.featuresGrid}>
            {[
              { id: 1, title: 'Validación con DNI', desc: 'Conexión directa con bases de datos de riesgo y validación de identidad biométrica instantánea.', icon: CheckCircle },
              { id: 2, title: 'Desembolso Inmediato', desc: 'Aprobación y carga de saldos digital optimizada para cuentas de Ahorro y Tarjeta oh!.', icon: Zap }
            ].map((card) => {
              const Icon = card.icon;
              const isHovered = hoveredCard === card.id;
              return (
                <div 
                  key={card.id}
                  style={{
                    ...styles.featureItem,
                    ...(isHovered ? styles.featureItemHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <span style={{
                    ...styles.featureIconBox,
                    backgroundColor: isHovered ? ROJO_OH : `${ROJO_OH}10`,
                    color: isHovered ? '#ffffff' : ROJO_OH,
                  }}>
                    <Icon size={20} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.featureItemTitle}>{card.title}</h3>
                    <p style={styles.featureItemDesc}>{card.desc}</p>
                  </div>
                  <ArrowUpRight size={16} style={{ color: isHovered ? ROJO_OH : '#ced4da', transition: 'all 0.2s' }} />
                </div>
              )
            })}
          </div>
        </section>

        {/* ───────── Columna Derecha: Login Card Estilizada ───────── */}
        <aside style={styles.rightPanel}>
          <div style={styles.loginCard}>
            <div style={styles.secureBadge}>
              <ShieldCheck size={14} style={{ marginRight: '6px', color: '#2b9348' }} /> Acceso Cifrado SSL
            </div>
            
            <h2 style={styles.loginTitle}>Ingreso al Sistema</h2>
            <p style={styles.loginSubtitle}>Digita tus credenciales autorizadas por Financiera Oh!</p>

            <form onSubmit={submit} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="dni">Número de DNI</label>
                <div style={styles.inputWrapper}>
                  <User size={18} style={styles.inputIcon} />
                  <input
                    id="dni"
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ingresa tu DNI"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="pwd">Contraseña de Red</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} style={styles.inputIcon} />
                  <input
                    id="pwd"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.rowActions}>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={recordar} 
                    onChange={(e) => setRecordar(e.target.checked)} 
                    style={{ marginRight: '6px', accentColor: ROJO_OH }}
                  />
                  Recordar terminal
                </label>
                <button type="button" style={styles.btnLink} onClick={() => setOlvido(!olvido)}>
                  ¿Problemas con tu clave?
                </button>
              </div>

              {olvido && (
                <div style={styles.hintBox}>
                  Por seguridad, el restablecimiento se realiza mediante el portal de Autoservicio TI o llamando al Anexo 4500.
                </div>
              )}

              {error && <div style={styles.errorBox}>{error}</div>}

              <button type="submit" style={styles.btnSubmit}>
                <LogIn size={16} style={{ marginRight: '8px' }} />
                {loading ? 'Autenticando...' : 'Iniciar Sesión Corporativa'}
              </button>
            </form>
          </div>
        </aside>

      </main>

      <footer style={styles.footer}>
        <span>© 2026 Financiera Oh! S.A. · Servidor de Producción Organizado</span>
        <span>Mesa de Ayuda Interna</span>
      </footer>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: '#FAFBFB',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    color: '#212529',
    // Fondo geométrico sutil que le da dinamismo sin pesar visualmente
    backgroundImage: 'radial-gradient(#cc171905 1px, transparent 0), radial-gradient(#cc171905 1px, transparent 0)',
    backgroundSize: '24px 24px',
    backgroundPosition: '0 0, 12px 12px'
  },
  franjaSuperior: {
    height: '4px',
    backgroundColor: ROJO_OH,
    width: '100%'
  },
  header: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '32px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
  },
  logoText: {
    backgroundColor: ROJO_OH,
    color: '#ffffff',
    padding: '4px 14px',
    borderRadius: '8px',
    fontWeight: '900',
    fontSize: '20px',
    letterSpacing: '-0.5px',
    boxShadow: '0 4px 10px rgba(204, 23, 25, 0.15)'
  },
  logoSubtext: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: '-0.3px'
  },
  headerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '12px',
    backgroundColor: '#ffffff',
    color: '#495057',
    padding: '8px 14px',
    borderRadius: '20px',
    fontWeight: '600',
    border: '1px solid #edf0f2',
    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#2b9348',
    borderRadius: '50%',
    marginRight: '8px',
    display: 'inline-block'
  },
  mainSplit: {
    maxWidth: '1200px',
    width: '100%',
    margin: 'auto',
    padding: '2rem 24px 5rem 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '5rem',
    flexWrap: 'wrap',
    boxSizing: 'border-box'
  },
  leftPanel: {
    flex: 1,
    minWidth: '340px'
  },
  liveBadge: {
    backgroundColor: '#101820',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderLeft: `3px solid ${ROJO_OH}`
  },
  panelTitle: {
    fontSize: '3.4rem',
    fontWeight: '800',
    color: '#1a1a1a',
    margin: '0 0 1rem 0',
    lineHeight: '1.1',
    letterSpacing: '-1.5px'
  },
  panelSubtitle: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#555555',
    marginBottom: '2.5rem',
    maxWidth: '490px'
  },
  liveMetricsContainer: {
    display: 'flex',
    gap: '16px',
    marginBottom: '2.5rem'
  },
  metricCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #edf0f2',
    borderRadius: '12px',
    padding: '14px 20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.01)'
  },
  metricLabel: {
    fontSize: '11px',
    color: '#888888',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  metricValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a1a',
    fontVariantNumeric: 'tabular-nums'
  },
  featuresGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  featureItem: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '18px',
    borderRadius: '14px',
    border: '1px solid #edf0f2',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer'
  },
  featureItemHover: {
    borderColor: '#ced4da',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.04)'
  },
  featureIconBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    flexShrink: 0
  },
  featureItemTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0 0 2px 0'
  },
  featureItemDesc: {
    fontSize: '13px',
    color: '#666666',
    margin: 0,
    lineHeight: '1.45'
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    minWidth: '340px'
  },
  loginCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '420px',
    padding: '3rem 2.5rem',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
    border: '1px solid #edf0f2',
    boxSizing: 'border-box'
  },
  secureBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: '#2b9348',
    backgroundColor: '#e8f5e9',
    padding: '4px 10px',
    borderRadius: '6px',
    marginBottom: '1.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  loginTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#1a1a1a',
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.5px'
  },
  loginSubtitle: {
    fontSize: '14px',
    color: '#666666',
    margin: '0 0 2.5rem 0',
    lineHeight: '1.45'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#495057'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#adb5bd'
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 44px',
    borderRadius: '12px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box'
  },
  rowActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    color: '#495057',
    cursor: 'pointer',
    fontWeight: '500'
  },
  btnLink: {
    background: 'none',
    border: 'none',
    color: ROJO_OH,
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    padding: 0
  },
  hintBox: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '12px',
    lineHeight: '1.5',
    border: '1px solid #ffeeba'
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid #f5c6cb'
  },
  btnSubmit: {
    backgroundColor: ROJO_OH,
    color: '#ffffff',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(204, 23, 25, 0.25)',
    transition: 'all 0.2s ease'
  },
  footer: {
    borderTop: '1px solid #edf0f2',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#666666',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
    gap: '10px'
  }
};