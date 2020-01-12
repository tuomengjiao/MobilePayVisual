import React from 'react';
import { connect } from 'react-redux';

import { Modal, Button, Row, Col, Tag, Icon } from 'antd';
import * as Utils from './HospitalPolyUtils';

let _ = require('underscore');

// function mockInput() {
//     let xmHospital = [
//         ['350211A1001', '厦门大学附属第一医院', '3J', '118.09341,24.457563'],
//         ['350211A1001A', '厦门大学附属第一医院杏林分院', '1I', '118.054418,24.567219'],
//         ['350211A1002', '厦门大学附属中山医院', '3J', '118.104233,24.477602'],
//         ['350211A1003', '厦门市第二医院', '3I', '118.110987,24.590618'],
//         ['350211A1004', '厦门市第三医院', '3I', '118.153711,24.711511'],
//         ['350211A1005', '中国人民解放军第一七四医院', '3J', '118.10134,24.464437'],
//         ['350211A1005', '解放军第一七四医院', '3J', '118.10134,24.464437'],
//         ['350211A1006', '厦门金尚医院', '1J', '118.147598,24.505606'],
//         ['350211A1007', '厦门大学医院', '2I', '118.099353,24.441393'],
//         ['350211A1008', '思明区医院', '2I', '118.101307,24.465141'],
//         ['350211A1009', '厦门思明长青医院', '2I', '118.107151,24.494378'],
//         ['350211A1010', '厦门仁安医院', '2J', '118.123331,24.477772'],
//         ['350211A1011', '厦门前埔医院', '2I', '118.178902,24.473788'],
//         ['350211A1012', '厦门莲花医院', '2J', '118.137307,24.491027'],
//         ['350211A1013', '厦门天济医院', '1J', '118.08931,24.464499'],
//         ['350211A1014', '福利中心松柏医院', '1I', '118.127232,24.499255'],
//         ['350211A1016', '厦门市翔安区同民医院', '2J', '118.256453,24.665445'],
//         ['350211A1016', '翔安区同民医院', '2J', '118.254851,24.665341'],
//         ['350211A1017', '厦门大学附属中山医院湖里分院', '3J', '118.104778,24.513575'],
//         ['350211A1017', '厦门市湖里医院', '2I', '118.104031,24.518077'],
//         ['350211A1018', '厦门湖里仁德医院', '1I', '118.134547,24.504672'],
//         ['350211A1019', '厦门海沧新阳医院', '2I', '118.003854,24.526695'],
//         ['350211A1030', '厦门大学附属第一医院鼓浪屿分院', '2J', '118.078125,24.450099'],
//         ['350211A1031', '厦门新开元医院', '2I', '118.087487,24.466204'],
//         ['350211A1039', '厦门湖里安兜医院', '1I', '118.142759,24.526091'],
//         ['350211A1049', '厦门市海沧医院', '3J', '118.045531,24.496495'],
//         ['350211A2001', '厦门市中医院', '3J', '118.147598,24.505606'],
//         ['350211A2003', '同安区中医院', '2J', '118.156431,24.740864'],
//         ['350211A5001', '厦门市仙岳医院', '3J', '118.117627,24.50169'],
//         ['350211A5002', '厦门市口腔医院', '3I', '118.095153,24.466531'],
//         ['350211A5003', '厦门市卫生学校附属口腔医院', '3I', '118.171839,24.492113'],
//         ['350211A5004', '厦门市眼科中心', '3J', '118.087159,24.4665'],
//         ['350211A5005', '厦门市博爱康复医院', '2I', '118.153019,24.736989'],
//         ['350211A5006', '厦门思明区开元骨科医院', '2I', '118.116862,24.486333'],
//         ['350211G1001', '厦门市妇幼保健院', '3J', '118.087104,24.456249'],
//         ['350211G1002', '东方天使厦门妇产医院', '1J', '118.09071,24.461781'],
//         ['350211G1101', '厦门思明区妇幼保健院', '1I', '118.08999,24.468888'],
//         ['350211G1103', '厦门集美区妇幼保健院', '1I', '118.039115,24.595081'],
//         ['350211G1104', '厦门海沧区妇幼保健院', '1I', '118.046828,24.498799'],
//     ];
//     let res = { polyData: [] };
//     res.polyData = { header: [{ name: 'hospitalName', dataType: 'STRING' }, { name: 'hospitalCoord', dataType: 'STRING' }, { name: 'count', dataType: 'INTEGER' }, { name: 'hospitalLevel', dataType: 'STRING' }], rows: [['厦门思明区妇幼保健院', '118.08999,24.468888', 0, '1I'], ['厦门新开元医院', '118.087487,24.466204', 0, '2I'], ['厦门天济医院', '118.08931,24.464499', 0, '1J'], ['厦门大学附属中山医院湖里分院', '118.104778,24.513575', 0, '3J'], ['厦门湖里安兜医院', '118.142759,24.526091', 0, '1I'], ['厦门莲花医院', '118.137307,24.491027', 0, '2J'], ['厦门市第二医院', '118.110987,24.590618', 0, '3I'], ['厦门市第三医院', '118.153711,24.711511', 0, '3I'], ['厦门市中医院', '118.147598,24.505606', 133921, '3J'], ['东方天使厦门妇产医院', '118.09071,24.461781', 0, '1J'], ['厦门集美区妇幼保健院', '118.039115,24.595081', 0, '1I'], ['厦门海沧新阳医院', '118.003854,24.526695', 0, '2I'], ['解放军第一七四医院', '118.10134,24.464437', 0, '3J'], ['厦门大学附属第一医院鼓浪屿分院', '118.078125,24.450099', 0, '2J'], ['同安区中医院', '118.156431,24.740864', 0, '2J'], ['厦门市翔安区同民医院', '118.256453,24.665445', 0, '2J'], ['厦门市海沧医院', '118.045531,24.496495', 229880, '3J'], ['厦门海沧区妇幼保健院', '118.046828,24.498799', 0, '1I'], ['厦门前埔医院', '118.178902,24.473788', 0, '2I'], ['厦门大学附属第一医院', '118.09341,24.457563', 370992, '3J'], ['厦门市妇幼保健院', '118.087104,24.456249', 0, '3J'], ['厦门市眼科中心', '118.087159,24.4665', 0, '3J'], ['厦门大学附属第一医院杏林分院', '118.054418,24.567219', 0, '1I'], ['厦门市仙岳医院', '118.117627,24.50169', 0, '3J']] };
//     if (res.polyData && res.polyData.rows) {
//         let newPolyData = [];
//         xmHospital.map(function (xm) {
//             let count = 0;
//             for (let i = 0; i < res.polyData.rows.length; i += 1) {
//                 if (res.polyData.rows[i][0] === xm[1]) {
//                     count = res.polyData.rows[i][2];
//                     break;
//                 }
//             }
//             newPolyData.push([xm[1], xm[3], count, xm[2]]);
//         });
//         res.polyData.rows = newPolyData;
//     }
//     console.log(res);
//     return res;
// }

export class HospitalPoly extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            curData: {},
            config: this.props.config,
            markerData: [],
            effectScatterData: [],
            geoMap: {},
            h: this.props.h,
            w: this.props.w,
        };
    }

    buildChart() {
        let { curData, markerData, effectScatterData, geoMap } = this.state;

        // polyData
        if (curData && curData.length > 0 && curData[0].rows && curData[0].rows.length > 0) {
            curData[0].rows.map(function (o) {
                if (o.length === 5 && o[1]) {
                    let geo = o[4].split(',');
                    if (geo && geo.length > 1) {
                        let geo1 = parseFloat(geo[0]);
                        let geo2 = parseFloat(geo[1]);
                        let count = (o[2] == null ? 0 : parseInt(o[2]));
                        let hLevel = o[3];
                        let isH1 = hLevel && hLevel.indexOf('1') > -1;
                        let isH2 = hLevel && hLevel.indexOf('2') > -1;
                        let isH3 = hLevel && hLevel.indexOf('3') > -1;

                        // 临时取消H1
                        if (isH1) {
                            return;
                        }

                        if (!isNaN(geo1) && !isNaN(geo2)) {
                            let mRow = {
                                name: o[0],
                                value: [geo1, geo2],
                                count: count,
                            };
                            let eRow = {
                                name: o[0],
                                value: [geo1, geo2],
                            };
                            if (!isNaN(count) && count > 0) {
                                if (isH3) {
                                    mRow.symbol = 'image:///images/h3-green.png';
                                } else if (isH2) {
                                    mRow.symbol = 'image:///images/h2-green.png';
                                } else {
                                    mRow.symbol = 'image:///images/h1-green.png';
                                }
                                eRow.itemStyle = {
                                    normal: {
                                        color: 'rgba(0,202,161,.5)',
                                    },
                                };
                            } else {
                                if (isH3) {
                                    mRow.symbol = 'image:///images/h3-blue.png';
                                } else if (isH2) {
                                    mRow.symbol = 'image:///images/h2-blue.png';
                                } else {
                                    mRow.symbol = 'image:///images/h1-blue.png';
                                }
                                eRow.itemStyle = {
                                    normal: {
                                        color: 'rgba(6,115,240,.5)',
                                    },
                                };
                            }
                            geoMap[o[0]] = {
                                geo: [geo1, geo2],
                                mData: mRow,
                                esData: eRow,
                            };
                            markerData.push(mRow);
                            effectScatterData.push(eRow);
                        }
                    }
                }
            });
        }

        this.setState({
            markerData: markerData,
            effectScatterData: effectScatterData,
            geoMap: geoMap,
        }, Utils.initChart(markerData, effectScatterData));
    }

    componentDidMount() {
        let that = this;
        let { data } = that.props;
        let log = function (msg) {
            console.error(msg);
        };

        let { config } = this.state;
        // echarts3
        if (!echarts) {
            log('ECharts is not Loaded');
            return;
        }
        if (!echarts.registerMap) {
            log('ECharts Map is not loaded');
            // return;
        }

        that.setState({ curData: data }, that.buildChart);
    }

    componentWillReceiveProps(nextProps) {
        let sameProps = (!nextProps.data || nextProps.data === this.state.data);
        if (!sameProps) {
            this.doUpdate(nextProps.data);
        }

        if (nextProps.w !== this.props.w || nextProps.h !== this.props.h) {
            this.setState({ w: nextProps.w, h: nextProps.h });
            this.processStyle('xiamenTest', nextProps.w, nextProps.h);
            Utils.resizeChart();
        }
    }

    processStyle(elId, new_w, new_h) {
        let barStyle = document.getElementById(elId).getAttribute('style').split(';');
        let newBarStyle = [];
        barStyle.map((e) => {
            if (e.indexOf('width') !== -1) { newBarStyle.push('width: ' + parseInt(new_w) + 'px'); } else if (e.indexOf('height') !== -1) { newBarStyle.push('height: ' + (parseInt(new_h) - 36) + 'px'); } else { newBarStyle.push(e); }
        });
        document.getElementById(elId).setAttribute('style', newBarStyle.join(';'));
    }

    doUpdate(data) {
        let that = this;
        let callback = null;
        callback = this.buildChart;
        this.setState({
            curData: data,
        }, callback);
    }

    renderLegend() {
        let rowStyle = { marginTop: 5, lineHeight: '24px' };
        let iconStyle = { width: 25, float: 'left', marginRight: 12 };
        let redPointStyle = { background: '#0673f0', width: 10, height: 10, float: 'left', borderRadius: '50%', marginTop: 6, marginLeft: 10, marginRight: 17 };
        let greenPointStyle = { background: '#00caa1', width: 10, height: 10, float: 'left', borderRadius: '50%', marginTop: 6, marginLeft: 10, marginRight: 17 };
        return (<div style={{ position: 'absolute', color: '#ababab', top: 16, right: 30, zIndex: 99999, fontSize: 12 }}>
            <Row>
                <div style={iconStyle}>
                    <img alt="" src="/images/h3-white.png" width="24"
                        style={{ marginLeft: 5, marginTop: -4 }}
                    />
                </div>
                <span>三级医院</span>
            </Row>
            <Row style={rowStyle}>
                <div style={iconStyle}>
                    <img alt="" src="/images/h2-white.png" width="18"
                        style={{ marginLeft: 7, marginTop: -2 }}
                    />
                </div>
                <span>二级医院</span>
            </Row>
            {/* <Row style={rowStyle}>
                        <div style={iconStyle}>
                            <img src="/images/h1-black.png" width="25" style={{marginLeft:2, marginTop:-1}}/>
                        </div>
                        <span>社区医院</span>
                    </Row> */}
            <Row style={rowStyle}>
                <div style={greenPointStyle}></div>
                <span>已接入数据</span>
            </Row>
            <Row style={rowStyle}>
                <div style={redPointStyle}></div>
                <span>未接入数据</span>
            </Row>
        </div>);
    }

    render() {
        return (
            <div style={{ position: 'relative' }}>
                <div style={{ marginLeft: 10, marginTop: 10, color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                    厦门各医院数据汇聚概览
                </div>
                {this.renderLegend()}
                <div id="xiamenTest" style={{ width: this.state.w, height: this.state.h, margin: '0 auto' }}></div>
            </div>
        );
    }
}

