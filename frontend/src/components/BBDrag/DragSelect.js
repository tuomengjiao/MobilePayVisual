import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { Select, Icon, Dropdown, Menu } from 'antd';
import ItemTypes from './ItemTypes';
import { BUTTONMETA } from './Lookup';

let _ = require('underscore');

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
};

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        };
    },
    endDrag(props) {
        if (props.dragEnd) {
            props.dragEnd(props.id, props.tag);
        }
        // return {
        //     id: props.id,
        //     index: props.index,
        // };
    },
};

const cardTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        const hoverClientX = clientOffset.x - hoverBoundingRect.left;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
            return;
        }

        // Time to actually perform the action
        props.moveCard(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

@DropTarget(ItemTypes.DRAGSELECT, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.DRAGSELECT, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))
export default class DragSelect extends Component {
    static defaultProps = {
        // tag: '',
        // value: '',
        // flush: false,
        // tagStyle: {},
        // fields: [],
    };

    static propTypes = {
        // connectDragSource: PropTypes.func.isRequired,
        // connectDropTarget: PropTypes.func.isRequired,
        // index: PropTypes.number.isRequired,
        // isDragging: PropTypes.bool.isRequired,
        // id: PropTypes.any.isRequired,
        // text: PropTypes.string.isRequired,
        // moveCard: PropTypes.func.isRequired,
        // dragEnd: PropTypes.func.isRequired,
    };

    // constructor(props,context) {
    //    super(props,context);
    // }

    componentDidMount() {
        // console.log('bind events', this.props.tag);
        // $( `#${this.props.tag}` ).mouseup(function() {
        //     console.log('mouse up', this.props.flush);
        //     const { flush } = this.props;
        //     if (flush === true) {
        //         this.props.dragEnd(this.props.id,this.props.tag);
        //     }
        // }.bind(this));
    }

    componentWillUnmount() {
        // $( `#${this.props.tag}` ).unbind();
    }

    onClose() {
        if (this.props.onClose) {
            this.props.onClose(this.props.value);
        }
    }

    onChange(value) {
        if (value === 'delete' && this.props.onClose) {
            this.props.onClose(this.props.value);
        } else {
            if (this.props.onChange) {
                this.props.onChange(value, this.props.index);
            }
        }
    }

    // onFieldMenuClick(fields, e){
    //     console.log(fields, e);
    // }

    render() {
        const { isDragging, connectDragSource, connectDropTarget, value, tag, fields } = this.props;
        const opacity = isDragging ? 0 : 1;
        // const menu = (
        //     <Menu onClick={this.onFieldMenuClick.bind(this, fields)} style={{width:80}}>
        //         <Menu.Item key="STRING">文本</Menu.Item>
        //         <Menu.Item key="INTEGER">整数</Menu.Item>
        //         <Menu.Item key="DECIMAL">小数</Menu.Item>
        //         <SubMenu key="TIMESTAMP" title="时间">
        //             {datetimeFormatOptions.map(o=>
        //                 <Menu.Item key={o}>{o}</Menu.Item>
        //             )}
        //         </SubMenu>
        //     </Menu>
        // );

        let items = _.where(fields, { name: value.tag });

        let options = [];
        let bgColor = '';
        let icon = '';
        let className = '';

        if (items.length > 0) {
            // bgColor = BUTTONMETA[items[0].dataType].color;
            icon = BUTTONMETA[items[0].dataType].iconA;
            options = BUTTONMETA[items[0].dataType].options;
            className = BUTTONMETA[items[0].dataType].className;
        }

        let optStr = '';
        if (value.opt.length > 0) {
            optStr = '(' + value.opt + ')';
        }

        return connectDragSource(connectDropTarget(
            <div id={tag} style={{ opacity, width: 130, height: 26, display: 'inline-block', marginLeft: 5 }} title={value.tag}>
                <Select className={'v-ant-select ' + className} size="small" onChange={::this.onChange}
                    value={
                        <div title={value.tag}>
                            <img src={icon} alt="" />
                            <span style={{ verticalAlign: 'middle', fontWeight: 400, fontSize: 12 }}> {value.tag} </span>
                        </div>
                    }
                >
                    {options.map(o =>
                        <Select.Option value={o.v} style={(value.opt === o.v) ? { background: '#ddd' } : {}} >{o.k}</Select.Option>
                    )}
                </Select>
            </div>
        ));
    }
}
