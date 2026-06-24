import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, UserCog, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { useHBAuth } from '../../hooks/useHBAuth.js'
import { useUI } from '../../context/UIContext.jsx'
import Logo from '../ui/Logo.jsx'

const AZUL_OH = '#16181b';
const ROJO_OH = '#cc1719';

const TABS = [
  { label: 'Inicio', to: '/inicio', match: ['/inicio'] },
  { label: 'Cuentas', to: '/cuentas/ahorro', match: ['/cuentas/ahorro'] },
  { label: 'Préstamos', to: '/cuentas/credito', match: ['/cuentas/credito'] },
  { label: 'Operaciones', to: '/operaciones', match: ['/operaciones', '/creditos/solicitar'] },
]

export default function Header() {
  const { user, logout } = useHBAuth()
  const { hideAmounts, toggleHideAmounts } = useUI()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuUser, setMenuUser] = useState(false)

  useEffect(() => { setMenuUser(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const iniciales = (user?.nombre || 'C')
    .split(/[\s,]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase()

  const isActive = (tab) => tab.match.some((m) => location.pathname.startsWith(m))

  const styles = {
    header: {
      width: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    topbar: {
      backgroundColor: AZUL_OH,
      color: '#ffffff',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center'
    },
    topbarInner: {
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    brandBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0
    },
    topbarRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px'
    },
    hideToggle: {
      background: 'rgba(255,255,255,0.08)',
      border: 'none',
      borderRadius: '20px',
      padding: '6px 14px',
      color: '#ffffff',
      fontSize: '13px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    switchTrack: {
      width: '28px',
      height: '16px',
      backgroundColor: hideAmounts ? '#22c55e' : 'rgba(255,255,255,0.3)',
      borderRadius: '10px',
      position: 'relative',
      display: 'inline-block',
      marginLeft: '4px'
    },
    switchDot: {
      width: '12px',
      height: '12px',
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      position: 'absolute',
      top: '2px',
      left: hideAmounts ? '14px' : '2px',
      transition: 'left 0.2s'
    },
    userWrap: {
      position: 'relative'
    },
    userBtn: {
      background: 'none',
      border: 'none',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer'
    },
    avatar: {
      width: '32px',
      height: '32px',
      backgroundColor: ROJO_OH,
      color: '#ffffff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '13px'
    },
    userText: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      fontSize: '13px',
      lineHeight: '1.2'
    },
    dropdownMenu: {
      position: 'absolute',
      top: '120%',
      right: 0,
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      width: '180px',
      padding: '6px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px'
    },
    dropdownBtn: {
      width: '100%',
      padding: '10px 12px',
      background: 'none',
      border: 'none',
      borderRadius: '6px',
      textAlign: 'left',
      fontSize: '13px',
      color: '#334155',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logoutActionBtn: {
      background: 'none',
      border: 'none',
      color: 'rgba(255,255,255,0.7)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center'
    },
    navTabs: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px'
    },
    navTabsInner: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      gap: '8px'
    },
    tabBtn: (active) => ({
      padding: '14px 16px',
      background: 'none',
      border: 'none',
      borderBottom: active ? `3px solid ${ROJO_OH}` : '3px solid transparent',
      color: active ? AZUL_OH : '#64748b',
      fontWeight: active ? '700' : '500',
      fontSize: '14px',
      cursor: 'pointer',
      outline: 'none'
    })
  }

  return (
    <header style={styles.header}>
      {/* 🛑 AQUÍ SE BORRÓ LA FRANJA MULTICOLOR */}

      <div style={styles.topbar}>
        <div style={styles.topbarInner}>
          <button style={styles.brandBtn} onClick={() => navigate('/inicio')} aria-label="Inicio">
            <Logo size={32} variant="light" subtitle="BANCA POR INTERNET" />
          </button>

          <div style={styles.topbarRight}>
            <button style={styles.hideToggle} onClick={toggleHideAmounts} title="Ocultar importes">
              {hideAmounts ? <EyeOff size={15} /> : <Eye size={15} />}
              <span style={{ fontWeight: '500' }}>Ocultar importes</span>
              <span style={styles.switchTrack}>
                <span style={styles.switchDot} />
              </span>
            </button>

            <div style={styles.userWrap}>
              <button style={styles.userBtn} onClick={() => setMenuUser((v) => !v)}>
                <span style={styles.avatar}>{iniciales}</span>
                <span style={styles.userText}>
                  <strong>{user?.nombre || 'Cliente'}</strong>
                  <small style={{ opacity: 0.7 }}>{user?.codcliente}</small>
                </span>
                <ChevronDown size={14} />
              </button>
              
              {menuUser && (
                <div style={styles.dropdownMenu}>
                  <button style={styles.dropdownBtn} onClick={() => navigate('/inicio')}>
                    <UserCog size={14} color="#64748b" /> Actualiza tus datos
                  </button>
                  <button 
                    style={{ ...styles.dropdownBtn, color: ROJO_OH, fontWeight: '600' }} 
                    onClick={handleLogout}
                  >
                    <LogOut size={14} color={ROJO_OH} /> Salir
                  </button>
                </div>
              )}
            </div>

            <button style={styles.logoutActionBtn} onClick={handleLogout} title="Salir">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <nav style={styles.navTabs}>
        <div style={styles.navTabsInner}>
          {TABS.map((t) => {
            const active = isActive(t);
            return (
              <button
                key={t.to}
                style={styles.tabBtn(active)}
                onClick={() => navigate(t.to)}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  )
}