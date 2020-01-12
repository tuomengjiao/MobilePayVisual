from db_models.db_models import DailyTransactionReport
from common.utils import get_value_with_default, build_rows_result
from datetime import datetime, timedelta
import traceback


def get_transaction_daily_report(db, args):
    """
    从表中拿出当天的daily report 数据
    过滤条件: 时间是昨天, 即 datetime.now() - 1
    """
    page = get_value_with_default(args, "page", 1)
    pageSize = get_value_with_default(args, "pageSize", 50)

    yesterday = (datetime.now() - timedelta(days=1)).date()
    try:
        query = db.session.query(
            DailyTransactionReport.id,
            DailyTransactionReport.type,
            DailyTransactionReport.transaction_count,
            DailyTransactionReport.transaction_new_user_count,
            DailyTransactionReport.transaction_at
        ) \
            .filter(DailyTransactionReport.part_dt == yesterday)

        offset = (page - 1) * pageSize
        total = query.count()
        rows = query.order_by(DailyTransactionReport.id).offset(offset).limit(pageSize).all()

        items = ["id", "type", "transaction_count", "transaction_new_user_count", "transaction_at"]
        data = build_rows_result(rows, items)

        res = {
            "code": "SUCCESS",
            "data": {
                "total": total,
                "data": data
            }
        }
    except Exception as e:
        res = {
            "code": "FAILURE",
            "message": "Failed to get today transaction report:\n%s" % traceback.format_exc()
        }
    return res
