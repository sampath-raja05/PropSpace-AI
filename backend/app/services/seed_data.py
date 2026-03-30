from collections.abc import Iterable

GALLERY_SETS = {
    "metro": [
        "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1741927378831-e51b54d27a02?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "urban": [
        "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1741927378831-e51b54d27a02?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "villa": [
        "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1760067537204-fe9b55b2f1b0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "coastal": [
        "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1760067537204-fe9b55b2f1b0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "plot": [
        "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "commercial": [
        "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1741927378831-e51b54d27a02?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "heritage": [
        "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1741927378831-e51b54d27a02?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
}

RELATABLE_IMAGE_STORIES = {
    "penthouse": [
        "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1741927378831-e51b54d27a02?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1738168251394-3250247c1455?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "urbanApartment": [
        "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1742490382029-98357c08f3cd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1738168251394-3250247c1455?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "familyApartment": [
        "https://images.unsplash.com/photo-1738168251394-3250247c1455?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1742490382029-98357c08f3cd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "growthApartment": [
        "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1741927378831-e51b54d27a02?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1742490382029-98357c08f3cd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "coastalApartment": [
        "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1742490382029-98357c08f3cd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "urbanVilla": [
        "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1760067537204-fe9b55b2f1b0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "waterfrontVilla": [
        "https://images.unsplash.com/photo-1760067537204-fe9b55b2f1b0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "familyVilla": [
        "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1760067537204-fe9b55b2f1b0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "plottedDevelopment": [
        "https://images.unsplash.com/photo-1684918061493-a3365486987f?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "commercialCore": [
        "https://images.unsplash.com/photo-1758862527435-1b623cbd4206?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1770425616829-61d6912705ad?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1770816307800-72ba937620fe?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
    "commercialPrime": [
        "https://images.unsplash.com/photo-1758862527435-1b623cbd4206?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1770816307800-72ba937620fe?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
        "https://images.unsplash.com/photo-1770425616829-61d6912705ad?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    ],
}

PROPERTY_IMAGE_STORYLINES = {
    "mumbai-worli-sky-residences": "penthouse",
    "mumbai-powai-lakefront-boulevard": "coastalApartment",
    "bangalore-whitefield-orbit-heights": "growthApartment",
    "bangalore-koramangala-courtyard-villas": "urbanVilla",
    "delhi-dwarka-signature-greens": "familyApartment",
    "delhi-vasant-kunj-capital-square": "commercialPrime",
    "hyderabad-gachibowli-verde-homes": "growthApartment",
    "hyderabad-jubilee-hills-celeste-villas": "urbanVilla",
    "chennai-omr-tidal-park-residences": "coastalApartment",
    "chennai-adyar-marina-plot-estate": "plottedDevelopment",
    "coimbatore-rs-puram-lotus-enclave": "familyApartment",
    "coimbatore-saravanampatti-cedar-villas": "familyVilla",
    "kochi-kakkanad-harbor-views": "coastalApartment",
    "kochi-marine-drive-bay-villas": "waterfrontVilla",
    "jaipur-jagatpura-rose-terraces": "familyApartment",
    "jaipur-vaishali-nagar-craft-plots": "plottedDevelopment",
    "lucknow-gomti-nagar-riverlight": "growthApartment",
    "lucknow-shaheed-path-meadow-villas": "familyVilla",
    "chandigarh-new-city-crescent-heights": "urbanApartment",
    "chandigarh-sector-5-atrium-square": "commercialPrime",
    "salem-fairlands-oak-residences": "urbanApartment",
    "salem-yercaud-foothills-orchard-plots": "plottedDevelopment",
    "madurai-kk-nagar-temple-view": "familyApartment",
    "madurai-iyer-bungalow-sandal-villas": "familyVilla",
    "mysore-vijayanagar-saffron-hill": "urbanApartment",
    "mysore-hebbal-lake-garden-villas": "waterfrontVilla",
    "nagpur-dharampeth-golden-avenue": "urbanApartment",
    "nagpur-mihan-axis-workspaces": "commercialCore",
    "indore-super-corridor-aero-heights": "growthApartment",
    "indore-vijay-nagar-canvas-villas": "urbanVilla",
}


def optimize_gallery_image(url: str) -> str:
    if "images.unsplash.com" not in url:
        return url

    base_url, _, query_string = url.partition("?")
    params: dict[str, str] = {}

    if query_string:
        for item in query_string.split("&"):
            if not item or "=" not in item:
                continue
            key, value = item.split("=", 1)
            params[key] = value

    params["auto"] = "format"
    params["fit"] = "crop"
    params["fm"] = "webp"
    params["q"] = "72"
    params["w"] = "1280"

    optimized_query = "&".join(f"{key}={value}" for key, value in params.items())
    return f"{base_url}?{optimized_query}"


def resolve_property_images(property_id: str, fallback_images: list[str]) -> list[str]:
    storyline = PROPERTY_IMAGE_STORYLINES.get(property_id)
    source_images = RELATABLE_IMAGE_STORIES.get(storyline, fallback_images) if storyline else fallback_images

    return list(dict.fromkeys(optimize_gallery_image(image) for image in source_images))

CITY_BLUEPRINTS = [
    {
        "city": "Mumbai",
        "state": "Maharashtra",
        "tier": 1,
        "listings": [
            {"id": "mumbai-worli-sky-residences", "title": "Worli Sky Residences", "locality": "Worli Sea Face", "latitude": 19.0176, "longitude": 72.8174, "address": "Dr Annie Besant Road, Worli Sea Face, Mumbai", "price": 38500000, "bhk": 3, "baths": 3, "sqft": 1720, "property_type": "apartment", "furnishing": "fully furnished", "possession": "ready", "verified": True, "builder_name": "BlueArc Habitat", "launch_year": 2021, "possession_date_label": "Ready to move", "amenities": ["pool", "gym", "security", "parking", "coworking", "ev-charging"], "gallery": "metro", "hero_tag": "Sea-facing premium tower", "description": "A refined Worli address with expansive glazing, skyline views, and hospitality-grade amenities for urban professionals.", "highlights": ["Panoramic sea views", "Private lounge floor", "Quick access to BKC"]},
            {"id": "mumbai-powai-lakefront-boulevard", "title": "Powai Lakefront Boulevard", "locality": "Powai", "latitude": 19.1176, "longitude": 72.906, "address": "Lake Boulevard Street, Powai, Mumbai", "price": 24800000, "bhk": 2, "baths": 2, "sqft": 1180, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "ready", "verified": True, "builder_name": "Northline Realty", "launch_year": 2020, "possession_date_label": "Ready to move", "amenities": ["clubhouse", "pool", "gym", "security", "parking", "garden"], "gallery": "urban", "hero_tag": "Lake district living", "description": "A polished lake-side apartment with social workspaces and strong rental demand from nearby tech hubs.", "highlights": ["Walkable to Hiranandani district", "High tenant absorption", "Lake-edge jogging trail"]},
        ],
    },
    {
        "city": "Bangalore",
        "state": "Karnataka",
        "tier": 1,
        "listings": [
            {"id": "bangalore-whitefield-orbit-heights", "title": "Orbit Heights", "locality": "Whitefield", "latitude": 12.9698, "longitude": 77.75, "address": "ECC Road, Whitefield, Bangalore", "price": 19500000, "bhk": 3, "baths": 3, "sqft": 1640, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "under construction", "verified": True, "builder_name": "Crestline Projects", "launch_year": 2023, "possession_date_label": "Dec 2027", "amenities": ["clubhouse", "pool", "gym", "security", "parking", "coworking", "play-area"], "gallery": "metro", "hero_tag": "Tech corridor address", "description": "A Whitefield community combining work-from-home layouts, wellness spaces, and future metro connectivity.", "highlights": ["Near ITPL and metro", "Large study alcove", "Investor-friendly micro market"]},
            {"id": "bangalore-koramangala-courtyard-villas", "title": "Koramangala Courtyard Villas", "locality": "Koramangala", "latitude": 12.9352, "longitude": 77.6245, "address": "80 Feet Road, Koramangala, Bangalore", "price": 48200000, "bhk": 4, "baths": 4, "sqft": 3240, "property_type": "villa", "furnishing": "fully furnished", "possession": "ready", "verified": True, "builder_name": "Garden Grid Estates", "launch_year": 2022, "possession_date_label": "Ready to move", "amenities": ["garden", "pool", "gym", "security", "parking", "terrace", "ev-charging"], "gallery": "villa", "hero_tag": "Private urban villa enclave", "description": "A boutique villa community with landscaped courtyards, rooftop entertaining spaces, and startup-district access.", "highlights": ["Low-density gated enclave", "Private terrace deck", "Premium rental upside"]},
        ],
    },
    {
        "city": "Delhi",
        "state": "Delhi",
        "tier": 1,
        "listings": [
            {"id": "delhi-dwarka-signature-greens", "title": "Signature Greens", "locality": "Dwarka Sector 19", "latitude": 28.5837, "longitude": 77.0572, "address": "Sector 19B, Dwarka, Delhi", "price": 23100000, "bhk": 3, "baths": 3, "sqft": 1780, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "ready", "verified": True, "builder_name": "Aravali Landmark", "launch_year": 2021, "possession_date_label": "Ready to move", "amenities": ["clubhouse", "gym", "security", "parking", "garden", "play-area"], "gallery": "heritage", "hero_tag": "Balanced family living", "description": "A bright Dwarka apartment with green podium gardens, broad balconies, and quick airport access.", "highlights": ["Close to airport corridor", "Large family-sized floor plan", "School cluster nearby"]},
            {"id": "delhi-vasant-kunj-capital-square", "title": "Capital Square Offices", "locality": "Vasant Kunj", "latitude": 28.5245, "longitude": 77.1587, "address": "Nelson Mandela Marg, Vasant Kunj, Delhi", "price": 36200000, "bhk": 0, "baths": 2, "sqft": 2240, "property_type": "commercial", "furnishing": "fully furnished", "possession": "ready", "verified": True, "builder_name": "Square Mile Infra", "launch_year": 2019, "possession_date_label": "Ready to lease", "amenities": ["security", "parking", "coworking", "ev-charging", "terrace"], "gallery": "commercial", "hero_tag": "Institutional-grade office asset", "description": "A premium commercial suite with strong frontage, flexible floor plates, and reliable leasing traction.", "highlights": ["High-visibility address", "Stable commercial micro-market", "Plug-and-play interiors"]},
        ],
    },
    {
        "city": "Hyderabad",
        "state": "Telangana",
        "tier": 1,
        "listings": [
            {"id": "hyderabad-gachibowli-verde-homes", "title": "Verde Homes", "locality": "Gachibowli", "latitude": 17.4401, "longitude": 78.3489, "address": "Financial District Road, Gachibowli, Hyderabad", "price": 17600000, "bhk": 3, "baths": 3, "sqft": 1690, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "under construction", "verified": True, "builder_name": "Sunward Constructions", "launch_year": 2024, "possession_date_label": "Jun 2028", "amenities": ["clubhouse", "pool", "gym", "security", "parking", "coworking", "garden"], "gallery": "metro", "hero_tag": "Financial district growth story", "description": "A future-ready apartment community curated for IT professionals seeking spacious layouts and quiet work zones.", "highlights": ["Strong appreciation corridor", "Amenity-rich clubhouse", "Metro expansion upside"]},
            {"id": "hyderabad-jubilee-hills-celeste-villas", "title": "Celeste Hills Villas", "locality": "Jubilee Hills", "latitude": 17.4239, "longitude": 78.4126, "address": "Road No. 45, Jubilee Hills, Hyderabad", "price": 52800000, "bhk": 5, "baths": 5, "sqft": 3920, "property_type": "villa", "furnishing": "fully furnished", "possession": "ready", "verified": True, "builder_name": "Velvet Stone Homes", "launch_year": 2022, "possession_date_label": "Ready to move", "amenities": ["pool", "gym", "security", "parking", "garden", "terrace", "ev-charging"], "gallery": "villa", "hero_tag": "Ultra-prime hillside villa", "description": "An expansive villa with private garden courts, entertainment decks, and polished interiors in Jubilee Hills.", "highlights": ["Prestige residential district", "Private plunge pool", "Rare low-supply asset class"]},
        ],
    },
    {
        "city": "Chennai",
        "state": "Tamil Nadu",
        "tier": 1,
        "listings": [
            {"id": "chennai-omr-tidal-park-residences", "title": "Tidal Park Residences", "locality": "OMR", "latitude": 12.9172, "longitude": 80.2293, "address": "Rajiv Gandhi Salai, OMR, Chennai", "price": 14800000, "bhk": 3, "baths": 3, "sqft": 1540, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "new launch", "verified": True, "builder_name": "East Coast Developers", "launch_year": 2025, "possession_date_label": "Sep 2029", "amenities": ["clubhouse", "pool", "gym", "security", "parking", "play-area", "coworking"], "gallery": "coastal", "hero_tag": "IT corridor launch", "description": "A modern OMR launch tuned for families and tech talent, with efficient floor plans and long-run upside.", "highlights": ["Near major tech campuses", "New-launch pricing", "Flexible family layouts"]},
            {"id": "chennai-adyar-marina-plot-estate", "title": "Marina Plot Estate", "locality": "Adyar", "latitude": 13.0067, "longitude": 80.2571, "address": "LB Road Extension, Adyar, Chennai", "price": 19200000, "bhk": 0, "baths": 0, "sqft": 2400, "property_type": "plot", "furnishing": "unfurnished", "possession": "ready", "verified": True, "builder_name": "Shoreline Landworks", "launch_year": 2023, "possession_date_label": "Ready for registration", "amenities": ["security", "parking", "garden"], "gallery": "plot", "hero_tag": "Premium plotted development", "description": "A titled plot parcel in leafy Adyar with low-density planning, paved internal roads, and strong end-user demand.", "highlights": ["Rare central-city plotted stock", "Tree-lined pocket", "Strong long-term land thesis"]},
        ],
    },
    {
        "city": "Coimbatore",
        "state": "Tamil Nadu",
        "tier": 2,
        "listings": [
            {"id": "coimbatore-rs-puram-lotus-enclave", "title": "Lotus Enclave", "locality": "RS Puram", "latitude": 11.0099, "longitude": 76.9513, "address": "DB Road, RS Puram, Coimbatore", "price": 8900000, "bhk": 2, "baths": 2, "sqft": 1320, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "ready", "verified": True, "builder_name": "Western Ghats Realty", "launch_year": 2021, "possession_date_label": "Ready to move", "amenities": ["gym", "security", "parking", "garden", "terrace"], "gallery": "heritage", "hero_tag": "Calm city-core apartment", "description": "An elegant apartment in Coimbatore's established core with breezy balconies and dependable owner-occupier demand.", "highlights": ["Walkable retail streets", "Low maintenance community", "Steady resale demand"]},
            {"id": "coimbatore-saravanampatti-cedar-villas", "title": "Cedar Grove Villas", "locality": "Saravanampatti", "latitude": 11.0836, "longitude": 77.0063, "address": "Sathy Road Link, Saravanampatti, Coimbatore", "price": 16500000, "bhk": 4, "baths": 4, "sqft": 2580, "property_type": "villa", "furnishing": "fully furnished", "possession": "ready", "verified": True, "builder_name": "Terraverde Homes", "launch_year": 2022, "possession_date_label": "Ready to move", "amenities": ["pool", "security", "parking", "garden", "terrace", "play-area"], "gallery": "villa", "hero_tag": "Family villa cluster", "description": "A spacious villa in Coimbatore's emerging employment corridor with private outdoor space and broad roads.", "highlights": ["Near educational institutions", "Generous plot sizes", "Fast-growing suburban belt"]},
        ],
    },
    {
        "city": "Kochi",
        "state": "Kerala",
        "tier": 2,
        "listings": [
            {"id": "kochi-kakkanad-harbor-views", "title": "Harbor View Residences", "locality": "Kakkanad", "latitude": 10.0159, "longitude": 76.3419, "address": "Seaport-Airport Road, Kakkanad, Kochi", "price": 11200000, "bhk": 3, "baths": 3, "sqft": 1460, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "under construction", "verified": True, "builder_name": "Backwater Crest Developers", "launch_year": 2024, "possession_date_label": "Mar 2028", "amenities": ["clubhouse", "pool", "gym", "security", "parking", "coworking"], "gallery": "coastal", "hero_tag": "Smart-city apartment", "description": "An investment-grade residence in Kakkanad with work lounge amenities and efficient three-bedroom layouts near Infopark.", "highlights": ["Close to Infopark", "Good rental absorption", "Modern amenity stack"]},
            {"id": "kochi-marine-drive-bay-villas", "title": "Bayfront Villas", "locality": "Marine Drive", "latitude": 9.9892, "longitude": 76.2812, "address": "Marine Drive Promenade, Kochi", "price": 23500000, "bhk": 4, "baths": 4, "sqft": 2860, "property_type": "villa", "furnishing": "fully furnished", "possession": "ready", "verified": True, "builder_name": "Arabian Shore Projects", "launch_year": 2021, "possession_date_label": "Ready to move", "amenities": ["pool", "security", "parking", "garden", "terrace", "ev-charging"], "gallery": "coastal", "hero_tag": "Waterfront villa living", "description": "A design-led villa with water views, relaxed indoor-outdoor spaces, and premium detailing in central Kochi.", "highlights": ["Promenade-facing location", "Strong lifestyle demand", "Luxury holiday-rental potential"]},
        ],
    },
    {
        "city": "Jaipur",
        "state": "Rajasthan",
        "tier": 2,
        "listings": [
            {"id": "jaipur-jagatpura-rose-terraces", "title": "Rose Terraces", "locality": "Jagatpura", "latitude": 26.8426, "longitude": 75.8596, "address": "Mahal Road, Jagatpura, Jaipur", "price": 9800000, "bhk": 3, "baths": 3, "sqft": 1490, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "ready", "verified": True, "builder_name": "Pink City Dwellings", "launch_year": 2022, "possession_date_label": "Ready to move", "amenities": ["clubhouse", "gym", "security", "parking", "play-area", "terrace"], "gallery": "heritage", "hero_tag": "Modern Jaipur family hub", "description": "A neatly planned apartment in Jagatpura with community terraces and rising demand from education catchments.", "highlights": ["Near institutional belt", "Community terrace garden", "Balanced entry price"]},
            {"id": "jaipur-vaishali-nagar-craft-plots", "title": "Craft Avenue Plots", "locality": "Vaishali Nagar", "latitude": 26.9118, "longitude": 75.7464, "address": "Amrapali Marg Extension, Vaishali Nagar, Jaipur", "price": 12500000, "bhk": 0, "baths": 0, "sqft": 3000, "property_type": "plot", "furnishing": "unfurnished", "possession": "ready", "verified": True, "builder_name": "Rajputana Land Ventures", "launch_year": 2023, "possession_date_label": "Ready for registry", "amenities": ["security", "parking", "garden"], "gallery": "plot", "hero_tag": "Low-density plotted pocket", "description": "A titled residential plot in a mature Jaipur district with broad internal roads and strong owner-builder preference.", "highlights": ["Established premium locality", "Broad access roads", "Good custom-home demand"]},
        ],
    },
    {
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "tier": 2,
        "listings": [
            {"id": "lucknow-gomti-nagar-riverlight", "title": "Riverlight Residences", "locality": "Gomti Nagar Extension", "latitude": 26.8504, "longitude": 81.0087, "address": "Shaheed Path Link, Gomti Nagar, Lucknow", "price": 9200000, "bhk": 3, "baths": 3, "sqft": 1510, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "under construction", "verified": True, "builder_name": "Nawab Urban Estates", "launch_year": 2024, "possession_date_label": "Jan 2028", "amenities": ["clubhouse", "gym", "security", "parking", "garden", "play-area"], "gallery": "urban", "hero_tag": "Growth corridor apartment", "description": "A new-age apartment with family amenities and efficient layouts in Lucknow's active expansion zone.", "highlights": ["Close to Shaheed Path", "Strong end-user pipeline", "Upcoming commercial catchment"]},
            {"id": "lucknow-shaheed-path-meadow-villas", "title": "Meadowline Villas", "locality": "Shaheed Path", "latitude": 26.7834, "longitude": 81.0246, "address": "Outer Ring Road, Shaheed Path, Lucknow", "price": 17200000, "bhk": 4, "baths": 4, "sqft": 2750, "property_type": "villa", "furnishing": "fully furnished", "possession": "ready", "verified": True, "builder_name": "Awadh Living Spaces", "launch_year": 2022, "possession_date_label": "Ready to move", "amenities": ["pool", "security", "parking", "garden", "terrace", "play-area"], "gallery": "villa", "hero_tag": "Suburban luxury villa", "description": "A family-first villa with a private lawn, sunlit interiors, and good road access to schools and business districts.", "highlights": ["Corner-plot format", "Private family lawn", "Large-format inventory"]},
        ],
    },
    {
        "city": "Chandigarh",
        "state": "Chandigarh",
        "tier": 2,
        "listings": [
            {"id": "chandigarh-new-city-crescent-heights", "title": "Crescent Heights", "locality": "New Chandigarh", "latitude": 30.7742, "longitude": 76.6976, "address": "Mullanpur Spine Road, New Chandigarh", "price": 18500000, "bhk": 3, "baths": 3, "sqft": 1710, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "ready", "verified": True, "builder_name": "Capitol Habitat", "launch_year": 2021, "possession_date_label": "Ready to move", "amenities": ["clubhouse", "pool", "gym", "security", "parking", "garden"], "gallery": "heritage", "hero_tag": "Wellness-led apartment enclave", "description": "A premium apartment project with broad open spaces, wellness amenities, and strong owner-user preference in the growth axis.", "highlights": ["Low-density planning", "Wide green setbacks", "Demand from professionals and NRIs"]},
            {"id": "chandigarh-sector-5-atrium-square", "title": "Atrium Square", "locality": "Sector 5", "latitude": 30.7392, "longitude": 76.7857, "address": "Madhya Marg, Sector 5, Chandigarh", "price": 29100000, "bhk": 0, "baths": 2, "sqft": 2110, "property_type": "commercial", "furnishing": "fully furnished", "possession": "ready", "verified": True, "builder_name": "Tricity Workspaces", "launch_year": 2020, "possession_date_label": "Ready to lease", "amenities": ["security", "parking", "coworking", "ev-charging", "terrace"], "gallery": "commercial", "hero_tag": "Prime business address", "description": "A polished commercial floor plate in Chandigarh's prime civic district with premium frontage and strong occupier credibility.", "highlights": ["High-income catchment", "Premium address value", "Flexible office fit-outs"]},
        ],
    },
    {
        "city": "Salem",
        "state": "Tamil Nadu",
        "tier": 3,
        "listings": [
            {"id": "salem-fairlands-oak-residences", "title": "Oak Residences", "locality": "Fairlands", "latitude": 11.6698, "longitude": 78.146, "address": "Five Roads Connector, Fairlands, Salem", "price": 6800000, "bhk": 2, "baths": 2, "sqft": 1180, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "ready", "verified": True, "builder_name": "Shevaroy Homes", "launch_year": 2021, "possession_date_label": "Ready to move", "amenities": ["gym", "security", "parking", "garden", "play-area"], "gallery": "urban", "hero_tag": "Compact city-center apartment", "description": "A value-conscious apartment in Fairlands with practical space planning, city access, and dependable owner demand.", "highlights": ["Established residential pocket", "Efficient ticket size", "Reliable resale liquidity"]},
            {"id": "salem-yercaud-foothills-orchard-plots", "title": "Orchard Foothill Plots", "locality": "Yercaud Foothills", "latitude": 11.7295, "longitude": 78.2099, "address": "Yercaud Main Road, Salem", "price": 8800000, "bhk": 0, "baths": 0, "sqft": 3600, "property_type": "plot", "furnishing": "unfurnished", "possession": "ready", "verified": True, "builder_name": "Hillline Estates", "launch_year": 2023, "possession_date_label": "Ready for registration", "amenities": ["security", "parking", "garden"], "gallery": "plot", "hero_tag": "Leisure-led land parcel", "description": "A plotted layout at the foothills of Yercaud suited for second homes and long-term land banking.", "highlights": ["Nature-facing surroundings", "Second-home potential", "Low-entry land banking"]},
        ],
    },
    {
        "city": "Madurai",
        "state": "Tamil Nadu",
        "tier": 3,
        "listings": [
            {"id": "madurai-kk-nagar-temple-view", "title": "Temple View Homes", "locality": "KK Nagar", "latitude": 9.9195, "longitude": 78.1198, "address": "KK Nagar Main Road, Madurai", "price": 7100000, "bhk": 2, "baths": 2, "sqft": 1215, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "ready", "verified": True, "builder_name": "Vaigai Living", "launch_year": 2022, "possession_date_label": "Ready to move", "amenities": ["gym", "security", "parking", "garden", "terrace"], "gallery": "heritage", "hero_tag": "Well-connected residential mid-rise", "description": "A bright Madurai apartment with solid end-user fundamentals, calm streets, and practical layouts near daily essentials.", "highlights": ["Stable family neighborhood", "Comfortable maintenance profile", "Reliable self-use demand"]},
            {"id": "madurai-iyer-bungalow-sandal-villas", "title": "Sandalwood Villas", "locality": "Iyer Bungalow", "latitude": 9.9593, "longitude": 78.1393, "address": "Iyer Bungalow Ring Road, Madurai", "price": 11800000, "bhk": 3, "baths": 3, "sqft": 2140, "property_type": "villa", "furnishing": "fully furnished", "possession": "ready", "verified": True, "builder_name": "Heritage South Homes", "launch_year": 2021, "possession_date_label": "Ready to move", "amenities": ["security", "parking", "garden", "terrace", "play-area"], "gallery": "villa", "hero_tag": "Spacious edge-of-city villa", "description": "A warm family villa with landscaped setbacks and a quiet residential setting that stays connected to key roads.", "highlights": ["Private car porch", "Quiet low-density street", "Good long-stay family appeal"]},
        ],
    },
    {
        "city": "Mysore",
        "state": "Karnataka",
        "tier": 3,
        "listings": [
            {"id": "mysore-vijayanagar-saffron-hill", "title": "Saffron Hill Residences", "locality": "Vijayanagar", "latitude": 12.3072, "longitude": 76.6164, "address": "Vijayanagar 4th Stage, Mysore", "price": 8300000, "bhk": 3, "baths": 3, "sqft": 1430, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "ready", "verified": True, "builder_name": "Mysuru Habitat", "launch_year": 2022, "possession_date_label": "Ready to move", "amenities": ["gym", "security", "parking", "garden", "play-area"], "gallery": "metro", "hero_tag": "Calm premium apartment", "description": "A balanced apartment for end-users and investors seeking quality housing, lower density, and steady demand.", "highlights": ["Good family livability", "Appealing entry price", "Healthy owner-occupier mix"]},
            {"id": "mysore-hebbal-lake-garden-villas", "title": "Lake Garden Villas", "locality": "Hebbal", "latitude": 12.3569, "longitude": 76.6371, "address": "Ring Road North, Hebbal, Mysore", "price": 14200000, "bhk": 4, "baths": 4, "sqft": 2480, "property_type": "villa", "furnishing": "fully furnished", "possession": "ready", "verified": True, "builder_name": "Royal Canopy Estates", "launch_year": 2021, "possession_date_label": "Ready to move", "amenities": ["security", "parking", "garden", "terrace", "ev-charging"], "gallery": "villa", "hero_tag": "Quiet villa enclave", "description": "A thoughtfully planned villa in Hebbal with generous setback space, low traffic, and strong family ownership appeal.", "highlights": ["Near ring road growth", "Private backyard", "Good villa demand in limited supply"]},
        ],
    },
    {
        "city": "Nagpur",
        "state": "Maharashtra",
        "tier": 3,
        "listings": [
            {"id": "nagpur-dharampeth-golden-avenue", "title": "Golden Avenue", "locality": "Dharampeth", "latitude": 21.1382, "longitude": 79.0587, "address": "North Ambazari Road, Dharampeth, Nagpur", "price": 7600000, "bhk": 2, "baths": 2, "sqft": 1250, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "ready", "verified": True, "builder_name": "Orange City Habitat", "launch_year": 2021, "possession_date_label": "Ready to move", "amenities": ["gym", "security", "parking", "garden", "terrace"], "gallery": "urban", "hero_tag": "Core-city apartment value", "description": "A tidy apartment in one of Nagpur's dependable residential markets with easy access to schools, retail, and healthcare.", "highlights": ["Central locality", "Broad resale market", "Comfortable maintenance costs"]},
            {"id": "nagpur-mihan-axis-workspaces", "title": "Axis Workspaces", "locality": "MIHAN", "latitude": 20.9811, "longitude": 79.0404, "address": "SEZ Spine Road, MIHAN, Nagpur", "price": 13800000, "bhk": 0, "baths": 2, "sqft": 1980, "property_type": "commercial", "furnishing": "fully furnished", "possession": "ready", "verified": True, "builder_name": "Central India Infra", "launch_year": 2020, "possession_date_label": "Ready to lease", "amenities": ["security", "parking", "coworking", "ev-charging"], "gallery": "commercial", "hero_tag": "Emerging business district asset", "description": "A flexible office unit in MIHAN with durable leasing potential tied to logistics, aviation, and services growth.", "highlights": ["Growth-zone commercial stock", "Flexible fit-out potential", "Business-park adjacency"]},
        ],
    },
    {
        "city": "Indore",
        "state": "Madhya Pradesh",
        "tier": 3,
        "listings": [
            {"id": "indore-super-corridor-aero-heights", "title": "Aero Heights", "locality": "Super Corridor", "latitude": 22.7644, "longitude": 75.8658, "address": "Super Corridor Main Road, Indore", "price": 8700000, "bhk": 3, "baths": 3, "sqft": 1485, "property_type": "apartment", "furnishing": "semi-furnished", "possession": "under construction", "verified": True, "builder_name": "Malwa Growth Homes", "launch_year": 2024, "possession_date_label": "Nov 2027", "amenities": ["clubhouse", "gym", "security", "parking", "garden", "coworking"], "gallery": "metro", "hero_tag": "Corridor growth apartment", "description": "A contemporary apartment for buyers looking to capture Indore's airport and corporate corridor growth early.", "highlights": ["Near airport influence zone", "Upcoming infrastructure push", "Efficient future-ready layouts"]},
            {"id": "indore-vijay-nagar-canvas-villas", "title": "Canvas Villas", "locality": "Vijay Nagar", "latitude": 22.7533, "longitude": 75.8953, "address": "Scheme 54 Extension, Vijay Nagar, Indore", "price": 15500000, "bhk": 4, "baths": 4, "sqft": 2625, "property_type": "villa", "furnishing": "fully furnished", "possession": "ready", "verified": True, "builder_name": "Canvas Living Co.", "launch_year": 2022, "possession_date_label": "Ready to move", "amenities": ["security", "parking", "garden", "terrace", "ev-charging", "play-area"], "gallery": "villa", "hero_tag": "Premium city villa", "description": "A contemporary villa with layered landscaping, family entertainment spaces, and strong self-use desirability.", "highlights": ["Prime urban neighborhood", "Strong aspirational demand", "Premium finished interiors"]},
        ],
    },
]


def build_seed_properties() -> list[dict]:
    properties: list[dict] = []
    for city in CITY_BLUEPRINTS:
        for listing in city["listings"]:
            fallback_images = GALLERY_SETS[listing["gallery"]]
            properties.append(
                {
                    "city": city["city"],
                    "state": city["state"],
                    "tier": city["tier"],
                    **listing,
                    "slug": listing["id"],
                    "images": resolve_property_images(listing["id"], fallback_images),
                }
            )
    return properties


def iter_property_ids(properties: Iterable[dict]) -> list[str]:
    return [property_data["id"] for property_data in properties]
