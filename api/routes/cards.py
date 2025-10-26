# routes/cards.py
import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import os
import base64
import qrcode
from io import BytesIO
import re
import secrets
from PIL import Image

from database import get_db  # your database session dependency
from models import BusinessCard
from schemas import CreateCardRequest, CreateCardResponse, CardDisplay, SocialLink
from middleware.rate_limit import check_rate_limit, get_client_ip, build_full_url

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/cards", tags=["cards"])

# configuration
UPLOAD_DIR = "uploads"
QR_CODE_DIR = "qr_codes"
PROFILE_PICS_DIR = "profile_pics"
BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")

# ensure upload directories exist
os.makedirs(f"{UPLOAD_DIR}/{PROFILE_PICS_DIR}", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/{QR_CODE_DIR}", exist_ok=True)


def generate_slug(first_name: str, last_name: str) -> str:
    """generate a unique slug for the business card"""
    # clean and combine names
    clean_first = re.sub(
        r'[^a-zA-Z0-9]',
        '',
        first_name.lower()) if first_name else ""
    clean_last = re.sub(
        r'[^a-zA-Z0-9]',
        '',
        last_name.lower()) if last_name else ""

    # create base slug
    if clean_first and clean_last:
        base_slug = f"{clean_first}-{clean_last}"
    elif clean_first:
        base_slug = clean_first
    elif clean_last:
        base_slug = clean_last
    else:
        base_slug = "card"

    # add random suffix to ensure uniqueness
    random_suffix = secrets.token_hex(4)
    return f"{base_slug}-{random_suffix}"


def save_profile_picture(base64_image: str, card_id: str) -> str:
    """save base64 image to disk and return relative file path"""
    try:
        # decode base64 image
        # remove data:image/jpeg;base64, prefix
        image_data = base64.b64decode(base64_image.split(',')[1])

        # create filename
        filename = f"{card_id}.jpg"
        file_path = f"{UPLOAD_DIR}/{PROFILE_PICS_DIR}/{filename}"

        # save image
        with open(file_path, "wb") as f:
            f.write(image_data)

        # return relative path from uploads directory for static serving
        return f"{PROFILE_PICS_DIR}/{filename}"
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"failed to process profile picture: {str(e)}"
        )


@router.post("/", response_model=CreateCardResponse)
async def create_business_card(
    request: Request,
    card_data: CreateCardRequest,
    db: Session = Depends(get_db)
):
    logger.info("📨 Card creation request received")
    print("📨 Card creation request received")

    try:
        # Get client IP address
        client_ip = get_client_ip(request)
        print(f"🌐 Client IP: {client_ip}")

        # Check rate limit (1 submission per 24 hours per IP)
        check_rate_limit(client_ip, db)

        print(f"📝 Data: {card_data.firstName} {card_data.lastName}")

        # validate that we have at least some data
        if not any([
                card_data.firstName.strip() if card_data.firstName else False,
                card_data.lastName.strip() if card_data.lastName else False,
                card_data.email,
                card_data.phone
        ]):
            print("❌ Validation failed")
            raise HTTPException(
                status_code=400,
                detail="at least one field must be provided"
            )

        print("🏷️ Generating slug...")
        slug = generate_slug(
            card_data.firstName or "",
            card_data.lastName or ""
        )
        print(f"Generated slug: {slug}")

        # Build full URLs from usernames
        processed_links = []
        for link in card_data.links:
            full_url = build_full_url(link.url, link.type)
            processed_links.append({
                "type": link.type,
                "url": full_url,
                "label": link.label
            })
            print(f"🔗 Processed link: {link.type} -> {full_url}")

        print("💾 Creating database record...")
        new_card = BusinessCard(
            slug=slug,
            first_name=card_data.firstName,
            last_name=card_data.lastName,
            email=card_data.email,
            phone=card_data.phone,
            ip_address=client_ip,
            links=processed_links
        )

        print("💾 Adding to database...")
        db.add(new_card)
        db.flush()
        print(f"Card ID: {new_card.id}")

        # Save profile picture if provided
        profile_pic_path = None
        if card_data.profilePicture:
            print("📸 Saving profile picture...")
            try:
                profile_pic_path = save_profile_picture(
                    card_data.profilePicture, str(new_card.id))
                new_card.profile_picture_path = profile_pic_path
                print(f"✅ Profile picture saved: {profile_pic_path}")
            except Exception as e:
                print(f"⚠️ Failed to save profile picture: {e}")

        print("✅ Success! Returning response...")
        response = CreateCardResponse(
            cardId=new_card.id,
            slug=new_card.slug,
            shareableUrl=f"{BASE_URL}/card/{slug}",
        )

        db.commit()
        print("📤 Response sent")
        return response

    except HTTPException:
        # Re-raise HTTP exceptions (like rate limit errors)
        raise
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"internal server error: {str(e)}"
        )


@router.get("/{slug}", response_model=CardDisplay)
async def get_business_card(slug: str, db: Session = Depends(get_db)):
    """get a business card by slug"""
    # find the card
    card = db.query(BusinessCard).filter(BusinessCard.slug == slug).first()

    if not card:
        raise HTTPException(
            status_code=404,
            detail="business card not found"
        )

    # prepare response
    response = CardDisplay(
        firstName=card.first_name or "",
        lastName=card.last_name or "",
        email=card.email,
        phone=card.phone,
        profilePicture=f"{BASE_URL}/static/{card.profile_picture_path}" if card.profile_picture_path else None,
        links=[SocialLink(**link) for link in (card.links or [])],
        createdAt=card.created_at,
    )

    return response
