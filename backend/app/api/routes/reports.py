from io import BytesIO

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.services.analytics import get_property_by_id
from app.services.pdf_service import build_property_pdf

router = APIRouter()


@router.get("/{property_id}/pdf")
def property_report(property_id: str) -> StreamingResponse:
    property_data = get_property_by_id(property_id)
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")

    pdf_bytes = build_property_pdf(property_data)
    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{property_id}-report.pdf"'},
    )
