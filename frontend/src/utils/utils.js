import moment from "moment";
import React from "react";
import nzh from "nzh/cn";
import { parse, stringify } from "qs";

export function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;

    if (type === "today") {
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        return [moment(now), moment(now.getTime() + (oneDay - 1000))];
    }

    if (type === "week") {
        let day = now.getDay();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);

        if (day === 0) {
            day = 6;
        } else {
            day -= 1;
        }

        const beginTime = now.getTime() - day * oneDay;

        return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
    }

    if (type === "month") {
        const year = now.getFullYear();
        const month = now.getMonth();
        const nextDate = moment(now).add(1, "months");
        const nextYear = nextDate.year();
        const nextMonth = nextDate.month();

        return [
            moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
            moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)
        ];
    }

    const year = now.getFullYear();
    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = "") {
    const arr = [];
    nodeList.forEach(node => {
        const item = node;
        item.path = `${parentPath}/${item.path || ""}`.replace(/\/+/g, "/");
        item.exact = true;
        if (item.children && !item.component) {
            arr.push(...getPlainNode(item.children, item.path));
        } else {
            if (item.children && item.component) {
                item.exact = false;
            }
            arr.push(item);
        }
    });
    return arr;
}

export function digitUppercase(n) {
    return nzh.toMoney(n);
}

function getRelation(str1, str2) {
    if (str1 === str2) {
        console.warn("Two path are equal!"); // eslint-disable-line
    }
    const arr1 = str1.split("/");
    const arr2 = str2.split("/");
    if (arr2.every((item, index) => item === arr1[index])) {
        return 1;
    }
    if (arr1.every((item, index) => item === arr2[index])) {
        return 2;
    }
    return 3;
}

function getRenderArr(routes) {
    let renderArr = [];
    renderArr.push(routes[0]);
    for (let i = 1; i < routes.length; i += 1) {
        // 去重
        renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
        // 是否包含
        const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
        if (isAdd) {
            renderArr.push(routes[i]);
        }
    }
    return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
    let routes = Object.keys(routerData).filter(
        routePath => routePath.indexOf(path) === 0 && routePath !== path
    );
    // Replace path to '' eg. path='user' /user/name => name
    routes = routes.map(item => item.replace(path, ""));
    // Get the route to be rendered to remove the deep rendering
    const renderArr = getRenderArr(routes);
    // Conversion and stitching parameters
    const renderRoutes = renderArr.map(item => {
        const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
        return {
            exact,
            ...routerData[`${path}${item}`],
            key: `${path}${item}`,
            path: `${path}${item}`
        };
    });
    return renderRoutes;
}

export function getPageQuery() {
    return parse(window.location.href.split("?")[1]);
}

export function getQueryPath(path = "", query = {}) {
    const search = stringify(query);
    if (search.length) {
        return `${path}?${search}`;
    }
    return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
    return reg.test(path);
}

export function formatWan(val) {
    const v = val * 1;
    if (!v || Number.isNaN(v)) return "";

    let result = val;
    if (val > 10000) {
        result = Math.floor(val / 10000);
        result = (
            <span>
        {result}
                <span
                    styles={{
                        position: "relative",
                        top: -2,
                        fontSize: 14,
                        fontStyle: "normal",
                        lineHeight: 20,
                        marginLeft: 2
                    }}
                >
          万
        </span>
      </span>
        );
    }
    return result;
}

export function isAntdPro() {
    return window.location.hostname === "preview.pro.ant.design";
}

export function buildOptionsByTags(datum, kTag, vTag, kTgtTag = "k", vTgtTag = "v", keepValue = false) {
    let rst = [];
    if (kTag instanceof Array) {
        for (let i = 0; i < datum.length; i++) {
            let dataOne = datum[i];
            let name = "";
            for (let j = 0; j < kTag.length; j++) {
                let k = kTag[j];
                if (j > 0) {
                    name += ":";
                }
                name += dataOne[k];
            }
            // let x = {
            //   k: name,
            //   v: ''+dataOne[vTag],
            // };
            let x = {};
            let val = dataOne[vTag];
            if (!keepValue) {
                val = "" + dataOne[vTag];
            }
            x[kTgtTag] = name;
            x[vTgtTag] = val;
            rst.push(x);
        }
    } else {
        for (let i = 0; i < datum.length; i++) {
            let dataOne = datum[i];
            // let x = {
            //   k: dataOne[kTag],
            //   v: ''+dataOne[vTag],
            // };
            let x = {};
            let val = dataOne[vTag];
            if (!keepValue) {
                val = "" + dataOne[vTag];
            }
            x[kTgtTag] = dataOne[kTag];
            x[vTgtTag] = val;
            rst.push(x);
        }
    }

    return rst;
}

export function getDomain() {
    let { hostname } = window.location;
    // 判断是否为ip
    let rgxIp = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/ig;
    if (rgxIp.test(hostname)) {
        return null;
    }
    let rgx = /\.\S+\.\S+$/ig;
    let domain = rgx.exec(hostname);
    if (domain) {
        return domain[0];
    } else {
        return null;
    }
}


export function compareLocale(property) {
    return function(obj1, obj2) {
        let value1 = obj1[property];
        let value2 = obj2[property];
        return value1.localeCompare(value2, "zh");
    };
}

export function findParent(treeNode, id) {
    if (!id) {
        return null;
    }
    if (parseInt(treeNode.value) === id) {
        return treeNode;
    }
    if (!treeNode.children) {
        return null;
    }
    let tgtObj = null;
    let childrenNodes = treeNode.children;
    for (let i = 0; i < childrenNodes.length; i++) {
        let curNode = childrenNodes[i];
        let curTgt = findParent(curNode, id);
        if (curTgt) {
            tgtObj = curTgt;
            break;
        }
    }
    return tgtObj;
}

export function buildTreeData(objectList, labelTag, valueTag, keyTag) {
    let treeData = [{
        label: "根节点",
        value: "1",
        key: "1"
    }];
    for (let i = 0; i < objectList.length; i++) {
        let curObj = objectList[i];
        let parent = findParent(treeData[0], curObj.parent_id);
        if (parent == null) {
            continue;
        }
        if (!parent.children) {
            parent.children = [];
        }
        parent.children.push({
            label: curObj[labelTag],
            value: "" + curObj[valueTag],
            key: "" + curObj[keyTag]
        });
    }

    let children = treeData[0].children.sort(compareLocale("label"));
    treeData = children;
    return treeData;
}

export function buildUrlWithTs(baseUrl, params = {}) {
    let now = moment().valueOf();
    params.ts = "" + now;
    let url = baseUrl + "?" + stringify(params);
    return url;
}
