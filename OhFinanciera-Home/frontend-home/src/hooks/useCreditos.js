import { useState, useEffect } from 'react'
import hbApi from '../services/hb_api.js'

// Hook para listar los créditos (el que usa el Home)
export function useCreditos() {
  const [creditos, setCreditos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargarCreditos() {
      try {
        const { data } = await hbApi.get('/cuentas/credito')
        setCreditos(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    cargarCreditos()
  }, [])

  return { creditos, loading, error }
}

// !!! AGREGA ESTE HOOK AQUÍ ABAJO PARA CORREGIR EL ERROR DE EXPORTACIÓN !!!
export function useCuotas(codcuentacredito) {
  const [cuotas, setCuotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!codcuentacredito) return

    async function cargarCuotas() {
      try {
        setLoading(true)
        const { data } = await hbApi.get(`/cuentas/credito/${codcuentacredito}/cuotas`)
        setCuotas(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    cargarCuotas()
  }, [codcuentacredito])

  return { cuotas, loading, error }
}