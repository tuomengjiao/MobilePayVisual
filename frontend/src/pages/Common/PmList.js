import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Select, Icon, Table, DatePicker, message, Button, Popconfirm } from 'antd';

import styles from './Common.less';
let underscore = require('underscore');
let moment = require('moment');

@connect(({ pm }) => ({
	pm
}))
export default class PmList extends React.Component {
	constructor(props) {
		super(props);
		let now = moment();
		let before1w = moment().subtract(1, 'weeks');
		this.state = {
			page: 1,
			pageSize: 10,
			cityCode: '',
			timeRange: [before1w, now],

			showPopup: false,
			hotOne: {},
		};
	}

	buildListQueryParams() {
		const { page, pageSize, cityCode, timeRange } = this.state;
		let params = {
			page: page,
			pageSize: pageSize,
		};
		if (cityCode) {
			params.cityCode = cityCode;
		}
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
		const { dispatch } = this.props;
		dispatch({
			type: 'pm/init',
			payload: this.buildListQueryParams()
		});
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
			type: 'pm/fetch',
			payload: this.buildListQueryParams()
		});
	}

	buildOpBar() {
		const { cities } = this.props.pm;
		const { cityCode, timeRange } = this.state;
		return (
			<Row style={{marginTop:10, marginBottom:10}}>
				<Col span={8}>
					<Row style={{marginBottom:6}}>
						<Col span={6} style={{textAlign:'right'}}>城市:</Col>
						<Col span={16} style={{marginLeft:6}}>
							<Select style={{width:'100%'}}
							        value={cityCode}
							        defaultActiveFirstOption={false}
							        allowClear showSearch
							        filterOption={
							            (input, option) =>
									      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									    }
							        onChange={this.onChange.bind(this, 'cityCode')}
							>
								{cities.map( o=> <Select.Option key={o.v}>{o.k}</Select.Option>)}
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

	onChange(tag, val) {
		let curState = this.state;
		curState[tag] = val;
		this.setState(curState, this.fetchListData.bind(this));
	}

	render() {
		const { data, total } = this.props.pm;
		const { page, pageSize } = this.state;
		const columns = [
			{dataIndex:'city_name', title:'城市'},
			{dataIndex:'province_name', title:'省份'},
			{dataIndex:'pm_date', title:'时间'},
			{dataIndex:'pm_25', title:'PM2.5(μg/m³)'},
			{dataIndex:'pm_10', title:'PM10(μg/m³)'},
			{dataIndex:'updated_at', title:'更新时间'},
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
