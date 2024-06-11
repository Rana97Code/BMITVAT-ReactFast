from sqlalchemy import create_engine,MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

metadata = MetaData()
#for local mysql
SQLALCHEMY_DATABASE_URL = "mysql+mysqldb://root@localhost:3306/bmitvatdb"

#Database connection
engine=create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

metadata.create_all(engine)

Base = declarative_base()

#Session Generate
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()