import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

let underscore = require('underscore');

// let  BJData = [
//     [{name:'鼓浪屿',value:100}, {name:'翔安'}],
//     [{name:'鼓浪屿',value:70}, {name:'厦门海沧医院'}],
//     [{name:'翔安',value:30}, {name:'同安区莲花卫生院'}],
//     [{name:'厦门海沧医院',value:50}, {name:'同安区莲花卫生院'}],
// ];

// let geoMap = {
//     '鼓浪屿': [118.073104,24.450589],
//     '翔安': [118.254587,24.624349],
//     '厦门海沧医院': [118.10134,24.464437],
//     '同安区莲花卫生院': [118.071058,24.752709],
// };

export function initChart(markerData, effectScatterData) {
    let domObj = document.getElementById('xiamenTest');
    if (domObj) {
        $.get('/js/map/fujian_xiamen.json', function (xmJson) {
            echarts.registerMap('xiamen', xmJson);
            let chart = echarts.init(domObj);
            let curOpts = buildPolyData(markerData, effectScatterData, false);
            chart.setOption(curOpts, true);
        });
    }
}

export function initPoly(markerData, effectScatterData) {
    let domObj = document.getElementById('xiamenTest');
    if (domObj) {
        let chart = echarts.getInstanceByDom(domObj);
        if (chart) {
            chart.dispose();
        }
        chart = echarts.init(domObj);
        let curOpts = buildPolyData(markerData, effectScatterData, false);
        chart.setOption(curOpts, true);
    }
}

export function resizeChart() {
    let domObj = document.getElementById('xiamenTest');
    if (domObj) {
        let chart = echarts.getInstanceByDom(domObj);
        if (chart) {
            chart.resize();
        }
    }
}

export function buildPolyData(markerData, effectScatterData, isTransfer, hSymbolSize = 18) {
    let tooltip = {
        show: true,
        formatter: function (params, ticket, callback) {
            return params.name + '<br>接入量：' + params.data.count;
        },
    };
    if (isTransfer) {
        tooltip = {
            show: true,
            formatter: function (params, ticket, callback) {
                if (params.data.value[2] !== null) {
                    return params.name + '<br>转诊量：' + params.data.value[2];
                }
                return params.name;
            },
        };
    }
    let curOpts = {
        tooltip: {
            show: false,
            trigger: 'item',
            textStyle: {
                fontSize: 12,
            },
        },
        geo: {
            map: 'xiamen',
            silent: true,
            roam: true,
            scaleLimit: {
                min: 1,
            },
            label: {
                normal: {
                    show: false,
                },
                emphasis: {
                    show: false,
                },
            },
            itemStyle: {
                normal: {
                    areaColor: '#202832',
                    borderColor: '#195aee',
                    borderWidth: 1,
                    // shadowColor: '#8cc0e6',
                    // shadowBlur: 20,
                },
            },
            zlevel: 0,
        },
        series: [
            // {
            //     type: 'map',
            //     map: 'xiamen',
            //     silent: true,
            //     top: 100,
            //     itemStyle: {
            //         normal: {
            //             areaColor: '#f8fbff',
            //             borderWidth: 0,
            //             shadowColor: '#8cc0e6',
            //             shadowBlur: 1,
            //             shadowOffsetX: 3,
            //             shadowOffsetY: 8
            //         }
            //     },
            //     zlevel:0
            // },
            {
                name: 'marker',
                type: 'scatter',
                coordinateSystem: 'geo',
                tooltip: tooltip,
                symbolSize: hSymbolSize,
                data: markerData,
                hoverAnimation: false,
                zlevel: 1,
            },
            {
                name: 'effectScatter',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                symbolSize: 23,
                data: effectScatterData,
                showEffectOn: 'render',
                rippleEffect: {
                    scale: 1.8,
                    brushType: 'stroke',
                },
                hoverAnimation: false,
                zlevel: 0,
            },
        ],
    };
    return curOpts;
}
