import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CreditCard, Wallet, ShieldCheck,
  Clock, MapPin, ArrowRight, Lock, CheckCircle, PiggyBank
} from 'lucide-react'
import PublicHeader from '../components/layout/PublicHeader.jsx'
import PublicFooter from '../components/layout/PublicFooter.jsx'


const ROJO_OH = '#cc1719';

const PRODUCTOS_POR_CATEGORIA = {
  tarjetas: [
    { icon: CreditCard, color: ROJO_OH, titulo: 'Tarjeta de Débito oh!', desc: 'Tarjeta VISA recargable para comprar, ahorrar y manejar tu dinero del día a día.' },
    { icon: CreditCard, color: ROJO_OH, titulo: 'Tarjeta de Crédito oh!', desc: 'Solicita tu tarjeta de crédito en línea y recógela de inmediato en nuestros Centros de Atención.' },
    { icon: CreditCard, color: ROJO_OH, titulo: 'Tarjeta oh! Plus', desc: 'Tu tarjeta ideal con descuentos increíbles y exclusivos en todo el ecosistema de tiendas socias.' },
    { icon: CreditCard, color: '#444444', titulo: 'Tarjeta Ceroh!', desc: 'Disfruta de todos los beneficios de una tarjeta de crédito tradicional 100% libre de membresía.' },
    { icon: CreditCard, color: ROJO_OH, titulo: 'Tarjeta oh! con Garantía', desc: 'Abre una garantía, solicita tu tarjeta de crédito y empieza a comprar de forma digital al instante.' },
    { icon: CreditCard, color: '#666666', titulo: 'Tarjeta Básica', desc: 'Una tarjeta esencial para tus operaciones diarias, sin descuentos exclusivos y sin cobro de membresía.' }
  ],
  efectivo: [
    { icon: Wallet, color: '#cc1719', titulo: 'Crédito Efectivo', desc: 'Solicita un crédito de consumo personal rápido con desembolso inmediato para lo que necesites.' },
    { icon: Wallet, color: '#cc1719', titulo: 'Disposición de Efectivo', desc: 'Retira dinero en efectivo directamente de la línea disponible de tu Tarjeta de Crédito oh!.' },
    { icon: Wallet, color: '#cc1719', titulo: 'Incremento de Línea', desc: 'Aumenta la línea de crédito de tu Tarjeta de Crédito de forma simple para elevar tu poder de compra.' },
    { icon: Wallet, color: '#cc1719', titulo: 'Préstamo Personal', desc: 'Solicita hasta S/ 25,000 con hasta 36 meses para pagar y úsalo en lo que más necesites.' }
  ],
  ahorros: [
    { icon: PiggyBank, color: '#cc1719', titulo: 'Depósito a Plazo Fijo', desc: 'Abre tu cuenta 100% digital y haz crecer tus fondos con nuestra tasa de interés preferencial.' },
    { icon: PiggyBank, color: '#cc1719', titulo: 'Cuenta CTS', desc: 'Abre o traslada tu CTS con nosotros y gana mucho más con una súper tasa de interés garantizada.' },
    { icon: PiggyBank, color: '#cc1719', titulo: 'Ahorro Digital oh!', desc: 'Abre tu cuenta 100% digital y haz crecer tus fondos con nuestra tasa de interés preferencial.' },
    { icon: PiggyBank, color: '#cc1719', titulo: 'Ahorro Programado Meta oh!', desc: 'Alcanza tus objetivos programando tus ahorros mensuales de forma automática y accede a una súper tasa de interés garantizada.' }
  ],
  seguros: [
    { icon: ShieldCheck, color: '#cc1719', titulo: 'Seguro de Desgravamen', desc: 'Protección obligatoria de saldo deudor con las mejores tasas reguladas del mercado.' },
    { icon: ShieldCheck, color: '#cc1719', titulo: 'Seguros Familiares', desc: 'Planes opcionales de protección de tarjeta, salud y respaldo para todo tu hogar.' }
  ]
};

const ESTABLECIMIENTOS = [
  { nombre: 'plazaVea', urlLogo: 'https://marketingperu.beglobal.biz/wp-content/uploads/2026/02/logotipo-plaza-vea-2.png' }, 
  { nombre: 'Oechsle', urlLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Oechsle_nuevo_logo.svg/960px-Oechsle_nuevo_logo.svg.png' },
  { nombre: 'Promart', urlLogo: 'https://revistagptwperu.com/wp-content/uploads/2026/02/12_promart_logo.png' },
  { nombre: 'Mifarma', urlLogo: 'https://static.wikia.nocookie.net/logopedia/images/5/59/MiFarma_logo_2012_apilado.svg/revision/latest/scale-to-width-down/250?cb=20200909195101&path-prefix=es' },
  { nombre: 'Makro', urlLogo: 'https://www.ferrocor.com.pe/wp-content/uploads/2025/11/makro.png' },
  { nombre: 'Real Plaza', urlLogo: 'https://static.wikia.nocookie.net/mall/images/b/ba/Real_Plaza_2019.svg/revision/latest/scale-to-width-down/1200?cb=20230526041521&path-prefix=es' }
];

const BENEFICIOS = [
  { icon: ShieldCheck, titulo: 'Respaldo Absoluto', desc: 'Operaciones e intereses 100% regulados bajo la estricta supervisión de la SBS.' },
  { icon: Clock, titulo: 'Control Total en Línea', desc: 'Revisa tu línea disponible, pagos mínimos, totales y fechas de vencimiento las 24 horas.' },
  { icon: MapPin, titulo: 'Presencia Nacional', desc: 'Atención física inmediata mediante nuestros Centros oh! dentro de Oechsle, plazaVea y Promart.' }
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [categoriaActiva, setCategoriaActiva] = useState('tarjetas')

  return (
    <div style={styles.container}>
      <PublicHeader />

      {/* ===== HERO REESTRUCTURADO EN DOS COLUMNAS ===== */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          
          {/* Columna Izquierda: Mensajes y Acciones */}
          <div style={styles.heroLeft}>
            <span style={styles.heroTag}>Ecosistema Tarjeta oh!</span>
            <h1 style={styles.heroTitle}>Tu tarjeta oh!<br />ahora 100% en línea</h1>
            <p style={styles.heroSubtitle}>
              Solicita tu tarjeta digital con un ingreso mínimo de S/ 500. Consulta saldos, simula tus cuotas 
              y administra tus finanzas desde cualquier ciudad del Perú de forma amigable.
            </p>
            <div style={styles.flexGroup}>
              <button style={styles.btnWhite} onClick={() => navigate('/login')}>
                <Lock size={16} style={{ marginRight: '8px' }} /> Ingresar a mi Banca
              </button>
              <button style={styles.btnOutlineWhite} onClick={() => navigate('/solicitar')}>
                Solicitar mi Tarjeta
              </button>
            </div>
          </div>

          {/* Columna Derecha: Llenado visual con Tarjeta oh! Estilizada */}
          <div style={styles.heroRight}>
            <div style={styles.tarjetaIlustracion}>
              <div style={styles.tarjetaHeader}>
                <div style={styles.tarjetaMiniLogo}>oh!</div>
                <span style={{ fontSize: '11px', fontWeight: 'bold', opacity: 0.8 }}>PREMIUM</span>
              </div>
              <div style={styles.tarjetaChip} />
              <div style={styles.tarjetaNumero}>•••• •••• •••• 2026</div>
              <div style={styles.tarjetaFooter}>
                <span style={{ fontSize: '12px', letterSpacing: '1px' }}>JUAN PEREZ P.</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', fontStyle: 'italic' }}>VISA</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== SECCIÓN ESTABLECIMIENTOS CON SOPORTE PARA LOGOS ===== */}
      <section style={styles.sectionEstablecimientos}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={styles.establecimientosTitle}>
            Con <span style={{ color: ROJO_OH }}>oh!</span> tienes beneficios en estos establecimientos y más
          </h2>
          <div style={styles.gridEstablecimientos}>
            {ESTABLECIMIENTOS.map((e) => (
              <div key={e.nombre} style={styles.boxLogoEstablecimiento}>
                {e.urlLogo ? (
                  <img src={e.urlLogo} alt={e.nombre} style={{ maxHeight: '35px', maxWidth: '100%' }} />
                ) : (
                  <span style={{ fontWeight: '700', color: '#495057', fontSize: '15px' }}>{e.nombre}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TABS / CATEGORÍAS ===== */}
      <div style={styles.tabsContainer}>
        {['tarjetas', 'efectivo', 'ahorros', 'seguros'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            style={{
              ...styles.tabButton,
              backgroundColor: categoriaActiva === cat ? ROJO_OH : '#ffffff',
              color: categoriaActiva === cat ? '#ffffff' : '#333333',
              border: categoriaActiva === cat ? `2px solid ${ROJO_OH}` : '2px solid #e1e1e1',
            }}
          >
            {cat === 'tarjetas' ? 'Tarjetas oh!' : cat === 'efectivo' ? 'Efectivo' : cat === 'ahorros' ? 'Ahorros' : 'Seguros'}
          </button>
        ))}
      </div>

      {/* ===== PRODUCTOS ===== */}
      <section style={styles.section}>
        <div style={styles.gridProducts}>
          {PRODUCTOS_POR_CATEGORIA[categoriaActiva].map((p) => {
            const Icon = p.icon
            return (
              <article key={p.titulo} style={styles.cardProduct}>
                <span style={{ ...styles.iconContainer, background: `${p.color}12`, color: p.color }}>
                  <Icon size={24} />
                </span>
                <h3 style={styles.cardProductTitle}>{p.titulo}</h3>
                <p style={styles.cardProductDesc}>{p.desc}</p>
                <div style={styles.cardBadge}>
                  <CheckCircle size={14} style={{ marginRight: '6px', color: ROJO_OH }} /> Producto Disponible
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section style={styles.promoBanner}>
        <div style={styles.promoInner}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <span style={styles.promoTag}>Beneficio Exclusivo</span>
            <h2 style={styles.promoTitle}>Membresía S/ 0 Consumiendo Todos los Meses</h2>
            <p style={styles.promoDesc}>
              Olvídate de cobros adicionales. Si registras al menos un consumo mensual en línea o en establecimientos físicos (sin monto mínimo), tu membresía anual queda totalmente exonerada.
            </p>
          </div>
          <button style={styles.btnWhitePromo} onClick={() => navigate('/login')}>
            Verificar mis consumos <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </section>

      {/* ===== BENEFICIOS TOTALES ===== */}
      <section style={styles.section}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={styles.sectionTitle}>Ventajas institucionales de tu Financiera</h2>
        </div>
        <div style={styles.gridBenefits}>
          {BENEFICIOS.map((b) => {
            const Icon = b.icon
            return (
              <div key={b.titulo} style={styles.cardBenefit}>
                <span style={{ color: ROJO_OH, marginBottom: '1rem', display: 'inline-block' }}>
                  <Icon size={32} />
                </span>
                <h3 style={styles.cardBenefitTitle}>{b.titulo}</h3>
                <p style={styles.cardProductDesc}>{b.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: '#FAFBFB',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '100vh',
    color: '#212529'
  },
  hero: {
    backgroundColor: '#cc1719',
    padding: '5rem 2rem',
    color: 'white',
    overflow: 'hidden'
  },
  heroInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4rem',
    flexWrap: 'wrap'
  },
  heroLeft: {
    flex: 1,
    minWidth: '300px'
  },
  heroRight: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    minWidth: '300px'
  },
  tarjetaIlustracion: {
    width: '340px',
    height: '210px',
    backgroundColor: '#850c0e',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    transform: 'rotate(-4deg) translateY(-10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#ffffff'
  },
  tarjetaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tarjetaMiniLogo: {
    backgroundColor: '#ffffff',
    color: '#cc1719',
    padding: '4px 10px',
    borderRadius: '6px',
    fontWeight: '900',
    fontSize: '14px'
  },
  tarjetaChip: {
    width: '42px',
    height: '32px',
    backgroundColor: '#f2c94c',
    borderRadius: '6px',
    marginTop: '15px',
    opacity: 0.85
  },
  tarjetaNumero: {
    fontSize: '18px',
    fontWeight: '600',
    letterSpacing: '2px',
    margin: '20px 0 10px 0',
    opacity: 0.95
  },
  tarjetaFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.9
  },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: '6px 14px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  heroTitle: {
    fontSize: '3.2rem',
    fontWeight: '800',
    margin: '1.5rem 0 1rem 0',
    lineHeight: '1.15',
    letterSpacing: '-1px'
  },
  heroSubtitle: {
    fontSize: '1.15rem',
    lineHeight: '1.6',
    opacity: '0.92',
    marginBottom: '2.5rem',
    fontWeight: '400'
  },
  flexGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  btnWhite: {
    backgroundColor: '#ffffff',
    color: '#cc1719',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  btnOutlineWhite: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '12px',
    border: '2px solid #ffffff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center'
  },
  sectionEstablecimientos: {
    backgroundColor: '#ffffff',
    padding: '3.5rem 0',
    borderBottom: '1px solid #edf0f2',
    textAlign: 'center'
  },
  establecimientosTitle: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: '2rem',
    letterSpacing: '-0.5px'
  },
  gridEstablecimientos: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'center',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  boxLogoEstablecimiento: {
    padding: '14px 28px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '130px',
    height: '50px',
    boxShadow: '0 3px 5px rgba(0,0,0,0.05)'
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '4rem',
    padding: '0 2rem',
    flexWrap: 'wrap'
  },
  tabButton: {
    padding: '10px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none'
  },
  section: {
    padding: '3rem 2rem 5rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionTitle: {
    color: '#1a1a1a',
    fontSize: '2rem',
    fontWeight: '800',
    letterSpacing: '-0.5px'
  },
  gridProducts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  cardProduct: {
    backgroundColor: '#ffffff',
    padding: '2.5rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
    border: '1px solid #edf0f2',
    display: 'flex',
    flexDirection: 'column'
  },
  iconContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    marginBottom: '1.5rem'
  },
  cardProductTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '0.6rem'
  },
  cardProductDesc: {
    color: '#555555',
    fontSize: '14px',
    lineHeight: '1.55',
    marginBottom: '1.5rem',
    flexGrow: 1
  },
  cardBadge: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#666666',
    borderTop: '1px solid #edf0f2',
    paddingTop: '12px'
  },
  promoBanner: {
    backgroundColor: '#101820',
    color: 'white',
    padding: '4rem 2rem',
    borderLeft: `6px solid ${ROJO_OH}`
  },
  promoInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem'
  },
  promoTag: {
    backgroundColor: ROJO_OH,
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  promoTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    margin: '1rem 0 0.5rem 0',
    letterSpacing: '-0.5px'
  },
  promoDesc: {
    opacity: '0.88',
    fontSize: '15px',
    lineHeight: '1.6',
    maxWidth: '750px'
  },
  btnWhitePromo: {
    backgroundColor: '#ffffff',
    color: '#101820',
    padding: '14px 24px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  gridBenefits: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2.5rem'
  },
  cardBenefit: {
    textAlign: 'center',
    padding: '1rem'
  },
  cardBenefitTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '0.6rem'
  }
};