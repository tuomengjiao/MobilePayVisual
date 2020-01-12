import json
from flask import Response
from datetime import datetime
from decimal import Decimal


def encoding_resp_utf8(data):
    json_response = json.dumps(data, ensure_ascii=False)
    response = Response(json_response, content_type="application/json; charset=utf-8")
    return response


def app_url(version, model, name):
    name = "/%s/%s%s" % (version, model, name)
    return name


def strip_value(value, strip):
    if value is None:
        return value
    if isinstance(value, str):
        if strip:
            value = value.strip()
    elif isinstance(value, Decimal):
        value = float(value)
    return value


def build_rows_result(rows, items, process_none=True, json_items=[], strip=False):

    rst = []
    item_len = len(items)
    for row in rows:
        x = {}
        for i in range(0, item_len):
            name = items[i]
            if isinstance(row[i], datetime):
                x[name] = datetime.strftime(row[i], '%Y-%m-%d %H:%M:%S')
            elif name in json_items:
                try:
                    content = json.loads(row[i]) if row[i] is not None and row[i] != '' else ''
                except Exception as e:
                    content = row[i]
                x[name] = content
            elif process_none:
                value = row[i] if row[i] is not None else ''
                x[name] = strip_value(value, strip=strip)
            else:
                x[name] = strip_value(row[i], strip=strip)
        rst.append(x)
    return rst


def get_value_with_default(a_map, key, default_val=None):
    """a_map: 一个字典"""
    v = a_map.get(key, default_val)
    if v is None:
        v = default_val
    return v
