/**
 * Logo oficial de Tarjeta Oh! basado en la identidad real.
 */

export default function Logo({
  size = 44,
  wordmark = true,
  variant = 'dark',
  subtitle = 'FINANCIERA',
}) {
  const textColor = variant === 'light' ? '#ffffff' : '#1a1a1a';
  const subColor = variant === 'light' ? 'rgba(255,255,255,.75)' : '#666666';

  // Dimensiones proporcionales basadas en la imagen
  const width = Math.round(size * 1.4); // Es más ancho que alto (rectangular)
  const height = size;
  const nameSize = Math.round(size * 0.5);
  const subSize = Math.max(9, Math.round(size * 0.22));

  return (
    <span 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '12px',
        verticalAlign: 'middle',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* El rectángulo rojo redondeado con el texto "oh!" calado adentro */}
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: '#cc1719', // El rojo exacto de la tarjeta
          borderRadius: `${Math.round(size * 0.15)}px`, // Esquinas sutilmente redondeadas
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: '900',
          fontSize: `${Math.round(size * 0.55)}px`,
          letterSpacing: '-1px',
          paddingBottom: `${Math.round(size * 0.05)}px` // Ajuste menor para centrar el texto baja-vocal
        }}
      >
        oh!
      </div>

      {/* Texto complementario al lado del logo */}
      {wordmark && (
        <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.1 }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: `${nameSize}px`,
              color: textColor,
              letterSpacing: '-0.3px',
            }}
          >
            tarjeta <span style={{ color: '#cc1719' }}>oh!</span>
          </span>
          
          {subtitle && (
            <span
              style={{
                fontSize: `${subSize}px`,
                fontWeight: 700,
                color: subColor,
                letterSpacing: '1.5px',
                marginTop: '2px',
                textTransform: 'uppercase'
              }}
            >
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  )
}