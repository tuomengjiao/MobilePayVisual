import json
from flask import Response


def encoding_resp_utf8(data):
    json_response = json.dumps(data, ensure_ascii=False)
    response = Response(json_response, content_type="application/json; charset=utf-8")
    return response


def app_url(version, model, name):
    name = "/%s/%s%s" % (version, model, name)
    return name
