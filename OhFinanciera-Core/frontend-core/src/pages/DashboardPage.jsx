import { useState, useMemo } from "react";
import { useDashboard, useDesembolsos } from "../hooks/useDashboard";
import { useAuth } from "../hooks/useAuth";
import { puede } from "../utils/permisos.js";
import KpiCard from "../components/ui/KpiCard.jsx";
import Semaforo from "../components/ui/Semaforo.jsx";
import GraficoBarras from "../components/ui/GraficoBarras.jsx";
import GraficoTorta from "../components/ui/GraficoTorta.jsx";
import GraficoLinea from "../components/ui/GraficoLinea.jsx";
import Loader from "../components/ui/Loader.jsx";
import MiCarteraDashboard from "./MiCarteraDashboard.jsx";
import { money, num, pct } from "../utils/format.js";
import {
  TrendingUp,
  ShieldAlert,
  Award,
  Layers,
  Calendar,
  Building,
  MapPin,
  User,
  ChevronRight,
} from "lucide-react";

const PERIODO_DEFAULT = "202512";
const ROJO_OH = "#cc1719";
const NEGRO_OH = "#101820";

function colorMora(r) {
  if (r > 10) return "#ef4444"; // Rojo vibrante UI
  if (r >= 5) return "#f59e0b"; // Ámbar
  return "#10b981"; // Esmeralda financiero
}

function DashboardInstitucional() {
  const { user } = useAuth();
  const [periodomes, setPeriodomes] = useState(PERIODO_DEFAULT);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [isFilterFocused, setIsFilterFocused] = useState(false);
  const [isMiniFilterFocused, setIsMiniFilterFocused] = useState(false);

  const { kpis, productividad, historico, loading, errores } = useDashboard(
    periodomes,
    user?.codagencia,
  );

  const verProductividad = puede(user?.rol, "ver_productividad");
  const [desemPeriodo, setDesemPeriodo] = useState("202506");
  const {
    desembolsos,
    loading: loadingDes,
    error: errorDes,
  } = useDesembolsos(desemPeriodo);

  const maxOfic = Math.max(
    1,
    ...(desembolsos?.por_oficina || []).map((o) => o.volumen),
  );
  const maxZona = Math.max(
    1,
    ...(desembolsos?.por_zona || []).map((z) => z.volumen),
  );

  const dataMora = kpis
    ? [
        {
          name: "Vigente",
          value: Number(kpis.cartera_vigente || 0),
          color: "#10b981",
        },
        {
          name: "Vencida",
          value: Number(kpis.cartera_vencida || 0),
          color: "#ef4444",
        },
      ]
    : [];

  const { moraPorPeriodo, colocPorPeriodo, moraPorTipo } = useMemo(() => {
    const porPeriodo = {};
    const colocPer = {};
    for (const r of historico) {
      const p = r.periodomes;
      if (!porPeriodo[p]) porPeriodo[p] = { suma: 0, n: 0 };
      porPeriodo[p].suma += Number(r.ratiomora_real || 0);
      porPeriodo[p].n += 1;
      if (!colocPer[p]) colocPer[p] = { periodomes: p, real: 0, meta: 0 };
      colocPer[p].real += Number(r.saldocolocaciones_real || 0);
      colocPer[p].meta += Number(r.saldocolocaciones_meta || 0);
    }
    const moraPorPeriodo = Object.keys(porPeriodo)
      .sort()
      .map((p) => ({
        periodomes: String(p),
        ratio: +(porPeriodo[p].suma / porPeriodo[p].n).toFixed(2),
      }));
    const colocPorPeriodo = Object.values(colocPer).sort((a, b) =>
      String(a.periodomes).localeCompare(String(b.periodomes)),
    );
    const periodos = Object.keys(porPeriodo).sort();
    const ultimo = periodos[periodos.length - 1];
    const moraPorTipo = historico
      .filter((r) => String(r.periodomes) === String(ultimo))
      .map((r) => ({
        tipo: r.codtipocredito,
        ratio: Number(r.ratiomora_real || 0),
      }))
      .sort((a, b) => b.ratio - a.ratio);
    return { moraPorPeriodo, colocPorPeriodo, moraPorTipo };
  }, [historico]);

  const maxMoraTipo = Math.max(10, ...moraPorTipo.map((m) => m.ratio));

  return (
    <div style={styles.dashboardContainer}>
      {/* ─── Encabezado de Alta Gama ─── */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.brandBadge}>
            <span style={styles.badgeDot} /> FINANCIERA OH! • PLATAFORMA CORE
          </div>
          <h1 style={styles.mainTitle}>Dashboard Institucional</h1>
          <p style={styles.mainSubtitle}>
            Consolidado estratégico de riesgo, contención de mora y salud de
            colocaciones.
          </p>
        </div>

        {/* Input de filtro totalmente rediseñado */}
        <div
          style={{
            ...styles.filterCard,
            ...(isFilterFocused ? styles.filterCardFocused : {}),
          }}
        >
          <div style={styles.filterIconBox}>
            <Calendar size={15} color={ROJO_OH} strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.filterLabel}>Período Fiscal</label>
            <input
              type="text"
              value={periodomes}
              onChange={(e) => setPeriodomes(e.target.value)}
              onFocus={() => setIsFilterFocused(true)}
              onBlur={() => setIsFilterFocused(false)}
              style={styles.filterInput}
              placeholder="AAAAMM"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div style={styles.centerCard}>
          <Loader texto="Sincronizando con el Core Bancario..." />
        </div>
      )}

      {!loading && (
        <>
          {/* ─── Bloque 1: Rediseño de KPIs ─── */}
          {kpis ? (
            <div style={styles.kpiGrid}>
              <div style={styles.customKpiCard}>
                <KpiCard
                  label="Cartera Total"
                  valor={money(kpis.cartera_total)}
                  icon={<Layers size={16} />}
                />
              </div>
              <div
                style={{
                  ...styles.customKpiCard,
                  borderLeft: "4px solid #10b981",
                }}
              >
                <KpiCard
                  label="Cartera Vigente"
                  valor={money(kpis.cartera_vigente)}
                  color="#10b981"
                />
              </div>
              <div
                style={{
                  ...styles.customKpiCard,
                  borderLeft: "4px solid #ef4444",
                }}
              >
                <KpiCard
                  label="Cartera Vencida"
                  valor={money(kpis.cartera_vencida)}
                  color="#ef4444"
                />
              </div>
              <div
                style={{
                  ...styles.customKpiCard,
                  borderLeft: "4px solid #f59e0b",
                }}
              >
                <KpiCard
                  label="Ratio Mora Global"
                  valor={pct(kpis.ratio_mora)}
                  color="#f59e0b"
                  icon={<ShieldAlert size={16} />}
                />
              </div>
              <div style={styles.customKpiCard}>
                <KpiCard
                  label="Créditos Activos"
                  valor={num(kpis.n_creditos_activos)}
                />
              </div>
              <div style={styles.customKpiCard}>
                <KpiCard
                  label="Clientes Deudores"
                  valor={num(kpis.n_clientes_deudores)}
                />
              </div>
            </div>
          ) : (
            errores.kpis && <div style={styles.errorAlert}>{errores.kpis}</div>
          )}

          {/* ─── Bloque 2: Gráficos de Gestión de Riesgo (Tarjetas Pulidas) ─── */}
          <div style={styles.chartsGrid}>
            <div style={styles.chartCard}>
              <div style={styles.chartHeaderContainer}>
                <h3 style={styles.chartTitle}>Composición de Cartera</h3>
                <p style={styles.chartSubtitle}>
                  Garantía líquida vs. Tramo vencido
                </p>
              </div>
              <div style={styles.chartWrapper}>
                {kpis ? (
                  <GraficoTorta data={dataMora} />
                ) : (
                  <p style={styles.noData}>Sin registros.</p>
                )}
              </div>
            </div>

            <div style={styles.chartCard}>
              <div style={styles.chartHeaderContainer}>
                <h3 style={styles.chartTitle}>Evolución del Ratio de Mora</h3>
                <p style={styles.chartSubtitle}>
                  Histórico mensual vs. Límite regulatorio SBS
                </p>
              </div>
              <div style={styles.chartWrapper}>
                {!errores.historico && (
                  <GraficoLinea
                    data={moraPorPeriodo}
                    xKey="periodomes"
                    yKey="ratio"
                    color={ROJO_OH}
                    refY={10}
                    refLabel="Límite 10%"
                    sufijo="%"
                  />
                )}
              </div>
            </div>
          </div>

          {/* ─── Bloque 3: Colocaciones y Barras Laterales con Micro-Estilos ─── */}
          <div style={styles.chartsGrid}>
            <div style={styles.chartCard}>
              <div style={styles.chartHeaderContainer}>
                <h3 style={styles.chartTitle}>Evolución de Colocaciones</h3>
                <p style={styles.chartSubtitle}>
                  Colocación real neta contra presupuesto corporativo
                </p>
              </div>
              <div style={styles.chartWrapper}>
                {!errores.historico && (
                  <GraficoBarras
                    data={colocPorPeriodo}
                    xKey="periodomes"
                    barras={[
                      { key: "real", label: "Real", color: ROJO_OH },
                      { key: "meta", label: "Meta", color: "#cbd5e1" },
                    ]}
                  />
                )}
              </div>
            </div>

            {/* AQUÍ CAMBIA EL DISEÑO RADICALMENTE: Lista de barras custom de lujo */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeaderContainer}>
                <h3 style={styles.chartTitle}>Mora por Tipo de Crédito</h3>
                <p style={styles.chartSubtitle}>
                  Identificación de desviaciones por sub-segmento
                </p>
              </div>
              <div style={styles.barListContainer}>
                {moraPorTipo.map((m) => (
                  <div style={styles.premiumBarRow} key={m.tipo}>
                    <div style={styles.barMetaInfo}>
                      <span style={styles.premiumBarLabel}>{m.tipo}</span>
                      <span
                        style={{
                          ...styles.premiumBarValue,
                          color: colorMora(m.ratio),
                        }}
                      >
                        {pct(m.ratio)}
                      </span>
                    </div>
                    <div style={styles.premiumTrack}>
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "6px",
                          transition:
                            "width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
                          width: `${Math.min((m.ratio / maxMoraTipo) * 100, 100)}%`,
                          background: `linear-gradient(90deg, ${colorMora(m.ratio)}cc, ${colorMora(m.ratio)})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Bloque 4: Sección Monitoreo de Desembolsos Modernizado ─── */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeaderRow}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <TrendingUp size={16} color={ROJO_OH} strokeWidth={3} />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "800",
                      color: NEGRO_OH,
                    }}
                  >
                    Monitoreo de Desembolsos
                  </h3>
                </div>
                <p style={styles.chartSubtitle}>
                  Flujo de colocación mensual y volumen acumulado anual.
                </p>
              </div>

              <div
                style={{
                  ...styles.miniFilter,
                  ...(isMiniFilterFocused ? styles.miniFilterFocused : {}),
                }}
              >
                <label style={styles.miniFilterLabel}>Mes Filtro</label>
                <input
                  type="text"
                  value={desemPeriodo}
                  onChange={(e) => setDesemPeriodo(e.target.value)}
                  onFocus={() => setIsMiniFilterFocused(true)}
                  onBlur={() => setIsMiniFilterFocused(false)}
                  style={styles.miniFilterInput}
                />
              </div>
            </div>

            {!loadingDes && !errorDes && desembolsos && (
              <>
                <div style={styles.kpiSubGrid}>
                  <div style={styles.subKpiItem}>
                    <span style={styles.subKpiLabel}>Volumen Mes</span>
                    <span style={{ ...styles.subKpiValue, color: ROJO_OH }}>
                      {money(desembolsos.mes.volumen)}
                    </span>
                  </div>
                  <div style={styles.subKpiItem}>
                    <span style={styles.subKpiLabel}>Operaciones</span>
                    <span style={styles.subKpiValue}>
                      {num(desembolsos.mes.n_creditos)}
                    </span>
                  </div>
                  <div style={styles.subKpiItem}>
                    <span style={styles.subKpiLabel}>Ticket Promedio</span>
                    <span style={{ ...styles.subKpiValue, color: NEGRO_OH }}>
                      {money(desembolsos.mes.ticket_promedio)}
                    </span>
                  </div>
                  <div style={{ ...styles.subKpiItem, background: "#f0fdf4" }}>
                    <span style={{ ...styles.subKpiLabel, color: "#166534" }}>
                      Acumulado {desembolsos.anio}
                    </span>
                    <span style={{ ...styles.subKpiValue, color: "#15803d" }}>
                      {money(desembolsos.anual.volumen)}
                    </span>
                  </div>
                </div>

                {/* Grid de distribución interna con tarjetas flotantes */}
                <div style={styles.distributionGrid}>
                  <div style={styles.distributionBox}>
                    <div style={styles.subGridTitle}>
                      <Building size={14} /> Distribución por Agencia / Oficina
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "14px",
                      }}
                    >
                      {desembolsos.por_oficina.map((o) => (
                        <div key={o.codagencia} style={styles.dataStrip}>
                          <span style={styles.stripLabel}>{o.desagencia}</span>
                          <div style={styles.stripTrack}>
                            <div
                              style={{
                                height: "100%",
                                borderRadius: "4px",
                                width: `${(o.volumen / maxOfic) * 100}%`,
                                background: ROJO_OH,
                              }}
                            />
                          </div>
                          <span style={styles.stripValue}>
                            {money(o.volumen)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={styles.distributionBox}>
                    <div style={styles.subGridTitle}>
                      <MapPin size={14} /> Distribución por Región / Zona
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "14px",
                      }}
                    >
                      {desembolsos.por_zona.map((z) => (
                        <div key={z.codzonacomercial} style={styles.dataStrip}>
                          <span style={styles.stripLabel}>
                            {z.deszonacomercial}
                          </span>
                          <div style={styles.stripTrack}>
                            <div
                              style={{
                                height: "100%",
                                borderRadius: "4px",
                                width: `${(z.volumen / maxZona) * 100}%`,
                                background: NEGRO_OH,
                              }}
                            />
                          </div>
                          <span style={styles.stripValue}>
                            {money(z.volumen)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ─── Bloque 5: Tabla de Asesores tipo Intranet de Inversiones ─── */}
          {verProductividad && (
            <div style={styles.sectionCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: "20px",
                }}
              >
                <Award size={16} color={ROJO_OH} strokeWidth={2.5} />
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "800",
                    color: NEGRO_OH,
                  }}
                >
                  Ranking de Productividad Comercial
                </h3>
              </div>

              <div style={styles.tableResponsive}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Asesor</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>
                        Saldo Real
                      </th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Meta</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>
                        % Cumplimiento
                      </th>
                      <th style={{ ...styles.th, textAlign: "center" }}>
                        Semaforización
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productividad.map((p) => {
                      const isHovered = hoveredRow === p.codasesor;
                      return (
                        <tr
                          key={p.codasesor}
                          onMouseEnter={() => setHoveredRow(p.codasesor)}
                          onMouseLeave={() => setHoveredRow(null)}
                          style={{
                            ...styles.tr,
                            backgroundColor: isHovered
                              ? "#f8fafc"
                              : "transparent",
                          }}
                        >
                          <td style={styles.td}>
                            <div style={styles.userCell}>
                              <div style={styles.avatarIcon}>
                                <User size={13} color="#64748b" />
                              </div>
                              <span style={styles.userNameText}>
                                {p.nomasesor}
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              ...styles.td,
                              textAlign: "right",
                              fontWeight: "700",
                              color: NEGRO_OH,
                            }}
                          >
                            {money(p.saldo_real)}
                          </td>
                          <td
                            style={{
                              ...styles.td,
                              textAlign: "right",
                              color: "#94a3b8",
                            }}
                          >
                            {money(p.saldo_meta)}
                          </td>
                          <td style={{ ...styles.td, textAlign: "right" }}>
                            <span
                              style={{
                                ...styles.tableBadge,
                                backgroundColor:
                                  p.cumplimiento_pct >= 100
                                    ? "#e6f4ea"
                                    : "#fce8e6",
                                color:
                                  p.cumplimiento_pct >= 100
                                    ? "#137333"
                                    : "#c5221f",
                              }}
                            >
                              {pct(p.cumplimiento_pct)}
                            </span>
                          </td>
                          <td style={{ ...styles.td, textAlign: "center" }}>
                            <div
                              style={{
                                display: "inline-flex",
                                transform: "scale(1.1)",
                              }}
                            >
                              <Semaforo estado={p.semaforo} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  return puede(user?.rol, "ver_dashboard_institucional") ? (
    <DashboardInstitucional />
  ) : (
    <MiCarteraDashboard />
  );
}

// ─── Estilos Avanzados de Interfaz SaaS de Finanzas ───
const styles = {
  dashboardContainer: {
    padding: "32px",
    backgroundColor: "#f6f8fa", // Gris de fondo premium
    minHeight: "100vh",
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    boxSizing: "border-box",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
    marginBottom: "32px",
  },
  brandBadge: {
    backgroundColor: "#ffffff",
    color: "#475569",
    padding: "6px 14px",
    borderRadius: "100px",
    fontSize: "11px",
    fontWeight: "700",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    letterSpacing: "0.5px",
    marginBottom: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
  },
  badgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: ROJO_OH,
  },
  mainTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: NEGRO_OH,
    margin: 0,
    letterSpacing: "-0.8px",
  },
  mainSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: "6px 0 0 0",
    fontWeight: "400",
  },
  filterCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "10px 18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow: "0 4px 12px rgba(16,24,32,0.02)",
    minWidth: "250px",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  filterCardFocused: {
    borderColor: NEGRO_OH,
    boxShadow: `0 0 0 4px rgba(16,24,32,0.06)`,
  },
  filterIconBox: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #f1f5f9",
  },
  filterLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  filterInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    fontWeight: "700",
    color: NEGRO_OH,
    width: "100%",
    padding: "2px 0 0 0",
    backgroundColor: "transparent",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "18px",
    marginBottom: "32px",
  },
  customKpiCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "6px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 15px -3px rgba(16,24,32,0.02)",
    display: "flex",
    flexDirection: "column",
  },
  chartHeaderContainer: {
    paddingBottom: "16px",
    marginBottom: "8px",
  },
  chartTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "800",
    color: NEGRO_OH,
    letterSpacing: "-0.3px",
  },
  chartSubtitle: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#64748b",
  },
  chartWrapper: {
    flex: 1,
    minHeight: "260px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  barListContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "16px",
    flex: 1,
    justifyContent: "center",
  },
  premiumBarRow: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  barMetaInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  premiumBarLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#334155",
  },
  premiumBarValue: {
    fontSize: "13px",
    fontWeight: "800",
    fontVariantNumeric: "tabular-nums",
  },
  premiumTrack: {
    height: "10px",
    backgroundColor: "#f1f5f9",
    borderRadius: "6px",
    overflow: "hidden",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid #e2e8f0",
    marginBottom: "32px",
    boxShadow: "0 10px 15px -3px rgba(16,24,32,0.02)",
  },
  sectionHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "24px",
  },
  kpiSubGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
    margin: "24px 0",
  },
  subKpiItem: {
    backgroundColor: "#f8fafc",
    padding: "16px 20px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  subKpiLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
  },
  subKpiValue: {
    fontSize: "20px",
    fontWeight: "800",
    color: NEGRO_OH,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.5px",
  },
  distributionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "24px",
  },
  distributionBox: {
    border: "1px solid #f1f5f9",
    padding: "20px",
    borderRadius: "16px",
    backgroundColor: "#fafafa",
  },
  subGridTitle: {
    fontSize: "13px",
    fontWeight: "800",
    color: NEGRO_OH,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  dataStrip: {
    display: "grid",
    gridTemplateColumns: "130px 1fr 90px",
    alignItems: "center",
    gap: "16px",
  },
  stripLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#475569",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  stripTrack: {
    height: "6px",
    backgroundColor: "#e2e8f0",
    borderRadius: "4px",
    overflow: "hidden",
  },
  stripValue: {
    fontSize: "12px",
    fontWeight: "700",
    color: NEGRO_OH,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
  miniFilter: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "6px 14px",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.15s ease",
  },
  miniFilterFocused: {
    borderColor: ROJO_OH,
    backgroundColor: "#ffffff",
  },
  miniFilterLabel: {
    fontSize: "9px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  miniFilterInput: {
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "13px",
    fontWeight: "700",
    color: NEGRO_OH,
    width: "80px",
  },
  tableResponsive: {
    width: "100%",
    overflowX: "auto",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#ffffff",
  },
  th: {
    backgroundColor: "#f8fafc",
    color: "#64748b",
    fontWeight: "700",
    padding: "16px 20px",
    textAlign: "left",
    borderBottom: "2px solid #e2e8f0",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  td: {
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
    color: "#475569",
    fontSize: "13px",
  },
  tr: {
    transition: "background-color 0.15s ease",
  },
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatarIcon: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userNameText: {
    fontWeight: "700",
    color: NEGRO_OH,
  },
  tableBadge: {
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
  },
  centerCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "60px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },
};
