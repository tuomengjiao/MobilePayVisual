import React, { PureComponent } from "react";
import { Row, Col, Input, Select, Icon, Tooltip, Button, Card, Modal, message,
	Divider, Radio, Checkbox } from "antd";
import ElementComponent from '../Common/ElementComponent';
let underscore = require("underscore");
let Immutable = require('immutable');

import styles from "./Common.less";

export default class CityPopup extends ElementComponent {
	constructor(props) {
		super(props);
		this.state = this.initData(props.item);
	}

	initData(item) {
		let newState = {
			id: 0,
			city_code: '',
			name_en: '',
			name_zh: '',
			province_zh: '',
		};
		if (item && item.id) {
			newState.id = item.id;
			newState.city_code = item.city_code;
			newState.name_en = item.name_en;
			newState.name_zh = item.name_zh;
			newState.province_zh = item.province_zh;
		}
		return newState;
	}

	componentWillReceiveProps(nextProps) {
		let isSame = (this.props.visible==nextProps.visible || !nextProps.visible);
		if (isSame) {
			return;
		}
		let newState = this.initData(nextProps.item);
		this.setState(newState);
	}

	onSubmit(isUpdate) {
		const { id, city_code, name_en, name_zh, province_zh } = this.state;
		if (!this.props.onSubmit) {
			return;
		}
		if (!isUpdate) {
			this.props.onSubmit(false, null);
			return;
		}

		if (!city_code || !name_zh || !name_en || !province_zh) {
			message.error('请检查信息是否填写!');
			return;
		}

		let x = {
			id: id,
			city_code: city_code,
			name_en: name_en,
			name_zh: name_zh,
			province_zh: province_zh,
		};
		this.props.onSubmit(true, x);
	}

	render() {
		const { id } = this.state;
		const { visible } = this.props;
		const Lines = [
			{
				split: 24,
				items: [{
					layout: {title: 6, element: 16}, elementType: 'input',
					title: '编码', tag: 'city_code'
				}]
			},
			{
				split: 24,
				items: [{
					layout: {title: 6, element: 16}, elementType: 'input',
					title: '英文名称', tag: 'name_en'
				}]
			},
			{
				split: 24,
				items: [{
					layout: {title: 6, element: 16}, elementType: 'input',
					title: '中文名称', tag: 'name_zh'
				}]
			},
			{
				split: 24,
				items: [{
					layout: {title: 6, element: 16}, elementType: 'input',
					title: '省名', tag: 'province_zh'
				}]
			},
		];
		let title = '新建城市';
		if (id) {
			title = '编辑城市';
		}
		return (
			<Modal  title={title} visible={visible} closable={false}
			        okText="确定" onOk={this.onSubmit.bind(this, true)}
			        cancelText="取消" onCancel={this.onSubmit.bind(this, false)}
			>
				{Lines.map(this.renderLine.bind(this))}
			</Modal>
		);
	}
}
