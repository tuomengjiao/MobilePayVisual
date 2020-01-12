import React, { PureComponent } from "react";
import { Row, Col, Input, Select, Icon, Tooltip, Button, Card, Modal, message,
	Divider, Radio, Checkbox } from "antd";
import ElementComponent from '../Common/ElementComponent';
let underscore = require("underscore");
let Immutable = require('immutable');

import styles from "./Common.less";

export default class RiskCommentPopup extends ElementComponent {
	constructor(props) {
		super(props);
		this.state = this.initData(props.item);
	}

	initData(item) {
		let newState = {
			id: 0,
			level: '',
			threshold: '',
			comment: '',
		};
		if (item && item.id) {
			newState.id = item.id;
			newState.level = '' + item.level;
			newState.threshold = '' + item.threshold;
			newState.comment = item.comment;
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
		const { id, level, threshold, comment } = this.state;
		if (!this.props.onSubmit) {
			return;
		}
		if (!isUpdate) {
			this.props.onSubmit(false, null);
			return;
		}

		if (!level || !threshold || !comment) {
			message.error('请检查信息是否填写!');
			return;
		}

		let x = {
			id: id,
			level: parseInt(level),
			threshold: parseFloat(threshold),
			comment: comment,
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
					title: '级别', tag: 'level'
				}]
			},
			{
				split: 24,
				items: [{
					layout: {title: 6, element: 16}, elementType: 'input',
					title: '风险门限', tag: 'threshold'
				}]
			},
			{
				split: 24,
				items: [{
					layout: {title: 6, element: 16}, elementType: 'textArea',
					title: '描述', tag: 'comment'
				}]
			},
		];
		let title = '新建风险评价';
		if (id) {
			title = '编辑风险评价';
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
