import { DiseaseSurveillanceUdf } from '../Dashboard/Widget/DiseaseSurveillanceUdf';

const INDEX_OPTS = [
    { k: '原值', v: '' },
    { k: '统计数', v: 'COUNT' },
    { k: '求和', v: 'SUM' },
    { k: '最大值', v: 'MAX' },
    { k: '最小值', v: 'MIN' },
    { k: '平均数', v: 'AVG' },
    { k: '移除', v: 'delete' },
];

const STRING_OPTS = [
    { k: '移除', v: 'delete' },
];

const DATE_OPTS = [
    // {k: '不分组', v: ''},
    { k: '日(d)', v: 'yyyy-MM-dd' },
    { k: '月(m)', v: 'yyyy-MM' },
    { k: '年(y)', v: 'yyyy' },
    { k: '移除', v: 'delete' },
];

export const BUTTONMETA = {
    STRING: { icon: '/images/type/character.png', colorA: '#6890D4', iconA: '/images/type/character-w.png', options: STRING_OPTS, className: 'v-ant-select-A' },
    TIMESTAMP: { icon: '/images/type/date.png', colorA: '#EB9838', iconA: '/images/type/date-w.png', options: DATE_OPTS, className: 'v-ant-select-D' },
    DATE: { icon: '/images/type/date.png', colorA: '#EB9838', iconA: '/images/type/date-w.png', options: DATE_OPTS, className: 'v-ant-select-D' },
    INTEGER: { icon: '/images/type/number.png', colorA: '#4BC69F', iconA: '/images/type/number-w.png', options: INDEX_OPTS, className: 'v-ant-select-I' },
    DECIMAL: { icon: '/images/type/number.png', colorA: '#4BC69F', iconA: '/images/type/number-w.png', options: INDEX_OPTS, className: 'v-ant-select-I' },
};

export const CHART_TYPE = [
    { type: 'layer', name: '数据挖掘', icon: '/images/chart/tree.png' },
    { type: 'pie', name: '饼图', icon: '/images/chart/pie.png' },
    { type: 'bar', name: '柱状图', icon: '/images/chart/histogram.png' },
    { type: 'line', name: '折线图', icon: '/images/chart/line.png' },
    { type: 'stack', name: '堆栈图', icon: '/images/chart/stack.png' },
    { type: 'map', name: '中国地区', icon: '/images/chart/map.png' },
    { type: 'linebar', name: '柱状折线图', icon: '/images/chart/linebar.png' },
    { type: 'table', name: '水平柱状图', icon: '/images/chart/tablegroup.png' },
    { type: 'point', name: '散点图', icon: '/images/chart/point.png' },
    { type: 'point2', name: '散点图2', icon: '/images/chart/point.png' },

    // {type:'bubble', name: '冒泡图', icon: '/images/chart/bubble.png'},
];

export const COL_META = {
    STRING: {
        image: {
            default: '/images/type/character.png',
            drag: '/images/type/character-w.png',
        },
        options: STRING_OPTS,
        className: 'v-ant-select-A',
        tagStyle: {
            default: { background: '#fbfbfb', color: '#515456', borderColor: '#DDDDDD', fontWeight: 400 },
            drag: { background: '#6890D4', color: 'white', orderColor: '#6890D4', fontWeight: 400 },
        },
    },
    TIMESTAMP: {
        image: {
            default: '/images/type/time.png',
            drag: '/images/type/time-w.png',
        },
        options: DATE_OPTS,
        className: 'v-ant-select-D',
        tagStyle: {
            default: { background: '#fbfbfb', color: '#515456', borderColor: '#DDDDDD', fontWeight: 400 },
            drag: { background: '#EB9838', color: 'white', borderColor: '#EB9838', fontWeight: 400 },
        },
    },
    DATE: {
        image: {
            default: '/images/type/date.png',
            drag: '/images/type/date-w.png',
        },
        options: DATE_OPTS,
        className: 'v-ant-select-D',
        tagStyle: {
            default: { background: '#fbfbfb', color: '#515456', borderColor: '#DDDDDD', fontWeight: 400 },
            drag: { background: '#EB9838', color: 'white', borderColor: '#EB9838', fontWeight: 400 },
        },
    },
    INTEGER: {
        image: {
            default: '/images/type/number.png',
            drag: '/images/type/number-w.png',
        },
        options: INDEX_OPTS,
        className: 'v-ant-select-I',
        tagStyle: {
            default: { background: '#fbfbfb', color: '#515456', borderColor: '#DDDDDD', fontWeight: 400 },
            drag: { background: '#4BC69F', color: 'white', borderColor: '#4BC69F', fontWeight: 400 },
        },
    },
    DECIMAL: {
        image: {
            default: '/images/type/number.png',
            drag: '/images/type/number-w.png',
        },
        options: INDEX_OPTS,
        className: 'v-ant-select-I',
        tagStyle: {
            default: { background: '#fbfbfb', color: '#515456', borderColor: '#DDDDDD', fontWeight: 400 },
            drag: { background: '#4BC69F', color: 'white', borderColor: '#4BC69F', fontWeight: 400 },
        },
    },
    DOUBLE: {
        image: {
            default: '/images/type/number.png',
            drag: '/images/type/number-w.png',
        },
        options: INDEX_OPTS,
        className: 'v-ant-select-I',
        tagStyle: {
            default: { background: '#fbfbfb', color: '#515456', borderColor: '#DDDDDD', fontWeight: 400 },
            drag: { background: '#4BC69F', color: 'white', borderColor: '#4BC69F', fontWeight: 400 },
        },
    },
    BOOLEAN: {
        image: {
            default: '/images/type/double.png',
            drag: '/images/type/double-w.png',
        },
        options: INDEX_OPTS,
        className: 'v-ant-select-I',
        tagStyle: {
            default: { background: '#bd10e0', color: '#515456', borderColor: '#DDDDDD', fontWeight: 400 },
            drag: { background: '#4BC69F', color: 'white', borderColor: '#4BC69F', fontWeight: 400 },
        },
    },
};

export const WIDGETS_CONFIG = [
    { i: 'diseaseDistri', x: 0, y: 0, w: 6, h: 5, isDraggable: true, isResizable: true, minW: 5, minH: 4, title: 'Top5 传染病发病趋势及分布图' },
    { i: 'hospitalPoly', x: 6, y: 0, w: 6, h: 9, isDraggable: true, isResizable: true, minW: 4, minH: 4, title: '厦门各医院数据汇聚概览' },
    { i: 'patientSource', x: 0, y: 5, w: 6, h: 4, isDraggable: true, isResizable: true, minW: 5, minH: 3, title: '就诊患者来源分布' },
];
export const WIDGETS_CONDITION = [
    {
        id: 'diseaseDistri',
        chartCondition: {
            jobSql: `
                REGISTER_TABLE temp1
                select * from PATIENT limit 1
                REGISTER_TABLE temp2
                select * from INPATIENT limit 1
                REGISTER_TABLE temp3
                select * from OUTPATIENT limit 1

                REGISTER_TABLE townData
                select patientCounty,patientTown,pointX, pointY from xiamenTownMapData

                REGISTER_TABLE patientDataByMonth
                select a.BB_PATIENT_UID, a.DIAG_NAME, a.DIAG_CODE, a.VISIT_MONTH,
                b.PATIENT_NAME,b.ADDRESS,b.PROVINCE,b.CITY,b.DISTRICT,b.STREET
                from (select BB_PATIENT_UID, DIAG_NAME, DIAG_CODE, date_format(VISIT_TIME, 'yyyy-MM')as VISIT_MONTH
                from OUTPATIENT
                where DIAG_NAME is not null
                and VISIT_TIME >= 'monthTimeBound_start' and VISIT_TIME < 'monthTimeBound_end'
                UNION ALL
                select BB_PATIENT_UID, OUT_DIAGNOSIS_NAME as DIAG_NAME, OUT_DIAGNOSIS_CODE as DIAG_CODE,
                date_format(IN_DTIME, 'yyyy-MM')as VISIT_MONTH
                from INPATIENT
                where OUT_DIAGNOSIS_NAME is not null
                and IN_DTIME >= 'monthTimeBound_start' and IN_DTIME < 'monthTimeBound_end') as a
                join PATIENT as b
                on a.BB_PATIENT_UID = b.BB_PATIENT_UID
                where b.CITY = '厦门市'

                REGISTER_TABLE patientDataByWeek
                select a.BB_PATIENT_UID, a.DIAG_NAME, a.DIAG_CODE, a.VISIT_WEEK,
                b.PATIENT_NAME,b.ADDRESS,b.PROVINCE,b.CITY,b.DISTRICT,b.STREET
                from (select BB_PATIENT_UID, DIAG_NAME, DIAG_CODE, weekofyear(VISIT_TIME) as VISIT_WEEK
                from OUTPATIENT
                where DIAG_NAME is not null
                and VISIT_TIME >= 'weekTimeBound_start' and VISIT_TIME < 'weekTimeBound_end'
                UNION ALL
                select BB_PATIENT_UID, OUT_DIAGNOSIS_NAME as DIAG_NAME, OUT_DIAGNOSIS_CODE as DIAG_CODE,
                weekofyear(IN_DTIME) as VISIT_WEEK
                from INPATIENT
                where OUT_DIAGNOSIS_NAME is not null
                and IN_DTIME >= 'weekTimeBound_start' and IN_DTIME < 'weekTimeBound_end') as a
                left join PATIENT as b
                on a.BB_PATIENT_UID = b.BB_PATIENT_UID
                where b.CITY = '厦门市'

                REGISTER_TABLE patientDataByDay
                select a.BB_PATIENT_UID, a.DIAG_NAME, a.DIAG_CODE, a.VISIT_DAY,
                b.PATIENT_NAME,b.ADDRESS,b.PROVINCE,b.CITY,b.DISTRICT,b.STREET
                from (select BB_PATIENT_UID, DIAG_NAME, DIAG_CODE, date_format(VISIT_TIME, 'yyyy-MM-dd')as VISIT_DAY
                from OUTPATIENT
                where DIAG_NAME is not null
                and VISIT_TIME >= 'dayTimeBound_start' and VISIT_TIME < 'dayTimeBound_end'
                UNION ALL
                select BB_PATIENT_UID, OUT_DIAGNOSIS_NAME as DIAG_NAME, OUT_DIAGNOSIS_CODE as DIAG_CODE,
                date_format(IN_DTIME, 'yyyy-MM-dd')as VISIT_DAY
                from INPATIENT
                where OUT_DIAGNOSIS_NAME is not null
                and IN_DTIME >= 'dayTimeBound_start' and IN_DTIME < 'dayTimeBound_end') as a
                left join PATIENT as b
                on a.BB_PATIENT_UID = b.BB_PATIENT_UID
                where b.CITY = '厦门市'

                DUMP_TABLE townData, patientDataByMonth, patientDataByWeek, patientDataByDay
                `,
            // queryTables: [
            //     'c0bdecafab164657a425c9c25a4f9ed7',
            //     'a7466c02c1454f2daffc97f97f491d86',
            //     '4b2def9bbe13408a9cc5b5cb501df0a5',
            //     '266d2580cee044919c237d38e64d811c',
            // ],
            // querySql: [
            //     'select * from c0bdecafab164657a425c9c25a4f9ed7',
            //     `select DIAG_NAME, count(*) as COUNT, VISIT_MONTH from a7466c02c1454f2daffc97f97f491d86
            //     group by DIAG_NAME, VISIT_MONTH`,
            //     `select DIAG_NAME, count(*) as COUNT, VISIT_WEEK from 4b2def9bbe13408a9cc5b5cb501df0a5
            //     group by DIAG_NAME, VISIT_WEEK`,
            //     `select DIAG_NAME, count(*) as COUNT, VISIT_DAY from 266d2580cee044919c237d38e64d811c
            //     group by DIAG_NAME, VISIT_DAY`,
            //     `select DIAG_NAME, count(*) as COUNT, VISIT_MONTH, CITY, DISTRICT, STREET
            //     from a7466c02c1454f2daffc97f97f491d86 group by DIAG_NAME, CITY, DISTRICT, STREET, VISIT_MONTH`,
            //     `select DIAG_NAME, count(*) as COUNT, VISIT_WEEK, CITY, DISTRICT, STREET
            //     from 4b2def9bbe13408a9cc5b5cb501df0a5 group by DIAG_NAME, CITY, DISTRICT, STREET, VISIT_WEEK`,
            //     `select DIAG_NAME, count(*) as COUNT, VISIT_DAY, CITY, DISTRICT, STREET
            //     from 266d2580cee044919c237d38e64d811c group by DIAG_NAME, CITY, DISTRICT, STREET, VISIT_DAY`,
            // ],
            querySqlTemplate: [
                'select * from :tableId0',
                `select DIAG_NAME, count(*) as COUNT, VISIT_MONTH from :tableId1
                group by DIAG_NAME, VISIT_MONTH`,
                `select DIAG_NAME, count(*) as COUNT, VISIT_WEEK from :tableId2
                group by DIAG_NAME, VISIT_WEEK`,
                `select DIAG_NAME, count(*) as COUNT, VISIT_DAY from :tableId3
                group by DIAG_NAME, VISIT_DAY`,
                `select DIAG_NAME, count(*) as COUNT, VISIT_MONTH, CITY, DISTRICT, STREET
                from :tableId1 group by DIAG_NAME, CITY, DISTRICT, STREET, VISIT_MONTH`,
                `select DIAG_NAME, count(*) as COUNT, VISIT_WEEK, CITY, DISTRICT, STREET
                from :tableId2 group by DIAG_NAME, CITY, DISTRICT, STREET, VISIT_WEEK`,
                `select DIAG_NAME, count(*) as COUNT, VISIT_DAY, CITY, DISTRICT, STREET
                from :tableId3 group by DIAG_NAME, CITY, DISTRICT, STREET, VISIT_DAY`,
            ],
            // queryId: 'c0bdecafab164657a425c9c25a4f9ed7',
            queryTransform: DiseaseSurveillanceUdf,
        },
    },
    {
        id: 'hospitalPoly',
        chartCondition: {
            jobSql: `
                REGISTER_TABLE temp2
                select * from INPATIENT limit 1
                REGISTER_TABLE temp3
                select * from OUTPATIENT limit 1

                REGISTER_TABLE xmHospital
                select * from xiamenHospitalMapData
                REGISTER_TABLE polyData
                select INPATIENT.ORG_CODE from INPATIENT
                UNION ALL
                select OUTPATIENT.ORG_CODE from OUTPATIENT
                DUMP_TABLE xmHospital,polyData`,
            querySqlTemplate: [
                `select t2.hospitalName,t2.hospitalCode,t1.count,t2.hospitalLevel,t2.hospitalCoord from
                (select ORG_CODE,count(ORG_CODE) as count from :tableId1 group by ORG_CODE) t1
                right join
                :tableId0 t2
                on t1.ORG_CODE=t2.hospitalCode`,
            ],
            // queryId: '176f1c77bb39412fa9a70bf5566778f4',
            // queryTables: ['85dec43cca9b4134829e5ec10b47d299', 'cd9198c5df8441fea9cc9f9245863f3c'],
            queryTransform: null,
        },
    },
    {
        id: 'patientSource',
        chartCondition: {
            jobSql: `
                REGISTER_TABLE temp1
                select * from PATIENT limit 1
                REGISTER_TABLE hospitalPatientInfo
                (select INPATIENT.ORG_CODE,xiamenHospitalMapData.hospitalName,PATIENT.PROVINCE,PATIENT.CITY,PATIENT.DISTRICT from INPATIENT
                inner join PATIENT
                on INPATIENT.BB_PATIENT_UID=PATIENT.BB_PATIENT_UID
                left join xiamenHospitalMapData
                on xiamenHospitalMapData.hospitalCode=INPATIENT.ORG_CODE
                )
                UNION ALL
                (select OUTPATIENT.ORG_CODE,xiamenHospitalMapData.hospitalName,PATIENT.PROVINCE,PATIENT.CITY,PATIENT.DISTRICT from OUTPATIENT
                inner join PATIENT
                on OUTPATIENT.BB_PATIENT_UID=PATIENT.BB_PATIENT_UID
                left join xiamenHospitalMapData
                on xiamenHospitalMapData.hospitalCode=OUTPATIENT.ORG_CODE
                )
                DUMP_TABLE hospitalPatientInfo
                `,
            querySqlTemplate: [
                'select hospitalName,PROVINCE,count(PROVINCE) as count from :tableId0 group by hospitalName,PROVINCE',
                'select hospitalName,DISTRICT,count(DISTRICT) as count from :tableId0 group by hospitalName,DISTRICT',
            ],
            // queryId: 'f30d6b7111f244b496898478cd4579bb',
            // queryTables: ['5037b1b4c8474f91b82e91aabeb4c03e'],
            queryTransform: null,
        },
    },
];
export const NEW_WIDGETS_CONFIG = [
    { i: 'new', x: 0, y: 99, w: 4, h: 3, isDraggable: false, isResizable: false },
];

