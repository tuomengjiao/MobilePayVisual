import sys
sys.path.insert(0, "/users/hk/dev/MobilePayVisual")
import pandas as pd


path = "/users/hk/dev/MobilePayVisual/backend/data/today/"

f1 = "7_days_remain_user_2020_01_11_17_48_pm.csv"
# f2 = "active_user_2020_01_11_17_48_pm.csv"
f3 = "last_month_remain_user_2020_01_11_17_48_pm.csv"
f4 = "level_1_pv_uv_2020_01_11_17_48_pm.csv"
f5 = "level_2_pv_uv_2020_01_11_17_48_pm.csv"
f6 = "level_3_pv_uv_2020_01_11_17_48_pm.csv"
# f7 = "new_user_2020_01_11_17_48_pm.csv"
f8 = "transaction_by_day_2020_01_11_17_48_pm.csv"
f9 = "yesterday_user_2020_01_11_17_48_pm.csv"

files = [f1, f3, f4, f5, f6, f8, f9]

total_keys = []
for i in files:
    data = pd.read_csv(path + i)
    total_keys.extend(data.columns)
print(len(set(total_keys)))
print(set(total_keys))
