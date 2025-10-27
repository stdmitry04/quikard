from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load .env variables (useful for local development)
load_dotenv()

# Get database URL from environment or use SQLite as fallback
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:uT5BAkhQlRiobvk@quikard-db.flycast:5432/postgres")

# SQLite-specific argument
connect_args = {}
# if DATABASE_URL.startswith("sqlite"):
#     connect_args["check_same_thread"] = False

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False  # Set True to see SQL queries
)

# Create sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create all tables (call this on startup)
def create_tables():
    Base.metadata.create_all(bind=engine)
