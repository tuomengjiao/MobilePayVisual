import * as React from 'react';

export interface IBBFixedTableHeaderProps {
    title?: string;
    value: string;
    width: number;
    flexGrow: number;
    render: (text: any, record: any, index: number) => void;
    cell: typeof React.ReactElement;
}

export interface IBBFixedTableProps {
    tableKey: string;
    data?: Array<any>
    header?: Array<IBBFixedTableHeaderProps>;
    width?: number;
    height?: number;
    maxHeight?: number;
    rowHeight?: number;
    headerHeight?: number;
    rowHeightGetter?: (index: number) => void;
    showIndex?: boolean;
    curPage?: number;
    pageSize?: number;
    totalCount?: number;
    onChangeSorter: (key: string, sort: string) => void;
}

export default class BBFixedTable extends React.Component<IBBFixedTableProps, any> {
}
