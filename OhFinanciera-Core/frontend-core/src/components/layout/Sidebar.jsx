import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Inbox,
  Gauge,
  FilePlus2,
  Users,
  BadgeCheck,
  AlertTriangle,
  PiggyBank,
} from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext.jsx'
import { puede } from '../../utils/permisos.js'
import Logo from '../ui/Logo.jsx' // ¡Inyectamos tu nuevo logo pulido aquí arriba!

// Menú estructurado según el flujo de otorgamiento MPR-003-CRE.
const SECCIONES = [
  {
    titulo: 'Principal',
    items: [{ to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard }],
  },
  {
    titulo: 'Otorgamiento de créditos',
    items: [
      { to: '/solicitudes', label: 'Bandeja de solicitudes', Icon: Inbox },
      { to: '/scoring', label: '1. Pre-solicitud', Icon: Gauge },
      { to: '/solicitudes/nueva', label: '2. Registro de solicitud', Icon: FilePlus2 },
      { to: '/solicitudes?estado=6', label: '3. Propuesta y comité', Icon: Users, estado: '6' },
      { to: '/solicitudes?estado=2', label: '4. Aprobación y desembolso', Icon: BadgeCheck, estado: '2' },
      { to: '/cartera', label: '5. Mora y recuperación', Icon: AlertTriangle },
    ],
  },
  {
    titulo: 'Recuperaciones',
    accion: 'consultar_mora',
    items: [{ to: '/recuperaciones', label: 'Bandeja de mora', Icon: AlertTriangle }],
  },
  {
    titulo: 'Captaciones',
    accion: 'ver_ahorros',
    items: [{ to: '/ahorros', label: 'Ahorros', Icon: PiggyBank }],
  },
]

// Determina si un ítem está activo analizando la URL actual
function esActivo(item, location) {
  const estado = new URLSearchParams(location.search).get('estado')
  if (item.estado) {
    return location.pathname === '/solicitudes' && estado === item.estado
  }
  if (item.to === '/solicitudes') {
    return location.pathname === '/solicitudes' && !estado
  }
  return location.pathname === item.to
}

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuthContext()
  
  // Estado local para controlar los hovers individuales de cada link por texto/label
  const [hoveredLink, setHoveredLink] = useState(null)

  // Filtro estricto de permisos comerciales/riesgos
  const visibles = SECCIONES.filter((sec) => !sec.accion || puede(user?.rol, sec.accion))

  return (
    <nav style={styles.sidebar}>
      {/* Cabecera del Sidebar con el branding unificado */}
      <div style={styles.brandWrapper}>
        <Logo size={36} wordmark={true} subtitle="Gst. Comercial" />
      </div>

      {/* Contenedor escrolleable de las secciones del menú */}
      <div style={styles.menuWrapper}>
        {visibles.map((sec) => (
          <div style={styles.section} key={sec.titulo}>
            <p style={styles.sectionTitle}>{sec.titulo}</p>
            
            <div style={styles.itemsGap}>
              {sec.items.map(({ to, label, Icon, estado }) => {
                const activo = esActivo({ to, estado }, location)
                const isHovered = hoveredLink === label

                // Configuración dinámica de estilos según el estado de la navegación
                const linkStyle = activo
                  ? styles.linkActive
                  : isHovered
                    ? styles.linkHover
                    : styles.linkNormal;

                return (
                  <Link
                    key={label}
                    to={to}
                    onMouseEnter={() => setHoveredLink(label)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{ ...styles.linkBase, ...linkStyle }}
                  >
                    <Icon 
                      size={18} 
                      strokeWidth={activo ? 2.5 : 2.0} 
                      style={{ shrink: 0, transition: 'transform 0.2s' }}
                    />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer del Sidebar con info del usuario en sesión */}
      {user && (
        <div style={styles.userFooter}>
          <div style={styles.userAvatar}>
            {user.nombre?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={styles.userName}>{user.nombre || 'Asesor Comercial'}</span>
            <span style={styles.userRole}>{user.rol?.toLowerCase() || 'Especialista'}</span>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Estilos UI Estructurales de Nivel de Producción ───
const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    left: 0,
    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.01)',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    boxSizing: 'border-box'
  },
  brandWrapper: {
    padding: '24px 18px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center'
  },
  menuWrapper: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column'
  },
  sectionTitle: {
    margin: '0 0 10px 10px',
    fontSize: '11px',
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    userSelect: 'none'
  },
  itemsGap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  linkBase: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    boxSizing: 'border-box'
  },
  linkNormal: {
    color: '#475569',
    backgroundColor: 'transparent'
  },
  linkHover: {
    color: '#101820',
    backgroundColor: '#f8fafc',
  },
  linkActive: {
    color: '#cc1719', // Rojo Corporativo Financiera oh!
    backgroundColor: '#fef2f2', // Fondo suavizado para contraste premium
  },
  userFooter: {
    padding: '16px',
    borderTop: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: 'auto'
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#cc1719',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
    shrink: 0
  },
  userName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#101820',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  userRole: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'capitalize',
    marginTop: '1px'
  }
}