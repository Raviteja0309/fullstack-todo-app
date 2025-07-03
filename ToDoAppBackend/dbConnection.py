import sys
sys.path.append(".")

from dbConnector import DBConnector

class DbConnection:
    def __init__(self):
        self.connector = None

    def __enter__(self):
        self.connector = DBConnector()
        return self.connector.get_conn()

    def __exit__(self, exc_type, exc_value, traceback):
        if self.connector:
            self.connector.close()
