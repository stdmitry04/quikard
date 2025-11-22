

![1231232222](https://github.com/user-attachments/assets/7161a5e3-ba1b-48e3-a7ae-5660defa7e29)
![1761759074613](https://github.com/user-attachments/assets/e2312bba-caf6-44a0-aaa3-430f718c6bbf)
![1761759074612](https://github.com/user-attachments/assets/6c26563b-d50b-4ee4-a3f6-90f8a213cdf9)

# QuiKard

A modern digital business card creation platform with QR code generation and Apple Wallet integration.

## Overview

QuiKard enables users to create, customize, and share digital business cards that can be saved to Apple Wallet. The application generates QR codes for easy sharing and provides a seamless way to distribute contact information digitally.

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.2 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React icons
- **QR Generation**: qrcode.react
- **Build Tool**: Turbopack

### Backend
- **Framework**: FastAPI
- **Language**: Python
- **Database**: PostgreSQL (production) / SQLite (development)
- **ORM**: SQLAlchemy
- **Integration**: Apple Wallet Pass API

## Project Structure

```
quikard/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/      # Next.js app directory
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── api/              # FastAPI backend
│   ├── routes/       # API endpoints
│   ├── models.py     # Database models
│   ├── schemas.py    # Pydantic schemas
│   ├── database.py   # Database configuration
│   └── main.py       # Application entry point
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.9+
- Docker and Docker Compose (optional)

### Development Setup

#### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/quikard.git
cd quikard
```

2. Set up environment variables:
```bash
cp api/.env.example api/.env
# Edit api/.env with your configuration
```

3. Start the services:
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

#### Manual Setup

**Backend:**

1. Navigate to the api directory:
```bash
cd api
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run the development server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Environment Variables

### API (.env)
```
ENV=development
BASE_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
BADGE_API_KEY=your_badge_api_key
BADGE_TEMPLATE_ID=your_template_id
DATABASE_URL=postgresql://user:password@localhost:5432/quikard
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- Database migrations and other scripts as needed

## Features

- Create customizable digital business cards
- Generate QR codes for easy sharing
- Apple Wallet integration for saving cards
- Responsive design for mobile and desktop
- Real-time card preview
- Contact information management

## API Documentation

When running the backend, interactive API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

The application is configured for deployment on Fly.io with the following production setup:
- Frontend and backend hosted separately
- PostgreSQL database
- CORS configured for production domains
- Environment-based configuration

## License

This project is licensed under the terms specified in the LICENSE file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
