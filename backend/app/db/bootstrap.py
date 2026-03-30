from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.security import get_password_hash, verify_password
from app.db.session import SessionLocal, engine
from app.models.alert import AlertRule
from app.models.portfolio import PortfolioHolding
from app.models.property import Property
from app.models.user import Base, User
from app.services.seed_data import build_seed_properties

DEMO_USER_EMAIL = "aarav@propspace.ai"
DEMO_USER_PASSWORD = "demo-password"


def bootstrap_database() -> None:
    try:
        with engine.begin() as connection:
            connection.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
        Base.metadata.create_all(bind=engine)
    except SQLAlchemyError:
        return

    db = SessionLocal()

    try:
        demo_user = db.query(User).filter(User.email == DEMO_USER_EMAIL).first()
        if demo_user is None:
            db.add(
                User(
                    id="demo-investor",
                    full_name="Aarav Mehta",
                    email=DEMO_USER_EMAIL,
                    hashed_password=get_password_hash(DEMO_USER_PASSWORD),
                    role="investor",
                )
            )
        elif not verify_password(DEMO_USER_PASSWORD, demo_user.hashed_password):
            demo_user.full_name = "Aarav Mehta"
            demo_user.role = "investor"
            demo_user.hashed_password = get_password_hash(DEMO_USER_PASSWORD)

        existing_properties = {property.id: property for property in db.query(Property).all()}
        for property_data in build_seed_properties():
            existing_property = existing_properties.get(property_data["id"])
            if existing_property is None:
                db.add(
                    Property(
                        id=property_data["id"],
                        slug=property_data["slug"],
                        title=property_data["title"],
                        city=property_data["city"],
                        state=property_data["state"],
                        tier=property_data["tier"],
                        locality=property_data["locality"],
                        address=property_data["address"],
                        latitude=property_data["latitude"],
                        longitude=property_data["longitude"],
                        price=property_data["price"],
                        bhk=property_data["bhk"],
                        baths=property_data["baths"],
                        sqft=property_data["sqft"],
                        property_type=property_data["property_type"],
                        furnishing=property_data["furnishing"],
                        possession=property_data["possession"],
                        verified=property_data["verified"],
                        builder_name=property_data["builder_name"],
                        launch_year=property_data["launch_year"],
                        possession_date_label=property_data["possession_date_label"],
                        amenities=property_data["amenities"],
                        images=property_data["images"],
                        hero_tag=property_data["hero_tag"],
                        description=property_data["description"],
                        highlights=property_data["highlights"],
                    )
                )
                continue

            existing_property.slug = property_data["slug"]
            existing_property.title = property_data["title"]
            existing_property.city = property_data["city"]
            existing_property.state = property_data["state"]
            existing_property.tier = property_data["tier"]
            existing_property.locality = property_data["locality"]
            existing_property.address = property_data["address"]
            existing_property.latitude = property_data["latitude"]
            existing_property.longitude = property_data["longitude"]
            existing_property.price = property_data["price"]
            existing_property.bhk = property_data["bhk"]
            existing_property.baths = property_data["baths"]
            existing_property.sqft = property_data["sqft"]
            existing_property.property_type = property_data["property_type"]
            existing_property.furnishing = property_data["furnishing"]
            existing_property.possession = property_data["possession"]
            existing_property.verified = property_data["verified"]
            existing_property.builder_name = property_data["builder_name"]
            existing_property.launch_year = property_data["launch_year"]
            existing_property.possession_date_label = property_data["possession_date_label"]
            existing_property.amenities = property_data["amenities"]
            existing_property.images = property_data["images"]
            existing_property.hero_tag = property_data["hero_tag"]
            existing_property.description = property_data["description"]
            existing_property.highlights = property_data["highlights"]

        if not db.query(PortfolioHolding).first():
            db.add_all(
                [
                    PortfolioHolding(
                        id="hold-1",
                        user_id="demo-investor",
                        property_id="mumbai-powai-lakefront-boulevard",
                        acquisition_value=22300000,
                        current_value=24800000,
                        target_yield=3.4,
                        notes="Core long-term hold",
                    ),
                    PortfolioHolding(
                        id="hold-2",
                        user_id="demo-investor",
                        property_id="bangalore-whitefield-orbit-heights",
                        acquisition_value=18100000,
                        current_value=19500000,
                        target_yield=4.2,
                        notes="Growth corridor position",
                    ),
                ]
            )

        if not db.query(AlertRule).first():
            db.add_all(
                [
                    AlertRule(
                        id="alert-1",
                        user_id="demo-investor",
                        title="Mumbai underpriced opportunities",
                        city="Mumbai",
                        trigger="AI score above 85 and overpricing below 2%",
                        status="active",
                    ),
                    AlertRule(
                        id="alert-2",
                        user_id="demo-investor",
                        title="Bangalore villa launches",
                        city="Bangalore",
                        trigger="New villa inventory above 2500 sqft",
                        status="active",
                    ),
                ]
            )

        db.commit()
    except SQLAlchemyError:
        db.rollback()
    finally:
        db.close()
