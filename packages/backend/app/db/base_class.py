from sqlalchemy.orm import declarative_base

# This creates a Base class. Our ORM models (the Python classes that map to
# database tables) will inherit from this class.
Base = declarative_base()