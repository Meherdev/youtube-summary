from sqlalchemy import Column, Integer, String, ForeignKey, Date
from datetime import datetime
from db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class SummaryUsage(Base):
    __tablename__ = "summary_usage"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)
    count = Column(Integer, default=0)