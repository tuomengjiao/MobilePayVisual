import React from 'react';
import { connect } from 'react-redux';

import { Modal, Button, Row, Col, Tag, Icon, Transfer, Select } from 'antd';
import * as Utils from './PatientDistributionUtils';

let _ = require('underscore');
let Immutable = require('immutable');

// function mockInput() {
//     let xmdata = {
//         header: [
//             { name: 'hospital', dataType: 'STRING' },
//             { name: 'region', dataType: 'STRING' },
//             { name: 'count', dataType: 'INTEGER' },
//         ],
//         rows: [
//             ['A医院', '思明区', 10],
//             ['A医院', '海沧区', 10],
//             ['A医院', '翔安区', 15],
//             ['A医院', '湖里区', 100],
//             ['A医院', '集美区', 1000],
//             ['A医院', '同安区', 200],
//             ['A医院', '翔安区', 40],
//             ['B医院', '思明区', 20],
//             ['B医院', '海沧区', 200],
//             ['B医院', '翔安区', 2050],
//             ['B医院', '湖里区', 120],
//             ['B医院', '集美区', 220],
//             ['B医院', '同安区', 320],
//         ],
//     };
//     let externaldata = {
//         header: [
//             { name: 'hospital', dataType: 'STRING' },
//             { name: 'region', dataType: 'STRING' },
//             { name: 'count', dataType: 'INTEGER' },
//         ],
//         rows: [
//             ['A医院', '福建省', 4000],
//             ['A医院', '山东省', 5],
//             ['A医院', '美国', 200],
//             ['B医院', '福建省', 5000],
//             ['B医院', '山东', 33],
//             ['B医院', '河南', 300],
//         ],
//     };
//     return {
//         xmdata: xmdata,
//         externaldata: externaldata,
//     };
// }

export class FMSelect extends React.Component {
    static defaultProps = {
        name: '',
        tag: '',
        className: null,
        disabled: false,
        value: [''],
        defaultValue: [],
        title: '',
        options: [],
        placeholder: '请选择',
        size: 'large',
        idx: 0,
        multiple: false,
        tags: false,
        combobox: false,
        rowStyle: { marginTop: 15 },
        editIcon: false,
        labeltitle: true,
    };

    onChange(value) {
        if (this.props.onChange) {
            this.props.onChange(this.props.tag, value);
        }
    }

    handleEdit() {
        if (this.props.onEdit) {
            this.props.onEdit(this.props.tag);
        }
    }

    findContainer(tag) {
        let name = 'form-select-' + tag;
        return Utils.getRef(this.refs[name]);
    }

    handlefilter(val, option) {
        if (option.props.children.indexOf(val) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    buildGroupSelect() {
        const { tag, disabled, options, placeholder, size, value, multiple, tags } = this.props;
        let mode = '';
        let showSearch = true;
        if (multiple || tags) {
            if (multiple) {
                mode = 'multiple';
            }
            if (tags) {
                mode = 'tags';
            }
            showSearch = false;
        }
        return (
            <Select mode={mode}
                filterOption={::this.handlefilter}
                name={tag}
                size={size}
                style={{ width: '100%' }}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                getPopupContainer={this.findContainer.bind(this, tag)}
                onChange={::this.onChange}
            >
                {options.map(o =>
                    <Select.OptGroup label={o.name}>
                        {o.kvs.map(vk => <Select.Option key={vk.v} >{vk.k}</Select.Option>)}
                    </Select.OptGroup>
                )}
            </Select>
        );
    }

    buildSelect() {
        const { tag, disabled, options, placeholder, size, value, multiple, tags } = this.props;
        let mode = '';
        let showSearch = true;
        if (multiple || tags) {
            if (multiple) {
                mode = 'multiple';
            }
            if (tags) {
                mode = 'tags';
            }
            showSearch = false;
        }

        if (mode === 'tags') {
            return (
                <Select mode={mode}
                    name={tag}
                    size={size}
                    style={{ width: '100%' }}
                    placeholder={placeholder}
                    disabled={disabled}
                    value={value}
                    getPopupContainer={this.findContainer.bind(this, tag)}
                    onChange={::this.onChange}
                >
                    {options.map(o =>
                        <Select.Option key={o.v} >{o.k}</Select.Option>
                    )}
                </Select>
            );
        }

        return (
            <Select tags={tags}
                multiple={multiple}
                showSearch
                filterOption={::this.handlefilter}
                name={tag}
                size={size}
                style={{ width: '100%' }}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                getPopupContainer={this.findContainer.bind(this, tag)}
                onChange={::this.onChange}
            >
                {options.map(o =>
                    <Select.Option key={o.v} >{o.k}</Select.Option>
                )}
            </Select>
        );
    }

    render() {
        const { tag, disabled, options, title, placeholder, size, value, multiple, tags, combobox, rowStyle,
            titleWidth, controlWidth, editIcon, labeltitle, group, className } = this.props;
        let iconStyle = {
            fontSize: 'x-large',
            marginTop: 5,
            marginLeft: 10,
        };
        let LabelColStyle = { paddingTop: 5, paddingRight: 20, textAlign: 'right' };
        let selectComponent = null;
        if (group) {
            selectComponent = this.buildGroupSelect();
        } else {
            selectComponent = this.buildSelect();
        }
        return (
            <Row className={className} style={rowStyle}>
                { (titleWidth !== 0) &&
                    <Col sm={titleWidth} style={LabelColStyle}>
                        {(labeltitle ?
                            <label>{title}</label>
                            :
                            <div>{title}</div>
                        )}
                    </Col>
                }
                <Col sm={controlWidth}>
                    <div ref={'form-select-' + tag} className="form-select" >
                        {selectComponent}
                    </div>
                </Col>
                { (editIcon) &&
                    <Icon style={iconStyle} type="edit" onClick={::this.handleEdit} />
                }
            </Row>
        );
    }
}

export default class PatientDistribution extends React.Component {
    static defaultProps = {
    };

    constructor(props, context) {
        super(props, context);
        let config = this.props.config;
        this.state = {
            dataMap: {},
            hospital: '',
            hospitalOptions: [],
            config: config,
            h: this.props.h,
            w: this.props.w,
        };
    }

    componentDidMount() {
        let { data } = this.props;
        this.initCharts();
        this.initData(data);
    }

    initData(res) {
        if (!res || res.length !== 2) {
            return false;
        }
        console.log('PatientDistribution Data: ', res);
        let buildData = {
            xmdata: res[1],
            externaldata: res[0],
        };
        let curData = Utils.BuildStateData(buildData); // mockInput(), res
        this.setState(curData, this.drawCharts.bind(this));
    }

    initCharts() {
        let idBar = this.props.tag + '_bar';
        this.barChart = echarts.init(document.getElementById(idBar));

        let idPie = this.props.tag + '_pie';
        this.pieChart = echarts.init(document.getElementById(idPie));
    }

    drawCharts() {
        Utils.drawBar(this.barChart, this.state.dataMap, this.state.hospital);
        Utils.drawPie(this.pieChart, this.state.dataMap, this.state.hospital);

        if (this.props.onHospitalSelect) {
            this.props.onHospitalSelect(this.state.hospital);
        }
    }

    onChange(tag, val) {
        let curState = this.state;
        if (curState[tag] === val) {
            return;
        }

        let callback = null;
        if (tag === 'hospital') {
            callback = this.drawCharts.bind(this);
        }
        curState[tag] = val;
        this.setState(curState, callback);
    }

    buildTop() {
        const titleStyle = {
            textAlign: 'left',
            paddingLeft: 10,
            paddingTop: 10,
            fontSize: 14,
            color: '#fff',
            fontWeight: 'bold',
        };
        // <Col span={8} style={{paddingTop:5, position:'absolute',left:200}}>
        return (
            <div>
                <Row>
                    <Col span={24} style={titleStyle}>
                        就诊患者来源分布
                    </Col>
                </Row>
                <Row>
                    <Col span={12} offset={6}>
                        <FMSelect tag="hospital"
                            className="patientDistributionSelect"
                            value={this.state.hospital}
                            options={this.state.hospitalOptions}
                            onChange={this.onChange.bind(this)}
                            size="default"
                        />
                    </Col>
                </Row>
            </div>
        );
    }

    componentWillReceiveProps(nextProps) {
        let sameProps = (!nextProps.data || nextProps.data === this.state.data);
        if (!sameProps) {
            this.initData(nextProps.data);
        }

        if (nextProps.w !== this.props.w || nextProps.h !== this.props.h) {
            this.setState({ w: parseInt(nextProps.w), h: parseInt(nextProps.h) });
            this.processStyle(this.props.tag + '_bar', nextProps.w, nextProps.h);
            this.processStyle(this.props.tag + '_pie', nextProps.w, nextProps.h);

            this.barChart.resize();
            this.pieChart.resize();
        }
    }

    processStyle(elId, new_w, new_h) {
        let barStyle = document.getElementById(elId).getAttribute('style').split(';');
        let newBarStyle = [];
        barStyle.map((e) => {
            if (e.indexOf('width') !== -1) { newBarStyle.push('width: ' + ((parseInt(new_w) - 25) / 2) + 'px'); } else if (e.indexOf('height') !== -1) { newBarStyle.push('height: ' + (parseInt(new_h) - 90) + 'px'); } else { newBarStyle.push(e); }
        });
        document.getElementById(elId).setAttribute('style', newBarStyle.join(';'));
    }

    buildBar() {
        let name = this.props.tag + '_bar';
        return (
            <Col span={12}>
                <Row style={{ textAlign: 'center' }}>
                    <div id={name} style={{ width: (this.state.w - 25) / 2, height: this.state.h - 90, margin: '0 auto' }} />
                </Row>
            </Col>
        );
    }

    buildPie() {
        let name = this.props.tag + '_pie';
        return (
            <Col span={12}>
                <Row style={{ textAlign: 'center' }}>
                    <div id={name} style={{ width: (this.state.w - 25) / 2, height: this.state.h - 90, margin: '0 auto' }} />
                </Row>
            </Col>
        );
    }

    buildBottom() {
        return (
            <Row style={{ textAlign: 'left', marginLeft: -25, color: '#aeaeae' }} className="chromeFont10">
                过去12个月
            </Row>
        );
    }

    render() {
        // style={{position:'absolute',width:'100%',marginTop:10,top:70,bottom:0,left:0}}
        let panelStyle = { width: '100%', height: '100%' };
        return (
            <div className="patientDistribution" style={panelStyle}>
                {this.buildTop()}
                <Row >
                    {this.buildBar()}
                    {this.buildPie()}
                </Row>
                {this.buildBottom()}
            </div>
        );
    }
}
