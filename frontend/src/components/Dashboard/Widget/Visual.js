import React from 'react';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import { renderChart } from './ChartUtils';
import { CHARTTEMP, CHARTPARAMS, MAP_COLORS } from './ChartData';

let _ = require('underscore');
const MAP_URI = global.mapUri;


export class Visual extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            config: props.config,
            h: props.h,
            w: props.w,
            tag: props.tag,
            graph: {},
            data: props.data,
            queryCommandResult: [],
            loadGraphChart: false,
        };
    }

    componentDidMount() {
        this.getChart();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.w !== this.props.w || nextProps.h !== this.props.h) {
            this.setState({ w: nextProps.w, h: nextProps.h }, () => {
                this.setState({ w: nextProps.w, h: nextProps.h }, () => {
                    this.getChart();
                });
            });
        }
    }

    getChart() {
        this.setState({ loadGraphChart: true });
        let chart = _.where(this.state.data.charts, { id: this.state.tag });
        let dataTags = chart[0].dataTags;
        let formatCols = [];
        let colDef = {};
        let axisXCol = [];
        let axisYCol = [];
        let operators = [];

        let statistics = chart[0].type !== 'point2';

        dataTags.index.map((index) => {
            if (index.opt !== '' && statistics) {
                let aggregationType = index.opt;
                let axisOutputName = index.tag + '-' + aggregationType;
                colDef[axisOutputName] = {
                    alias: axisOutputName,
                };
                axisYCol.push(axisOutputName);
            } else {
                colDef[index.tag] = {
                    alias: index.tag,
                };
                axisYCol.push(index.tag);
            }
            operators.push(index.opt);
        });

        dataTags.dim.map((dim) => {
            if (dim.opt !== '' && (_.contains(dateFormat, dim.opt))) {
                formatCols.push([dim.opt, dim.tag]);
            }
            axisXCol.unshift(dim.tag);
            colDef[dim.tag] = {
                alias: dim.tag,
            };
        });

        let that = this;
        if (this.state.queryCommandResult.length === 0) {
            this.props.dispatch({
                type: 'dashboard/fetch',
                workspaceId: that.props.workspaceId,
                workspaceInstanceId: that.props.workspaceInstanceId,
                workspaceToken: that.props.workspaceToken,
                payload: {
                    DaasQuery: {
                        queryId: chart[0].queryId,
                        queryCommand: {
                            sql: [chart[0].queryCommandSql],
                            tables: chart[0].queryTables,
                            refresh: false,
                        },
                    },
                },
                success: (res) => {
                    let queryCommandResult = {
                        rows: [],
                        columns: [],
                    };

                    if (res) {
                        if (res) {
                            queryCommandResult.rows = res[0].rows;
                            if (res[0].columns.length) {
                                res[0].columns.map((column) => {
                                    queryCommandResult.columns.push({ name: column.name, type: column.dataType });
                                });
                            }

                            this.drowChart(chart, queryCommandResult, chart[0].type, colDef, axisXCol, axisYCol, operators, formatCols);
                        }
                    }
                },
            });
        } else {
            this.drowChart(chart, this.state.queryCommandResult, chart[0].type, colDef, axisXCol, axisYCol, operators, formatCols);
        }
    }

    drowChart = (chart, queryCommandResult, type, colDef, axisXCol, axisYCol, operators, formatCols) => {
        let chartParams = JSON.parse(JSON.stringify(CHARTPARAMS));
        chartParams.source.data = queryCommandResult;
        chartParams.chart.title = chart[0].title;
        chartParams.chart.height = this.state.h - 28;
        chartParams.source.colDef = colDef;
        chartParams.layout.axisYCol = axisYCol;
        chartParams.layout.operators = operators;
        // axisXCol.reverse();
        if (type === 'stack') {
            chartParams.layout.axisXCol = [];
            chartParams.layout.axisXCol.push(axisXCol[0]);
            chartParams.layout.axisStackCol = [];
            chartParams.layout.axisStackCol.push(axisXCol[1]);
        } else {
            chartParams.layout.axisXCol = axisXCol;
            delete (chartParams.layout.axisStackCol);
        }

        global.formatGuide = function (obj) {
            formatCols.map((item) => {
                switch (item[0]) {
                case 'Y':
                    obj[item[1]] = moment(obj[item[1]], 'YYYY').format('YYYY年');
                    break;
                case 'Y-M':
                    obj[item[1]] = moment(obj[item[1]], 'YYYY-MM').format('YYYY年MM月');
                    break;
                case 'Y-M-d':
                    obj[item[1]] = moment(obj[item[1]], 'YYYY-MM-DD').format('YYYY年MM月D日');
                    break;
                default:
                    break;
                }
            });
        };

        switch (type) {
        case 'point':
            chartParams.chartType = 'point_vdp';
            chartParams.layout.axisXCol = [axisXCol[0]];
            chartParams.layout.axisMarkCol = axisXCol[1];
            chartParams.layout.shape = ['circle', 'diamond', 'square'];
            // chartParams.layout.color = ['red', 'blue', 'green'];
            chartParams.chart.margin = [20, 60, 60, 90];
            break;
        case 'point2':
            chartParams.chartType = 'point_vdp';
            chartParams.layout.axisXCol = [axisXCol[0]];
            chartParams.layout.axisMarkCol = axisXCol[1];
            chartParams.layout.shape = ['circle', 'diamond', 'square'];
            // chartParams.layout.color = ['red', 'blue', 'green'];
            chartParams.chart.margin = [20, 60, 60, 90];
            break;
        case 'table':
            chartParams.chartType = 'table_vdp';
            // data.executorParams.chartLib = 'ant';
            chartParams.chart = {};
            chartParams.chart.id = this.state.tag;
            chartParams.chart.style = { height: this.state.h, marginTop: 10, marginRight: 10 };
            break;
        case 'linebar':
            chartParams.chartType = 'line_bar_vdp';
            delete (chartParams.layout.axisYCol);
            chartParams.layout.axis2YCols = axisYCol;
            chartParams.layout.size = [2, 5];
            chartParams.layout.color = ['#f99332', '#217ddb'];
            chartParams.layout.legend = { position: 'bottom' };
            chartParams.chart.margin = [20, 70, 70, 70];
            break;
        case 'layer':
            chartParams.chartType = 'layer_vdp';
            chartParams.layout.color = MAP_COLORS;
            chartParams.chart.margin = [30, 10, 10, 30];
            break;
        case 'pie':
            chartParams.chartType = 'pie_vdp';
            chartParams.layout.legend = { position: 'bottom' };
            break;
        case 'bar':
        case 'stack':
            chartParams.chartType = 'bar_vdp';
            chartParams.layout.size = 20;
            chartParams.layout.legend = { position: 'bottom' };
            chartParams.chart.margin = [20, 20, 90, 80];
            chartParams.chart.minWidth = this.state.w;
            break;
        case 'line':
            chartParams.chartType = 'line_vdp';
            chartParams.layout.legend = { position: 'bottom' };
            chartParams.chart.margin = [20, 40, 90, 60];
            break;
        case 'map':
            // data.executorParams.chartLib = 'ec';
            chartParams.chartType = 'china_map_vdp';
            chartParams.source.mapServer = MAP_URI;
            for (let i = chartParams.layout.axisXCol.length; i < 3; i++) {
                chartParams.layout.axisXCol[i] = '';
            }
            break;
        default:
            break;
        }

        let html = '<div> <h1 id="' + this.state.tag + '-chart-title" class="g2-title"></h1> <div id="' + this.state.tag + "-chart-body\" style=\"height: 100%; width: 100%;\" class=\"g2-graph-div\"></div> </div> <script type=\"text/javascript\"> G2.track(false); (function() { var params = JSON.parse('" +
            JSON.stringify(chartParams) + "'); if (params.chart.title) { document.getElementById(\"" + this.state.tag + "-chart-title\").innerHTML = params.chart.title; } params.chart.divId = '" + this.state.tag + "-chart-body'; __MDA_G2ChartRender.render(params); }()); </script>";

        if (type === 'map') {
            html = '<div id="' + this.state.tag + "-div-chart\" style=\"width: auto;height:410px;\"></div> <script type=\"text/javascript\"> (function() { var params = JSON.parse('" +
                JSON.stringify(chartParams) + "'); params.chart.divId = '" + this.state.tag + "-div-chart'; __MDA_EcChartRender.render(params); }()); </script>";
        }

        if (type === 'table') {
            html = '<div><h1 id="' + this.state.tag + '-chart-title" class="ant-title"></h1><div id="' + this.state.tag + "-chart-body\" style=\"height: 100%; width: 100%;\" class=\"ant-graph-div\"></div></div><script type=\"text/javascript\">G2.track(false); (function() {var params = JSON.parse('" +
                JSON.stringify(chartParams) + "');if (params.chart.title) {document.getElementById(\"" + this.state.tag + "-chart-title\").innerHTML = params.chart.title;}params.chart.divId = '" + this.state.tag + "-chart-body'; __MDA_AntChartRender.render(params);}());</script>";
        }

        renderChart('#' + this.state.tag, html);
        this.setState({ loadGraphChart: false });
    }

    render() {
        return (
            <Spin spinning={this.state.loadGraphChart}>
                <div id={this.state.tag} style={{ padding: 10, width: '100%', height: '100%', minHeight: this.state.h }}>
                </div>
            </Spin>
        );
    }
}
