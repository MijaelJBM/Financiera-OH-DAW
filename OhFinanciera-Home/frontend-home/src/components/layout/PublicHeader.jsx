import { useNavigate } from 'react-router-dom'
import { Lock, Menu, CreditCard } from 'lucide-react'
import Logo from '../ui/Logo.jsx'

const NAV = [
  { label: 'Tarjetas', href: '#tarjetas' },
  { label: 'Promociones oh!', href: '#promociones' },
  { label: 'Requisitos', href: '#requisitos' },
  { label: 'Centros oh!', href: '#centros' },
  { label: 'Ayuda', href: '#ayuda' },
]

export default function PublicHeader() {
  const navigate = useNavigate()

  const styles = {
    header: {
      width: '100%',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    topBar: {
      backgroundColor: '#fff5f5', 
      borderBottom: '1px solid #ffe3e3',
      padding: '10px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '13px',
      color: '#ff1a1a', 
      fontWeight: '500'
    },
    topBarLinks: {
      display: 'flex',
      gap: '16px'
    },
    topLink: {
      color: '#e60000',
      textDecoration: 'none',
      cursor: 'pointer',
      fontSize: '12px'
    },
    mainNav: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    logoBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'center'
    },
    navLinks: {
      display: 'flex',
      gap: '32px'
    },
    link: {
      color: '#333333', 
      textDecoration: 'none',
      fontWeight: '600', 
      fontSize: '15px',
      transition: 'color 0.2s'
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    },
    btnSecondary: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'transparent',
      border: '2px solid #ff0000', 
      color: '#ff0000',
      padding: '10px 18px',
      fontSize: '14px',
      fontWeight: '700',
      borderRadius: '10px', 
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    btnPrimary: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#ff0000', 
      border: 'none',
      color: '#ffffff',
      padding: '12px 22px', 
      fontSize: '14px',
      fontWeight: '700',
      borderRadius: '10px', 
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(255, 0, 0, 0.2)', 
      transition: 'background-color 0.2s'
    }
  }

  return (
    <header style={styles.header}>
      {/* Franja Superior Informativa */}
      <div style={styles.topBar}>
        <span>Pide tu Tarjeta oh! 100% en línea y úsala hoy mismo</span>
        <div style={styles.topBarLinks}>
          <a href="#ciudades" style={styles.topLink}>Nuestras Ciudades</a>
          <span style={{ color: '#ffe3e3' }}>|</span>
          <a href="#canales" style={styles.topLink}>Canales de Atención</a>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div style={styles.mainNav}>
        
        {/* Logo */}
        <button style={styles.logoBtn} onClick={() => navigate('/')} aria-label="Financiera Oh! — Inicio">
          <Logo size={36} variant="dark" subtitle="FINANCIERA" />
        </button>

        {/* Enlaces */}
        <nav style={styles.navLinks}>
          {NAV.map((n) => (
            <a key={n.label} href={n.href} style={styles.link}>
              {n.label}
            </a>
          ))}
        </nav>

        {/* Botones de Acción */}
        <div style={styles.actions}>
          <button style={styles.btnSecondary} onClick={() => navigate('/solicitar')}>
            <CreditCard size={16} />
            Solicita tu Tarjeta
          </button>

          <button style={styles.btnPrimary} onClick={() => navigate('/login')}>
            <Lock size={15} /> 
            Banca por Internet
          </button>
        </div>

      </div>
    </header>
  )
}