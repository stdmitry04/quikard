# schemas_passes.py
from pydantic import BaseModel
from typing import Optional


class CreatePassRequest(BaseModel):
	"""
	Optional request body for pass creation with customization options
	"""
	customMessage: Optional[str] = None
	backgroundColor: Optional[str] = None
	foregroundColor: Optional[str] = None

	class Config:
		from_attributes = True


class CreatePassResponse(BaseModel):
	"""
	Response after creating a digital pass
	"""
	success: bool
	passId: str
	cardUrl: str
	appleWalletUrl: Optional[str] = None
	googlePayUrl: Optional[str] = None
	passUrl: Optional[str] = None
	message: str

	class Config:
		from_attributes = True


class PassStatusResponse(BaseModel):
	"""
	Response for pass status check
	"""
	cardExists: bool
	slug: str
	cardUrl: str
	canCreatePass: bool
	passId: Optional[str] = None

	class Config:
		from_attributes = True