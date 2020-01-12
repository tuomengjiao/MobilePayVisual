from common.utils import app_url
from mobile_pay.serve import TransactionDailyReport


def mobile_pay_route_func(api, api_version, model):
    api.add_resource(TransactionDailyReport, app_url(api_version, model, '/daily_report'))

    return
