import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, CreditCard, FileText, FilePlus2, ChevronRight } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout.jsx'

const AZUL_OH = '#0033A0'
const ROJO_OH = '#cc1719'

const OPERACIONES = [
  {
    icon: CreditCard, 
    color: ROJO_OH,
    titulo: 'Pagar mi Tarjeta oh!',
    desc: 'Cancela tu estado de cuenta de forma rápida y segura.',
    to: '/operaciones/pago-credito',
  },
  {
    icon: FilePlus2, 
    color: AZUL_OH,
    titulo: 'Solicita un préstamo',
    desc: 'Solicita un préstamo de forma rápida y segura.',
    to: '/creditos/solicitar',
  },
  {
    icon: Send, 
    color: AZUL_OH,
    titulo: 'Transferencias',
    desc: 'Envía dinero entre tus cuentas o a otros bancos al instante.',
    to: '/operaciones/transferencia',
  },
  {
    icon: FileText, 
    color: '#475569', // Un gris neutro elegante
    titulo: 'Pago de servicios y tiendas',
    desc: 'Paga tus recibos cotidianos o tus cuentas de Oechsle, PlazaVea y más.',
    to: '/operaciones/pago-servicios',
  },
]

export default function OperacionesPage() {
  const navigate = useNavigate()

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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.25rem',
      paddingTop: '0.5rem'
    },
    card: {
      display: 'flex',
      alignItems: 'center',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px', // Curvatura amigable
      padding: '1.5rem',
      cursor: 'pointer',
      textAlign: 'left',
      width: '100%',
      gap: '1.25rem',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)'
    },
    iconBox: (color) => ({
      width: '52px',
      height: '52px',
      borderRadius: '14px',
      backgroundColor: `${color}12`, // Capa ligera de color de fondo amigable
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }),
    body: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      flexGrow: 1
    },
    title: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#0f172a',
      letterSpacing: '-0.015em'
    },
    desc: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#64748b',
      lineHeight: '1.4'
    },
    chevron: {
      color: '#94a3b8',
      transition: 'transform 0.2s ease, color 0.2s ease',
      flexShrink: 0
    }
  }

  return (
    <PageLayout 
      title={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 }}>
          Operaciones en Línea
        </span>
      } 
      subtitle={
        <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Operaciones › Selecciona una opción
        </span>
      }
    >
      <div style={styles.container}>
        <div style={styles.grid}>
          {OPERACIONES.map((o) => {
            const Icon = o.icon
            return (
              <button 
                key={o.to} 
                style={styles.card} 
                onClick={() => navigate(o.to)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = AZUL_OH
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 51, 160, 0.03)'
                  // Seleccionamos el chevron interno para animarlo levemente hacia la derecha
                  const chev = e.currentTarget.querySelector('.op-chev')
                  if (chev) {
                    chev.style.transform = 'translateX(4px)'
                    chev.style.color = AZUL_OH
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.01)'
                  const chev = e.currentTarget.querySelector('.op-chev')
                  if (chev) {
                    chev.style.transform = 'translateX(0px)'
                    chev.style.color = '#94a3b8'
                  }
                }}
              >
                <div style={styles.iconBox(o.color)}>
                  <Icon size={24} />
                </div>
                
                <div style={styles.body}>
                  <strong style={styles.title}>{o.titulo}</strong>
                  <span style={styles.desc}>{o.desc}</span>
                </div>
                
                <ChevronRight size={18} className="op-chev" style={styles.chevron} />
              </button>
            )
          })}
        </div>
      </div>
    </PageLayout>
  )
}