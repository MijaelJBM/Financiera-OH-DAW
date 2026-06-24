// Tarjeta blanca con borde redondeado moderno, sombra suave y tipografía amigable.
export default function Card({ title, icon, actions, children }) {
  
  const styles = {
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)',
      // 👇 Agregamos !important para romper cualquier estilo heredado de archivos CSS externos
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif !important', 
      letterSpacing: '-0.01em'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: children ? '16px' : '0px'
    },
    titleBox: {
      // 👇 También aseguramos el título aquí por si acaso
      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif !important',
      fontSize: '16.5px',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      letterSpacing: '-0.015em'
    },
    actionsBox: {
      display: 'flex',
      alignItems: 'center'
    }
  }

  return (
    <section style={styles.card}>
      {(title || actions) && (
        <div style={styles.header}>
          {title && (
            <h2 style={styles.titleBox}>
              {icon}
              {title}
            </h2>
          )}
          {actions && <div style={styles.actionsBox}>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}