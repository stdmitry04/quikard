# routes/passes.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session
import requests
import os
from typing import Optional

from database import get_db
from models import BusinessCard
from schemas_passes import CreatePassRequest, CreatePassResponse

# Get configuration from environment variables
BADGE_API_URL = "https://api.trybadge.com/v0/rpc/userPassUpsert"
BADGE_API_KEY = os.getenv("BADGE_API_KEY")
BADGE_TEMPLATE_ID = os.getenv("BADGE_TEMPLATE_ID")
BASE_URL = os.getenv("BASE_URL", "https://quikard.vercel.app")

router = APIRouter(prefix="/api/v1/passes", tags=["passes"])


def create_badge_pass(card_id: str, card_slug: str, card_url: str, user_name: str) -> dict:
	"""
	Create or update a digital pass via Badge API

	Args:
		card_id: The database ID of the business card
		card_slug: The unique slug for the card
		card_url: The shareable URL for the card
		user_name: Display name for the pass holder

	Returns:
		dict: Response from Badge API containing pass information
	"""
	payload = {
		"passTemplateId": BADGE_TEMPLATE_ID,
		"user": {
			"id": card_id,
			"name": user_name
		},
		"pass": {
			"id": f"quikard-{card_slug}",  # unique identifier per user/pass
			"attributes": {
				"link": card_url
			}
		}
	}

	headers = {
		"accept": "application/json",
		"content-type": "application/json",
		"Authorization": f"Bearer {BADGE_API_KEY}"
	}

	try:
		response = requests.post(BADGE_API_URL, json=payload, headers=headers, timeout=10)
		response.raise_for_status()
		return response.json()
	except requests.exceptions.HTTPError as e:
		raise HTTPException(
			status_code=e.response.status_code if e.response else 500,
			detail=f"Badge API error: {e.response.text if e.response else str(e)}"
		)
	except requests.exceptions.RequestException as e:
		raise HTTPException(
			status_code=503,
			detail=f"Failed to connect to Badge API: {str(e)}"
		)


def get_pass_download_url(pass_template_id: str = None) -> str:
	"""
	Get the download URL for a pass template

	Args:
		pass_template_id: Optional template ID, uses default if not provided

	Returns:
		str: Download URL for the pass
	"""
	template_id = pass_template_id or BADGE_TEMPLATE_ID
	url = f"https://api.trybadge.com/v0/passTemplates/{template_id}"

	headers = {
		"accept": "application/json",
		"Authorization": f"Bearer {BADGE_API_KEY}"
	}

	try:
		response = requests.get(url, headers=headers, timeout=10)
		response.raise_for_status()
		data = response.json()
		return data.get("downloadUrl", "")
	except requests.exceptions.RequestException as e:
		# If we can't get the download URL, return empty string
		# The pass was still created, just can't get download URL
		print(f"Warning: Could not retrieve download URL: {e}")
		return ""


@router.post("/{slug}", response_model=CreatePassResponse)
async def create_digital_pass(
		slug: str,
		request_data: Optional[CreatePassRequest] = None,
		db: Session = Depends(get_db)
):
	"""
	Create a digital pass (Apple Wallet/Google Pay) for a business card

	Args:
		slug: The unique slug of the business card
		request_data: Optional additional data for pass customization

	Returns:
		CreatePassResponse with pass URLs and metadata
	"""
	# Find the business card
	card = db.query(BusinessCard).filter(BusinessCard.slug == slug).first()

	if not card:
		raise HTTPException(
			status_code=404,
			detail="Business card not found"
		)

	# Build card URL
	card_url = f"{BASE_URL}/card/{card.slug}"

	# Construct user display name
	name_parts = []
	if card.first_name:
		name_parts.append(card.first_name)
	if card.last_name:
		name_parts.append(card.last_name)

	user_name = " ".join(name_parts) if name_parts else "Quikard User"

	# Create the digital pass via Badge API
	try:
		badge_response = create_badge_pass(
			card_id=str(card.id),
			card_slug=card.slug,
			card_url=card_url,
			user_name=user_name
		)

		print(f"📦 Badge API Full Response: {badge_response}")

		# Extract data from Badge API response
		pass_data = badge_response.get("pass", {})
		print(f"📦 Pass Data: {pass_data}")

		pass_id = pass_data.get('id') or f"quikard-{card.slug}"
		download_url = pass_data.get("downloadUrl")

		print(f"🔑 Pass ID: {pass_id}")
		print(f"📥 Download URL from Badge: {download_url}")

		# Badge API returns a token-based download URL, use it directly
		# Also construct platform-specific URLs if needed
		apple_wallet_url = None
		google_pay_url = None

		if download_url:
			print(f"✅ Pass created successfully!")
			print(f"📱 Will return download URL: {download_url}")
		else:
			print(f"⚠️  WARNING: No download URL in Badge API response!")

		response_data = CreatePassResponse(
			success=True,
			passId=pass_id,
			cardUrl=card_url,
			appleWalletUrl=apple_wallet_url,
			googlePayUrl=google_pay_url,
			passUrl=download_url,
			downloadUrl=download_url,
			message=f"Digital pass created successfully for {user_name}"
		)

		print(f"📤 Returning response to frontend:")
		print(f"   passId: {response_data.passId}")
		print(f"   downloadUrl: {response_data.downloadUrl}")
		print(f"   passUrl: {response_data.passUrl}")

		return response_data

	except HTTPException:
		raise
	except Exception as e:
		raise HTTPException(
			status_code=500,
			detail=f"Failed to create digital pass: {str(e)}"
		)


@router.get("/{slug}/status")
async def get_pass_status(slug: str, db: Session = Depends(get_db)):
	"""
	Check if a digital pass exists for a business card

	Args:
		slug: The unique slug of the business card

	Returns:
		Status information about the pass
	"""
	# Find the business card
	card = db.query(BusinessCard).filter(BusinessCard.slug == slug).first()

	if not card:
		raise HTTPException(
			status_code=404,
			detail="Business card not found"
		)

	return {
		"cardExists": True,
		"slug": card.slug,
		"cardUrl": f"{BASE_URL}/card/{card.slug}",
		"canCreatePass": True
	}


@router.get("/{slug}/download")
async def get_pass_download(slug: str, db: Session = Depends(get_db)):
	"""
	Get the download URL for an existing pass

	Args:
		slug: The unique slug of the business card

	Returns:
		Download URL information
	"""
	# Find the business card
	card = db.query(BusinessCard).filter(BusinessCard.slug == slug).first()

	if not card:
		raise HTTPException(
			status_code=404,
			detail="Business card not found"
		)

	# Get download URL from Badge API
	download_url = get_pass_download_url()

	if not download_url:
		raise HTTPException(
			status_code=404,
			detail="Pass download URL not available"
		)

	pass_id = f"quikard-{card.slug}"

	return {
		"success": True,
		"passId": pass_id,
		"downloadUrl": download_url,
		"appleWalletUrl": f"https://api.trybadge.com/passes/apple/{pass_id}",
		"googlePayUrl": f"https://api.trybadge.com/passes/google/{pass_id}",
		"cardUrl": f"{BASE_URL}/card/{card.slug}"
	}


@router.get("/{slug}/apple-wallet-pass")
async def download_apple_wallet_pass(slug: str, db: Session = Depends(get_db)):
	"""
	Download the actual .pkpass file for Apple Wallet

	Args:
		slug: The unique slug of the business card

	Returns:
		Binary .pkpass file that can be opened in Apple Wallet
	"""
	# Find the business card
	card = db.query(BusinessCard).filter(BusinessCard.slug == slug).first()

	if not card:
		raise HTTPException(
			status_code=404,
			detail="Business card not found"
		)

	# Construct pass ID
	pass_id = f"quikard-{card.slug}"

	# Call Badge API to get the .pkpass binary
	url = f"https://api.trybadge.com/v0/passTemplates/{BADGE_TEMPLATE_ID}/passes/{pass_id}/appleWalletPkpass"

	headers = {
		"Accept": "application/vnd.apple.pkpass",
		"Authorization": f"Bearer {BADGE_API_KEY}"
	}

	print(f"📱 Fetching Apple Wallet pass from Badge API...")
	print(f"   URL: {url}")
	print(f"   Pass ID: {pass_id}")

	try:
		response = requests.get(url, headers=headers, timeout=15)
		response.raise_for_status()

		print(f"✅ Successfully fetched .pkpass file ({len(response.content)} bytes)")

		# Return the binary .pkpass file
		return Response(
			content=response.content,
			media_type="application/vnd.apple.pkpass",
			headers={
				"Content-Disposition": f"attachment; filename={pass_id}.pkpass"
			}
		)

	except requests.exceptions.HTTPError as e:
		print(f"❌ Badge API error: {e.response.status_code if e.response else 'unknown'}")
		if e.response:
			print(f"   Response: {e.response.text}")
		raise HTTPException(
			status_code=e.response.status_code if e.response else 500,
			detail=f"Failed to fetch Apple Wallet pass from Badge API: {e.response.text if e.response else str(e)}"
		)
	except requests.exceptions.RequestException as e:
		print(f"❌ Request error: {str(e)}")
		raise HTTPException(
			status_code=503,
			detail=f"Failed to connect to Badge API: {str(e)}"
		)


@router.delete("/{slug}")
async def delete_digital_pass(slug: str, db: Session = Depends(get_db)):
	"""
	Delete/revoke a digital pass for a business card
	Note: This is a placeholder - Badge API deletion endpoint needed

	Args:
		slug: The unique slug of the business card
	"""
	card = db.query(BusinessCard).filter(BusinessCard.slug == slug).first()

	if not card:
		raise HTTPException(
			status_code=404,
			detail="Business card not found"
		)

	# Note: Implement Badge API deletion if available
	# For now, just return success as passes can be recreated

	return {
		"success": True,
		"message": "Pass deletion requested",
		"note": "The pass will expire or can be recreated as needed"
	}
