# schemas.py
from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional
from datetime import datetime
import re


class SocialLink(BaseModel):
    type: str
    url: str  # Now accepts username/identifier instead of full URL
    label: str

    @validator('url')
    def validate_username(cls, v, values):
        """Ensure URL field contains valid username/identifier"""
        # Remove whitespace
        v = v.strip()

        platform = values.get('type', '')

        # For social media platforms, ensure no full URLs are passed
        if platform in ['linkedin', 'instagram', 'twitter', 'github']:
            # Check if it looks like a URL (has protocol or multiple slashes)
            if v.startswith(('http://', 'https://', 'www.')) or '//' in v:
                raise ValueError(
                    f'For {platform}, please provide only your username, not a full URL')

            # Remove @ if present
            v = v.lstrip('@')

            # Validate format: alphanumeric, underscore, hyphen, period only
            if not re.match(r'^[a-zA-Z0-9_\-\.]+$', v):
                raise ValueError(
                    f'Username can only contain letters, numbers, underscores, hyphens, and periods')

        elif platform == 'website':
            # For websites, remove protocol if present
            v = v.replace('http://', '').replace('https://', '').rstrip('/')

        # Ensure not empty
        if not v:
            raise ValueError('Username/URL cannot be empty')

        return v

    class Config:
        from_attributes = True


class CreateCardRequest(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    profilePicture: Optional[str] = None  # Base64 encoded image
    links: List[SocialLink] = []

    class Config:
        from_attributes = True


class CreateCardResponse(BaseModel):
    cardId: int
    slug: str
    shareableUrl: str

    class Config:
        from_attributes = True


class CardDisplay(BaseModel):
    firstName: str
    lastName: str
    email: Optional[str] = None
    phone: Optional[str] = None
    profilePicture: Optional[str] = None
    links: List[SocialLink] = []
    createdAt: datetime
    qrCodeUrl: Optional[str] = None

    class Config:
        from_attributes = True
