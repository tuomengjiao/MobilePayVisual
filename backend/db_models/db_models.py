from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = 'mobile_pay_visual'
    id = Column(Integer, autoincrement=True, primary_key=True)
    type = Column(String(256), nullable=False, comment="交易类型")

    level_1_pv = Column(Integer, nullable=False, comment="一级访问次数pv")
    level_2_pv = Column(Integer, nullable=False, comment="二级访问次数pv")
    level_3_pv = Column(Integer, nullable=False, comment="三级访问次数pv")

    level_1_uv = Column(Integer, nullable=False, comment="一级访问次数uv")
    level_2_uv = Column(Integer, nullable=False, comment="一级访问次数uv")
    level_3_uv = Column(Integer, nullable=False, comment="一级访问次数uv")

    transaction_count = Column(Integer, nullable=False, comment="交易笔数")
    transaction_at = Column(Integer, nullable=False, comment="交易金额")
    transaction_user_count = Column(Integer, nullable=False, comment="交易用户数量")
    transaction_new_user_count = Column(Integer, nullable=False, comment="当日新交易用户数量")

    yesterday_remain_user_count = Column(Integer, nullable=False, comment="昨天留存用户数量")
    seven_days_remain_user_count = Column(Integer, nullable=False, comment="7日留存用户数量")
    last_month_remain_user_count = Column(Integer, nullable=False, comment="上个月留存用户数量")

    part_dt = Column(DateTime, nullable=False, default=datetime.now)

    created_at = Column(DateTime, nullable=False, default=datetime.now)
    created_by = Column(Integer, nullable=False, default=0)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)
    updated_by = Column(Integer, nullable=False, default=0)
