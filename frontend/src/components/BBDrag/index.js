import React, { Component } from 'react';
import { Tooltip, Tag, Icon } from 'antd';
import SourceBox from './DragSource';
import TargetBox from './DragTarget';
import DragTag from './DragTag';
import DragSelect from './DragSelect';
import styles from './index.less';

let Immutable = require('immutable');
let _ = require('underscore');

export class SourceDragTags extends Component {
    static defaultProps = {
        disabled: false,
        size: [160, 30],
        tags: [],
        textAlign: 'center',
        className: '',
    };

    constructor(props, context) {
        super(props, context);
        this.state = this.initData(props);
    }

    initData(props) {
        let tagsDrag = {};
        props.tags.map((t) => {
            tagsDrag[t.tag] = false;
        });
        let newState = {
            tagsDrag: tagsDrag,
        };
        return newState;
    }

    handleBeginDrag(tag) {
        if (this.props.targetObjStyle) {
            this.props.targetObjStyle(tag, 'begin');
        }
        let tagsDrag = this.state;
        tagsDrag[tag] = true;
        this.setState({
            tagsDrag: tagsDrag,
        });
    }

    handleEndDrag(tag) {
        if (this.props.targetObjStyle) {
            this.props.targetObjStyle(tag, 'end');
        }
        let tagsDrag = this.state;
        tagsDrag[tag] = false;
        this.setState({
            tagsDrag: tagsDrag,
        });
    }

    handleMouseIsOver(tag, type) {
        let tagsDrag = this.state;
        tagsDrag[tag] = type;
        this.setState({
            tagsDrag: tagsDrag,
        });
    }

    buildDragTag(t, idx) {
        const { size, className, textAlign } = this.props;
        const { tagsDrag } = this.state;
        let sourceTagStyle = { height: size[1] };
        let tagStyle = {
            ...sourceTagStyle,
            width: size[0],
            textAlign: textAlign,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: -1,
            background: '#fbfbfb',
            borderColor: '#DDDDDD',
        };
        if (tagsDrag[t.tag]) {
            tagStyle = { ...tagStyle, ...t.style.drag };
        } else if (t.selected > 0) {
            tagStyle = { ...tagStyle, ...t.style.selected };
        } else {
            tagStyle = { ...tagStyle, ...t.style.default };
        }
        let image = null;
        let downIconColor = null;
        if (t.image && !_.isEmpty(t.image)) {
            image = (tagsDrag[t.tag] && t.image.drag) ? t.image.drag : t.image.default;
            downIconColor = (tagsDrag[t.tag] && t.image.drag) ? '#ffffff' : '#4bc69f';
        }
        return (
            <div className={className}>
                <SourceBox
                    tag={t.tag}
                    style={sourceTagStyle}
                    isOver={::this.handleMouseIsOver}
                    beginDrag={::this.handleBeginDrag}
                    endDrag={::this.handleEndDrag}
                >
                    <Tooltip placement="topLeft" title={t.name}>
                        <Tag style={tagStyle}>
                            <span style={{ verticalAlign: 'sub' }}>
                                <img alt="" src={image} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                                <span style={{ verticalAlign: 'middle' }}>
                                    {t.name}
                                </span>
                            </span>
                        </Tag>
                    </Tooltip>
                </SourceBox>
            </div>
        );
    }

    render() {
        const { tags, bodyStyle } = this.props;
        return (
            <div style={{ ...bodyStyle, overflowY: 'auto', textAlign: 'center' }}>
                {tags.map((t, idx) =>
                    this.buildDragTag(t, idx)
                )}
            </div>
        );
    }
}

export class DataTagsComponent extends Component {
    static defaultProps = {
        fields: [],
        dataTags: {
            dim: [],
            index: [],
        },
    };

    constructor(props, context) {
        super(props, context);
    }

    onChange(tag, value) {
        if (this.props.onChange) {
            this.props.onChange(tag, value);
        }
    }

    onClose(tag, dataName) {
        let value = this.props.dataTags[tag];
        let idx = value.indexOf(dataName);
        if (idx !== -1) {
            value.splice(idx, 1);
        }
        if (this.props.onDelete) {
            this.props.onDelete(tag, value, dataName);
        }
    }

    onSelect(tag, dataTag) {
        if (this.props.onSelect) {
            this.props.onSelect(tag, dataTag);
        }
    }

    getFieldsTags(fields) {
        let tags = [];
        fields.map((field) => {
            tags.push(field.tag);
        });
        return tags;
    }

    render() {
        const { dataTags, fields } = this.props;
        let tags = this.getFieldsTags(fields);
        return (
            <div>
                <FMContainer
                    type="select"
                    fields={fields}
                    tag="dim"
                    title="维度"
                    value={dataTags.dim}
                    tags={tags}
                    titleWidth={2}
                    controlWidth={22}
                    icon="bars"
                    rowStyle={{ marginTop: 0, height: 31 }}
                    onSelect={::this.onSelect}
                    onChange={::this.onChange}
                    onClose={::this.onClose}
                />
                <FMContainer
                    type="select"
                    fields={fields}
                    tag="index"
                    title="指标"
                    icon="bar-chart"
                    value={dataTags.index}
                    tags={tags}
                    titleWidth={2}
                    controlWidth={22}
                    rowStyle={{ marginTop: 10, height: 31 }}
                    onSelect={::this.onSelect}
                    onChange={::this.onChange}
                    onClose={::this.onClose}
                />
            </div>
        );
    }
}


export class FMContainer extends Component {
    static defaultProps = {
        type: 'tag',
        name: '',
        fields: [],
        icon: '',
        tag: '',
        disabled: false,
        value: [],
        title: '',
        titleWidth: 0,
        controlWidth: 8,
        rowStyle: {},
        tags: [],
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            cards: this.initState(props),
            flush: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        let sameProps = Immutable.is(this.props, nextProps);
        if (!sameProps) {
            let cards = this.initState(nextProps);
            this.setState({
                cards: cards,
                flush: false,
            });
        }
    }

    initState(props) {
        let cards = [];

        const { value } = props;
        for (let idx = 0; idx < value.length; idx++) {
            cards[idx] = {
                id: idx,
                value: value[idx],
            };
        }
        return cards;
    }

    moveCard(dragIndex, hoverIndex) {
        const { cards } = this.state;
        const dragCard = cards[dragIndex];

        this.setState(update(this.state, {
            cards: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            },
        }));

        this.setState({
            flush: true,
        });
    }

    onSelect(dataTag) {
        if (this.props.onSelect) {
            this.props.onSelect(this.props.tag, dataTag);
        }
    }

    onClose(dataTag) {
        if (this.props.onClose) {
            this.props.onClose(this.props.tag, dataTag);
        }
    }

    onChange(opt, idx) {
        let value = [];
        this.state.cards.map((card, i) => {
            if (idx === i) {
                card.value.opt = opt;
            }
            value.push(card.value);
        });

        if (this.props.onChange) {
            this.props.onChange(this.props.tag, value);
        }
    }

    beginDrag(id, tag) {
        // console.log('drag id',id);
        // this.setState({
        //     flush:true
        // });
        // console.log('state',this.state.flush);
    }

    dragEnd(dragId, dragTag) {
        let value = [];

        if (this.props.onChange && this.state.flush === true) {
            this.state.cards.map((card) => {
                value.push(card.value);
            });
            this.props.onChange(this.props.tag, value);
        }

        this.setState({
            flush: false,
        });
    }

    buildDragItem(card, idx) {
        const { tag, fields, type } = this.props;
        const { flush } = this.state;
        const tagStyle = {
            width: 130,
            height: 24,
            textAlign: 'right',
        };

        switch (type) {
        case 'tag':
            return (
                <DragTag
                    fields={fields}
                    key={card.id}
                    id={card.id}
                    value={card.value}
                    index={idx}
                    flush={flush}
                    moveCard={::this.moveCard}
                    dragEnd={::this.dragEnd}
                    onClose={::this.onClose}
                    tag={tag + '-' + card.id}
                    tagStyle={tagStyle}
                    beginDrag={::this.beginDrag}
                />
            );
        case 'select':
            return (
                <DragSelect
                    fields={fields}
                    name={tag}
                    key={card.id}
                    index={idx}
                    id={card.id}
                    value={card.value}
                    flush={flush}
                    moveCard={::this.moveCard}
                    onChange={::this.onChange}
                    dragEnd={::this.dragEnd}
                    onClose={::this.onClose}
                    onDrag={::this.beginDrag}
                    tag={tag + '-' + card.id}
                />
            );
        default:
            return (
                <div></div>
            );
        }
    }

    render() {
        const { title, icon, rowStyle, tags, tag } = this.props;
        const { cards } = this.state;

        return (
            <div id={tag} style={{ ...rowStyle, minWidth: 600 }}>
                { (title !== '') &&
                    <label className={styles.buttonStyle}>
                        <span style={{ verticalAlign: '-webkit-baseline-middle', fontWeight: 400 }}>
                            <Icon type={icon} style={{ marginRight: 5 }} />
                            {title}
                        </span>
                    </label>
                }
                <label className={styles.labelStyle}>
                    <TargetBox style={{ width: '100%', height: 31, marginTop: 2 }} tags={tags} onSelect={::this.onSelect}>
                        {cards.map((card, idx) =>
                            this.buildDragItem(card, idx)
                        )}
                    </TargetBox>
                </label>
            </div>
        );
    }
}


export class FMCloseButton extends Component {
    static defaultProps = {
        title: '',
        tag: '',
        icon: '',
        bgColor: '',
        fontColor: 'white',
    };

    componentDidMount() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    onClick() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    onClose() {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    render() {
        const leftLabelStyle = {
            display: 'inline-block',
            borderColor: '#ddd',
            borderWidth: 1,
            borderStyle: 'solid',
            paddingLeft: 5,
            height: 26,
            width: 105,
            borderBottomLeftRadius: 4,
            borderTopLeftRadius: 4,
            borderRightWidth: 0,
            backgroundColor: '#79b0ec',
            marginBottom: 0,
            // textAlign: 'center',
            fontWeight: 300,
            overflow: 'hidden',
        };

        const rightLabelStyle = {
            display: 'inline-block',
            borderColor: '#ddd',
            borderWidth: 1,
            borderStyle: 'solid',
            paddingLeft: 5,
            height: 26,
            width: 25,
            borderBottomRightRadius: 4,
            borderTopRightRadius: 4,
            borderLeftWidth: 0,
            backgroundColor: '#79b0ec',
            marginBottom: 0,
            // textAlign: 'center',
            fontWeight: 300,
            overflow: 'hidden',
        };

        const { title, leftStyle, rightStyle, fontColor, icon, bgColor } = this.props;

        let textStyle = { verticalAlign: 'sub', color: fontColor, fontSize: 12, fontWeight: 400, marginLeft: 4 };
        let style = (bgColor.length > 0) ? { backgroundColor: bgColor } : {};
        return (
            <div style={{ height: 26 }}>
                <label style={{ ...leftLabelStyle, ...style }} onClick={::this.onClick}>
                    <span style={textStyle}>
                        {(icon.length > 0) && <img alt="" src={icon} style={{ marginRight: 5, marginTop: -2 }} />}
                        {title}
                    </span>
                </label>
                <label style={{ ...rightLabelStyle, ...style }} onClick={::this.onClose}>
                    <Icon type="close" style={{ color: fontColor, verticalAlign: 'sub' }} />
                </label>
            </div>
        );
    }
}
