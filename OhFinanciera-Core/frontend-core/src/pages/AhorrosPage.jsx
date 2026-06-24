import { useState } from 'react'
import { 
  PiggyBank, CalendarDays, Building2, 
  Wallet, TrendingUp, Info 
} from 'lucide-react'
import { useResumenAhorros } from '../hooks/useAhorros.js'
import { useAuth } from '../hooks/useAuth.js'
import GraficoTorta from '../components/ui/GraficoTorta.jsx'
import Loader from '../components/ui/Loader.jsx'
import { money, num } from '../utils/format.js'

const ROJO_OH = '#cc1719'
const NEGRO_OH = '#101820'
const GRIS_BORDE = '#e2e8f0'
const PERIODO_DEFAULT = '20251231'

export default function AhorrosPage() {
  const { user } = useAuth()
  const [codagencia, setCodagencia] = useState(user?.codagencia ?? '0001')
  const [periodomes, setPeriodomes] = useState(PERIODO_DEFAULT)

  const { resumen, loading, error } = useResumenAhorros(codagencia, periodomes)

  const totalSaldo = resumen.reduce((acc, r) => acc + Number(r.saldo_total || 0), 0)
  const totalCuentas = resumen.reduce((acc, r) => acc + Number(r.n_cuentas || 0), 0)
  
  const dataTorta = resumen.map((r) => ({
    name: r.tipo,
    value: Number(r.saldo_total || 0),
  }))

  return (
    <div style={styles.pageContainer}>
      
      {/* ── Header ── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.brandBadge}>
            <PiggyBank size={12} /> CAPTACIONES Y PASIVOS
          </div>
          <h1 style={styles.mainTitle}>Resumen de Ahorros por Agencia</h1>
        </div>
      </div>

      {/* ── Filtros ── */}
      <div style={styles.filterPanel}>
        <div style={styles.filterGroup}>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Agencia (Código)</label>
            <div style={styles.inputIconContainer}>
              <Building2 size={16} color="#64748b" style={{ marginLeft: '10px' }} />
              <input style={styles.input} type="number" value={codagencia} onChange={(e) => setCodagencia(e.target.value)} />
            </div>
          </div>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Fecha de Corte (AAAAMMDD)</label>
            <div style={styles.inputIconContainer}>
              <CalendarDays size={16} color="#64748b" style={{ marginLeft: '10px' }} />
              <input style={styles.input} type="text" value={periodomes} onChange={(e) => setPeriodomes(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {loading && <div style={styles.loaderArea}><Loader texto="Procesando saldos..." /></div>}
      {error && <div style={styles.alertError}>{error}</div>}

      {!loading && !error && resumen.length > 0 && (
        <>
          {/* ── KPIs Superiores ── */}
          <div style={styles.kpiGrid}>
            <div style={styles.kpiCard}>
              <span style={styles.kpiLabel}>SALDO TOTAL CAPTADO</span>
              <strong style={styles.kpiValue}>{money(totalSaldo)}</strong>
            </div>
            <div style={styles.kpiCard}>
              <span style={styles.kpiLabel}>TOTAL CUENTAS ACTIVAS</span>
              <strong style={styles.kpiValue}>{num(totalCuentas)}</strong>
            </div>
          </div>

          {/* ── Contenido Principal ── */}
          <div style={styles.mainGrid}>
            <div style={styles.tableCard}>
              <h3 style={styles.subTitle}><Wallet size={16} /> Desglose de Tipología</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th style={styles.th}>Tipo de Cuenta</th>
                    <th style={{...styles.th, textAlign: 'right'}}>N° Cuentas</th>
                    <th style={{...styles.th, textAlign: 'right'}}>Saldo Capital</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.map((r) => (
                    <tr key={r.tipo} style={styles.trBody}>
                      <td style={styles.td}>{r.tipo}</td>
                      <td style={{...styles.td, textAlign: 'right'}}>{num(r.n_cuentas)}</td>
                      <td style={{...styles.td, textAlign: 'right', fontWeight: '700'}}>{money(r.saldo_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={styles.tableCard}>
              <h3 style={styles.subTitle}><TrendingUp size={16} /> Distribución de Cartera</h3>
              <div style={styles.chartContainer}>
                <GraficoTorta data={dataTorta} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Estilos de Diseño ───
const styles = {
  pageContainer: { padding: '32px', backgroundColor: '#f6f8fa', minHeight: '100vh', fontFamily: '"Inter", sans-serif' },
  headerRow: { marginBottom: '24px' },
  brandBadge: { backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid ' + GRIS_BORDE },
  mainTitle: { fontSize: '24px', fontWeight: '800', color: NEGRO_OH, margin: '8px 0 0' },
  filterPanel: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid ' + GRIS_BORDE, display: 'flex', gap: '16px', marginBottom: '24px' },
  filterGroup: { display: 'flex', gap: '16px', width: '100%' },
  fieldWrapper: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  label: { fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' },
  inputIconContainer: { display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '10px', backgroundColor: '#f8fafc' },
  input: { border: 'none', backgroundColor: 'transparent', padding: '12px', width: '100%', fontSize: '14px', fontWeight: '600' },
  kpiGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' },
  kpiCard: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid ' + GRIS_BORDE, display: 'flex', flexDirection: 'column' },
  kpiLabel: { fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px' },
  kpiValue: { fontSize: '28px', fontWeight: '800', color: NEGRO_OH },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid ' + GRIS_BORDE, padding: '24px' },
  subTitle: { fontSize: '13px', fontWeight: '800', color: NEGRO_OH, textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { fontSize: '11px', color: '#64748b', fontWeight: '800', padding: '12px 8px', borderBottom: '2px solid #f1f5f9' },
  td: { fontSize: '13px', padding: '14px 8px', borderBottom: '1px solid #f1f5f9', color: NEGRO_OH },
  trBody: { transition: 'background 0.2s' },
  chartContainer: { height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loaderArea: { padding: '60px', textAlign: 'center' },
  alertError: { backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '16px', borderRadius: '12px', fontSize: '13px' }
}