import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

let underscore = require('underscore');

const xiamenCounty = [
    '市内其他', '思明区', '海沧区', '翔安区', '湖里区', '集美区', '同安区',
];
const otherRegion = ['省内', '省外'];

function trim(str) { // 删除左右两端的空格
    if (!str) {
        return '';
    }
    return str.replace(/(^\s*)|(\s*$)/g, '');
}
function ltrim(str) { // 删除左边的空格
    if (!str) {
        return '';
    }
    return str.replace(/(^\s*)/g, '');
}
function rtrim(str) { // 删除右边的空格
    if (!str) {
        return '';
    }
    return str.replace(/(\s*$)/g, '');
}

function buildXmMap(dataMap, xmdata) {
    for (let i = 0; i < xmdata.length; i += 1) {
        let curData = xmdata[i];
        // hospital, region, count
        let hospital = trim(curData[0]);
        if (!hospital || hospital === '') {
            continue;
        }
        let region = trim(curData[1]);
        let count = curData[2];

        if (dataMap[hospital] === undefined) {
            dataMap[hospital] = {
                xmtotal: 0,
            };
        }
        let hospitalMap = dataMap[hospital];
        if (xiamenCounty.indexOf(region) !== -1) {
            hospitalMap[region] = count;
        } else if (hospitalMap['市内其他'] === undefined) {
            hospitalMap['市内其他'] = count;
        } else {
            hospitalMap['市内其他'] += count;
        }
        hospitalMap.xmtotal += count;
    }
}

function buildExternalMap(dataMap, externaldata) {
    for (let i = 0; i < externaldata.length; i += 1) {
        let curData = externaldata[i];
        // hospital, region, count
        let hospital = trim(curData[0]);
        if (!hospital || hospital === '') {
            continue;
        }
        let region = trim(curData[1]);
        let count = curData[2];

        if (dataMap[hospital] === undefined) {
            dataMap[hospital] = {
                xmtotal: 0,
            };
        }
        let hospitalMap = dataMap[hospital];
        if (region === '福建省') {
            let otherCity = count - hospitalMap.xmtotal;
            hospitalMap['省内'] = otherCity;
        } else if (hospitalMap['省外'] === undefined) {
            hospitalMap['省外'] = count;
        } else {
            hospitalMap['省外'] += count;
        }
    }
}

function otherProcess(dataMap) {
    let hospitalOptions = [];
    for (let k in dataMap) {
        hospitalOptions.push({ k: k, v: k });
    }
    let initHospital = '';
    if (hospitalOptions.length > 0) {
        initHospital = hospitalOptions[0].k;
    }

    return {
        hospitalOptions: hospitalOptions,
        initHospital: initHospital,
    };
}

export function BuildStateData(curData) {
    // init env for map
    let dataMap = {};
    if (curData.xmdata && curData.xmdata.rows) {
        buildXmMap(dataMap, curData.xmdata.rows);
    }
    if (curData.externaldata && curData.externaldata.rows) {
        buildExternalMap(dataMap, curData.externaldata.rows);
    }
    let otherOpts = otherProcess(dataMap);

    return {
        dataMap: dataMap,
        hospital: otherOpts.initHospital,
        hospitalOptions: otherOpts.hospitalOptions,
    };
}

function compare(x, y) {
    if (x.val > y.val) {
        return 1;
    } else if (x.val < y.val) {
        return -1;
    } else {
        return 0;
    }
}

function buildXMonlyData(hospitalMap) {
    let data = [];
    for (let i = 0; i < xiamenCounty.length; i += 1) {
        let region = xiamenCounty[i];
        let val = 0;
        if (hospitalMap[region] !== undefined) {
            val = hospitalMap[region];
        }
        data.push({
            val: val,
            key: xiamenCounty[i],
        });
    }
    // sort by val
    data.sort(compare);
    // split data and name
    let rst = {
        vals: [],
        names: [],
    };
    for (let i = 0; i < data.length; i += 1) {
        rst.vals.push(data[i].val);
        rst.names.push({
            value: data[i].key,
            textStyle: {
                fontSize: 10,
            },
        });
    }
    return rst;
}

let curBarOptions = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
        formatter: '{b}: {c}',
        textStyle: {
            fontSize: 10,
        },
    },
    legend: {
        show: false,
    },
    grid: {
        top: 20,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'value',
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        axisLabel: {
            show: false,
        },
        splitArea: {
            show: false,
        },
        splitLine: {
            show: false,
        },
    },
    yAxis: [
        {
            type: 'category',
            data: [],
            axisTick: {
                show: true,
                alignWithLabel: true,
                lineStyle: {
                    color: '#79828b',
                },
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#79828b',
                },
            },
        },
        {
            type: 'category',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            splitArea: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            data: [],
        },
    ],
    series: [
        {
            name: '最近12个月',
            type: 'bar',
            itemStyle: {
                normal: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                        offset: 0,
                        color: '#6ec2ff',
                    }, {
                        offset: 1,
                        color: '#006eee',
                    }]),
                    barBorderRadius: [0, 50, 50, 0],
                    borderWidth: 0,
                },
                emphasis: {
                    shadowBlur: 15,
                    shadowColor: 'rgba(105,123, 214, 0.7)',
                },
            },
            zlevel: 2,
            barWidth: '40%',
            data: [],
        },
        {
            name: '',
            type: 'bar',
            yAxisIndex: 1,
            zlevel: 1,
            itemStyle: {
                normal: {
                    color: '#16191c',
                    barBorderRadius: [0, 50, 50, 0],
                    borderWidth: 0,
                    shadowBlur: {
                        shadowColor: 'rgba(255,255,255,0.31)',
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowOffsetY: 2,
                    },
                },
            },
            barWidth: '40%',
            data: [],
        },
    ],
};
export function drawBar(barChart, dataMap, hospital) {
    let data = {
        vals: [], names: [],
    };
    if (hospital && dataMap[hospital]) {
        data = buildXMonlyData(dataMap[hospital]);
    }
    curBarOptions.series[0].data = data.vals;
    let maxVals = Math.max(...data.vals);
    maxVals += maxVals * 0.2;
    let series1Data = new Array(data.vals.length);
    for (let i = 0; i < data.vals.length; i += 1) {
        series1Data[i] = maxVals;
    }
    curBarOptions.series[1].data = series1Data;

    curBarOptions.yAxis[0].data = data.names;
    curBarOptions.yAxis[1].data = data.names;
    barChart.setOption(curBarOptions);
}

const colorMap = {
    市内其他: '#cccccc',
    思明区: '#4e9bee',
    海沧区: '#37e8e9',
    翔安区: '#4eeea9',
    湖里区: '#89f6c7',
    集美区: '#a3f789',
    同安区: '#f8ff97',
    省内: '#ffdd95',
    省外: '#ffcc33',
};
function buildAllData(hospitalMap) {
    let data = [];

    let sum = 0;
    for (let region in hospitalMap) {
        if (region === 'xmtotal') {
            continue;
        }
        sum += hospitalMap[region];
    }
    if (sum === 0) {
        return data;
    }

    for (let region in hospitalMap) {
        if (region === 'xmtotal') {
            continue;
        }
        let color = colorMap[region];
        let percent = 1.0 * hospitalMap[region] / sum;
        let x = 1.0 * Math.round(percent * 100);
        if (x === 0) {
            continue;
        }
        let showText = region + ' ' + x.toString() + '%';
        data.push({
            name: showText,
            value: hospitalMap[region],
            itemStyle: {
                normal: {
                    color: color,
                },
                emphasis: {
                    color: color,
                },
            },
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        color: '#666666',
                        fontSize: 10,
                    },
                },
            },
        });
    }
    return data;
}

let curPieOptions = {
    color: ['red', 'green', 'yellow', 'blueviolet'],
    title: {
        show: false,
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
        textStyle: {
            fontSize: 10,
        },
    },
    legend: {
        show: false,
    },
    series: [{
        name: '最近12个月',
        type: 'pie',
        selectedMode: 'single',
        selectedOffset: 5,
        radius: '55%',
        center: ['50%', '50%'],
        data: [],
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
        },
        labelLine: {
            show: true,
            smooth: true,
        },
        animationType: 'expansion',
    }],
};
export function drawPie(pieChart, dataMap, hospital) {
    let data = [];
    if (hospital && dataMap[hospital]) {
        data = buildAllData(dataMap[hospital]);
    }
    curPieOptions.series[0].data = data;
    pieChart.setOption(curPieOptions);
}

export function getRef(element) {
    return ReactDOM.findDOMNode(element);
}

export function getRefVal(element) {
    let node = ReactDOM.findDOMNode(element);
    return $(node).val();
}
