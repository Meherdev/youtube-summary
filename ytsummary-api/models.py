from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from db import Base

class DeviceRequest(Base):
    __tablename__ = "device_requests"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
