from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def build_property_pdf(property_data: dict) -> bytes:
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    pdf.setTitle(f"{property_data['title']} Report")
    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawString(48, height - 60, property_data["title"])
    pdf.setFont("Helvetica", 12)
    pdf.drawString(48, height - 84, f"{property_data['locality']}, {property_data['city']}")
    pdf.drawString(48, height - 104, f"Guide price: INR {property_data['price']:,}")
    pdf.drawString(48, height - 124, f"AI investment score: {property_data['ai_investment_score']}/100")
    pdf.drawString(48, height - 144, f"Predicted price: INR {property_data['predicted_price']:,}")
    pdf.drawString(48, height - 164, f"Overpricing signal: {property_data['overpricing_percent']}%")
    pdf.drawString(48, height - 184, f"Rental yield: {property_data['rental_yield']}%")
    pdf.drawString(48, height - 214, "Highlights")
    y = height - 236
    for highlight in property_data["highlights"]:
        pdf.drawString(60, y, f"- {highlight}")
        y -= 18
    pdf.drawString(48, y - 8, "AI commentary")
    text = pdf.beginText(48, y - 30)
    text.textLines(
        property_data["description"]
        + " This report blends city benchmarks, configuration factors, and local comparables to estimate fair value."
    )
    pdf.drawText(text)
    pdf.showPage()
    pdf.save()
    return buffer.getvalue()
