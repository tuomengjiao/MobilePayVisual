import os
from datetime import datetime
import pandas as pd


def init_all_csv_files(app, global_var):
    """
    从 data/raw_csv 中读取所有的 csv 文件, 加载到 global_var["today_csv"]字典中
    today_time_str = 2010_01_11

    os.walk 有3个值:
    root_path: ./data/raw_csv
    dir_list: 是指 root_path 下所有的目录的名字. 因为today目录下没有其他子目录了, 所以这里 dir_list 是一个空的列表.
    file_name: root_path 下每一个文件的名字, 比如 "seven_days_remain_user_2020_01_11_17_48_pm.csv"
    """

    csv_path = os.path.abspath(global_var["today_csv_path"])
    csv_file_name_list = global_var["today_csv_file_name_list"]
    today_time_str = datetime.now().strftime("%Y_%m_%d")
    print(today_time_str)
    # 先从 data/raw_csv/ 中读取当天的9个csv, 并且加载到 global_var
    for root_path, dir_list, file_name_list in os.walk(csv_path):
        for csv_file in csv_file_name_list:
            for file_name in file_name_list:
                # csv_file = "seven_days_remain_user"
                # file_name = "seven_days_remain_user_2020_01_11_17_48_pm.csv"
                # 1 文件名匹配 2 时间匹配 (只取今天的那一个csv)
                if (csv_file in file_name) and (today_time_str in file_name):
                    global_var[csv_file] = pd.read_csv(root_path + "/" + file_name)
    # 将9个csv写入data/today文件夹中.
    return
