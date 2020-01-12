from flask_restful import reqparse, Api, Resource
from app.init_global import global_var
from common.utils import encoding_resp_utf8
from mobile_pay.logic.get_transaction_daily_report import get_transaction_daily_report


class TransactionDailyReport(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('keyword', type=str, required=False, location='args')
        parser.add_argument('page', type=int, required=False, location='args')
        parser.add_argument('pageSize', type=int, required=False, location='args')

        args = parser.parse_args()
        res = get_transaction_daily_report(global_var["db"], args)

        return encoding_resp_utf8(res)
