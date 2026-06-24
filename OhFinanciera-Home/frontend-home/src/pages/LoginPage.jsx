import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { CreditCard, Fingerprint, Lock, LogIn, ArrowLeft } from 'lucide-react'
import { useHBAuth } from '../hooks/useHBAuth.js'
import { extractError } from '../utils/format.js'
import Alert from '../components/ui/Alert.jsx'
import Logo from '../components/ui/Logo.jsx'

const ROJO_OH = '#cc1719';

export default function LoginPage() {
  const { login, isAuthenticated } = useHBAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [tarjeta, setTarjeta] = useState(location.state?.tarjeta || '')
  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/inicio', { replace: true })
  }, [isAuthenticated, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!/^\d{8}$/.test(dni.trim())) {
      setError('Ingresa un DNI válido de 8 dígitos.')
      return
    }

    setLoading(true)
    try {
      await login(tarjeta.trim(), password)
      navigate('/inicio', { replace: true })
    } catch (err) {
      setError(extractError(err, 'No se pudo iniciar sesión.'))
    } finally {
      setLoading(false)
    }
  }

  // Estilos en línea integrados directamente para reemplazar las variables genéricas
  const localStyles = {
    bg: {
      backgroundColor: '#f4f6f7',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      backgroundColor: '#ffffff',
      width: '100%',
      maxWidth: '420px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      padding: '2.5rem 2rem',
      position: 'relative'
    },
    franja: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '5px',
      backgroundColor: ROJO_OH
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '6px',
      color: '#495057'
    },
    input: {
      width: '100%',
      height: '44px',
      padding: '0 12px 0 40px',
      borderRadius: '10px',
      border: '1px solid #ced4da',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s'
    },
    field: {
      marginBottom: '1.25rem'
    },
    btnSubmit: {
      width: '100%',
      height: '46px',
      backgroundColor: ROJO_OH,
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '1.5rem',
      boxShadow: '0 4px 12px rgba(204, 23, 25, 0.15)',
      opacity: loading ? 0.8 : 1
    },
    hint: {
      textAlign: 'center',
      backgroundColor: '#f8f9fa',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#6c757d',
      marginTop: '1.5rem',
      border: '1px dashed #e9ecef',
      lineHeight: '1.4'
    }
  }

  return (
    <div style={localStyles.bg}>
      <div style={localStyles.card}>
        <div style={localStyles.franja} />
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <Logo size={42} variant="dark" subtitle="BANCA POR INTERNET" />
        </div>
        
        <p style={{ textAlign: 'center', color: '#6c757d', fontSize: '13px', margin: '0 0 24px 0', lineHeight: '1.4' }}>
          Ingresa tus datos de forma segura para administrar tu Tarjeta oh!
        </p>

        <Alert tipo="error">{error}</Alert>

        <form onSubmit={onSubmit}>
          <div style={localStyles.field}>
            <label htmlFor="tarjeta" style={localStyles.label}>N° de Tarjeta oh! o Usuario</label>
            <div style={{ position: 'relative' }}>
              <CreditCard size={18} style={iconStyle} />
              <input
                id="tarjeta"
                style={localStyles.input}
                placeholder="Ej. cli000001"
                autoComplete="username"
                value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div style={localStyles.field}>
            <label htmlFor="dni" style={localStyles.label}>Documento de Identidad (DNI)</label>
            <div style={{ position: 'relative' }}>
              <Fingerprint size={18} style={iconStyle} />
              <input
                id="dni"
                style={localStyles.input}
                placeholder="8 dígitos del titular"
                inputMode="numeric"
                maxLength={8}
                autoComplete="off"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
          </div>

          <div style={localStyles.field}>
            <label htmlFor="password" style={localStyles.label}>Clave Digital de Internet</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={iconStyle} />
              <input
                id="password"
                type="password"
                style={localStyles.input}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" style={localStyles.btnSubmit} disabled={loading}>
            <LogIn size={18} />
            {loading ? 'Validando datos...' : 'Ingresar Seguro'}
          </button>
        </form>

        <div style={localStyles.hint}>
           <strong>Credenciales de Prueba:</strong><br />
          Usuario: <strong>cli000001</strong> · DNI: <strong>12345678</strong> · Clave: <strong>demo1234</strong>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6c757d', fontSize: '13px', textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Regresar a la Landing
          </Link>
        </div>
      </div>
    </div>
  )
}

const iconStyle = {
  position: 'absolute',
  left: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#a6aeb5',
  pointerEvents: 'none',
}