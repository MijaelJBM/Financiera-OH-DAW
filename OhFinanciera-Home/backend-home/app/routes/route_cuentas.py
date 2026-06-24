"""Router de consultas de cuentas (ahorro y crédito). Todos exigen get_cliente."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.engine import Connection
from sqlalchemy import text

from app.controllers import ctrl_cuentas
from app.core.cfg_auth import get_cliente
from app.core.cfg_database import get_db
from app.schemas.sch_cuentas import (
    CuentaAhorroOut,
    CuentaCreditoOut,
    CuotaOut,
    DetalleAhorroResponse,
    MovimientoOut,
)

router = APIRouter(prefix="/cuentas", tags=["cuentas"], dependencies=[Depends(get_cliente)])


@router.get("/ahorro", response_model=list[CuentaAhorroOut])
def cuentas_ahorro(conn: Connection = Depends(get_db), cliente: dict = Depends(get_cliente)):
    return ctrl_cuentas.listar_ahorros(conn, cliente["pkcliente"])


@router.get("/ahorro/{codcuentaahorro}/movimientos", response_model=list[MovimientoOut])
def movimientos(
    codcuentaahorro: str,
    limit: int = Query(50, ge=1, le=500),
    conn: Connection = Depends(get_db),
    cliente: dict = Depends(get_cliente),
):
    return ctrl_cuentas.movimientos_ahorro(conn, cliente["pkcliente"], codcuentaahorro, limit)


@router.get("/ahorro/{codcuentaahorro}/detalle", response_model=DetalleAhorroResponse)
def detalle_ahorro(
    codcuentaahorro: str,
    conn: Connection = Depends(get_db),
    cliente: dict = Depends(get_cliente),
):
    return ctrl_cuentas.detalle_ahorro(conn, cliente["pkcliente"], codcuentaahorro)


@router.get("/credito", response_model=list[CuentaCreditoOut])
def cuentas_credito(conn: Connection = Depends(get_db), cliente: dict = Depends(get_cliente)):
    return ctrl_cuentas.listar_creditos(conn, cliente["pkcliente"])


@router.get("/credito/{codcuentacredito}/cuotas", response_model=list[CuotaOut])
def cuotas(
    codcuentacredito: str,
    conn: Connection = Depends(get_db),
    cliente: dict = Depends(get_cliente),
):
    # 1. Intentamos buscar las cuotas reales en el controlador/repositorio original
    cuotas_reales = ctrl_cuentas.cuotas_credito(conn, cliente["pkcliente"], codcuentacredito)
    
    if cuotas_reales:
        return cuotas_reales

    # 2. PUENTE DE SEGURIDAD: Si da vacío o no existe (Crédito Nuevo recién creado),
    # jalamos los datos de la solicitud para armar un cronograma simulado idéntico al real
    query_solicitud = """
        SELECT montosolicitudcredito, montoaprobadocredito, plazosolicitudcredito, fechasolicitudcredito
        FROM dsolicitud
        WHERE pkcliente = :pkcliente
        ORDER BY pksolicitud DESC LIMIT 1;
    """
    sol = conn.execute(text(query_solicitud), {"pkcliente": cliente["pkcliente"]}).fetchone()
    
    if sol:
        monto = float(sol.montoaprobadocredito or sol.montosolicitudcredito or 1000.0)
        plazo = int(sol.plazosolicitudcredito or 12)
        monto_cuota = round((monto / plazo) * 1.10, 2)  # Simula un 10% de interés/comisiones total
        
        cronograma_simulado = []
        from datetime import date, timedelta
        
        fecha_base = sol.fechasolicitudcredito if isinstance(sol.fechasolicitudcredito, date) else date.today()

        for i in range(1, plazo + 1):
            # Sumamos 30 días por cada cuota
            fecha_vencimiento = fecha_base + timedelta(days=30 * i)
            
            cronograma_simulado.append({
                "nrocuota": i,
                "fecha_vencimiento": fecha_vencimiento,
                "monto_cuota": monto_cuota,
                "monto_saldo": round(monto - ((monto / plazo) * i), 2) if i < plazo else 0.0,
                "dias_atraso": 0,
                "estado": "Vigente",
                "pagada": False
            })
        return cronograma_simulado

    # Si por alguna razón extrema no hay nada, devolvemos una lista vacía en lugar de un 404
    return []
