from datetime import datetime

from geoalchemy2 import Geometry
from sqlalchemy import BIGINT, JSON, Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.user import Base


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    slug: Mapped[str] = mapped_column(String(140), index=True, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    city: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    state: Mapped[str] = mapped_column(String(80), nullable=False)
    tier: Mapped[int] = mapped_column(Integer, nullable=False)
    locality: Mapped[str] = mapped_column(String(120), nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    geom = mapped_column(Geometry(geometry_type="POINT", srid=4326, spatial_index=True))
    price: Mapped[int] = mapped_column(BIGINT, nullable=False)
    bhk: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    baths: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    sqft: Mapped[int] = mapped_column(Integer, nullable=False)
    property_type: Mapped[str] = mapped_column(String(40), nullable=False)
    furnishing: Mapped[str] = mapped_column(String(40), nullable=False)
    possession: Mapped[str] = mapped_column(String(40), nullable=False)
    verified: Mapped[bool] = mapped_column(Boolean, default=True)
    builder_name: Mapped[str] = mapped_column(String(120), nullable=False)
    launch_year: Mapped[int] = mapped_column(Integer, nullable=False)
    possession_date_label: Mapped[str] = mapped_column(String(80), nullable=False)
    amenities: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    images: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    hero_tag: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(800), nullable=False)
    highlights: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
