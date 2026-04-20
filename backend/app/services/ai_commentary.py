import json
from typing import Any
from urllib import error, request

from app.core.config import get_settings


GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


def build_fallback_commentary(property_data: dict[str, Any]) -> str:
    score = float(property_data["ai_investment_score"])
    overpricing = float(property_data["overpricing_percent"])
    rental_yield = float(property_data["rental_yield"])
    appreciation = float(property_data["annual_appreciation"])
    verification_note = "Verified project credentials improve execution confidence." if property_data["verified"] else ""

    value_note = (
        "The current ask looks meaningfully above our modeled fair-value band, so negotiation discipline matters."
        if overpricing > 6
        else "The asking price sits near or inside our modeled fair-value band, which supports a cleaner entry."
    )

    score_note = (
        "The overall signal is strong for medium-term investors."
        if score >= 82
        else "The fundamentals are balanced, but this looks more selective than obvious."
    )

    income_note = (
        "Rental yield is supportive for income-led buyers."
        if rental_yield >= 3.2
        else "This looks better suited to appreciation-led buyers than pure yield seekers."
    )

    return " ".join(
        note
        for note in [
            f"{property_data['title']} in {property_data['locality']}, {property_data['city']} carries an AI score of {score:.1f}/100.",
            value_note,
            f"Expected annual appreciation is {appreciation:.1f}% and modeled rental yield is {rental_yield:.1f}%.",
            score_note,
            income_note,
            verification_note,
        ]
        if note
    )


def build_prompt(property_data: dict[str, Any]) -> str:
    return (
        "Write a concise real-estate investment commentary in 3-4 sentences. "
        "Keep it practical, balanced, and specific. Do not use bullet points. "
        "Mention upside, risk, and who the property may suit.\n\n"
        f"Title: {property_data['title']}\n"
        f"City: {property_data['city']}\n"
        f"Locality: {property_data['locality']}\n"
        f"Property type: {property_data['property_type']}\n"
        f"Configuration: {property_data['bhk']} BHK\n"
        f"Price: INR {property_data['price']}\n"
        f"AI investment score: {property_data['ai_investment_score']}/100\n"
        f"Predicted fair price: INR {property_data['predicted_price']}\n"
        f"Fair range: INR {property_data['predicted_price_low']} to INR {property_data['predicted_price_high']}\n"
        f"Overpricing percent: {property_data['overpricing_percent']}%\n"
        f"Rental yield: {property_data['rental_yield']}%\n"
        f"Annual appreciation: {property_data['annual_appreciation']}%\n"
        f"Verified: {property_data['verified']}\n"
        f"Amenities: {', '.join(property_data['amenities'])}\n"
        f"Highlights: {', '.join(property_data['highlights'])}"
    )


def generate_property_commentary(property_data: dict[str, Any]) -> dict[str, Any]:
    settings = get_settings()
    fallback_commentary = build_fallback_commentary(property_data)

    if not settings.groq_api_key:
        return {
            "commentary": fallback_commentary,
            "model": None,
            "property_id": property_data["id"],
            "provider": "local-fallback",
        }

    payload = {
        "messages": [
            {
                "content": "You are a careful Indian real-estate analyst writing short investment notes for a property platform.",
                "role": "system",
            },
            {
                "content": build_prompt(property_data),
                "role": "user",
            },
        ],
        "model": settings.groq_model,
        "temperature": 0.4,
    }
    req = request.Request(
        GROQ_API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {settings.groq_api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=15) as response:
            body = json.loads(response.read().decode("utf-8"))
            commentary = (
                body.get("choices", [{}])[0]
                .get("message", {})
                .get("content", "")
                .strip()
            )

            if not commentary:
                raise ValueError("Groq response did not include commentary")

            return {
                "commentary": commentary,
                "model": settings.groq_model,
                "property_id": property_data["id"],
                "provider": "groq",
            }
    except (error.URLError, TimeoutError, ValueError, json.JSONDecodeError):
        return {
            "commentary": fallback_commentary,
            "model": settings.groq_model,
            "property_id": property_data["id"],
            "provider": "local-fallback",
        }
