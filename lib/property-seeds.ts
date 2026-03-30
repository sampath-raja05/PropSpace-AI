import type { PropertySeed } from "@/types";

const galleries = {
  metro: [
    "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1741927378831-e51b54d27a02?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  urban: [
    "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1741927378831-e51b54d27a02?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  villa: [
    "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1760067537204-fe9b55b2f1b0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  coastal: [
    "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1760067537204-fe9b55b2f1b0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  plot: [
    "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  commercial: [
    "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1741927378831-e51b54d27a02?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  heritage: [
    "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1741927378831-e51b54d27a02?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ]
} satisfies Record<string, string[]>;

const relatableImageStories = {
  penthouse: [
    "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1741927378831-e51b54d27a02?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1738168251394-3250247c1455?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  urbanApartment: [
    "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1742490382029-98357c08f3cd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1738168251394-3250247c1455?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  familyApartment: [
    "https://images.unsplash.com/photo-1738168251394-3250247c1455?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1742490382029-98357c08f3cd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  growthApartment: [
    "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1741927378831-e51b54d27a02?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1742490382029-98357c08f3cd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  coastalApartment: [
    "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1706622767826-957f91a1c56d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1742490382029-98357c08f3cd?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  urbanVilla: [
    "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1760067537204-fe9b55b2f1b0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  waterfrontVilla: [
    "https://images.unsplash.com/photo-1760067537204-fe9b55b2f1b0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1674494777503-f5d3484104c9?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  familyVilla: [
    "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1760067537204-fe9b55b2f1b0?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  plottedDevelopment: [
    "https://images.unsplash.com/photo-1684918061493-a3365486987f?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1758448756207-54505680d130?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  commercialCore: [
    "https://images.unsplash.com/photo-1758862527435-1b623cbd4206?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1770425616829-61d6912705ad?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1770816307800-72ba937620fe?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ],
  commercialPrime: [
    "https://images.unsplash.com/photo-1758862527435-1b623cbd4206?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1770816307800-72ba937620fe?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600",
    "https://images.unsplash.com/photo-1770425616829-61d6912705ad?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
  ]
} satisfies Record<string, string[]>;

const propertyImageStorylines = {
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
  "indore-vijay-nagar-canvas-villas": "urbanVilla"
} satisfies Record<string, keyof typeof relatableImageStories>;

function optimizeGalleryImage(url: string) {
  if (!url.includes("images.unsplash.com")) {
    return url;
  }

  const [baseUrl, queryString = ""] = url.split("?");
  const params = new URLSearchParams(queryString);

  params.set("auto", "format");
  params.set("fit", "crop");
  params.set("fm", "webp");
  params.set("q", "72");
  params.set("w", "1280");

  return `${baseUrl}?${params.toString()}`;
}

export function resolvePropertyImagesById(propertyId: string, fallbackImages: string[]) {
  const storyline =
    propertyId in propertyImageStorylines
      ? propertyImageStorylines[propertyId as keyof typeof propertyImageStorylines]
      : undefined;
  const sourceImages = storyline ? relatableImageStories[storyline] : fallbackImages;

  return Array.from(new Set(sourceImages.map(optimizeGalleryImage)));
}

const propertySeedBase = [
  { id: "mumbai-worli-sky-residences", title: "Worli Sky Residences", city: "Mumbai", tier: 1, locality: "Worli Sea Face", state: "Maharashtra", latitude: 19.0176, longitude: 72.8174, address: "Dr Annie Besant Road, Worli Sea Face, Mumbai", price: 38500000, bhk: 3, baths: 3, sqft: 1720, propertyType: "apartment", furnishing: "fully furnished", possession: "ready", verified: true, builderName: "BlueArc Habitat", launchYear: 2021, possessionDateLabel: "Ready to move", amenities: ["pool", "gym", "security", "parking", "coworking", "ev-charging"], images: galleries.metro, heroTag: "Sea-facing premium tower", description: "A refined Worli address with expansive glazing, skyline views, and hospitality-grade amenities for urban professionals.", highlights: ["Panoramic sea views", "Private lounge floor", "Quick access to BKC"] },
  { id: "mumbai-powai-lakefront-boulevard", title: "Powai Lakefront Boulevard", city: "Mumbai", tier: 1, locality: "Powai", state: "Maharashtra", latitude: 19.1176, longitude: 72.906, address: "Lake Boulevard Street, Powai, Mumbai", price: 24800000, bhk: 2, baths: 2, sqft: 1180, propertyType: "apartment", furnishing: "semi-furnished", possession: "ready", verified: true, builderName: "Northline Realty", launchYear: 2020, possessionDateLabel: "Ready to move", amenities: ["clubhouse", "pool", "gym", "security", "parking", "garden"], images: galleries.urban, heroTag: "Lake district living", description: "A polished lake-side apartment with social workspaces, promenades, and strong rental demand from nearby tech hubs.", highlights: ["Walkable to Hiranandani district", "High tenant absorption", "Lake-edge jogging trail"] },
  { id: "bangalore-whitefield-orbit-heights", title: "Orbit Heights", city: "Bangalore", tier: 1, locality: "Whitefield", state: "Karnataka", latitude: 12.9698, longitude: 77.75, address: "ECC Road, Whitefield, Bangalore", price: 19500000, bhk: 3, baths: 3, sqft: 1640, propertyType: "apartment", furnishing: "semi-furnished", possession: "under construction", verified: true, builderName: "Crestline Projects", launchYear: 2023, possessionDateLabel: "Dec 2027", amenities: ["clubhouse", "pool", "gym", "security", "parking", "coworking", "play-area"], images: galleries.metro, heroTag: "Tech corridor address", description: "A Whitefield community combining large work-from-home layouts, wellness spaces, and future metro connectivity.", highlights: ["Near ITPL and metro", "Large study alcove", "Investor-friendly micro market"] },
  { id: "bangalore-koramangala-courtyard-villas", title: "Koramangala Courtyard Villas", city: "Bangalore", tier: 1, locality: "Koramangala", state: "Karnataka", latitude: 12.9352, longitude: 77.6245, address: "80 Feet Road, Koramangala, Bangalore", price: 48200000, bhk: 4, baths: 4, sqft: 3240, propertyType: "villa", furnishing: "fully furnished", possession: "ready", verified: true, builderName: "Garden Grid Estates", launchYear: 2022, possessionDateLabel: "Ready to move", amenities: ["garden", "pool", "gym", "security", "parking", "terrace", "ev-charging"], images: galleries.villa, heroTag: "Private urban villa enclave", description: "A boutique villa community with landscaped courtyards, rooftop entertaining spaces, and startup-district access.", highlights: ["Low-density gated enclave", "Private terrace deck", "Premium rental upside"] },
  { id: "delhi-dwarka-signature-greens", title: "Signature Greens", city: "Delhi", tier: 1, locality: "Dwarka Sector 19", state: "Delhi", latitude: 28.5837, longitude: 77.0572, address: "Sector 19B, Dwarka, Delhi", price: 23100000, bhk: 3, baths: 3, sqft: 1780, propertyType: "apartment", furnishing: "semi-furnished", possession: "ready", verified: true, builderName: "Aravali Landmark", launchYear: 2021, possessionDateLabel: "Ready to move", amenities: ["clubhouse", "gym", "security", "parking", "garden", "play-area"], images: galleries.heritage, heroTag: "Balanced family living", description: "A bright Dwarka apartment with green podium gardens, broad balconies, and quick airport access.", highlights: ["Close to airport corridor", "Large family-sized floor plan", "School cluster nearby"] },
  { id: "delhi-vasant-kunj-capital-square", title: "Capital Square Offices", city: "Delhi", tier: 1, locality: "Vasant Kunj", state: "Delhi", latitude: 28.5245, longitude: 77.1587, address: "Nelson Mandela Marg, Vasant Kunj, Delhi", price: 36200000, bhk: 0, baths: 2, sqft: 2240, propertyType: "commercial", furnishing: "fully furnished", possession: "ready", verified: true, builderName: "Square Mile Infra", launchYear: 2019, possessionDateLabel: "Ready to lease", amenities: ["security", "parking", "coworking", "ev-charging", "terrace"], images: galleries.commercial, heroTag: "Institutional-grade office asset", description: "A premium commercial suite with strong frontage, flexible floor plates, and reliable leasing traction.", highlights: ["High-visibility address", "Stable commercial micro-market", "Plug-and-play interiors"] },
  { id: "hyderabad-gachibowli-verde-homes", title: "Verde Homes", city: "Hyderabad", tier: 1, locality: "Gachibowli", state: "Telangana", latitude: 17.4401, longitude: 78.3489, address: "Financial District Road, Gachibowli, Hyderabad", price: 17600000, bhk: 3, baths: 3, sqft: 1690, propertyType: "apartment", furnishing: "semi-furnished", possession: "under construction", verified: true, builderName: "Sunward Constructions", launchYear: 2024, possessionDateLabel: "Jun 2028", amenities: ["clubhouse", "pool", "gym", "security", "parking", "coworking", "garden"], images: galleries.metro, heroTag: "Financial district growth story", description: "A future-ready apartment community curated for IT professionals seeking spacious layouts and quiet work zones.", highlights: ["Strong appreciation corridor", "Amenity-rich clubhouse", "Metro expansion upside"] },
  { id: "hyderabad-jubilee-hills-celeste-villas", title: "Celeste Hills Villas", city: "Hyderabad", tier: 1, locality: "Jubilee Hills", state: "Telangana", latitude: 17.4239, longitude: 78.4126, address: "Road No. 45, Jubilee Hills, Hyderabad", price: 52800000, bhk: 5, baths: 5, sqft: 3920, propertyType: "villa", furnishing: "fully furnished", possession: "ready", verified: true, builderName: "Velvet Stone Homes", launchYear: 2022, possessionDateLabel: "Ready to move", amenities: ["pool", "gym", "security", "parking", "garden", "terrace", "ev-charging"], images: galleries.villa, heroTag: "Ultra-prime hillside villa", description: "An expansive villa with private garden courts, entertainment decks, and polished interiors in Jubilee Hills.", highlights: ["Prestige residential district", "Private plunge pool", "Rare low-supply asset class"] },
  { id: "chennai-omr-tidal-park-residences", title: "Tidal Park Residences", city: "Chennai", tier: 1, locality: "OMR", state: "Tamil Nadu", latitude: 12.9172, longitude: 80.2293, address: "Rajiv Gandhi Salai, OMR, Chennai", price: 14800000, bhk: 3, baths: 3, sqft: 1540, propertyType: "apartment", furnishing: "semi-furnished", possession: "new launch", verified: true, builderName: "East Coast Developers", launchYear: 2025, possessionDateLabel: "Sep 2029", amenities: ["clubhouse", "pool", "gym", "security", "parking", "play-area", "coworking"], images: galleries.coastal, heroTag: "IT corridor launch", description: "A modern OMR launch tuned for families and tech talent, with efficient floor plans and long-run upside.", highlights: ["Near major tech campuses", "New-launch pricing", "Flexible family layouts"] },
  { id: "chennai-adyar-marina-plot-estate", title: "Marina Plot Estate", city: "Chennai", tier: 1, locality: "Adyar", state: "Tamil Nadu", latitude: 13.0067, longitude: 80.2571, address: "LB Road Extension, Adyar, Chennai", price: 19200000, bhk: 0, baths: 0, sqft: 2400, propertyType: "plot", furnishing: "unfurnished", possession: "ready", verified: true, builderName: "Shoreline Landworks", launchYear: 2023, possessionDateLabel: "Ready for registration", amenities: ["security", "parking", "garden"], images: galleries.plot, heroTag: "Premium plotted development", description: "A titled plot parcel in leafy Adyar with low-density planning, paved internal roads, and strong end-user demand.", highlights: ["Rare central-city plotted stock", "Tree-lined pocket", "Strong long-term land thesis"] },
  { id: "coimbatore-rs-puram-lotus-enclave", title: "Lotus Enclave", city: "Coimbatore", tier: 2, locality: "RS Puram", state: "Tamil Nadu", latitude: 11.0099, longitude: 76.9513, address: "DB Road, RS Puram, Coimbatore", price: 8900000, bhk: 2, baths: 2, sqft: 1320, propertyType: "apartment", furnishing: "semi-furnished", possession: "ready", verified: true, builderName: "Western Ghats Realty", launchYear: 2021, possessionDateLabel: "Ready to move", amenities: ["gym", "security", "parking", "garden", "terrace"], images: galleries.heritage, heroTag: "Calm city-core apartment", description: "An elegant apartment in Coimbatore's established core with breezy balconies and dependable owner-occupier demand.", highlights: ["Walkable retail streets", "Low maintenance community", "Steady resale demand"] },
  { id: "coimbatore-saravanampatti-cedar-villas", title: "Cedar Grove Villas", city: "Coimbatore", tier: 2, locality: "Saravanampatti", state: "Tamil Nadu", latitude: 11.0836, longitude: 77.0063, address: "Sathy Road Link, Saravanampatti, Coimbatore", price: 16500000, bhk: 4, baths: 4, sqft: 2580, propertyType: "villa", furnishing: "fully furnished", possession: "ready", verified: true, builderName: "Terraverde Homes", launchYear: 2022, possessionDateLabel: "Ready to move", amenities: ["pool", "security", "parking", "garden", "terrace", "play-area"], images: galleries.villa, heroTag: "Family villa cluster", description: "A spacious villa in Coimbatore's emerging employment corridor with private outdoor space and broad roads.", highlights: ["Near educational institutions", "Generous plot sizes", "Fast-growing suburban belt"] },
  { id: "kochi-kakkanad-harbor-views", title: "Harbor View Residences", city: "Kochi", tier: 2, locality: "Kakkanad", state: "Kerala", latitude: 10.0159, longitude: 76.3419, address: "Seaport-Airport Road, Kakkanad, Kochi", price: 11200000, bhk: 3, baths: 3, sqft: 1460, propertyType: "apartment", furnishing: "semi-furnished", possession: "under construction", verified: true, builderName: "Backwater Crest Developers", launchYear: 2024, possessionDateLabel: "Mar 2028", amenities: ["clubhouse", "pool", "gym", "security", "parking", "coworking"], images: galleries.coastal, heroTag: "Smart-city apartment", description: "An investment-grade residence in Kakkanad with work lounge amenities and efficient three-bedroom layouts near Infopark.", highlights: ["Close to Infopark", "Good rental absorption", "Modern amenity stack"] },
  { id: "kochi-marine-drive-bay-villas", title: "Bayfront Villas", city: "Kochi", tier: 2, locality: "Marine Drive", state: "Kerala", latitude: 9.9892, longitude: 76.2812, address: "Marine Drive Promenade, Kochi", price: 23500000, bhk: 4, baths: 4, sqft: 2860, propertyType: "villa", furnishing: "fully furnished", possession: "ready", verified: true, builderName: "Arabian Shore Projects", launchYear: 2021, possessionDateLabel: "Ready to move", amenities: ["pool", "security", "parking", "garden", "terrace", "ev-charging"], images: galleries.coastal, heroTag: "Waterfront villa living", description: "A design-led villa with water views, relaxed indoor-outdoor spaces, and premium detailing in central Kochi.", highlights: ["Promenade-facing location", "Strong lifestyle demand", "Luxury holiday-rental potential"] },
  { id: "jaipur-jagatpura-rose-terraces", title: "Rose Terraces", city: "Jaipur", tier: 2, locality: "Jagatpura", state: "Rajasthan", latitude: 26.8426, longitude: 75.8596, address: "Mahal Road, Jagatpura, Jaipur", price: 9800000, bhk: 3, baths: 3, sqft: 1490, propertyType: "apartment", furnishing: "semi-furnished", possession: "ready", verified: true, builderName: "Pink City Dwellings", launchYear: 2022, possessionDateLabel: "Ready to move", amenities: ["clubhouse", "gym", "security", "parking", "play-area", "terrace"], images: galleries.heritage, heroTag: "Modern Jaipur family hub", description: "A neatly planned apartment in Jagatpura with community terraces and rising demand from education catchments.", highlights: ["Near institutional belt", "Community terrace garden", "Balanced entry price"] },
  { id: "jaipur-vaishali-nagar-craft-plots", title: "Craft Avenue Plots", city: "Jaipur", tier: 2, locality: "Vaishali Nagar", state: "Rajasthan", latitude: 26.9118, longitude: 75.7464, address: "Amrapali Marg Extension, Vaishali Nagar, Jaipur", price: 12500000, bhk: 0, baths: 0, sqft: 3000, propertyType: "plot", furnishing: "unfurnished", possession: "ready", verified: true, builderName: "Rajputana Land Ventures", launchYear: 2023, possessionDateLabel: "Ready for registry", amenities: ["security", "parking", "garden"], images: galleries.plot, heroTag: "Low-density plotted pocket", description: "A titled residential plot in a mature Jaipur district with broad internal roads and strong owner-builder preference.", highlights: ["Established premium locality", "Broad access roads", "Good custom-home demand"] },
  { id: "lucknow-gomti-nagar-riverlight", title: "Riverlight Residences", city: "Lucknow", tier: 2, locality: "Gomti Nagar Extension", state: "Uttar Pradesh", latitude: 26.8504, longitude: 81.0087, address: "Shaheed Path Link, Gomti Nagar, Lucknow", price: 9200000, bhk: 3, baths: 3, sqft: 1510, propertyType: "apartment", furnishing: "semi-furnished", possession: "under construction", verified: true, builderName: "Nawab Urban Estates", launchYear: 2024, possessionDateLabel: "Jan 2028", amenities: ["clubhouse", "gym", "security", "parking", "garden", "play-area"], images: galleries.urban, heroTag: "Growth corridor apartment", description: "A new-age apartment with family amenities and efficient layouts in Lucknow's active expansion zone.", highlights: ["Close to Shaheed Path", "Strong end-user pipeline", "Upcoming commercial catchment"] },
  { id: "lucknow-shaheed-path-meadow-villas", title: "Meadowline Villas", city: "Lucknow", tier: 2, locality: "Shaheed Path", state: "Uttar Pradesh", latitude: 26.7834, longitude: 81.0246, address: "Outer Ring Road, Shaheed Path, Lucknow", price: 17200000, bhk: 4, baths: 4, sqft: 2750, propertyType: "villa", furnishing: "fully furnished", possession: "ready", verified: true, builderName: "Awadh Living Spaces", launchYear: 2022, possessionDateLabel: "Ready to move", amenities: ["pool", "security", "parking", "garden", "terrace", "play-area"], images: galleries.villa, heroTag: "Suburban luxury villa", description: "A family-first villa with a private lawn, sunlit interiors, and good road access to schools and business districts.", highlights: ["Corner-plot format", "Private family lawn", "Large-format inventory"] },
  { id: "chandigarh-new-city-crescent-heights", title: "Crescent Heights", city: "Chandigarh", tier: 2, locality: "New Chandigarh", state: "Chandigarh", latitude: 30.7742, longitude: 76.6976, address: "Mullanpur Spine Road, New Chandigarh", price: 18500000, bhk: 3, baths: 3, sqft: 1710, propertyType: "apartment", furnishing: "semi-furnished", possession: "ready", verified: true, builderName: "Capitol Habitat", launchYear: 2021, possessionDateLabel: "Ready to move", amenities: ["clubhouse", "pool", "gym", "security", "parking", "garden"], images: galleries.heritage, heroTag: "Wellness-led apartment enclave", description: "A premium apartment project with broad open spaces, wellness amenities, and strong owner-user preference in the growth axis.", highlights: ["Low-density planning", "Wide green setbacks", "Demand from professionals and NRIs"] },
  { id: "chandigarh-sector-5-atrium-square", title: "Atrium Square", city: "Chandigarh", tier: 2, locality: "Sector 5", state: "Chandigarh", latitude: 30.7392, longitude: 76.7857, address: "Madhya Marg, Sector 5, Chandigarh", price: 29100000, bhk: 0, baths: 2, sqft: 2110, propertyType: "commercial", furnishing: "fully furnished", possession: "ready", verified: true, builderName: "Tricity Workspaces", launchYear: 2020, possessionDateLabel: "Ready to lease", amenities: ["security", "parking", "coworking", "ev-charging", "terrace"], images: galleries.commercial, heroTag: "Prime business address", description: "A polished commercial floor plate in Chandigarh's prime civic district with premium frontage and strong occupier credibility.", highlights: ["High-income catchment", "Premium address value", "Flexible office fit-outs"] },
  { id: "salem-fairlands-oak-residences", title: "Oak Residences", city: "Salem", tier: 3, locality: "Fairlands", state: "Tamil Nadu", latitude: 11.6698, longitude: 78.146, address: "Five Roads Connector, Fairlands, Salem", price: 6800000, bhk: 2, baths: 2, sqft: 1180, propertyType: "apartment", furnishing: "semi-furnished", possession: "ready", verified: true, builderName: "Shevaroy Homes", launchYear: 2021, possessionDateLabel: "Ready to move", amenities: ["gym", "security", "parking", "garden", "play-area"], images: galleries.urban, heroTag: "Compact city-center apartment", description: "A value-conscious apartment in Fairlands with practical space planning, city access, and dependable owner demand.", highlights: ["Established residential pocket", "Efficient ticket size", "Reliable resale liquidity"] },
  { id: "salem-yercaud-foothills-orchard-plots", title: "Orchard Foothill Plots", city: "Salem", tier: 3, locality: "Yercaud Foothills", state: "Tamil Nadu", latitude: 11.7295, longitude: 78.2099, address: "Yercaud Main Road, Salem", price: 8800000, bhk: 0, baths: 0, sqft: 3600, propertyType: "plot", furnishing: "unfurnished", possession: "ready", verified: true, builderName: "Hillline Estates", launchYear: 2023, possessionDateLabel: "Ready for registration", amenities: ["security", "parking", "garden"], images: galleries.plot, heroTag: "Leisure-led land parcel", description: "A plotted layout at the foothills of Yercaud suited for second homes and long-term land banking.", highlights: ["Nature-facing surroundings", "Second-home potential", "Low-entry land banking"] },
  { id: "madurai-kk-nagar-temple-view", title: "Temple View Homes", city: "Madurai", tier: 3, locality: "KK Nagar", state: "Tamil Nadu", latitude: 9.9195, longitude: 78.1198, address: "KK Nagar Main Road, Madurai", price: 7100000, bhk: 2, baths: 2, sqft: 1215, propertyType: "apartment", furnishing: "semi-furnished", possession: "ready", verified: true, builderName: "Vaigai Living", launchYear: 2022, possessionDateLabel: "Ready to move", amenities: ["gym", "security", "parking", "garden", "terrace"], images: galleries.heritage, heroTag: "Well-connected residential mid-rise", description: "A bright Madurai apartment with solid end-user fundamentals, calm streets, and practical layouts near daily essentials.", highlights: ["Stable family neighborhood", "Comfortable maintenance profile", "Reliable self-use demand"] },
  { id: "madurai-iyer-bungalow-sandal-villas", title: "Sandalwood Villas", city: "Madurai", tier: 3, locality: "Iyer Bungalow", state: "Tamil Nadu", latitude: 9.9593, longitude: 78.1393, address: "Iyer Bungalow Ring Road, Madurai", price: 11800000, bhk: 3, baths: 3, sqft: 2140, propertyType: "villa", furnishing: "fully furnished", possession: "ready", verified: true, builderName: "Heritage South Homes", launchYear: 2021, possessionDateLabel: "Ready to move", amenities: ["security", "parking", "garden", "terrace", "play-area"], images: galleries.villa, heroTag: "Spacious edge-of-city villa", description: "A warm family villa with landscaped setbacks and a quiet residential setting that stays connected to key roads.", highlights: ["Private car porch", "Quiet low-density street", "Good long-stay family appeal"] },
  { id: "mysore-vijayanagar-saffron-hill", title: "Saffron Hill Residences", city: "Mysore", tier: 3, locality: "Vijayanagar", state: "Karnataka", latitude: 12.3072, longitude: 76.6164, address: "Vijayanagar 4th Stage, Mysore", price: 8300000, bhk: 3, baths: 3, sqft: 1430, propertyType: "apartment", furnishing: "semi-furnished", possession: "ready", verified: true, builderName: "Mysuru Habitat", launchYear: 2022, possessionDateLabel: "Ready to move", amenities: ["gym", "security", "parking", "garden", "play-area"], images: galleries.metro, heroTag: "Calm premium apartment", description: "A balanced apartment for end-users and investors seeking quality housing, lower density, and steady demand.", highlights: ["Good family livability", "Appealing entry price", "Healthy owner-occupier mix"] },
  { id: "mysore-hebbal-lake-garden-villas", title: "Lake Garden Villas", city: "Mysore", tier: 3, locality: "Hebbal", state: "Karnataka", latitude: 12.3569, longitude: 76.6371, address: "Ring Road North, Hebbal, Mysore", price: 14200000, bhk: 4, baths: 4, sqft: 2480, propertyType: "villa", furnishing: "fully furnished", possession: "ready", verified: true, builderName: "Royal Canopy Estates", launchYear: 2021, possessionDateLabel: "Ready to move", amenities: ["security", "parking", "garden", "terrace", "ev-charging"], images: galleries.villa, heroTag: "Quiet villa enclave", description: "A thoughtfully planned villa in Hebbal with generous setback space, low traffic, and strong family ownership appeal.", highlights: ["Near ring road growth", "Private backyard", "Good villa demand in limited supply"] },
  { id: "nagpur-dharampeth-golden-avenue", title: "Golden Avenue", city: "Nagpur", tier: 3, locality: "Dharampeth", state: "Maharashtra", latitude: 21.1382, longitude: 79.0587, address: "North Ambazari Road, Dharampeth, Nagpur", price: 7600000, bhk: 2, baths: 2, sqft: 1250, propertyType: "apartment", furnishing: "semi-furnished", possession: "ready", verified: true, builderName: "Orange City Habitat", launchYear: 2021, possessionDateLabel: "Ready to move", amenities: ["gym", "security", "parking", "garden", "terrace"], images: galleries.urban, heroTag: "Core-city apartment value", description: "A tidy apartment in one of Nagpur's dependable residential markets with easy access to schools, retail, and healthcare.", highlights: ["Central locality", "Broad resale market", "Comfortable maintenance costs"] },
  { id: "nagpur-mihan-axis-workspaces", title: "Axis Workspaces", city: "Nagpur", tier: 3, locality: "MIHAN", state: "Maharashtra", latitude: 20.9811, longitude: 79.0404, address: "SEZ Spine Road, MIHAN, Nagpur", price: 13800000, bhk: 0, baths: 2, sqft: 1980, propertyType: "commercial", furnishing: "fully furnished", possession: "ready", verified: true, builderName: "Central India Infra", launchYear: 2020, possessionDateLabel: "Ready to lease", amenities: ["security", "parking", "coworking", "ev-charging"], images: galleries.commercial, heroTag: "Emerging business district asset", description: "A flexible office unit in MIHAN with durable leasing potential tied to logistics, aviation, and services growth.", highlights: ["Growth-zone commercial stock", "Flexible fit-out potential", "Business-park adjacency"] },
  { id: "indore-super-corridor-aero-heights", title: "Aero Heights", city: "Indore", tier: 3, locality: "Super Corridor", state: "Madhya Pradesh", latitude: 22.7644, longitude: 75.8658, address: "Super Corridor Main Road, Indore", price: 8700000, bhk: 3, baths: 3, sqft: 1485, propertyType: "apartment", furnishing: "semi-furnished", possession: "under construction", verified: true, builderName: "Malwa Growth Homes", launchYear: 2024, possessionDateLabel: "Nov 2027", amenities: ["clubhouse", "gym", "security", "parking", "garden", "coworking"], images: galleries.metro, heroTag: "Corridor growth apartment", description: "A contemporary apartment for buyers looking to capture Indore's airport and corporate corridor growth early.", highlights: ["Near airport influence zone", "Upcoming infrastructure push", "Efficient future-ready layouts"] },
  { id: "indore-vijay-nagar-canvas-villas", title: "Canvas Villas", city: "Indore", tier: 3, locality: "Vijay Nagar", state: "Madhya Pradesh", latitude: 22.7533, longitude: 75.8953, address: "Scheme 54 Extension, Vijay Nagar, Indore", price: 15500000, bhk: 4, baths: 4, sqft: 2625, propertyType: "villa", furnishing: "fully furnished", possession: "ready", verified: true, builderName: "Canvas Living Co.", launchYear: 2022, possessionDateLabel: "Ready to move", amenities: ["security", "parking", "garden", "terrace", "ev-charging", "play-area"], images: galleries.villa, heroTag: "Premium city villa", description: "A contemporary villa with layered landscaping, family entertainment spaces, and strong self-use desirability.", highlights: ["Prime urban neighborhood", "Strong aspirational demand", "Premium finished interiors"] }
  ] satisfies PropertySeed[];

export const propertySeeds: PropertySeed[] = propertySeedBase.map((property) => ({
  ...property,
  images: resolvePropertyImagesById(property.id, property.images)
}));
