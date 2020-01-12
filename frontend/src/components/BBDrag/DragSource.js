import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import $ from 'jquery';

const FieldsSource = {
    canDrag(props) {
        return !props.forbidDrag;
    },

    beginDrag(props) {
        if (props.beginDrag) {
            props.beginDrag(props.tag);
        }
        return {};
    },

    endDrag(props, monitor) {
        const didDrop = monitor.didDrop();


        if (props.endDrag) {
            props.endDrag(props.tag);
        }
        return {};
    },
};


@DragSource(props => props.tag, FieldsSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))

class SourceBox extends Component {
    static propTypes = {
        // connectDragSource: PropTypes.func.isRequired,
        // isDragging: PropTypes.bool.isRequired,
        // tag: PropTypes.string.isRequired,
        // forbidDrag: PropTypes.bool.isRequired,
        // onToggleForbidDrag: PropTypes.func.isRequired,
        // children: PropTypes.node,
    };

    static defaultProps = {
        // style: {},
        // dragStyle: {},
    };

    componentDidMount() {
        if (this.props.tag) {
            $(`#${this.props.tag}`).mouseenter(function () {
                if (this.props.isOver) {
                    this.props.isOver(this.props.tag, true);
                }
            }.bind(this));
            $(`#${this.props.tag}`).mouseleave(function () {
                if (this.props.isOver) {
                    this.props.isOver(this.props.tag, false);
                }
            }.bind(this));
        }
    }

    render() {
        const { children, isDragging, connectDragSource, forbidDrag, onToggleForbidDrag, style, dragStyle, tag } = this.props;
        const opacity = isDragging ? 0.4 : 1;

        return connectDragSource(
            <div id={tag} style={{ ...style, opacity, cursor: forbidDrag ? 'default' : 'move' }}>
                {children}
            </div>
        );
    }
}

export default class StatefulSourceBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forbidDrag: false,
        };
    }

    render() {
        return (
            <SourceBox
                {...this.props}
                forbidDrag={this.state.forbidDrag}
                onToggleForbidDrag={() => this.handleToggleForbidDrag()}
            />
        );
    }

    handleToggleForbidDrag() {
        this.setState({
            forbidDrag: !this.state.forbidDrag,
        });
    }
}

