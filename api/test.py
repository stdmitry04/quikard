# test_db.py (put this in the same directory as main.py)
print("🧪 Testing database creation...")

# test imports
try:
	from database import engine, Base, create_tables

	print("✅ Database imports OK")
except Exception as e:
	print(f"❌ Database import failed: {e}")
	exit(1)

try:
	from models import BusinessCard

	print("✅ Models import OK")
except Exception as e:
	print(f"❌ Models import failed: {e}")
	exit(1)

# test table creation
try:
	print("🗄️ Creating tables...")
	Base.metadata.create_all(bind=engine)
	print("✅ Tables created!")

	# verify tables exist
	from sqlalchemy import inspect

	inspector = inspect(engine)
	tables = inspector.get_table_names()
	print(f"📋 Tables in database: {tables}")

except Exception as e:
	print(f"❌ Table creation failed: {e}")
	import traceback

	traceback.print_exc()