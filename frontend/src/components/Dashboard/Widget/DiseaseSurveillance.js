import React from 'react';
import { connect } from 'react-redux';
import { Tooltip, Popover, Slider, Card, Carousel } from 'antd';
import $ from 'jquery';
import Immutable from 'immutable';

import { LINE_CHART_COLORS, XIAMEN_POINTS, LINE_CHART_AREA_COLORS } from '../../Common/applications';
import styles from './DiseaseSurveillance.less';

let underscore = require('underscore');
let lodash = require('lodash');
let moment = require('moment');

export class DiseaseSurveillance extends React.Component {
    constructor(props, context) {
        super(props, context);
        let show = {
            month: props.appSetting && !lodash.isUndefined(props.appSetting.show_month) ? props.appSetting.show_month : true,
            week: props.appSetting && !lodash.isUndefined(props.appSetting.show_week) ? props.appSetting.show_week : true,
            day: props.appSetting && !lodash.isUndefined(props.appSetting.show_day) ? props.appSetting.show_day : true,
        };
        this.state = {
            config: props.config,
            // app: curData.appOne
            benchmark: {
                month: props.appSetting && props.appSetting.benchmark_month ? props.appSetting.benchmark_month : 0,
                week: props.appSetting && props.appSetting.benchmark_week ? props.appSetting.benchmark_week : 0,
                day: props.appSetting && props.appSetting.benchmark_day ? props.appSetting.benchmark_day : 0,
            },
            show: show,
            lineChartTags: this.createlineChartTags(show),
            diseases: {},
            diseaseSelected: {},
            lineChartDatas: {},
            mapChartDatas: {},
            timeRanges: {
                month: this.createTimeRange('month', 13),
                day: this.createTimeRange('day', 8),
                week: this.createTimeRange('week', 7),
            },
            lineChartIndex: 0,
            w: props.w,
            h: props.h,
        };
        // /mock疾病名称
        this.mockDiseaseDics = {
            month: {},
            week: {},
            day: {},
        };
    }

    createTimeRange(type, count) {
        let timeRange = [];
        let curMonth = null;
        let curDay = null;
        switch (type) {
        case 'month':
            curMonth = this.getNow().subtract(count, 'months');
            for (let i = 0; i < count; i += 1) {
                let monthStr = curMonth.format('YYYY-MM');
                timeRange.push(monthStr);
                curMonth.add(1, 'months');
            }
            break;
        case 'day':
            curDay = this.getNow().subtract(count, 'days');
            for (let i = 0; i < count; i += 1) {
                let dayStr = curDay.format('YYYY-MM-DD');
                timeRange.push(dayStr);
                curDay.add(1, 'days');
            }
            break;
        case 'week':
            curDay = this.getNow().subtract(7 * count, 'days');
            for (let i = 0; i < count; i += 1) {
                let dayInt = curDay.isoWeek();
                timeRange.push(dayInt);
                curDay.add(7, 'days');
            }
            break;
        default:
            break;
        }
        return timeRange;
    }

    createlineChartTags(show) {
        let lineChartTags = [];
        if (show.day) {
            lineChartTags.push('day');
        }
        if (show.week) {
            lineChartTags.push('week');
        }
        if (show.month) {
            lineChartTags.push('month');
        }
        return lineChartTags;
    }

    getNow() {
        return global.mockDate ? moment(global.mockDate) : moment();
    }

    initData(data) {
        let diseaseSelected = {
            month: data.diseases.month && data.diseases.month.length > 0 ? data.diseases.month[0] : '',
            week: data.diseases.week && data.diseases.week.length > 0 ? data.diseases.week[0] : '',
            day: data.diseases.day && data.diseases.day.length > 0 ? data.diseases.day[0] : '',
        };
        let lineChartDatas = this.initLineChartDatas(data.lineData, data.diseases, this.state.timeRanges);
        let mapChartDatas = data.mapData;

        // let o = mockInput2();
        // rst.mapChartDatas = this.initMapChartDatas(o, rst.diseases, this.state.timeRanges);
        this.setState({
            diseases: data.diseases,
            diseaseSelected: diseaseSelected,
            lineChartDatas: lineChartDatas,
            mapChartDatas: mapChartDatas,
        }, () => {
            this.initLine();
            this.setLineOption(diseaseSelected.month, lineChartDatas.month, this.state.timeRanges.month, data.diseases.month, 'month');
            this.setLineOption(diseaseSelected.week, lineChartDatas.week, this.state.timeRanges.week, data.diseases.week, 'week');
            this.setLineOption(diseaseSelected.day, lineChartDatas.day, this.state.timeRanges.day, data.diseases.day, 'day');
            this.initMap(() => {
                let type = this.state.lineChartTags[this.state.lineChartIndex];
                this.setMapOption(diseaseSelected.day, mapChartDatas.day);
                this.initAutoPlay();
            });
        });
    }

    getCompareTimeRange(type) {
        let rst = [];
        let curMonth = null;
        let curDay = null;
        switch (type) {
        case 'month':
            curMonth = this.getNow();
            rst.push(curMonth.subtract(2, 'months').format('YYYY-MM'));
            rst.push(curMonth.add(1, 'months').format('YYYY-MM'));
            break;
        case 'day':
            curDay = this.getNow();
            rst.push(curDay.subtract(2, 'days').format('YYYY-MM-DD'));
            rst.push(curDay.add(1, 'days').format('YYYY-MM-DD'));
            break;
        case 'week':
            curDay = this.getNow();
            rst.push(curDay.subtract(14, 'days').isoWeek());
            rst.push(curDay.add(7, 'days').isoWeek());
            break;
        default:
            break;
        }
        return rst;
    }


    // the line chart auto play
    initAutoPlay() {
        let that = this;
        // 获取鼠标初始位置

        // let pos = getMousePos(e);
        // console.log('pos',pos);
        // / 定时器自动切换linechart
        let timer_ds_linechart = null;

        timer_ds_linechart = setInterval(autoPlay, 5000);
        function autoPlay() {
            let { lineChartIndex } = that.state;
            if (lineChartIndex < 2) {
                lineChartIndex += 1;
            } else {
                lineChartIndex = 0;
            }
            $($('.ant-carousel .slick-slider .slick-dots li button')[lineChartIndex]).click();
        }
        // / hover clear timer  ,blur add timer
        $('.disease_surveillance_line').off('mouseenter').on('mouseenter', function () {
            if (timer_ds_linechart) {
                clearInterval(timer_ds_linechart);
                timer_ds_linechart = null;
            }
        });
        $('.disease_surveillance_line').off('mouseleave').on('mouseleave', function () {
            if (!timer_ds_linechart) {
                timer_ds_linechart = setInterval(autoPlay, 5000);
            }
        });
    }

    // bindMouseMove() {
    //     window.addEventListener('mousemove',function(event){
    //         let loc = getMousePos(event);
    //         function getMousePos(event) {
    //             var e = event || window.event;
    //             var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    //             var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    //             var x = e.pageX || e.clientX + scrollX;
    //             var y = e.pageY || e.clientY + scrollY;
    //             return { 'x': x, 'y': y };
    //         }
    //     })
    // }

    setLineOption(diseaseSelected, lineChartDatas, timeRange, diseases, type) {
        let lineOption = this.buildLineChartOption(diseaseSelected, lineChartDatas, timeRange, diseases, type);
        lodash.map(this.lineCharts[type], (o) => {
            o.setOption(lineOption);
        });
    }

    setMapOption(diseaseSelected, mapChartDatas) {
        if (this.mapChart) {
            let mapOption = this.buildMapChartOption(diseaseSelected, mapChartDatas);
            this.mapChart.setOption(mapOption);
        }
    }

    // 初始化处理折线表数据
    initLineChartDatas(orgiData, diseases, timeRanges) {
        let rst = {}; // target format {'month':},{'day'},{'week'}
        rst.month = this.initLineChartDatasByTime(orgiData.month, diseases.month, timeRanges.month);
        rst.day = this.initLineChartDatasByTime(orgiData.day, diseases.day, timeRanges.day);
        rst.week = this.initLineChartDatasByTime(orgiData.week, diseases.week, timeRanges.week);
        return rst;
    }

    initLineChartDatasByTime(orgiData, diseases, timeRange) {
        let rst = {}; // target format {'疾病名称':[1,2,3,4,5,6]}
        // 筛选疾病
        let curData = lodash.filter(orgiData, (o) => {
            return diseases.indexOf(o[0]) > -1;
        });
        let diseaseGroup = lodash.groupBy(curData, (o) => {
            return o[0];
        });
        lodash.map(diseaseGroup, (o, disease) => {
            let arr = [];
            for (let i = 1; i < timeRange.length; i += 1) {
                let d1 = lodash.find(o, (p) => {
                    return p[2] === timeRange[i - 1];
                });
                let d2 = lodash.find(o, (p) => {
                    return p[2] === timeRange[i];
                });
                let c1 = d1 ? d1[1] : 0;
                let c2 = d2 ? d2[1] : 0;
                let rate = 0;
                if (c1 === 0 && c2 === 0) {
                    rate = 0;
                } else if (c1 === 0) {
                    rate = 1;
                } else {
                    rate = (c2 - c1) / c1;
                }
                arr.push(rate);
            }
            rst[disease] = arr;
        });
        return rst;
    }

    componentDidMount() {
        let { config } = this.state;
        $($('.disease_surveillance_line_month')[0]).removeClass('disease_surveillance_line_month');
        $($('.disease_surveillance_line_day')[1]).removeClass('disease_surveillance_line_day');
    }

    initMap(callback) {
        this.mapChart = echarts.init(document.getElementById('disease_surveillance_map'));
        $.get('/js/map/fujian_xiamen.json', function (geoJson) {
            echarts.registerMap('xiamen', geoJson);
            callback();
        });
    }

    initLine() {
        let that = this;
        that.lineCharts = {};
        that.lineCharts.month = [];
        $('.disease_surveillance_line_month').each(function () {
            that.lineCharts.month.push(echarts.init(this));
        });
        that.lineCharts.week = [];
        $('.disease_surveillance_line_week').each(function () {
            that.lineCharts.week.push(echarts.init(this));
        });
        that.lineCharts.day = [];
        $('.disease_surveillance_line_day').each(function () {
            that.lineCharts.day.push(echarts.init(this));
        });
        // this.lineCharts['month'].push(echarts.init($('.disease_surveillance_line_month')[0]))
        // this.lineCharts['day'] = echarts.init($('.disease_surveillance_line_day')[0]);
        // this.lineCharts['week'] = echarts.init($('.disease_surveillance_line_week')[0]);
    }

    onChangeLegend(type, val) {
        // console.log('onChangeLegend',type,val);
        let { diseaseSelected, lineChartDatas, mapChartDatas, timeRanges, diseases } = this.state;
        this.setLineOption(val, lineChartDatas[type], timeRanges[type], diseases[type], type);
        this.setMapOption(val, mapChartDatas[type]);
        diseaseSelected[type] = val;
        this.setState({
            diseaseSelected: diseaseSelected,
        });
    }


    buildLineLegend(type) {
        let legends = [];
        let { diseases, diseaseSelected } = this.state;
        let diseasesOne = diseases[type];
        let diseaseSelectedOne = diseaseSelected[type];
        if (diseaseSelectedOne) {
            for (let i = 0; i < diseasesOne.length; i += 1) {
                let lengedTitle = null;
                let diseasesShowName = global.mockDiseases ? this.mockDiseaseDics[type][diseasesOne[i]] : diseasesOne[i];// mock
                if (diseasesShowName.length > 3) {
                    lengedTitle = (
                        <Tooltip title={diseasesShowName}>
                            <span>{diseasesShowName.substring(0, 2) + '...'}</span>
                        </Tooltip>
                    );
                } else {
                    lengedTitle = (
                        <span>{diseasesShowName}</span>
                    );
                }
                legends.push(
                    <div className={diseasesOne[i] === diseaseSelectedOne ? `${styles.line_chart_legend} ${styles.legend_selected}` : `${styles.line_chart_legend} ${styles.legend_unselected}`}
                        style={{ float: 'left', marginRight: 8, marginBottom: 8 }}
                        onClick={this.onChangeLegend.bind(this, type, diseasesOne[i])}
                    >
                        <div style={{ backgroundColor: LINE_CHART_COLORS[i], width: 10, height: 10, float: 'left', borderRadius: 5 }}></div>
                        <div style={{ float: 'left', marginLeft: 3, lineHeight: '10px' }}>
                            {lengedTitle}
                        </div>
                    </div>
                );
            }
            let legendWidth = 52;
            let legendLeft = 10;
            if (diseasesOne && diseasesOne.length < 5) {
                legendWidth = 52 * diseasesOne.length;
                legendLeft = (320 - legendWidth) / 2;
            }
            return (
                <div className={styles.chromeFont10} style={{ height: 15, marginTop: 10, marginLeft: legendLeft }}>
                    {legends}
                </div>
            );
        }
    }

    buildMapChartOption(disease, mapChartDatas) {
        // console.log('mapChartDatas',mapChartDatas);
        let data = mapChartDatas ? mapChartDatas[disease] : [];
        let length = data && data.length > 0 ? data.length : 1;
        let option = this.initMapChartOption();
        // let sum = lodash.sumBy(data,(o) => {
        //     return o[2];
        // });
        // let max = Math.round(sum/length);
        let maxObj = lodash.maxBy(data, (o) => {
            return o[2];
        });
        let max = maxObj ? maxObj[2] : 0;
        max = Math.ceil(max / 10) * 10;
        option.visualMap.max = max;
        option.series[0].data = data;
        return option;
    }

    initMapChartOption() {
        let option = {
            visualMap: {
                show: false,
                top: 'top',
                min: 0,
                max: 1,
                seriesIndex: 0,
                calculable: true,
                splitNumber: 5,
                inRange: {
                    color: ['blue', 'green', 'yellow', 'orange', 'red'],
                },
            },
            geo: {
                map: 'xiamen',
                itemStyle: {
                    normal: {
                        // areaColor: '#fff',
                        // borderColor: '#59a9ff',
                        // borderWidth: 1,
                        areaColor: '#202832',
                        borderColor: '#195aee',
                        borderWidth: 1,
                    },
                },
                silent: true,
            },
            series: [
                {
                    type: 'heatmap',
                    coordinateSystem: 'geo',
                    data: [],
                    pointSize: 5,
                    blurSize: 6,
                },
            ],
        };
        return option;
    }

    buildLineChartOption(disease, lineChartDatas, timeRange, diseaseList, type) {
        let option = this.initLineChartOption();
        let xTimeRange = lodash.tail(timeRange);
        switch (type) {
        case 'month':
            option.xAxis.data = xTimeRange;
            break;
        case 'week':
            option.xAxis.data = lodash.map(xTimeRange, (o) => {
                return '第' + o + '周';
            });
            break;
        case 'day':
            option.xAxis.data = lodash.map(xTimeRange, (o) => {
                let date = moment(o).format('MM-DD');
                return date;
            });
            break;
        default:
            break;
        }
        lodash.map(lineChartDatas, (o, p) => {
            let seriesIndex = diseaseList.indexOf(p);
            let item = {};
            item.name = global.mockDiseases ? this.mockDiseaseDics[type][p] : p;
            item.type = 'line';
            item.data = o;
            item.smooth = true;
            if (disease === p) {
                item.lineStyle = {
                    normal: {
                        width: 2,
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                };
            } else {
                item.lineStyle = {
                    normal: {
                        width: 1,
                    },
                };
            }
            item.itemStyle = {
                normal: {
                    areaStyle: {
                        color: LINE_CHART_AREA_COLORS[seriesIndex],
                        type: 'default',
                    },
                },
            };

            option.series[seriesIndex] = item;
        });
        return option;
    }

    initLineChartOption() {
        let option = {
            tooltip: {
                trigger: 'axis',
                position: function (pos, params, dom, rect, size) {
                    // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                    let obj = { top: 60 };
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                    return obj;
                },
                textStyle: {
                    fontSize: 10,
                },
                formatter: function (params) {
                    let html = params[0].name;
                    for (let i = 0; i < params.length; i += 1) {
                        html += ('<br/><span style="font-size:10px; color:' + params[i].color + ';">●</span>' + params[i].seriesName + ': ' + parseFloat((params[i].value * 10000 / 100).toFixed(2)) + '%');
                    }
                    return html;
                },
                // axisPointer:{
                //     label: {
                //         formatter: function (params) {
                //             return parseFloat((params.value * 10000 /100).toFixed(2)) + '%'
                //         }
                //     }
                // }
            },
            grid: {
                top: '5%',
                left: '3%',
                bottom: '3%',
                right: '10%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
                axisLabel: {
                    show: false,
                    textStyle: {
                        color: '#666',
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc',
                    },
                },
            },
            yAxis: {
                type: 'value',
                scale: true,
                // axisLabel: null,
                // axisLine: null,
                // splitLine: null,
                axisLabel: {
                    show: false,
                    textStyle: {
                        color: '#666',
                    },
                    formatter: function (value, indx) {
                        return parseFloat((value * 10000 / 100).toFixed(2)) + '%';
                    },
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#ccc',
                    },
                },
                axisTick: null,
                splitLine: {
                    show: false,
                    lineStyle: {
                        type: 'dotted',
                        color: '#d9d9d9',
                    },
                },
            },
            series: [],
            color: LINE_CHART_COLORS,

        };
        return option;
    }

    changeCarousel(indx) {
        let { diseaseSelected, mapChartDatas, lineChartTags } = this.state;
        let type = lineChartTags[indx];
        this.setMapOption(diseaseSelected[type], mapChartDatas[type]);
        this.setState({
            lineChartIndex: indx,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.w !== this.props.w || nextProps.h !== this.props.h) {
            this.setState({ w: parseInt(nextProps.w), h: parseInt(nextProps.h) });
            this.processStyle('leven_1', nextProps.w + 0, nextProps.h);
            this.processStyle('leven_2', (nextProps.w + 0) * 0.6, nextProps.h - 10);
            this.processStyle('leven_3', (nextProps.w + 0) * 0.36, nextProps.h - 20);
            this.processStyle('disease_surveillance_map', (nextProps.w + 0) * 0.4, nextProps.h - 30);
            if (this.state.show.day) {
                this.processStyle('leven_4_0', (nextProps.w + 0) * 0.58, nextProps.h - 20);
                this.processStyle('leven_5_0', (nextProps.w + 0) * 0.58, nextProps.h - 87);
                this.processStyle('disease_surveillance_line_day', (nextProps.w + 0) * 0.58, nextProps.h - 102, 'ClassName');
                if (this.lineCharts && this.lineCharts.day) {
                    this.lineCharts.day.map((o) => {
                        o.resize();
                    });
                }
            }
            if (this.state.show.week) {
                this.processStyle('leven_4_1', (nextProps.w + 0) * 0.58, nextProps.h - 20);
                this.processStyle('leven_5_1', (nextProps.w + 0) * 0.58, nextProps.h - 87);
                this.processStyle('disease_surveillance_line_week', (nextProps.w + 0) * 0.58, nextProps.h - 102, 'ClassName');
                if (this.lineCharts && this.lineCharts.week) {
                    this.lineCharts.week.map((o) => {
                        o.resize();
                    });
                }
            }
            if (this.state.show.month) {
                this.processStyle('leven_4_2', (nextProps.w + 0) * 0.58, nextProps.h - 20);
                this.processStyle('leven_5_2', (nextProps.w + 0) * 0.58, nextProps.h - 87);
                this.processStyle('disease_surveillance_line_month', (nextProps.w + 0) * 0.58, nextProps.h - 102, 'ClassName');
                if (this.lineCharts && this.lineCharts.month) {
                    this.lineCharts.month.map((o) => {
                        o.resize();
                    });
                }
            }
            if (this.mapChart) {
                this.mapChart.resize();
            }
        }
        let sameProps = Immutable.is(this.props.data, nextProps.data);
        if (!sameProps) {
            let newState = this.initData(nextProps.data);
        }
    }
    processStyle(elId, new_w, new_h, flag = 'Id') {
        if (flag === 'ClassName') {
            let barObjs = document.getElementsByClassName(elId);
            for (let o = 0; o < barObjs.length; o += 1) {
                this.processStyle(barObjs[o], new_w, new_h, 'OBJ');
            }
        } else {
            let barObj = {};
            if (flag === 'Id') {
                barObj = document.getElementById(elId);
            } else if (flag === 'OBJ') {
                barObj = elId;
            }
            let barStyle = barObj.getAttribute('style').split(';');
            let newBarStyle = [];
            barStyle.map((e) => {
                if (e.indexOf('width') !== -1) { newBarStyle.push('width: ' + (parseInt(new_w)) + 'px'); } else if (e.indexOf('height') !== -1) { newBarStyle.push('height: ' + (parseInt(new_h)) + 'px'); } else { newBarStyle.push(e); }
            });
            barObj.setAttribute('style', newBarStyle.join(';'));
        }
    }

    render() {
        let { show, w, h } = this.state;
        return (
            <div id="leven_1" style={{ padding: 10, width: w + 55, height: h }}>
                <div id="leven_2" style={{ height: h - 10, float: 'left', width: (w + 0) * 0.6 }}>
                    <div style={{ marginLeft: 10, fontSize: 14, textAlign: 'left', fontWeight: 'bold', color: '#fff', marginBottom: 20 }}>
                        Top5 传染病发病趋势及分布图
                    </div>
                    {(show.day || show.week || show.month) &&
                    <Carousel afterChange={this.changeCarousel.bind(this)}>
                        {show.day && <div id="leven_4_0" className="disease_surveillance_line" style={{ height: h - 20 }}>
                            <div id="leven_5_0" style={{ width: (w + 0) * 0.58, height: h - 87, marginLeft: 7 }}>
                                {this.buildLineLegend('day')}
                                <div id="leven_6_0" className="disease_surveillance_line_day" style={{ width: (w + 0) * 0.58, height: h - 102 }}>
                                </div>
                            </div>
                            <div className="chromeFont10" style={{ marginTop: 10, marginLeft: 30, color: '#aeaeae', float: 'left' }}>
                                过去7天
                            </div>
                        </div>}
                        {show.week && <div id="leven_4_1" className="disease_surveillance_line" style={{ height: h - 20 }}>
                            <div id="leven_5_1" style={{ width: (w + 0) * 0.58, height: h - 87, marginLeft: 7 }}>
                                {this.buildLineLegend('week')}
                                <div id="leven_6_1" className="disease_surveillance_line_week" style={{ width: (w + 0) * 0.58, height: h - 102 }}>
                                </div>
                            </div>
                            <div className="chromeFont10" style={{ marginTop: 10, marginLeft: 30, color: '#aeaeae', float: 'left' }}>
                                过去6周
                            </div>
                        </div>}
                        {show.month && <div id="leven_4_2" className="disease_surveillance_line" style={{ height: h - 20 }}>
                            <div id="leven_5_2" style={{ width: (w + 0) * 0.58, height: h - 87, marginLeft: 7 }}>
                                {this.buildLineLegend('month')}
                                <div id="leven_6_2" className="disease_surveillance_line_month" style={{ width: (w + 0) * 0.58, height: h - 102 }}>
                                </div>
                            </div>
                            <div className="chromeFont10" style={{ marginTop: 10, marginLeft: 30, color: '#aeaeae', float: 'left' }}>
                                过去12个月
                            </div>
                        </div>}
                    </Carousel>}
                </div>
                <div id="leven_3" style={{ float: 'left', width: (w + 0) * 0.36, height: h - 20 }}>
                    <div id="disease_surveillance_map" style={{ width: (w + 0) * 0.34, height: h - 30, marginTop: 5 }}>
                    </div>
                </div>
            </div>
        );
    }
}
