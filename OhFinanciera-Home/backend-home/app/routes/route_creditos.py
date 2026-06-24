"""Router de créditos (solicitar). Exige get_cliente."""
from fastapi import APIRouter, Depends
from sqlalchemy.engine import Connection
from sqlalchemy import text

from app.controllers import ctrl_creditos
from app.core.cfg_auth import get_cliente
from app.core.cfg_database import get_db
from app.schemas.sch_creditos import SolicitudCreditoRequest, SolicitudCreditoResponse

router = APIRouter(prefix="/creditos", tags=["creditos"], dependencies=[Depends(get_cliente)])


@router.post("/solicitar", response_model=SolicitudCreditoResponse)
def solicitar(
    body: SolicitudCreditoRequest,
    conn: Connection = Depends(get_db),
    cliente: dict = Depends(get_cliente),
):
    return ctrl_creditos.solicitar(
        conn,
        cliente["pkcliente"],
        body.montosolicitud,
        body.plazo,
        body.codtipocredito,
        body.codactividadeconomica,
        body.montoingresoneto,
    )

@router.get("/mis-solicitudes")
def obtener_mis_solicitudes(
    conn: Connection = Depends(get_db),
    cliente: dict = Depends(get_cliente),
):
    # 1. Primero verificamos si el cliente ya cuenta con algún crédito activo desembolsado
    query_verificar_credito = """
        SELECT COUNT(*) FROM dcuentacredito WHERE pkcliente = :pkcliente;
    """
    tiene_credito = conn.execute(text(query_verificar_credito), {"pkcliente": cliente["pkcliente"]}).scalar()

    # 2. Consultamos sus solicitudes registradas
    query_solicitudes = """
        SELECT 
            codsolicitud, 
            fechasolicitudcredito, 
            montosolicitudcredito, 
            plazosolicitudcredito, 
            pksolicitudestado,
            destiposolicitud
        FROM dsolicitud
        WHERE pkcliente = :pkcliente
        ORDER BY pksolicitud DESC;
    """
    result = conn.execute(text(query_solicitudes), {"pkcliente": cliente["pkcliente"]}).fetchall()
    
    solicitudes_limpias = []
    for row in result:
        # Lógica de estados: si ya se le generó un producto activo en dcuentacredito,
        # forzamos visualmente el estado a 'Aprobado' para cerrar el flujo limpiamente.
        if tiene_credito and tiene_credito > 0:
            estado_texto = "Aprobado"
        else:
            estado_id = row.pksolicitudestado
            if estado_id in (5, 2):
                estado_texto = "Aprobado"
            elif estado_id in (6, 3):
                estado_texto = "Rechazado"
            else:
                estado_texto = "En Evaluación"

        solicitudes_limpias.append({
            "codsolicitud": row.codsolicitud,
            "fechasolicitud": str(row.fechasolicitudcredito),
            "montosolicitado": float(row.montosolicitudcredito or 0.0),
            "plazo": int(row.plazosolicitudcredito or 0),
            "estado": estado_texto
        })
        
    return solicitudes_limpias