import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';


const TagTarget = {
    drop(props, monitor) {
        console.log('dorp');
        props.onSelect(monitor.getItemType());
    },

};

@DropTarget(props => props.tags, TagTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    draggingTag: monitor.getItemType(),
}))

class TargetBox extends Component {
    static propTypes = {
        // isOver: PropTypes.bool.isRequired,
        // canDrop: PropTypes.bool.isRequired,
        // draggingTag: PropTypes.string,
        // connectDropTarget: PropTypes.func.isRequired,
        // onSelect: PropTypes.func.isRequired,
        // children: PropTypes.node,
    };

    static defaultProps = {
        // style: {},
    };

    render() {
        const { canDrop, isOver, connectDropTarget, children, style } = this.props;
        const opacity = isOver ? 1 : 1;

        return connectDropTarget(
            <div style={{ ...style, opacity }}>
                {children}
            </div>
        );
    }
}

export default class StatefulTargetBox extends Component {
    // constructor(props) {
    //    super(props);
    // }

    render() {
        return (
            <TargetBox
                {...this.props}
                onDrop={tag => this.handleSelect(tag)}
            />
        );
    }

    handleSelect(tag) {
        if (this.props.onSelect) {
            this.props.onSelect(tag);
        }
    }
}
