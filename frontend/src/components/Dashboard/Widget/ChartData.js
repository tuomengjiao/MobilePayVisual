let queryUri = 'testtest'; // global.queryUri;
let chartColors = [
	'#1AC41F',
	'#1AC42F',
	'#1AC43F',
	'#1AC44F',
	'#1AC45F',
	'#1AC46F',
	'#1AC47F',
	'#1AC48F',
	'#1AC49F',
	'#29DEA4',
	'#29DEB4',
	'#29DEC4',
	'#29DED4',
	'#29DEE4',
	'#29DEF4',
	'#29D514',
	'#29D524',
	'#29D534',
	'#29D544',
	'#29D554',
	'#29D564',
	'#cc9966',
	'#ff99ff',
	'#33cc99',
	'#E7975D',
	'#213173',
	'#763EC3',
	'#D14259',
	'#FAD337',
	'#4DCB73',
	'#3AA0FF',
];

export const CHARTTEMP = {
	'jobType': 'VISUALIZE',
	'executor': 'VISUALIZER_DF_BASIC',
	'executorParams': {
		'chartParams': {
			chartType: 'bar_vdp',
			'chart': {
				title: '',
				'height': 560,
				'width': 'auto',
				'margin': [40, 200, 200, 100],
				'animate': false,
				'colWidth': 15,
				'minWidth': 800,
				'maxWidth': 30000,
			},
			'source': {
				'rowFormatters': ['formatGuide'],
				colDef: {
					address: { 'alias': 'address' },
					idsum: { 'alias': 'idsum' },
				}
			},
			'layout': {
				axisXCol: [],
				axisYCol: [],
				color: chartColors,
			},
			'events': {
				'click': 'handleClick'
			},
			'downloadImgHandle': 'downloadImg'
		},
	},
	'inputFileDesc': {
		'type': 'FILE',
		'conn': {
			'storage': 'XDP-HTTP-API',
			'api': {
				'uri': queryUri,
				'method': 'POST',
				'headers': {'content-type': 'application/json'},
				'body': {
					type: 'GROUP_BY',
					relation: {
						'type': 'XTABLE',
						'xtableId': '0176826E935143D58566BE4EE427B9CD'
					},
					aggregations: [
						{
							type: 'COUNT',
							columnName: 'id',
							outputName: 'idsum'
						}
					],
					columns: [
						{
							type: 'DEFAULT',
							columnName: 'address'
						}
					]
				}
			},
		},
		'meta': {
			'format': 'csv',
		}
	}
};

export const CHARTPARAMS = {
	chartType: 'bar_vdp',
	chart: {
		title: '',
		'height': 380,
		'width': 'auto',
		'margin': [40, 40, 40, 40],
		'animate': true,
		'colWidth': 10,
		'minWidth': 600,
		'maxWidth': 30000,
	},
	source: {
		rowFormatters: ['formatGuide'],
		colDef: {
			address: { 'alias': 'address' },
			idsum: { 'alias': 'idsum' },
		},
		format: 'csv',
	},
	layout: {
		axisXCol: [],
		axisYCol: [],
		color: chartColors,
	},
	events: {
		click: 'handleClick',
	},
	downloadImgHandle: 'downloadImg',
};

export const MAP_COLORS = [
	'#6890D4',
	'#ffcc00',
	'#29DEF4',
	'#ff6600',
	'#66cc33',
	'#1AC46F',
	'#29D514',
];
