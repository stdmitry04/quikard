# middleware/rate_limit.py
from fastapi import Request, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from models import IPRateLimit
import re

def get_client_ip(request: Request) -> str:
    """Extract client IP from request, handling proxies"""
    # Check common proxy headers
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # X-Forwarded-For can contain multiple IPs, get the first one
        return forwarded_for.split(",")[0].strip()

    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()

    # Fallback to direct client
    if request.client:
        return request.client.host

    return "unknown"

def check_rate_limit(ip_address: str, db: Session) -> bool:
    """
    Check if IP has exceeded rate limit (1 submission per 24 hours)
    Returns True if allowed, raises HTTPException if blocked
    """
    # Find existing rate limit record
    rate_limit = db.query(IPRateLimit).filter(
        IPRateLimit.ip_address == ip_address
    ).first()

    current_time = datetime.utcnow()

    if rate_limit:
        # Check if 24 hours have passed since last submission
        time_since_last = current_time - rate_limit.last_submission

        if time_since_last < timedelta(hours=24):
            # Calculate remaining time
            remaining_time = timedelta(hours=24) - time_since_last
            hours = int(remaining_time.total_seconds() // 3600)
            minutes = int((remaining_time.total_seconds() % 3600) // 60)

            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. You can create a new card in {hours}h {minutes}m"
            )

        # Update the record
        rate_limit.last_submission = current_time
        rate_limit.submission_count += 1
    else:
        # Create new rate limit record
        rate_limit = IPRateLimit(
            ip_address=ip_address,
            last_submission=current_time,
            submission_count=1
        )
        db.add(rate_limit)

    db.commit()
    return True

def sanitize_username(username: str, platform: str) -> str:
    """
    Sanitize username to ensure it only contains allowed characters
    Different platforms have different username rules
    """
    # Remove whitespace
    username = username.strip()

    if platform in ['linkedin', 'instagram', 'twitter', 'github']:
        # Social media usernames: alphanumeric, underscore, hyphen, period
        # Remove @ if present
        username = username.lstrip('@')
        # Only allow alphanumeric, underscore, hyphen, period
        username = re.sub(r'[^a-zA-Z0-9_\-\.]', '', username)
    elif platform == 'website':
        # Website URLs: more permissive, but no protocol
        username = username.replace('http://', '').replace('https://', '')
        # Remove trailing slashes
        username = username.rstrip('/')

    # Ensure it's not empty after sanitization
    if not username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid username format for {platform}"
        )

    return username

def build_full_url(username: str, platform: str) -> str:
    """Build full URL from username and platform"""
    url_templates = {
        'linkedin': 'https://linkedin.com/in/{id}',
        'instagram': 'https://instagram.com/{id}',
        'twitter': 'https://twitter.com/{id}',
        'github': 'https://github.com/{id}',
        # 'website': 'https://{id}',
    }

    template = url_templates.get(platform)
    if template:
        return template.replace('{id}', username)

    # For custom links, expect full URL but still sanitize
    if not username.startswith('http'):
        username = 'https://' + username

    return username
