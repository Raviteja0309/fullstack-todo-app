import sys
import psycopg2
import logging
from dotenv import dotenv_values

# Setup logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Load environment variables
config = dotenv_values(".env")

# Read full PostgreSQL URL from .env
POSTGRES_DATABASE_URL = config.get("POSTGRES_DATABASE_URL")

class DBConnector:
    def __init__(self):
        try:
            self.connection = psycopg2.connect(POSTGRES_DATABASE_URL)
            logger.info("Database connection established successfully")
        except Exception as e:
            logger.error(f"Error connecting to the database: {e}")
            sys.exit("Database connection failed.")

    def get_conn(self):
        return self.connection

    def close(self):
        if self.connection:
            self.connection.close()
            logger.info("Database connection closed")
