import sys
sys.path.insert(0, "/users/hk/dev/MobilePayVisual/backend")
import os
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import re
import traceback
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from db_models.db_models import DailyTransactionReport, DailyUser
import pymysql
pymysql.install_as_MySQLdb()


class CsvWriter(object):
    """该类用来读取 data/raw 中每天的9个csv, 并将其merge后, 写入database的 mobile_pay_visual 表中"""
    def __init__(self):
        self.app = None
        self.db = None

        self.csv_path = None
        self.merged_csv_file_name_dict = None
        self.raw_df = {}
        self.merged_csv = {}
        return

    def _init_app(self):
        self.app = Flask(__name__)

        env_dist = os.environ
        config_file = env_dist.get("CFG_PATH", "../service.conf")
        self.app.config.from_pyfile(config_file, silent=True)

    def _init_db(self):
        self.app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://%s:%s@%s:%s/%s" % (
            self.app.config["DB_USER"],
            self.app.config["DB_PASSWORD"],
            self.app.config["DB_HOST"],
            self.app.config["DB_PORT"],
            self.app.config["DB_NAME"]
        )

        try:
            self.db = SQLAlchemy(self.app)
        except Exception as e:
            traceback.print_exc()

        return

    @staticmethod
    def _replace_datetime_str_to_standard_format(raw_datetime_str):
        """
        功能函数
        输入 1/11/2020
        输出 2020年1月11日
        """
        raw_list = raw_datetime_str.split("/")

        standard_time_list = list()
        standard_time_list.append(raw_list[2])
        standard_time_list.append(raw_list[0])
        standard_time_list.append(raw_list[1])

        standard_time_str = "-".join(list(standard_time_list))
        return datetime.strptime(standard_time_str, "%Y-%m-%d")

    @staticmethod
    def _is_datetime_col(input_str):
        """
        输入 1/11/2020 > 返回True
        输入 其他 > 返回 False
        TODO
        """
        return

    def read_all_csv_files(self):
        """
        从 data/raw_csv 中读取所有的 csv 文件, 加载到 global_var["today_csv"]字典中
        today_time_str = 2010_01_11

        os.walk 有3个值:
        root_path: ./data/raw_csv
        dir_list: 是指 root_path 下所有的目录的名字. 因为today目录下没有其他子目录了, 所以这里 dir_list 是一个空的列表.
        file_name: root_path 下每一个文件的名字, 比如 "seven_days_remain_user_2020_01_11_17_48_pm.csv"
        """
        self._init_app()
        self._init_db()

        self.csv_path = os.path.abspath(self.app.config["CSV_PATH"])
        self.merged_csv_file_name_dict = self.app.config["MERGED_CSV_FILE_NAME_DICT"]
        dayjob_time_str = (datetime.now() - timedelta(days=1)).strftime("%Y_%m_%d")

        # 从 data/raw_csv/ 中读取当天的9个csv, 并且加载到 global_var
        for root_path, dir_list, os_file_name_list in os.walk(self.csv_path):
            for db_table, csv_file_list in self.merged_csv_file_name_dict.items():
                for os_file_name in os_file_name_list:
                    # csv_file = "seven_days_remain_user"
                    # os_file_name = "seven_days_remain_user_2020_01_11_17_48_pm.csv"
                    # 1 文件名匹配 2 时间匹配 (只取今天的那一个csv)
                    for csv_file_name_one in csv_file_list:
                        if (csv_file_name_one in os_file_name) and (dayjob_time_str in os_file_name):
                            if db_table not in self.raw_df.keys():
                                self.raw_df[db_table] = {}
                            self.raw_df[db_table][csv_file_name_one] = pd.read_csv(root_path + "/" + os_file_name)
        return

    def merge(self):
        """
        该函数 - 把self.raw_df 的csv, merge到 self.merged_csv
        1. master_csv_file: 基准 df, 即 transaction_by_day.csv

        2. df.merge 的使用方法:
        把 df2 merge到 df1 后面, 以df1为准.
        df1 = df1.merge(df2, how="left")

        3. 先将 transaction_by_day 从 self.csv_file_name_list pop 出去;
        再按顺序将这些csv file merge 到 master_csv_file
        """
        for db_table, csv_dict in self.raw_df.items():
            if db_table == "daily_transaction_report":
                self.merged_csv[db_table] = self.raw_df[db_table]["transaction_by_day"]
                for csv_name, csv_df in csv_dict.items():
                    if csv_name != "transaction_by_day":
                        self.merged_csv[db_table] = self.merged_csv[db_table].merge(csv_df, how="left")
            elif db_table == "daily_user":
                self.merged_csv[db_table] = self.raw_df[db_table]["active_user"]
                for csv_name, csv_df in csv_dict.items():
                    if csv_name != "active_user":
                        self.merged_csv[db_table] = self.merged_csv[db_table].merge(csv_df, how="left")

        return

    def write_merged_csv_to_db(self):
        """
        将 self.merged_csv 中的2个df, 写入数据表
        1 将 self.merged_csv["daily_transaction_report"] 写入 daily_transaction_report 表;
        2 将 self.merged_csv["daily_user"] 写入 daily_user 表.
        """
        db_csv_map = {
            "daily_transaction_report": DailyTransactionReport,
            "daily_user": DailyUser
        }

        for map_table_name, map_db_model in db_csv_map.items():
            for self_csv_table_name, self_csv_df in self.merged_csv.items():
                if map_table_name == self_csv_table_name:
                    # 根据type数量, 一共有 5、6行数据, 将每一行写入 table 中
                    try:
                        for idx in self_csv_df.index:
                            row_one = dict(self_csv_df.iloc[idx])
                            for k, v in row_one.items():
                                # 字符串 1/11/2020 转换成日期格式
                                if isinstance(v, str) and "/" in v:
                                    row_one[k] = CsvWriter._replace_datetime_str_to_standard_format(v)
                                elif isinstance(v, np.int64):
                                    row_one[k] = int(v)
                            # 将csv的每一列, 写入 db_model 的每一个字段
                            record = db_csv_map[map_table_name](**row_one)
                            self.db.session.add(record)
                            self.db.session.commit()
                    except Exception as e:
                        traceback.print_exc()
                        self.db.session.rollback()


def main():
    csv_writer = CsvWriter()
    csv_writer.read_all_csv_files()
    csv_writer.merge()
    csv_writer.write_merged_csv_to_db()


if __name__ == '__main__':
    main()
