import React, { Component } from 'react';
import $ from 'jquery';
import ContainerDimensions from 'react-container-dimensions';
import { track, Chart, Axis, Tooltip, Geom } from 'bizcharts';
import { Icon } from 'antd';
import { Table, Column, Cell } from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import BBIcon from '../BBIcon';
import styles from './index.less';

const _ = require('lodash');

track(false);

export default class BBFixedTable extends Component {
    state = {
        headerHeight: 40,
        rowHeight: 32,
        width: '100%',
        maxHeight: 1000,
        curPage: 1,
        pageSize: 10,
        columnsWidth: {

        },
    }

    onChangeSorter(id, key, sort) {
        let sorters = $(`#${id}`).find('span');
        if (sort === 'asc') {
            $(sorters[0]).removeClass('sorterOff')
                .removeClass('sorterOn')
                .addClass('sorterOn');
            $(sorters[1]).removeClass('sorterOff')
                .removeClass('sorterOn')
                .addClass('sorterOff');
        } else {
            $(sorters[1]).removeClass('sorterOff')
                .removeClass('sorterOn')
                .addClass('sorterOn');
            $(sorters[0]).removeClass('sorterOff')
                .removeClass('sorterOn')
                .addClass('sorterOff');
        }
        if (this.props.onChangeSorter) {
            this.props.onChangeSorter(key, sort);
        }
    }

    // 获取列宽
    getColumnWidth(col) {
        if (col.width) {
            return col.width;
        }
        let len = col.title.length + (col.type ? 1 : 0) + (col.sorter ? 1 : 0);
        return 150 + 14 * (len > 7 ? len - 7 : 0);
    }

    getSorter(col) {
        let { tableKey } = this.props;
        let id = `columnSorter_${col.value}_${tableKey}`;
        return (
            <div className={styles.columnSorter} id={id}>
                <span className={styles.columnSorterUp + ' sorterOff'} title="↑" onClick={this.onChangeSorter.bind(this, id, col.value, 'asc')}>
                    <Icon type="caret-up" />
                </span>
                <span className={styles.columnSorterDown + ' sorterOff'} title="↓" onClick={this.onChangeSorter.bind(this, id, col.value, 'desc')}>
                    <Icon type="caret-down" />
                </span>
            </div>
        );
    }

    // 生成带icon的title
        getTitleWithIcon(col) {
            if (!col.type) {
                return (<div style={{ width: '100%', textAlign: col.align || 'center' }}>
                    {col.title}
                    {col.sorter && this.getSorter(col)}
                </div>);
            }
            let title = (<div style={{ width: '100%', textAlign: col.align || 'center' }}>
                <BBIcon type={col.type} style={this.getIconColorStyle(col.type)} />
                <span style={{ marginLeft: 5 }}>{col.title}</span>
                {col.sorter && this.getSorter(col)}
            </div>);
            return title;
        }

        getIconColorStyle(type) {
            let style = {};
            switch (type) {
            case 'field-text':
                style.color = '#5dabe0';
                break;
            case 'field-num':
                style.color = '#67cfae';
                break;
            case 'field-time':
                style.color = '#ef96f0';
                break;
            case 'field-date':
                style.color = '#f1b671';
                break;
            case 'field-bool':
                style.color = '#bd10e0';
                break;
            default:
                break;
            }
            return style;
        }

    // 获取index列的宽
    getIndexColumnWidth() {
        let { curPage, pageSize, totalCount } = this.props;
        let p = curPage || this.state.curPage;
        let s = pageSize || this.state.pageSize;
        let max = p * s;
        if (totalCount && max > totalCount) {
            max = totalCount;
        }
        let len = max.toString().length;
        return 40 + (_.ceil(len / 3) - 1) * 20;
    }

    buildIndexColums() {
        let { curPage, pageSize, rowHeight, rowHeightGetter } = this.props;
        let p = curPage || this.state.curPage;
        let s = pageSize || this.state.pageSize;
        let col = (
            <Column header={null} columnKey="index"
                cell={(props) => {
                    return (
                        <div className={styles.indexCell}
                            style={{ lineHeight: `${rowHeightGetter ? rowHeightGetter(props.rowIndex) : (rowHeight || this.state.rowHeight)}px` }}
                        >
                            { s * (p - 1) + props.rowIndex + 1}
                        </div>
                    );
                }}
                width={this.getIndexColumnWidth()}
                fixed
            />
        );
        return col;
    }
    buildColums() {
        const { header, data, rowHeight, showIndex, rowHeightGetter, tableKey } = this.props;
        let columns = [];
        if (showIndex) {
            columns.push(this.buildIndexColums());
        }
        _.map(header, (col) => {
            columns.push(
                <Column header={<Cell>{this.getTitleWithIcon(col)}</Cell>}
                    columnKey={col.value}
                    // cell={col.cell
                    //     ? <col.cell data={data} align={col.align || 'center'} rowHeight={rowHeight || this.state.rowHeight} />
                    //     : (props) => {
                    //         if (col.render && _.isFunction(col.render)) {
                    //             return (<Cell {...props}>
                    //                 {col.render(data[props.rowIndex][col.value], data[props.rowIndex], props.rowIndex)}
                    //             </Cell>);
                    //         } else {
                    //             return (<Cell {...props}>
                    //                 <div style={{ width: '100%', textAlign: col.align || 'center' }}>
                    //                     {data[props.rowIndex][col.value]}
                    //                 </div>
                    //             </Cell>);
                    //         }
                    //     }
                    // }
                    cell={col.cell ?
                        <col.cell align={col.align || 'center'}
                            rowHeight={rowHeight || this.state.rowHeight}
                            data={data} rowHeightGetter={rowHeightGetter}
                            tableKey={tableKey}
                        />
                        : (
                            col.render && _.isFunction(col.render)
                                ? (props) => {
                                    return (
                                        <Cell {...props}>
                                            {col.render(data[props.rowIndex][col.value], data[props.rowIndex], props.rowIndex)}
                                        </Cell>
                                    );
                                }
                                :
                                <BBTextCell align={col.align || 'center'}
                                    rowHeight={rowHeight || this.state.rowHeight}
                                    data={data} rowHeightGetter={rowHeightGetter}
                                    tableKey={tableKey}
                                />
                        )
                    }
                    width={this.getColumnWidth(col)}
                    flexGrow={col.flexGrow}
                />
            );
        });
        return columns;
    }

    render() {
        let { data, height, maxHeight, rowHeight, headerHeight, rowHeightGetter, pagination, scrollToColumn } = this.props;
        let cols = this.buildColums();
        return (
            <div style={{ width: '100%' }}>
                <ContainerDimensions>
                    {({ width }) =>
                        <Table rowsCount={data.length}
                            width={width}
                            height={height}
                            maxHeight={maxHeight || this.state.maxHeight}
                            rowHeight={rowHeight || this.state.rowHeight}
                            headerHeight={headerHeight || this.state.headerHeight}
                            rowHeightGetter={rowHeightGetter}
                            scrollToColumn={scrollToColumn}
                        >
                            {cols}
                        </Table>
                    }
                </ContainerDimensions>
                <div className={styles.bbTableFooter}>
                    {pagination}
                </div>
            </div>
        );
    }
}

export class BBTextCell extends Component {
    maxRowHeight = null;

    onFocusCell(id) {
        let cell = $(`#${id}`).parent();
        let text = $(`#${id}`).text();
        let html = `<textarea id="${id}" style="width:100%; resize:none; background:transparent; height:${this.maxRowHeight}px;" readonly></textarea>`;
        cell.html(html);
        $(`#${id}`).text(text);
        $(`#${id}`).focus();
        $(`#${id}`).off('click').on('blur', () => {
            this.onBlurCell(id);
        });
    }

    onBlurCell(id, height) {
        let cell = $(`#${id}`).parent();
        let text = $(`#${id}`).val();
        let html = `<div id="${id}" style="min-height: 10px; max-height:${this.maxRowHeight}; overflow:hidden;"></div>`;
        cell.html(html);
        $(`#${id}`).text(text);
        $(`#${id}`).off('blur').on('click', () => {
            this.onFocusCell(id);
        });
    }

    render() {
        const { data, rowIndex, columnKey, align, tableKey, rowHeight, rowHeightGetter, ...props } = this.props;
        let id = `cell_${columnKey}_${rowIndex}_${tableKey}`;
        this.maxRowHeight = rowHeight - 12;
        if (rowHeightGetter && _.isFunction(rowHeightGetter)) {
            this.maxRowHeight = rowHeightGetter(rowIndex) - 12;
        }
        return (
            <Cell {...props}>
                <div style={{ width: '100%', textAlign: align }}>
                    <div id={id} onClick={this.onFocusCell.bind(this, id)} style={{ minHeight: 10, maxHeight: this.maxRowHeight, overflow: 'hidden' }}>
                        {data[rowIndex][columnKey]}
                    </div>
                </div>
            </Cell>
        );
    }
}

export class BBDistributionCell extends Component {
    render() {
        const { data, rowIndex, columnKey, align, ...props } = this.props;
        let cell = null;
        switch (data[rowIndex].distribution.type) {
        case 'bar':
            cell = (<BBHistogramCell {...this.props} />);
            break;
        case 'split':
            cell = (<BBSplitCell {...this.props} />);
            break;
        case 'sample':
            cell = (<BBSampleCell {...this.props} />);
            break;
        default:
            cell = (
                <Cell {...props}>
                    <div style={{ width: '100%', textAlign: align }}>
                        {data[rowIndex][columnKey]}
                    </div>
                </Cell>
            );
            break;
        }
        return cell;
    }
}

export class BBSplitCell extends Component {
    buildMultiCells(item) {
        let { rowHeight, rowHeightGetter, rowIndex } = this.props;
        let height = rowHeight;
        if (rowHeightGetter && _.isFunction(rowHeightGetter)) {
            height = rowHeightGetter(rowIndex);
        }
        if (!item || !_.isArray(item) || item.length === 0) {
            return null;
        }
        let style = { borderLeft: '1px solid rgb(211, 211, 211)', paddingLeft: '8px' };
        let cols = [];
        let width = _.ceil(100 / item.length, 2);
        let lastWidth = 100 - width * (item.length - 1);
        for (let i = 0; i < item.length; i += 1) {
            if (i === 0) {
                cols.push(
                    <div className={styles.bbSplitCell} style={{ width: `${width}%`, height: height, lineHeight: `${height}px` }}>
                        {item[i]}
                    </div>
                );
            } else if (i === item.length - 1) {
                cols.push(
                    <div className={styles.bbSplitCell} style={{ width: `${lastWidth}%`, height: height, lineHeight: `${height}px`, ...style }}>
                        {item[i]}
                    </div>
                );
            } else {
                cols.push(
                    <div className={styles.bbSplitCell} style={{ width: `${width}%`, height: height, lineHeight: `${height}px`, ...style }}>
                        {item[i]}
                    </div>
                );
            }
        }
        return (
            <div style={{ display: 'flex' }}>
                {cols}
            </div>
        );
    }

    render() {
        const { data, rowIndex, columnKey, ...props } = this.props;
        const item = data[rowIndex][columnKey].data;
        return (
            <Cell {...props}>
                {this.buildMultiCells(item)};
            </Cell>
        );
    }
}

export class BBSampleCell extends Component {
    render() {
        const { data, rowIndex, columnKey, align, ...props } = this.props;
        return (
            <Cell {...props}>
                <div style={{ width: '100%', textAlign: align }}>
                    {`抽样值: ${data[rowIndex][columnKey].data}`}
                </div>
            </Cell>
        );
    }
}

export class BBHistogramCell extends Component {
    render() {
        const { data, rowIndex, columnKey, rowHeight, rowHeightGetter, ...props } = this.props;
        const scale = {
            x: {
                type: 'cat',
            },
            y: {
                min: 0,
            },
        };
        const tooltip = [
            'x*y',
            (x, y) => ({
                name: x,
                value: y,
            }),
        ];
        const color = 'rgba(24, 144, 255, 0.85)';
        let height = rowHeight - 20;
        if (rowHeightGetter && _.isFunction(rowHeightGetter)) {
            height = rowHeightGetter(rowIndex) - 20;
        }
        return (
            <Cell {...props}>
                <Chart scale={scale}
                    height={height}
                    forceFit
                    data={data[rowIndex][columnKey].data}
                    padding="auto"
                >
                    <Axis name="x"
                        title={false}
                        label={false}
                        tickLine={false}
                    />
                    <Axis name="y" min={0} label={false} tickLine={false} />
                    <Tooltip showTitle={false} crosshairs={false} />
                    <Geom type="interval" position="x*y" color={color} tooltip={tooltip} />
                </Chart>
            </Cell>
        );
    }
}
