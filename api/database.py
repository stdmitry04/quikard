# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# get database url from environment or use sqlite as default
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./quikard.db")

# create sqlalchemy engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    echo=True  # set to False in production
)

# create sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# create base class for models
Base = declarative_base()

# dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# create all tables
def create_tables():
    Base.metadata.create_all(bind=engine)
