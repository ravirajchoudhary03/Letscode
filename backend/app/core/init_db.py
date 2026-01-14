"""Database initialization script."""

from sqlalchemy import create_engine
from app.models.database import Base, Platform, Category
from app.core.config import get_settings


def init_database():
    """
    Initialize database schema and seed initial data.
    
    Run this once when setting up a new database.
    """
    settings = get_settings()
    engine = create_engine(settings.database_url)
    
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully")
    
    # Seed platforms
    from sqlalchemy.orm import sessionmaker
    Session = sessionmaker(bind=engine)
    db = Session()
    
    try:
        # Check if platforms already exist
        existing_platforms = db.query(Platform).count()
        
        if existing_platforms == 0:
            print("Seeding platforms...")
            platforms = [
                Platform(name="Reddit", description="Reddit posts and comments", is_active=1),
                Platform(name="YouTube", description="YouTube videos", is_active=1),
                Platform(name="News", description="News articles and blogs", is_active=1),
                Platform(name="Google", description="Google Search results", is_active=1)
            ]
            db.add_all(platforms)
            db.commit()
            print("✓ Platforms seeded")
        
        # Check if categories exist
        existing_categories = db.query(Category).count()
        
        if existing_categories == 0:
            print("Seeding categories...")
            categories = [
                Category(name="Fashion", description="Fashion and apparel brands"),
                Category(name="Beauty", description="Beauty and cosmetics brands"),
                Category(name="Food", description="Food and beverage brands"),
                Category(name="Tech", description="Technology brands"),
                Category(name="Wellness", description="Health and wellness brands")
            ]
            db.add_all(categories)
            db.commit()
            print("✓ Categories seeded")
        
        print("\n✅ Database initialization complete!")
        print(f"Database URL: {settings.database_url}")
        
    except Exception as e:
        print(f"❌ Error during initialization: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_database()
