import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Select, Icon, Table, DatePicker, Button, Popconfirm, Tooltip } from 'antd';

import styles from './Notification.less';
let underscore = require('underscore');

@connect(({ notification }) => ({
	notification
}))
export default class NotificationList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			pageSize: 10,
			level: '1',
			timeRange: [],
		};
	}

	buildListQueryParams() {
		const { page, pageSize, timeRange, level } = this.state;
		let params = {
			page: page,
			pageSize: pageSize,
			level: parseInt(level)
		};
		if (timeRange.length > 0) {
			if (timeRange[0]) {
				let startdate = timeRange[0].format('YYYY-MM-DD');
				params.startdate = startdate;
			}
			if (timeRange.length > 1 && timeRange[1]) {
				let enddate = timeRange[1].format('YYYY-MM-DD');
				params.enddate = enddate;
			}
		}
		return params;
	}

	componentDidMount() {
		this.fetchListData();
	}

	onListPageChange(page, pageSize) {
		this.setState({
			page: page,
			pageSize: pageSize
		}, this.fetchListData.bind(this));
	}

	fetchListData() {
		const { dispatch } = this.props;
		dispatch({
			type: 'notification/fetch',
			payload: this.buildListQueryParams()
		});
	}

	levelRender(text, record, index) {
		const NameMap = {
			'warning': {name: '提醒', color: 'blue'},
			'error': {name: '错误', color: 'red'},
			'ok': {name: '成功', color: 'green'},
		};
		let cfg = NameMap[text];
		if (!cfg) {
			cfg = {name: '未知类型', color: 'black'};
		}

		return (
			<div>
				<span style={{color:cfg.color}}>{cfg.name}</span>
			</div>
		);
	}

	longTextRender(text, record, index) {
		if (!text) {
			return '未知';
		}
		if (text.length < 80) {
			return text;
		}
		let showText = text.substring(0, 76) + '...';
		let component = (
			<Tooltip title={text}>
				{showText}
			</Tooltip>
		);
		return component;
	}

	onChange(tag, val) {
		let curState = this.state;
		curState[tag] = val;
		this.setState(curState, this.fetchListData.bind(this));
	}

	buildOpBar() {
		const { timeRange, level } = this.state;
		const levelOpts = [
			{k:'成功',v:'0'},{k:'提醒',v:'1'},{k:'错误',v:'2'},
		];
		return (
			<Row style={{marginTop:10, marginBottom:10}}>
				<Col span={8}>
					<Row style={{marginBottom:6}}>
						<Col span={6} style={{textAlign:'right'}}>类型:</Col>
						<Col span={16} style={{marginLeft:6}}>
							<Select style={{width:'100%'}}
							        value={level}
							        defaultActiveFirstOption={false}
							        allowClear
							        onChange={this.onChange.bind(this, 'level')}
							>
								{levelOpts.map( o=> <Select.Option key={o.v}>{o.k}</Select.Option>)}
							</Select>
						</Col>
					</Row>
				</Col>

				<Col span={12}>
					<Row style={{marginBottom:6}}>
						<Col span={6} style={{textAlign:'right'}}>时间:</Col>
						<Col span={16} style={{marginLeft:6}}>
							<DatePicker.RangePicker style={{width:'100%'}}
							                        value={timeRange}
							                        allowClear
							                        onChange={this.onChange.bind(this, 'timeRange')}
							/>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}

	render() {
		const { data, total } = this.props.notification;
		const { page, pageSize } = this.state;
		const columns = [
			{dataIndex:'notification_date', title:'时间', width: '25%'},
			{dataIndex:'level_name', title:'类型', render: this.levelRender.bind(this), width: '15%'},
			{dataIndex:'notification', title:'内容', render: this.longTextRender.bind(this)},
		];
		let pageOpts = {
			current: page,
			pageSize: pageSize,
			size: 'small',
			total: total,
			onChange: this.onListPageChange.bind(this),
			onShowSizeChange: this.onListPageChange.bind(this)
		};
		return (
			<div style={{width:1000, margin:'auto', backgroundColor:'white', padding:20}}>
				{this.buildOpBar()}
				<Table columns={columns}
				       dataSource={data}
				       pagination={pageOpts}
				/>
			</div>
		);
	}
}
