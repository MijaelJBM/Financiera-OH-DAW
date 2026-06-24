import { LogOut, User, Shield, MapPin } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import Logo from '../ui/Logo.jsx'

const ROJO_OH = '#cc1719'
const NEGRO_OH = '#101820'

// Función helper para capitalizar el rol (ej. "ADMINISTRADOR" -> "Administrador")
const capitalizar = (str) => {
  if (!str) return '—'
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default function Navbar() {
  const { user, cerrarSesion } = useAuth()

  return (
    <header style={styles.navbarContainer}>
      {/* Brand / Identidad Visual con Fondo Oscuro */}
      <div style={styles.navbarBrand}>
        <Logo size={36} variant="light" />
      </div>
      
      {/* Metadatos y Acciones de Usuario */}
      <div style={styles.navbarUserSection}>
        {user && (
          <div style={styles.sessionMetaGroup}>
            {/* Bloque Nombre */}
            <div style={styles.metaPill}>
              <User size={13} style={styles.pillIcon} />
              <span style={styles.pillText}>{user.nombre}</span>
            </div>
            
            {/* Bloque Rol (Capitalizado) */}
            <div style={{ ...styles.metaPill, backgroundColor: 'rgba(204, 23, 25, 0.15)', borderColor: ROJO_OH }}>
              <Shield size={13} style={{ ...styles.pillIcon, color: '#ff4d4f' }} />
              <span style={{ ...styles.pillText, color: '#ff4d4f', fontWeight: '800' }}>
                {capitalizar(user.rol)}
              </span>
            </div>
            
            {/* Bloque Agencia */}
            <div style={styles.metaPill}>
              <MapPin size={13} style={styles.pillIcon} />
              <span style={styles.pillText}>Ag. {user.codagencia}</span>
            </div>
          </div>
        )}

        {/* Separador Visual Interno */}
        {user && <div style={styles.divider} />}

        {/* Botón de Desconexión */}
        <button 
          style={styles.navbarLogout} 
          onClick={cerrarSesion}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 77, 79, 0.1)';
            e.currentTarget.style.color = '#ff4d4f';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <LogOut size={15} strokeWidth={2.5} /> 
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </header>
  )
}

// ─── Estilos de Diseño Corporativo Financiera oh! (Contraste Oscuro) ───
const styles = {
  navbarContainer: {
    height: '70px',
    backgroundColor: NEGRO_OH, // Fondo oscuro corregido para hacer match con Logo variant="light"
    borderBottom: '1px solid #1e293b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 32px',
    boxSizing: 'border-box',
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  navbarBrand: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  navbarUserSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  sessionMetaGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  metaPill: {
    backgroundColor: '#1e293b', // Fondo de pastillas adaptado para modo oscuro
    border: '1px solid #334155',
    padding: '6px 12px',
    borderRadius: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  pillIcon: {
    color: '#94a3b8',
    flexShrink: 0
  },
  pillText: {
    fontSize: '12px',
    color: '#f1f5f9', // Letras legibles en blanco/gris claro
    fontWeight: '600',
    letterSpacing: '-0.1px'
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: '#334155'
  },
  navbarLogout: {
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s ease'
  }
}