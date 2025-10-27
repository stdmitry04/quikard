# Quikard Deployment Guide - Fly.io

## Prerequisites

1. Install Fly.io CLI:
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. Sign up and login:
   ```bash
   fly auth signup  # or fly auth login if you have an account
   ```

## Step 1: Create PostgreSQL Database

Fly.io doesn't automatically provision databases. You need to create one first:

```bash
# Create a PostgreSQL cluster (choose a region close to your users)
fly postgres create --name quikard-db --region sjc

# Choose configuration when prompted:
# - Development (shared-cpu-1x, 256MB RAM) - FREE
# - Or Production (more resources)
```

**Important:** Save the connection string shown after creation! It looks like:
```
postgres://postgres:password@quikard-db.internal:5432
```

## Step 2: Deploy Backend API

1. Navigate to your API directory:
   ```bash
   cd api
   ```

2. Create a `fly.toml` file:
   ```bash
   fly launch --no-deploy
   ```

3. Edit `fly.toml` to configure your app:
   ```toml
   app = "quikard-api"
   primary_region = "sjc"  # Same region as your database

   [build]
     dockerfile = "Dockerfile"

   [http_service]
     internal_port = 8000
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0

   [[services]]
     protocol = "tcp"
     internal_port = 8000

     [[services.ports]]
       port = 80
       handlers = ["http"]

     [[services.ports]]
       port = 443
       handlers = ["tls", "http"]

   [env]
     BASE_URL = "https://quikard.com"  # Update with your frontend URL
   ```

4. Set environment variables (secrets):
   ```bash
   # Attach PostgreSQL database
   fly postgres attach quikard-db

   # Set Badge API credentials
   fly secrets set BADGE_API_KEY="your-badge-api-key"
   fly secrets set BADGE_TEMPLATE_ID="your-template-id"

   # The following are automatically configured based on ENV=production:
   # - DATABASE_URL: Set by `fly postgres attach`
   # - BASE_URL: Defaults to https://quikard-frontend.fly.dev
   # - ALLOWED_ORIGINS: Defaults to https://quikard-frontend.fly.dev

   # Optional: Override with custom domain
   # fly secrets set BASE_URL="https://yourdomain.com"
   # fly secrets set ALLOWED_ORIGINS="https://yourdomain.com,https://quikard-frontend.fly.dev"
   ```

5. Deploy:
   ```bash
   fly deploy
   ```

## Step 3: Deploy Frontend (Next.js)

1. Navigate to your frontend directory:
   ```bash
   cd ../frontend
   ```

2. Create a `fly.toml` file:
   ```bash
   fly launch --no-deploy
   ```

3. Edit `fly.toml`:
   ```toml
   app = "quikard-frontend"
   primary_region = "sjc"

   [build]
     dockerfile = "Dockerfile"

   [http_service]
     internal_port = 3000
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0

   [env]
     NODE_ENV = "production"
   ```

4. Set environment variables:
   ```bash
   fly secrets set NEXT_PUBLIC_API_URL="https://quikard-api.fly.dev"
   ```

5. Deploy:
   ```bash
   fly deploy
   ```

## Step 4: Verify Deployment

1. Check API health:
   ```bash
   fly open  # Opens your API in browser
   # Visit https://quikard-api.fly.dev/docs to see API documentation
   ```

2. Check frontend:
   ```bash
   cd ../frontend
   fly open
   ```

3. View logs:
   ```bash
   # API logs
   cd ../api
   fly logs

   # Frontend logs
   cd ../frontend
   fly logs
   ```

## Local Development with PostgreSQL

To test locally with PostgreSQL before deploying:

```bash
# Start PostgreSQL and services
docker-compose up -d

# The API will now use PostgreSQL instead of SQLite
# Connection: postgresql://quikard:quikard_dev_password@localhost:5432/quikard
```

## Database Migrations

Your database tables will be created automatically on first run thanks to:
```python
# In main.py
create_tables()  # This runs when the app starts
```

## Monitoring & Scaling

```bash
# Check app status
fly status

# Scale to multiple regions (if needed)
fly scale count 2

# View metrics
fly dashboard
```

## Costs

- **PostgreSQL**: Free tier available (Development config)
- **API & Frontend**: Free tier with auto-stop (sleeps when inactive)
- **Total**: Can run entirely on free tier for development/testing

## Troubleshooting

### Database connection issues:
```bash
# Check database status
fly postgres db list --app quikard-db

# Connect to database directly
fly postgres connect --app quikard-db
```

### View environment variables:
```bash
fly ssh console -a quikard-api
env | grep DATABASE_URL
```

### Reset deployment:
```bash
fly apps destroy quikard-api
fly apps destroy quikard-frontend
# Then redeploy from Step 2
```

## Custom Domain (Optional)

1. Add your domain:
   ```bash
   fly certs create yourdomain.com
   ```

2. Update DNS records as instructed

3. Update environment variables with your domain
