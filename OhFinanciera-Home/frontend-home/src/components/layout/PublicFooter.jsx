import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'
import Logo from '../ui/Logo.jsx'

const COLS = [
  {
    title: 'Nosotros',
    links: [
      { text: '¿Quiénes somos?', href: '#quienes-somos' },
      { text: 'Grupo Intercorp', href: '#grupo-intercorp' },
      { text: 'Financiera oh!', href: '#financiera-oh' },
      { text: 'Nuestro propósito', href: '#nuestro-proposito' },
      { text: 'Orgulloh!', href: '#orgulloh' }
    ],
  },
  {
    title: 'Somos transparentes',
    links: [
      { text: 'Documentos relevantes', href: '#documentos' },
      { text: 'Estados financieros', href: '#estados-financieros' },
      { text: 'Buen gobierno', href: '#buen-gobierno' },
      { text: 'Información www.gob.pe/SMV', href: 'https://www.gob.pe/SMV', target: '_blank' }
    ],
  },
  {
    title: 'Reclamos',
    links: [
      { text: 'Protección de datos', href: '#proteccion-datos' },
      { text: 'Servicio al cliente', href: '#servicio-cliente' },
      { text: 'Libro de reclamaciones', href: '#libro-reclamaciones' },
      { text: 'Superintendencia de Banca y Seguros', href: 'https://www.sbs.gob.pe', target: '_blank' },
      { text: 'Términos y condiciones de canales digitales', href: '#terminos' },
      { text: 'Nuestro Ohblog! Entérate de qué trata', href: '#ohblog' }
    ],
  }
]

export default function PublicFooter() {
  const styles = {
    footer: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      padding: '4rem 2rem 2rem 2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    inner: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '2.5rem',
      marginBottom: '3rem'
    },
    brandCol: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    brandDesc: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#b3b3b3',
      margin: 0
    },
    socialContainer: {
      display: 'flex',
      gap: '12px',
      marginTop: '0.5rem'
    },
    socialLink: {
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: '8px',
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s',
      cursor: 'pointer'
    },
    colTitle: {
      fontSize: '16px',
      fontWeight: '700',
      marginBottom: '1.2rem',
      color: '#ffffff'
    },
    linkList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem'
    },
    linkItem: {
      color: '#b3b3b3',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.2s'
    },
    contactList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      color: '#b3b3b3',
      fontSize: '14px'
    },
    phoneBox: {
      backgroundColor: '#262626',
      padding: '10px 14px',
      borderRadius: '8px',
      marginTop: '4px'
    },
    phoneNumber: {
      display: 'block',
      color: '#ffffff',
      fontWeight: '700',
      fontSize: '15px',
      marginTop: '2px'
    },
    divider: {
      border: 0,
      height: '1px',
      backgroundColor: '#333333',
      margin: '2rem 0'
    },
    legalRow: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      fontSize: '13px',
      color: '#888888'
    }
  }

  return (
    <footer style={styles.footer} id="footer">
      <div style={styles.inner}>
        
        {/* Columna de Marca */}
        <div style={styles.brandCol}>
          <Logo size={38} variant="light" subtitle="FINANCIERA" />
          <p style={styles.brandDesc}>
            Formamos parte del Grupo Intercorp. Comprometidos con democratizar el acceso al crédito de manera transparente y responsable.
          </p>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', marginTop: '0.5rem' }}>
            Síguenos en redes:
          </span>
          <div style={styles.socialContainer}>
            <a href="#footer" style={styles.socialLink} aria-label="Facebook"><Facebook size={16} /></a>
            <a href="#footer" style={styles.socialLink} aria-label="Instagram"><Instagram size={16} /></a>
            <a href="#footer" style={styles.socialLink} aria-label="Twitter"><Twitter size={16} /></a>
          </div>
        </div>

        {/* Columnas de Enlaces Dinámicos */}
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 style={styles.colTitle}>{c.title}</h4>
            <ul style={styles.linkList}>
              {c.links.map((l) => (
                <li key={l.text}>
                  <a 
                    href={l.href} 
                    style={styles.linkItem} 
                    target={l.target || '_self'} 
                    rel={l.target === '_blank' ? 'noopener noreferrer' : undefined}
                  >
                    {l.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Columna de Contacto Obligatoria */}
        <div>
          <h4 style={styles.colTitle}>Contacto Oh!</h4>
          <ul style={styles.contactList}>
            <li style={{ lineHeight: '1.4' }}>
              <p style={{ margin: '0 0 12px 0' }}>
                Para consultas y reclamos comunícate con nuestro call center de lunes a sábado de 9am a 9pm.
              </p>
              
              {/* Contenedor Flex Corregido (Ambas cajas viven aquí adentro) */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ ...styles.phoneBox, flex: '1', minWidth: '120px', marginTop: 0 }}>
                  <span>Lima:</span>
                  <span style={styles.phoneNumber}>(01) 619 4800</span>
                </div>

                <div style={{ ...styles.phoneBox, flex: '1', minWidth: '120px', marginTop: 0 }}>
                  <span>Provincias:</span>
                  <span style={styles.phoneNumber}>0801 00002</span>
                </div>
              </div>

            </li>
          </ul>
        </div>

      </div>

      <hr style={styles.divider} />

      {/* Franja Legal e Identidad Corporativa */}
      <div style={styles.legalRow}>
        <div>
          <span>© Tarjeta oh! 2026 todos los derechos reservados. </span>
          <span style={{ marginLeft: '8px', color: '#b3b3b3' }}>Financiera Oh! S.A. — RUC: 20522291201</span>
        </div>
        <div style={{ fontStyle: 'italic' }}>
          Regulado y Supervisado por la Superintendencia de Banca, Seguros y AFP (SBS)
        </div>
      </div>
    </footer>
  )
}