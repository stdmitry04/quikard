# models.py
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

class BusinessCard(Base):
    __tablename__ = "business_cards"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)

    # personal information
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)

    # profile picture stored as base64, qr code as file path
    profile_picture_path = Column(Text, nullable=True)  # Now stores base64 data
    qr_code_path = Column(String(500), nullable=True)

    # social links stored as json
    links = Column(JSON, nullable=True, default=[])

    # rate limiting
    ip_address = Column(String(45), nullable=True, index=True)  # supports ipv6

    # timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class IPRateLimit(Base):
    __tablename__ = "ip_rate_limits"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String(45), nullable=False, index=True)
    last_submission = Column(DateTime(timezone=True), nullable=False)
    submission_count = Column(Integer, default=1, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
