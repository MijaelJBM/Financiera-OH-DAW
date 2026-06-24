/**
 * Logo oficial de Tarjeta Oh! basado en el plástico real.
 * Renderiza el rectángulo redondeado de la tarjeta con el texto "oh!" calado.
 */
export default function Logo({
  size = 44,
  wordmark = true,
  variant = 'dark',
  subtitle = 'FINANCIERA',
}) {
  const textColor = variant === 'light' ? '#ffffff' : '#101820'; // El negro premium del sistema
  const subColor = variant === 'light' ? 'rgba(255,255,255,.75)' : '#64748b';

  // Dimensiones proporcionales perfectas simulando la tarjeta de crédito real
  const width = Math.round(size * 1.4); // Relación rectangular aspecto tarjeta
  const height = size;
  const nameSize = Math.round(size * 0.48);
  const subSize = Math.max(9, Math.round(size * 0.22));

  return (
    <span 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '12px',
        verticalAlign: 'middle',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        WebkitFontSmoothing: 'antialiased'
      }}
    >
      {/* ─── El Rectángulo de la Tarjeta Oh! ─── */}
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: '#cc1719', // Rojo oficial oh!
          borderRadius: `${Math.round(size * 0.16)}px`, // Curvatura suave imitando el plástico
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: '950', // Ultra negrita para simular la tipografía nativa de la marca
          fontSize: `${Math.round(size * 0.52)}px`,
          letterSpacing: '-0.5px',
          boxShadow: '0 2px 4px rgba(204, 23, 25, 0.12)', // Sutil relieve de tarjeta
          paddingBottom: `${Math.round(size * 0.02)}px`,
          userSelect: 'none'
        }}
      >
        oh!
      </div>

      {/* ─── Bloque de Texto Corporativo ─── */}
      {wordmark && (
        <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.05 }}>
          <span
            style={{
              fontWeight: '400',
              fontSize: `${nameSize}px`,
              color: textColor,
              letterSpacing: '-0.3px',
            }}
          >
            tarjeta <span style={{ fontWeight: '950', color: '#cc1719' }}>oh!</span>
          </span>
          
          {subtitle && (
            <span
              style={{
                fontSize: `${subSize}px`,
                fontWeight: '800',
                color: subColor,
                letterSpacing: '1.5px',
                marginTop: '2px',
                textTransform: 'uppercase',
                opacity: 0.9
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