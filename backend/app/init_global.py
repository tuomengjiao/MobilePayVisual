import sys
from model_init_config import global_init_func_dict
from app.init_db import init_db_func

global_var = {}


def init_global_func(app):
    global global_var
    # 通用变量
    global_var['version'] = app.config['VERSION']
    global_var['description'] = app.config['SERVICE_DESC']
    global_var['service'] = app.config['SERVICE_NAME']
    global_var['models'] = app.config['MODELS'].split(',')

    # csv 相关的变量
    global_var["today_csv_path"] = app.config["TODAY_CSV_PATH"]
    global_var["today_csv_file_name_list"] = app.config["TODAY_CSV_FILE_NAME_LIST"]

    # 把所需的初始化函数加入到 init_func_list 中
    init_func_list = list()
    # 1 先放入 init_db
    init_func_list.append(init_db_func)

    # 2 再放其他的
    for model in global_var["models"]:
        model = model.strip()
        func = global_init_func_dict.get(model, None)
        if func is None:
            continue

        init_func_list.extend(func)

    # 逐个运行 init_func_list 中的每个函数
    for func in init_func_list:
        try:
            func(app, global_var)
        except Exception as e:
            print("init_func_list失败, 错误信息:\n%s" % str(e))
            sys.exit(0)

    return
