import React, { PureComponent } from "react";
import { Row, Col, Input, Select, Icon, Tooltip, Button, Card, Modal, message,
	Divider, Radio, Checkbox } from "antd";
import ElementComponent from '../Common/ElementComponent';
let underscore = require("underscore");
let Immutable = require('immutable');

import styles from "./Org.less";

export default class UserPopup extends ElementComponent {
	constructor(props) {
		super(props);
		this.state = this.initData(props.item);
	}

	initData(item) {
		let newState = {
			id: 0,
			name: '',
			fullname: '',
			email: '',
			disabled: 0,
			password: '',
		};
		if (item && item.id) {
			newState.id = item.id;
			newState.name = item.name;
			newState.email = item.email;
			newState.fullname = item.fullname;
			newState.disabled = item.disabled;
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
		const { id, name, email, fullname, disabled, password } = this.state;
		if (!this.props.onSubmit) {
			return;
		}
		if (!isUpdate) {
			this.props.onSubmit(false, null);
			return;
		}

		if (!name) {
			message.error('请检查名称等信息是否选择或填写!');
			return;
		}

		let x = {
			id: id,
			name: name,
			email: email,
			fullname: fullname,
			disabled: disabled,
			role_id: 1,
		};
		if (password != '') {
			x.password = password;
		}
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
					title: '用户', tag: 'name'
				}]
			},
			{
				split: 24,
				items: [{
					layout: {title: 6, element: 16}, elementType: 'input',
					title: '名称', tag: 'fullname'
				}]
			},
			{
				split: 24,
				items: [{
					layout: {title: 6, element: 16}, elementType: 'input',
					title: '电子邮件', tag: 'email'
				}]
			},
			{
				split: 24,
				items: [{
					layout: {title: 6, element: 16}, elementType: 'password',
					title: '密码', tag: 'password', visibilityToggle:true
				}]
			},
		];
		let title = '新建用户';
		if (id) {
			title = '编辑用户';
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
