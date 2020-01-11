import os
import sys
sys.path.insert(0, "/users/hk/dev/MobilePayVisual/backend")
from flask import Flask
from flask_restful import Api
from app.init_global import init_global_func
from flask_cors import CORS

app = Flask(__name__)
env_dist = os.environ

config_file = env_dist.get("CFG_PATH", "../service.conf")
app.config.from_pyfile(config_file, silent=True)

api_version = "api/{}".format(app.config["API_VERSION"])
cors = CORS(app, resources={r"/{}/*".format(api_version): {"origins": "*", "supports_credentials": True}})
api = Api(app)

init_global_func(app)


# 如果在最前面引入，会导致 global_var的一些参数还没有初始化，启动服务时会报错keyError
from app.route import init_route
init_route(api, api_version)
