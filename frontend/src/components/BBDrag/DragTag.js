import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { Tag, Icon, Tooltip } from 'antd';
import ItemTypes from './ItemTypes';
// import { FMCloseButton } from './index';
// import { BUTTONMETA } from './Lookup';

let _ = require('underscore');

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        };
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

        // Get vertical
        const hoverY = hoverBoundingRect.bottom - hoverBoundingRect.top;

        const hoverX = hoverBoundingRect.right - hoverBoundingRect.left;

        // Get vertical middle
        const hoverMiddleY = hoverY / 2;

        const hoverMiddleX = hoverX / 2;

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

        if (dragIndex < hoverIndex && hoverClientX < 0) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        if (dragIndex > hoverIndex && hoverClientX > hoverX) {
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
export default class DragTag extends Component {
    static defaultProps = {
        // tag: '',
        // title: '',
        // image: null,
        // flush: false,
        // tagStyle: {},
        // spanStyle: {},
        // titleEnabled: false,
        // fields: [],
        // size: [220,30]
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

    // constructor(props) {
    //    super(props);
    // }

    componentDidMount() {
        $(`#${this.props.tag}`).off('mouseup').on('mouseup', function () {
            const { flush } = this.props;
            if (flush === true) {
                this.props.dragEnd();
            }
        }.bind(this));
    }

    componentWillUnmount() {
        $(`#${this.props.tag}`).unbind();
    }

    onClose() {
        // e.preventDefault();
        // e.stopPropagation();
        if (this.props.onClose) {
            this.props.onClose(this.props.value);
        }
    }

    render() {
        const { isDragging, connectDragSource, connectDropTarget, tag, size, image, icon, tooltip, title, tagStyle, spanStyle, operation, onClick, titleEnabled, dragDisabled } = this.props;
        const opacity = isDragging ? 0 : 1;

        let tagTitleContent = (
            <div style={{ ...spanStyle, verticalAlign: 'text-top', float: 'left' }} title={titleEnabled ? title : null}>
                {(image !== null) &&
                    <img alt="" src={image} style={{ marginRight: 3 }} />
                }
                {(icon !== null) &&
                    <Icon type={icon} style={{ marginRight: 3 }} />
                }
                {title}
            </div>
        );
        if (tooltip !== null) {
            tagTitleContent = (
                <Tooltip placement="left" title={tooltip}>
                    {tagTitleContent}
                </Tooltip>
            );
        }

        let divStyle = { opacity, width: size[0], height: size[1] };
        if (tagStyle && tagStyle.display) {
            divStyle.display = tagStyle.display;
        }
        let tagHtml = (
            <div id={tag} style={divStyle}>
                <Tag style={{ ...tagStyle, width: size[0], height: size[1] }}>
                    <div style={{ ...spanStyle, verticalAlign: 'text-top', float: 'left' }} onClick={onClick} title={titleEnabled ? title : null}>
                        {tagTitleContent}
                    </div>
                    {operation}
                </Tag>
            </div>
        );

        if (dragDisabled) {
            return tagHtml;
        }

        return connectDragSource(connectDropTarget(tagHtml));
    }
}
