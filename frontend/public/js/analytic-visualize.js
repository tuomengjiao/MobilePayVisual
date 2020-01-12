const __MDA_UTILS = {

    ChartDataUtils: {

        csv2json: function(data) {
            const columns = data.columns
            const rows = data.rows 
            var json_rows = []
            for (var i = 0; i < rows.length; i++) {
                var json_row = {} 
                for (var j = 0; j < columns.length; j++) {
                    json_row[columns[j].name] = rows[i][j]
                }
                json_rows.push(json_row)
            }
            return json_rows
        }
    },

    JsonUtils: {

        mcontains: function (obj, path) {
            try {
                var pt = obj;
                var slices = path.split('.');
                var idx = 0;
                while (idx < slices.length) {
                    var slice = slices[idx];
                    pt = pt[slice];
                    if (pt == undefined)
                        return false;
                    idx += 1;
                }
                return true
            } catch (e) {
                return false
            }
        },

        mget: function (obj, path, defaultValue=null) {
            var value = defaultValue;
            try {
                var pt = obj;
                var slices = path.split('.');
                var idx = 0;
                while (idx < slices.length) {
                    var slice = slices[idx];

                    if (slice.endsWith(']')) {
                        var arySimiSlice = slice.split('[')
                        var arySlice = arySimiSlice[0]
                        var aryIndex = parseInt(arySimiSlice[1].replace(']', ''))
                        pt = pt[arySlice][aryIndex]
                    } else {
                        pt = pt[slice];
                    }
                    if (pt == undefined) {
                        break;
                    }
                    idx += 1;
                }
                value = pt
            } catch (e) {
            }
            return value;
        },

        mset: function (obj, path, value) {
            var pt = obj;
            var slices = path.split('.');
            var idx = 0;
            while (idx < slices.length - 1) {
                var slice = slices[idx];
                if (pt[slice] == undefined) {
                    pt[slice] = {}
                }
                pt = pt[slice];
                idx += 1;
            }
            pt[slices[slices.length - 1]] = value
        }

    }
}


class __MDA_Chart  {

	getFn(fnName) {
		var fn = window[fnName];
		if(typeof fn === 'function') {
			return fn;
		} else {
			console.log(`Fn:${fnName} is not funcion` )
			return null;
		}	
	}

    formatSourceData(params) {
      var source = params.source
      if (source.format == 'csv')
        source.data = __MDA_UTILS.ChartDataUtils.csv2json(source.data)

      _.map(source.data, row => {
        _.map(source.rowFormatters, name => {
        	var formatter = this.getFn(name)
        	if (formatter)
          		formatter(row);
        })
      })
    }

}




class __MDA_G2Chart extends __MDA_Chart {

	parseChartConfig(params) {
		switch (params.chartType) {
		case 'bar_vdp':
		case 'line_vdp':
			let colsNum = params.source.data.length;
			let colWidth = (params.chart.colWidth) ? params.chart.colWidth : 30;
			let minWidth = (params.chart.minWidth) ? params.chart.minWidth : 800;
			let maxWidth = (params.chart.maxWidth) ? params.chart.maxWidth : 1200;
			let width = colsNum * colWidth;
			if (params.chart.width === 'auto') {
				if (width < minWidth) {
					params.chart.width = minWidth;
				} else if (width > maxWidth) {
					params.chart.width = maxWidth;
				} else {
					params.chart.width = width;
				}
			}
			let colXLength = (params.layout.axisXCol) ? params.layout.axisXCol.length : 1;
			if (colXLength > 2) {
				let bottom = params.chart.margin[2];
				params.chart.margin[2] = (colXLength - 2) * 70 + bottom;
				params.chart.height = params.chart.height - bottom + params.chart.margin[2];
			}
			break;
		default:
			break;
		}

		const chart = params.chart
		var config = {
			id: chart.divId,
			height: chart.height,
			width: chart.width,
			forceFit: true,//chart.width == 'auto',
			plotCfg: {
				margin: chart.margin
			},
			animate: chart.animate,
		}
		return config
	}

	parseSourceConfig(params) {
		const p = params
		const source = params.source

		var config = {
			data: source.data,
			rowFormatters: source.rowFormatters,
			colDef: _.mapValues(source.colDef, (val) => {
				return {alias: val.alias, tickInterval: val.tickInterval};
			}),
		};
		return config;
	}

	parseEventConfig(params) {
		const p = params;
		var config = {
			'plotclick': function (ev) {
				if (p.events.click && ev.data) {
					var origin = ev.data._origin;
					var fn = this.getFn(p.events.click)
					fn(origin);
				}
			}.bind(this)
		}
		return config;
	}

	buildChartBase(params) {
		const chart = this.parseChartConfig(params);
		var source = this.parseSourceConfig(params);
		const events = this.parseEventConfig(params);
		var chartV = new G2.Chart(chart);
		var downloadImgHandle = params.downloadImgHandle;

		let downloadImage = function () {
			chartV.downloadImage();
        };
        
        console.log('global', global);
		// if (global.regFunc && typeof global.regFunc === 'function') {
		// 	global.regFunc(downloadImgHandle, downloadImage);
		// }

		chartV.source(source.data, source.colDef);
		chartV.legend({title: null});
		_.map(events, (value, key) => {
			chartV.on(key, value);
		})
		return chartV;
	}

	renderChart(params, baseBuilder, layoutBuilder) {
		this.formatSourceData(params)
		var chart = baseBuilder(params);
		layoutBuilder(chart, params);
		try {
			chart.render();
		} catch(e){
			let fn = this.getFn(params.events.error);
			fn(e.message);
		}
	}

	render(params) {
		this.renderChart(params,
			this.buildBase.bind(this), this.buildLayout.bind(this))
	}
}

class __MDA_G2ChartVdp extends __MDA_G2Chart {

	buildBase(params) {
		return this.buildChartBase(params)
	}

	parseSourceConfig(params) {

		var layout = params.layout;
		var axisXCol = layout.axisXCol
		var axisYCol = layout.axisYCol

		var source = super.parseSourceConfig(params)
		var colDef = Object.assign({}, source.colDef)
		source.colDef = {}
		if (layout.axisMarkCol) {
			source.colDef['_X'] = { alias: _.map(axisXCol, col => colDef[col].alias).join(' ~ ') }
			source.colDef['_Y'] = { alias: _.map(axisYCol, col => colDef[col].alias).join(' ~ '), min: 0 }
			source.colDef['_M'] = { alias: colDef[layout.axisMarkCol].alias }
        } if (layout.axis2YCols) {
			source.colDef['_Y1'] = { alias: colDef[layout.axis2YCols[0]].alias}
            source.colDef['_Y2'] = { alias: colDef[layout.axis2YCols[1]].alias}
		} else {
			source.colDef['_X'] = { alias: _.map(axisXCol, col => colDef[col].alias).join(' ~ ') }
			source.colDef['_Y'] = { alias: _.map(axisYCol, col => colDef[col].alias).join(' ~ '), min: 0 }
			source.colDef['_C'] = {}
		}
		return source;
	}

	formatSourceData(params) {
		super.formatSourceData(params)
		var layout = params.layout

		var data = params.source.data;

		if (data.length > 0) {
			_.each(data, row => {
				row['_X'] = _.map(layout.axisXCol, c => row[c]).join(' ~ ')
			})
		} else {
			let axisYCol = params.layout.axisYCol;
			let record = {
				_X: '无相关维度数据',
			};
			axisYCol.map(y => {
				record[y] = 0;
			})
			data.push(record)
		}
		var frame = new G2.Frame(params.source.data);
		var combinedData = null;
		if (layout.axisStackCol) {
			combinedData = frame.data;
			_.each(combinedData, row => {
				row['_C'] = row[layout.axisStackCol]
				row['_Y'] = row[layout.axisYCol[0]]
			})
		} else if (layout.axisMarkCol) {
		    combinedData = frame.data;
			_.each(combinedData, row => {
				row['_M'] = row[layout.axisMarkCol]
				row['_Y'] = row[layout.axisYCol[0]]
			})
		} else if (layout.axis2YCols) {
			combinedData = frame.data;
			_.each(combinedData, row => {
				row['_Y1'] = row[layout.axis2YCols[0]]
				row['_Y2'] = row[layout.axis2YCols[1]]
			})
		} else {
			combinedData = G2.Frame.combinColumns(frame, layout.axisYCol, '_Y', '_C', ['_X']).data
			_.each(combinedData, row => {
				row['_C'] = params.source.colDef[row['_C']].alias
			})
		}
		params.source.data = combinedData
	}

	buildChartBase(params) {
		const chart = this.parseChartConfig(params);
		var source = this.parseSourceConfig(params);
		const events = this.parseEventConfig(params);
		var chartV = new G2.Chart(chart);
		var downloadImgHandle = params.downloadImgHandle;

		let downloadImage = function () {
			chartV.downloadImage();
		};

        // console.log('global', global);
		// if (global.regFunc && typeof global.regFunc === 'function') {
		// 	global.regFunc(downloadImgHandle, downloadImage);
		// }

		chartV.source(source.data, source.colDef);
		chartV.legend({title: null});

		_.map(events, (value, key) => {
			chartV.on(key, value);
		})
		return chartV;
	}
}


class __MDA_G2ChartPie extends __MDA_G2Chart {

	buildBase(params) {
		return this.buildChartBase(params)
	}

	buildLayout(chart, params) {
		var layout = params.layout;
		chart.coord('theta', layout.coord)
		chart.intervalStack()
			.position(G2.Stat.summary.percent(layout.valueCol))
			.color(layout.catCol)

	}
}

class __MDA_G2ChartPieVdp extends __MDA_G2ChartVdp {

	buildBase(params) {
		return this.buildChartBase(params)
	}

	buildLayout(chart, params) {
		var layout = params.layout;
		chart.coord('theta', layout.coord)
		chart.facet(['_C'], {})
		chart.intervalStack()
			.position(G2.Stat.summary.percent('_Y'))
			.color('_X', layout.color.reverse())

		if(layout.legend){
			chart.legend(layout.legend);
		}
	}
}

class __MDA_G2ChartBar extends __MDA_G2Chart {

	buildBase(params) {
		return this.buildChartBase(params)
	}

	buildLayout(chart, params) {
		var layout = params.layout;
		var geom;
		if (_.includes(['stack', 'dodge'], layout.mode)) {
			geom = chart.interval(layout.mode)
			geom.position(`${layout.axisXCol}*${layout.axisYCol}`)
				.color(layout.groupCol, layout.color[layout.groupCol].reverse())
		} else {
			geom = chart.interval()
			geom.position(`${layout.axisXCol}*${layout.axisYCol}`)
		}

		if (layout.size)
			geom.size(layout.size)

	}

}


class __MDA_G2ChartBarVdp extends __MDA_G2ChartVdp {
	buildLayout(chart, params) {
		var layout = params.layout;
		var geom;

		var mode = [];
		if (layout.axisStackCol) {
			mode.push('stack');
		} else {
			mode.push('dodge');
		}
		geom = chart.interval(mode)
		geom.position('_X*_Y')
			.color('_C', layout.color.reverse())
		if (layout.size)
			geom.size(layout.size)
		chart.axis('_Y', {
			title: null
		})
		chart.axis('_X', {
			position: 'bottom'
		})
		if(layout.legend){
			chart.legend(layout.legend);
		}

	}
}


class __MDA_G2ChartLine extends __MDA_G2Chart {

	buildBase(params) {
		return this.buildChartBase(params)
	}

	buildLayout(chart, params) {
		var layout = params.layout;
		chart.line()
			.position(`${layout.axisXCol}*${layout.axisYCol}`)

		if (layout.size)
			chart.size(layout.size);

		if(layout.legend){
			chart.legend(layout.legend);
		}
	}
}

class __MDA_G2ChartLineVdp extends __MDA_G2ChartVdp {

	buildBase(params) {
		return this.buildChartBase(params)
	}

	buildLayout(chart, params) {
		var layout = params.layout;
		chart.line()
			.position(`_X*_Y`)
			.color('_C', layout.color.reverse())
		if (layout.size)
			chart.size(layout.size);
		chart.axis('_Y', {
			title: null
		});
		chart.axis('_X', {
			position: 'bottom',
		})

		if(layout.legend){
			chart.legend(layout.legend);
		}

	}
}

class __MDA_G2ChartLineBarVdp extends __MDA_G2ChartVdp {

	buildBase(params) {
		return this.buildChartBase(params)
	}

	buildLayout(chart, params) {
		var layout = params.layout;
		var line = chart.line();
		line.position(`_X*_Y1`)

		if (layout.color)
        	line.color(layout.color[0])
		if (layout.size)
			line.size(layout.size[0]);

		var bar = chart.interval();
		bar.position('_X*_Y2')

		if (layout.color)
			bar.color(layout.color[1])
        if (layout.size)
			bar.size(layout.size[1])

		chart.axis('_Y1', {
			title: null
		});
		chart.axis('_Y2', {
			title: null
		})
		chart.axis('_X', {
			position: 'bottom',
			title: null
		})

		if(layout.legend){
			chart.legend(layout.legend);
		}
	}

}


class __MDA_G2ChartPointVdp extends __MDA_G2ChartVdp {

    buildBase(params) {
        return this.buildChartBase(params)
    }

    buildLayout(chart, params) {
        var layout = params.layout;
        var c = chart.point()
			.position('_X*_Y')
			.tooltip('_M*_X*_Y')
		//if (layout.size)
		//	chart.size(layout.size)
		if (layout.color)
			c.color('_M', layout.color.reverse())
		if (layout.shape)
			c.shape('_M', layout.shape)

    }
}

class __MDA_G2ChartSankey extends __MDA_G2Chart {

	render(params) {
		this.formatSourceData(params)

		const chart = this.parseChartConfig(params);
		var source = this.parseSourceConfig(params);
		const events = this.parseEventConfig(params);
		var chartV = new G2.Chart(chart);

		chartV.legend(false)

		_.map(events, (value, key) => {
			chartV.on(key, value);
		})

		var edges = _.map(params.source.data, row => {
			return {
				source: row[params.layout.sourceCol],
				target: row[params.layout.targetCol],
				value: row[params.layout.valueCol]
			}
		})

		var layout = new G2.Layout.Sankey({
			edges: edges,
			thickness: 0.15,
			calculationTimes: 2
		});
		var nodes = layout.getNodes();
		var edgeView = chartV.createView();


		edgeView.source(edges, {
			'..x': {
				min: 0,
				max: 1,
			},
			'..y': {
				min: 0,
				max: 1,
			},
			'value': {
				alias: params.source.colDef[params.layout.valueCol].alias
			},
			'target': {
				alias: '~'
			}

		});
		edgeView.coord().transpose();
		edgeView.axis(false);
		edgeView.edge()
			.position(G2.Stat.link.sankey('source*target*value', nodes))
			.shape('arc')
			.color('#bbb')
			.opacity(0.6)
			.tooltip('target*value');

		var nodeView = chartV.createView();
		nodeView.axis(false);
		nodeView.source(nodes, {
			x: {
				min: 0,
				max: 1,
			},
			y: {
				min: 0,
				max: 1,
			}
		});
		nodeView.coord().transpose();
		nodeView.point()
			.position('x*y')
			.color('id')
			.size('width*height', function (width, height) {
				return [width, height];
			})
			.shape('rect')
			.label('id', {
				renderer: function (text, item, index) {
					return text;
				},
				offset: 0
			})
			.style({
				stroke: '#ccc'
			});

		chartV.render()
	}
}


class __MDA_G2ChartLayerVdp extends __MDA_G2ChartVdp {
	render(params) {
		function GetRound(num, len) {
			return Math.round(num * Math.pow(10, len)) / Math.pow(10, len);
		}

		function getCount(data,yCols,operators){
			var values = [];
			operators.map((op,idx) => {
				var count = 0;
				var value = 0;
				console.log('data',data);
				data.map(r => {
					if (op === 'COUNT' || op === 'SUM') {
						value += (r.hasOwnProperty(yCols[idx])) ? r[yCols[idx]] : 1;
					} else if (op === 'MAX') {
						value = (r.hasOwnProperty(yCols[idx]) && (r[yCols[idx]] > value)) ? r[yCols[idx]] : value;
					} else if (op === 'MIN') {
						value = (r.hasOwnProperty(yCols[idx]) && (r[yCols[idx]] < value)) ? r[yCols[idx]] : value;
					} else {
						value += (r.hasOwnProperty(yCols[idx])) ? r[yCols[idx]] : 1
					}
					count += 1;
				});
				if (op === 'AVG') {
					value = GetRound(value/count, 2);
				}
				var rec = {};
				var name = yCols[idx];
				rec[name] = value;
				values.push(rec);
			});
			return values;
		}

		function genLayerData(data,idx,xCols,yCols,treeData,operators) {
			var aggData = _.groupBy(data, function(n) {
				return n[xCols[idx]];
			});
			_.keys(aggData).map(key => {
				var record = {};
				var values = getCount(aggData[key],yCols,operators);
				values.map(value => {
					record = _.extend(record,value);
				});
				record['name'] = key;
				record['layer'] = idx + 1;
				if (idx < xCols.length-1) {
					record['children'] = [];
					genLayerData(aggData[key], idx+1, xCols, yCols, record['children'], operators);
				}
				console.log('values',values);
				treeData.push(record);
			});
		}

		function formatSourceData(sourceData) {
			var dataArr = [];
			_.each(sourceData.rows, row => {
				var data = {};
				sourceData.columns.map((col,idx) => {
					data[col.name] = row[idx];
				});
				dataArr.push(data);
			});
			var xCols = params.layout.axisXCol;
			var yCols = params.layout.axisYCol;
			var operators = params.layout.operators;
			var treeData = [];
			var values = getCount(dataArr,yCols,operators);
			genLayerData(dataArr,0,xCols,yCols,treeData,operators);
			var data = [{
				name: '数据集',
				layer: 0,
				children: treeData
			}];
			values.map(value => {
				console.log('value*****',value)
				data[0] = _.extend(data[0],value);
			});
			console.log('data*****',data);
			return data
		}

		G2.Shape.registShape('point', 'collapsed', {
			drawShape: function(cfg, group) {
				return drawNode(cfg, group, true);
			}
		});
		G2.Shape.registShape('point', 'expanded', {
			drawShape: function(cfg, group) {
				return drawNode(cfg, group, false);
			}
		});
		G2.Shape.registShape('point', 'leaf', {
			drawShape: function(cfg, group) {
				return drawNode(cfg, group, false, true);
			}
		});
		// this.formatSourceData(params)
		var data = formatSourceData(params.source.data);
		const chart = this.parseChartConfig(params);
		var source = this.parseSourceConfig(params);
		const events = this.parseEventConfig(params);

		var Layout = G2.Layout;
		var layout = new Layout.Tree({
			nodes: data
		});
		var dx = layout.dx;
		var nodes = layout.getNodes();
		var edges = layout.getEdges();
		var Stat = G2.Stat;
		var chartV = new G2.Chart({
			id: chart.id,
			forceFit: chart.forceFit,
			height: chart.height,
			plotCfg: chart.plotCfg,
			animate: chart.animate
		});
		chartV.tooltip({
			title: null
		});
		chartV.legend('children', false);
		chartV.legend('name', false);
		var downloadImgHandle = params.downloadImgHandle;
		let downloadImage = function () {
			chartV.downloadImage();
        };
        
        // console.log('global', global);
		// if (global.regFunc && typeof global.regFunc === 'function') {
		// 	global.regFunc(downloadImgHandle, downloadImage);
		// }
		renderTree(nodes, edges, dx);

		function getLayer(name,data) {
			var layer = null;
			for (var idx=0;idx<data.length;idx++) {
				if (data[idx]['name'] === name) {
					layer = data[idx]['layer'];
				} else if (data[idx]['children'] && data[idx]['children'].length>0) {
					layer = getLayer(name,data[idx]['children'])
				}
				if (layer !== null) {
					break;
				}
			}
			return layer
		}

		function drawNode(cfg, group, collapsed, isLeaf) {
			var x = cfg.x;
			var y = cfg.y;
			var pointSize = 5;
			var width = cfg.size;
			var height = 20;
			var label = cfg.label;

			var name = cfg.id.split(' ')[3];
			var layer = getLayer(name,data);
			console.log('debug layer',layer)
			var color = (layer !== null) ? params.layout.color[layer % params.layout.color.length] : 'steelblue';
			console.log('color',color);
			var shape = group.addShape('rect', {
				attrs: {
					x: x,
					y: y - height / 2 ,
					width: width,
					height: height,
					fill: color,
					// fill: '#fff',
					cursor: isLeaf ? '' : 'pointer',
					stroke: color
					// stroke: params.layout.color
				}
			});
			if (!isLeaf) {
				x = x - pointSize;
				group.addShape('circle', {
					attrs: {
						r: pointSize,
						x: x,
						y: y,
						fill: '#fff',
						stroke: cfg.color // 可以直接设置颜色 cfg.color，也可以使用映射
					}
				});

				var path = [];
				path.push(['M', x - pointSize/2, y]);
				path.push(['L', x + pointSize/2, y]);
				if (collapsed) {
					path.push(['M', x, y - pointSize/2]);
					path.push(['L', x, y + pointSize/2]);
				}
				group.addShape('path', {
					attrs: {
						path: path,
						stroke: params.layout.color
					}
				});
			}
			return shape;
		}

		function getFieldList() {
			var fields = ['id','x','y','name','children'];
			var operators = params.layout.operators;
			var yCols = params.layout.axisYCol;
			yCols.map((y,idx) => {
				var name = y;
				fields.push(name);
			});
			fields.push('collapsed')
			return fields;
		}
		function getTipStr() {
			var tipStr = 'name';
			var operators = params.layout.operators;
			var yCols = params.layout.axisYCol;
			yCols.map((y,idx) => {
				var name = y;
				tipStr += '*' + name;
			});
			return tipStr;
		}

		function renderTree(nodes, edges, dx) {
			chartV.clear();
			//var height = Math.max(600, 26 / dx); // 最小高度 500
			//chartV.changeSize(1000, height);
			// 首先绘制 edges，点要在边的上面
			// 创建单独的视图
			var edgeView = chartV.createView();
			edgeView.source(edges);
			edgeView.coord().transpose().scale(1, -1); //
			edgeView.axis(false);
			edgeView.tooltip(false);
			// Stat.link 方法会生成 ..x, ..y的字段类型，数值范围是 0-1
			edgeView.edge()
				.position(Stat.link('source*target',nodes))
				.shape('smooth')
				.color('#ccc');
			function strLen(str) {
				var len = 0;
				for (var i = 0; i < str.length; i ++) {
					if(str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
						len ++;
					} else {
						len += 2;
					}
				}
				return len;
			}
			// 创建节点视图
			var nodeView = chartV.createView();
			var fields = getFieldList();
			var tipStr = getTipStr();
			console.log('fields****',fields,tipStr)
			nodeView.coord().transpose().scale(1, -1); //'polar'
			nodeView.axis(false);
			// 节点的x,y范围是 0，1
			// 因为边的范围也是 0,1所以正好统一起来
			nodeView.source(nodes, {
				x: {min: 0,max:1},
				y: {min: 0, max:1},
				value: {min: 0}
			},fields); // 由于数据中没有 'collapsed' 字段，所以需要设置所有的字段名称
			nodeView.point().position('x*y').color('steelblue').size('name', function(name) {
				var length = strLen(name);
				return length * 6 + 5 * 2;
			}).label('name', {
				offset: 5,
				labelEmit: true,
			}).shape('children*collapsed', function(children,collapsed) {
					if (children) {
						if (collapsed) {
							return 'collapsed';
						} else {
							return 'expanded';
						}
					}
					return 'leaf';
				}).tooltip(tipStr);
			chartV.render();
		}
		chartV.on('plotclick', function(ev){
			var shape = ev.shape;
			if (shape) {
				var obj = shape.get('origin');
				var id = obj._origin.id;
				var node = layout.findNode(id);
				if (node && node.children) {
					node.collapsed = !node.collapsed ? 1 : 0;
					layout.reset();
					nodes = layout.getNodes();
					edges = layout.getEdges();
					dx = layout.dx;
					renderTree(nodes, edges, dx);
				}
			}
		});
	}
}

const __MDA_G2ChartRender = {
	build: function (chartType) {
		switch (chartType) {
		case 'layer_vdp':
			return new __MDA_G2ChartLayerVdp();
			break;
		case 'line':
			return new __MDA_G2ChartLine();
			break;
		case 'line_vdp':
			return new __MDA_G2ChartLineVdp();
			break;
		case 'bar':
			return new __MDA_G2ChartBar();
			break;
		case 'bar_vdp':
			return new __MDA_G2ChartBarVdp();
			break;
		case 'line_bar_vdp':
			return new __MDA_G2ChartLineBarVdp();
			break;
		case 'point_vdp':
			return new __MDA_G2ChartPointVdp();
			break;
		case 'pie':
			return new __MDA_G2ChartPie();
			break;
		case 'pie_vdp':
			return new __MDA_G2ChartPieVdp();
			break;
		case 'sankey':
			return new __MDA_G2ChartSankey();
			break;
		}
	},
	render: function (params) {
		var chart = this.build(params.chartType)
		chart.render(params)
	}
}




class __MDA_D3Chart extends __MDA_Chart {

    parseEventConfig(params) {
      const p = params
      var config = {
        'click': function(ev){
          if (p.events.click && ev.data) {
            var fn = this.getFn(p.events.click)
            fn(ev.data);
          }
        }.bind(this)
      }
      return config;
    }
}


class __MDA_G2ChartBubble extends __MDA_D3Chart {

    render(params) {
        const events = this.parseEventConfig(params);
        this.formatSourceData(params)
        var data = params.source.data
        var classes = _.map(data, row => {
            return { id: row[params.layout.catCol], value: row[params.layout.valueCol] }
        })

        //var svg = d3.select(`svg.diag-bubble`);
        var svg = d3.select(`#svg${params.chart.divId}`);
        var width = svg.attr("width");
        var height = svg.attr("height");

        var format = d3.format(",d");
        var color = d3.scaleOrdinal(d3.schemeCategory20c);

        var pack = d3.pack()
            .size([width, height])
            .padding(1.5);

        var root = d3.hierarchy({children: classes})
            .sum(function(d) { return d.value; })
            .each(function(d) {
                if (id = d.data.id) {
                    var id, i = id.lastIndexOf(".");
                    d.id = id;
                    d.package = id.slice(0, i);
                    d.class = id.slice(i + 1);
                }
            });

        var node = svg.selectAll(".node")
            .data(pack(root).leaves())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("circle")
            .attr("id", function(d) { return d.id; })
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d) { return color(d.package); });

        node.append("clipPath")
            .attr("id", function(d) { return "clip-" + d.id; })
            .append("use")
            .attr("xlink:href", function(d) { return "#" + d.id; });

        node.append("text")
            .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
            .selectAll("tspan")
            .data(function(d) {
                var text = d.class.split(/(?=[A-Z][^A-Z])/g)[0];
                return [text];
            })
            .enter().append("tspan")
            .attr("x", 0)
            .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
            .text(function(d) { return d; });
        node.append("title")
            .text(function(d) { return d.id + "\n" + format(d.value); });

        _.map(events, (value, key) => {
          node.on(key, value);
        })
    }
}

const __MDA_D3ChartRender = {

    build: function(chartType) {
      switch(chartType) {
        case 'bubble': return new __MDA_G2ChartBubble(); break;
      }
    }, 
    render: function(params) {
      var chart = this.build(params.chartType)
      chart.render(params)
    }
}



class __MDA_PlotlyChart extends __MDA_Chart {

    renderChart(params, dataBuilder, layoutBuilder) {
      this.formatSourceData(params)
      var data = dataBuilder(params)
      var layout = layoutBuilder(params)
      Plotly.newPlot(params.chart.divId, data, layout, {showLink: false});
    }

    render(params) {
      this.renderChart(params,
        this.buildData.bind(this), this.buildLayout.bind(this))
    }
}

class __MDA_PlotlyChartBar extends __MDA_PlotlyChart {

  buildData(params) {
      const source = params.source
      const data = source.data
      const layout = params.layout
      var group = {}
      _.each(data, item => {
        var stackCol;
        if (layout.mode == 'stack')
          stackCol = layout.stackCol
        else
          stackCol = ''
        const trace = item[stackCol]
        if (group[trace] == undefined) {
          group[trace] = {
            x: [],
            y: [],
            type: 'bar',
            name: trace,
          }
        }
        group[trace].x.push(item[layout.axisXCol])
        group[trace].y.push(item[layout.axisYCol])
      })
      return _.values(group);
    }

    buildLayout(params) {
      var layout = {
        barmode: params.layout.mode,
      };
      return layout
    }

}

const __MDA_PlotlyChartRender = {

    build: function(chartType) {
      switch(chartType) {
        case 'bar': return new __MDA_PlotlyChartBar(); break; 
      }
    }, 
    render: function(params) {
      var chart = this.build(params.chartType)
      chart.render(params)
    }
}





class __MDA_EcChart extends __MDA_Chart {

}

class __MDA_EcChartVdp extends __MDA_EcChart {

    buildBase(params) {
      return this.buildChartBase(params)
    }
  }

const __MDA_EcChinaMap = {
    '中国': 'china',
    '中国-浙江-杭州市': 'zhejiang_hangzhou',
    '中国-浙江-宁波市': 'zhejiang_ningbo',
    '中国-浙江-温州市': 'zhejiang_wenzhou',
    '中国-浙江-嘉兴市': 'zhejiang_jiaxing',
    '中国-浙江-湖州市': 'zhejiang_huzhou',
    '中国-浙江-绍兴市': 'zhejiang_shaoxing',
    '中国-浙江-金华市': 'zhejiang_jinhua',
    '中国-浙江-衢州市': 'zhejiang_quzhou',
    '中国-浙江-舟山市': 'zhejiang_zhoushan',
    '中国-浙江-台州市': 'zhejiang_taizhou',
    '中国-浙江-丽水市': 'zhejiang_lishui',
    '中国-黑龙江-哈尔滨': 'hlj_haerbin',
    '中国-黑龙江-齐齐哈尔市': 'hlj_qiqihaer',
    '中国-黑龙江-鸡西市': 'hlj_jixi',
    '中国-黑龙江-鹤岗市': 'hlj_hegang',
    '中国-黑龙江-双鸭山市': 'hlj_shuangyashan',
    '中国-黑龙江-大庆市': 'hlj_daqing',
    '中国-黑龙江-伊春市': 'hlj_yichun',
    '中国-黑龙江-佳木斯市': 'hlj_jiamusi',
    '中国-黑龙江-七台河市': 'hlj_qitaihe',
    '中国-黑龙江-牡丹江市': 'hlj_mudanjiang',
    '中国-黑龙江-黑河市': 'hlj_heihe',
    '中国-黑龙江-绥化市': 'hlj_suihua',
    '中国-黑龙江-大兴安岭地区': 'hlj_daxinganling',
    '中国-西藏-拉萨市': 'xizang_lasa',
    '中国-西藏-日喀则市': 'xizang_rikaze',
    '中国-西藏-昌都市': 'xizang_changdu',
    '中国-西藏-山南市': 'xizang_shannan',
    '中国-西藏-那曲地区': 'xizang_naqudiqu',
    '中国-西藏-阿里地区': 'xizang_alidiqu',
    '中国-西藏-林芝市': 'xizang_linzhi',
    '中国-广东-广州市': 'guangdong_guangzhou',
    '中国-广东-韶关市': 'guangdong_shaoguan',
    '中国-广东-深圳市': 'guangdong_shenzhen',
    '中国-广东-珠海市': 'guangdong_zhuhai',
    '中国-广东-汕头市': 'guangdong_shantou',
    '中国-广东-佛山市': 'guangdong_foshan',
    '中国-广东-江门市': 'guangdong_jiangmen',
    '中国-广东-镇江': 'guangdong_zhenjiang',
    '中国-广东-茂名市': 'guangdong_maoming',
    '中国-广东-肇庆市': 'guangdong_zhaoqing',
    '中国-广东-惠州市': 'guangdong_huizhou',
    '中国-广东-梅州市': 'guangdong_meizhou',
    '中国-广东-汕尾市': 'guangdong_shanwei',
    '中国-广东-河源市': 'guangdong_heyuan',
    '中国-广东-阳江市': 'guangdong_yangjiang',
    '中国-广东-清远市': 'guangdong_qingyuan',
    '中国-广东-东莞市': 'guangdong_dongguan',
    '中国-广东-中山市': 'guangdong_zhongshan',
    '中国-广东-潮州市': 'guangdong_chaozhou',
    '中国-广东-揭阳市': 'guangdong_jieyang',
    '中国-广东-云浮市': 'guangdong_yunfu',
    '中国-广西-南宁市': 'guangxi_nanning',
    '中国-广西-柳州市': 'guangxi_liuzhou',
    '中国-广西-桂林市': 'guangxi_guilin',
    '中国-广西-梧州市': 'guangxi_wuzhou',
    '中国-广西-北海市': 'guangxi_beihai',
    '中国-广西-防城港市': 'guangxi_fangchenggang',
    '中国-广西-钦州市': 'guangxi_qinzhou',
    '中国-广西-贵港市': 'guangxi_guigang',
    '中国-广西-玉林市': 'guangxi_yulin',
    '中国-广西-白色市': 'guangxi_baise',
    '中国-广西-贺州市': 'guangxi_hezhou',
    '中国-广西-河池市': 'guangxi_hechi',
    '中国-广西-来宾市': 'guangxi_laibin',
    '中国-广西-崇左市': 'guangxi_chongzuo',
    '中国-福建-厦门市': 'china_fujian_xiamen',
    '中国-福建-福州市': 'fujian_fuzhou',
    '中国-福建-莆田市': 'fujian_putian',
    '中国-福建-三明市': 'fujian_sanming',
    '中国-福建-泉州市': 'fujian_quanzhou',
    '中国-福建-漳州市': 'fujian_zhangzhou',
    '中国-福建-南平市': 'fujian_nanping',
    '中国-福建-龙岩市': 'fujian_longyan',
    '中国-福建-宁德市': 'fujian_ningde',
    '中国-河北': 'hebei',
    '中国-山西': 'shanxi',
    '中国-内蒙古': 'neimenggu',
    '中国-辽宁': 'liaoning',
    '中国-吉林': 'jilin',
    '中国-黑龙江': 'heilongjiang',
    '中国-江苏': 'jiangsu',
    '中国-浙江': 'zhejiang',
    '中国-安徽': 'anhui',
    '中国-福建': 'fujian',
    '中国-江西': 'jiangxi',
    '中国-山东': 'shandong',
    '中国-河南': 'henan',
    '中国-湖北': 'hubei',
    '中国-湖南': 'hunan',
    '中国-广东': 'guangdong',
    '中国-广西': 'guangxi',
    '中国-海南': 'hainan',
    '中国-四川': 'sichuan',
    '中国-贵州': 'guizhou',
    '中国-云南': 'yunnan',
    '中国-西藏': 'xizang',
    '中国-陕西': 'shanxi1',
    '中国-甘肃': 'gansu',
    '中国-青海': 'qinghai',
    '中国-宁夏': 'ningxia',
    '中国-新疆': 'xinjiang',
    '中国-北京': 'beijing',
    '中国-天津': 'tianjin',
    '中国-上海': 'shanghai',
    '中国-重庆': 'chongqing',
    '中国-香港': 'xianggang',
    '中国-澳门': 'aomen',
    '中国-台湾': 'taiwan',
}

const __MDA_ChinaMap_CHINA = '中国'

class __MDA_EcChartChinaMapVdp extends __MDA_EcChartVdp {


    buildChartBase(params) {
        var divId = params.chart.divId


        var chart = echarts.init(document.getElementById(divId));

        var navOption = {
            graphic: [{
                id: 'left-btn',
                type: 'circle',
                shape: { r: 20 },
                style: {
                    text: '<',
                    fill: '#eee'
                },
                left: 10,
                top: 'middle',
                onclick: function () {
                }
            }],

            series: []
        };

        var chartOption = {
            title: {
                text: '',
                left: 'center',
                textStyle: {
                }
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
            },
            visualMap: {
                min: 0,
                max: null,
                left: 'left',
                top: 'bottom',
                calculable: true,
                inRange: {
                    color: ['#e0ffff', '#006edd']
                },
	            textStyle: {
		            color: '#eeeeee'
	            }
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                }
            },
            series: [
                {
                    name: '',
                    type: 'map',
                    mapType: '',
                    roam: false,
                    aspectScale: 0.75,
                    zoom: 0.85,
                    layoutCenter: ['110%', '110%'],
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data:[]
                }
            ]
        };
        return {
            chart: chart,
            navOption: navOption,
            chartOption: chartOption
        };
    }

    formatSourceData(params) {
        super.formatSourceData(params)

        var layout = params.layout
        var data = params.source.data;

        var l1Col = layout.axisXCol[0]
        var l2Col = layout.axisXCol[1]
        var l3Col = layout.axisXCol[2]
        var targetCol = layout.axisYCol[0]

        var l1DicData = {}
        var l2DicData = {}
        var l3DicData = {}

        for (var i = 0; i < data.length; i++) {
            var row = data[i]
            if (l1Col != '') {
                var name = row[l1Col]
                if (l1DicData[name] == undefined)
                    l1DicData[name] = 0
                l1DicData[name] += row[targetCol]
            }
            if (l2Col != '') {
                var name = row[l2Col]
                if (l2DicData[name] == undefined)
                    l2DicData[name] = 0
                l2DicData[name] += row[targetCol]
            }
            if (l3Col != '') {
                var name = row[l3Col]
                if (l3DicData[name] == undefined)
                    l3DicData[name] = 0
                l3DicData[name] += row[targetCol]
            }
        }

        var l1AryData = []
        var l2AryData = []
        var l3AryData = []
        _.map(l1DicData, (value, name) => {
            l1AryData.push({name: name, value: value})
        })
        _.map(l2DicData, (value, name) => {
            l2AryData.push({name: name, value: value})
        })
        _.map(l3DicData, (value, name) => {
            l3AryData.push({name: name, value: value})
        })

        params.source.data = {
            l1: l1AryData,
            l2: l2AryData,
            l3: l3AryData
        }
    }

    render(params) {
        this.formatSourceData(params)
        var base = this.buildBase(params)
        var chart = base.chart
        var navOption = base.navOption
        var chartOption = base.chartOption
        this.renderChartHandler = this.renderChart.bind(this, params, chart, navOption, chartOption)
        this.renderChartHandler(1, [], __MDA_ChinaMap_CHINA)
    }

    renderChart(params, chart, navOption, chartOption, mapLevel, parentNames, name) {
        var data = params.source.data[`l${mapLevel}`]
        chartOption.visualMap.max = _.max(_.map(data, e => e.value))
        chartOption.series[0].name = params.source.colDef[params.layout.axisYCol[0]].alias
        chartOption.series[0].data = data

        var absNames = _.map(parentNames, n => n)
        absNames.push(name)
        var subNamesTag = absNames.join('-')

        var usedCols = _.filter(params.layout.axisXCol, c => c != '').length


        if (mapLevel < usedCols) {
            chart.on('click', function (clickParams) {
                this.renderChartHandler(mapLevel + 1, absNames, clickParams.name)
            }.bind(this))
        } else {
            chart.on('click', function(clickParams) {
            })
        }


        if (__MDA_EcChinaMap[subNamesTag] == undefined) {
            return
        }
        var uuName = __MDA_EcChinaMap[subNamesTag]
        if (name == __MDA_ChinaMap_CHINA)
            chartOption.title.text = ''
        else
            chartOption.title.text = name
        chartOption.series[0].mapType = uuName
        $.get(params.source.mapServer + uuName + '.json', function (geoJson) {
            // myChart.hideLoading();
            echarts.registerMap(uuName, geoJson);
            if (mapLevel != 1) {
                navOption.graphic[0].onclick = function() {
                    var navParentNames = []
                    var navName = parentNames[parentNames.length-1]
                    for (var i = 0; i < parentNames.length-1; i++) {
                        navParentNames.push(parentNames[i])
                    }
                    this.renderChartHandler(mapLevel-1, navParentNames, navName)
                }.bind(this)
                chart.setOption(navOption)
            } else {
                chart.setOption({
                    graphic: [],
                    series: []
                })
            }
            chart.setOption(chartOption)
        }.bind(this))
    }
}

const __MDA_EcChartRender = {

    build: function(chartType) {
      switch(chartType) {
        case 'china_map_vdp': return new __MDA_EcChartChinaMapVdp(); break;
      }
    }, 
    render: function(params) {
      var chart = this.build(params.chartType)
      chart.render(params)
    }
}



class __MDA_AntChart extends __MDA_Chart {

    renderChart(params, dataBuilder, layoutBuilder) {
        this.formatSourceData(params);
        var data = dataBuilder(params);
        var layout = layoutBuilder(params);
        ReactDOM.render(React.createElement(antd.Table, { dataSource: data['rowSources'],
            columns: data['columns'], size: 'small', pagination: false, className: 'my-table', style: layout.style }), document.getElementById(params.chart.divId));

        var tds = document.getElementsByClassName('hideBorderCell');
        for (var i = 0; i < tds.length; i++) {
            $(tds[i].parentNode).addClass('hideBorderCellTd');
        }
    }

    render(params) {
        this.renderChart(params, this.buildData.bind(this), this.buildLayout.bind(this));
    }
}

class __MDA_AntChartTableVdp extends __MDA_AntChart {

    buildData(params) {
        const source = params.source;
        const data = source.data;
        const layout = params.layout;

        var columns = [];
        _.each(layout.axisXCol, col => {
            columns.push({
                'title': source.colDef[col].alias,
                'index': col,
                'type': 'X',
                'width': 150,
                'render': function (text, record, index) {
                    var borderCls = record[source.colDef[col].alias]['hideBorder'] ? 'hideBorderCell' : '';
                    var contentCls = record[source.colDef[col].alias]['hideContent'] ? 'hideContentCell' : '';
                    return React.createElement(
                        'span',
                        { className: `${borderCls} ${contentCls}` },
                        record[source.colDef[col].alias]['value']
                    );
                }
            });
        });
        _.each(layout.axisYCol, col => {
            columns.push({
                'title': source.colDef[col].alias,
                'index': col,
                'type': 'Y',
                'render': function (text, record, index) {
                    return React.createElement(
                        antd.Tooltip,
                        { placement: 'top', title: record[source.colDef[col].alias]['value'] },
                        React.createElement(
                            'div',
                            { className: 'chartCellBar', style: { width: `${record[source.colDef[col].alias]['size']}%` } },
                            record[source.colDef[col].alias]['value']
                        )
                    );
                }
            });
        });

        var maxColIndexs = layout.axisYCol;
        var maxColValues = {};
        _.each(data, item => {
            _.each(maxColIndexs, col => {
                if (maxColValues[col] != undefined) {
                    maxColValues[col] = Math.max(maxColValues[col], item[col]);
                } else {
                    maxColValues[col] = item[col];
                }
            });
        });

        var rowSources = [];
        _.each(data, item => {
            var row = {};
            _.each(columns, col => {
                if (col['type'] == 'X') {
                    row[col['title']] = {
                        'value': item[col['index']]
                    };
                } else {
                    row[col['title']] = {
                        'value': item[col['index']],
                        'size': parseInt(item[col['index']] / maxColValues[col['index']] * 0.9 * 100)
                    };
                }
            });
            rowSources.push(row);
        });
        var groupCols = _.map(layout.axisXCol, col => {
            return source.colDef[col].alias;
        });

        rowSources = _.sortBy(rowSources, [function (s) {
            return _.join(_.map(groupCols, col => s[col]['value']), '~');
        }]);
        for (var i = 0; i < rowSources.length - 1; i++) {
            for (var j = 0; j < groupCols.length; j++) {
                if (rowSources[i][groupCols[j]]['value'] == rowSources[i + 1][groupCols[j]]['value']) {
                    var prefixEqual = true;
                    for (var z = 0; z < j; z++) {
                        if (rowSources[i][groupCols[z]]['value'] != rowSources[i + 1][groupCols[z]]['value']) {
                            prefixEqual = false;
                            break;
                        }
                    }
                    if (prefixEqual) rowSources[i][groupCols[j]]['hideBorder'] = true;
                }
            }
        }
        for (var i = 1; i < rowSources.length; i++) {
            for (var j = 0; j < groupCols.length; j++) {
                if (rowSources[i][groupCols[j]]['value'] == rowSources[i - 1][groupCols[j]]['value']) {
                    var prefixEqual = true;
                    for (var z = 0; z < j; z++) {
                        if (rowSources[i][groupCols[z]]['value'] != rowSources[i - 1][groupCols[z]]['value']) {
                            prefixEqual = false;
                            break;
                        }
                    }
                    if (prefixEqual) rowSources[i][groupCols[j]]['hideContent'] = true;
                }
            }
        }
        return { 'columns': columns, 'rowSources': rowSources };
    }

    buildLayout(params) {
        var layout = {
            style: params.chart.style,
        };
        if (layout.style) {
            layout.style.overflowY = 'auto';
        } else {
            layout.style = {};
            layout.style.overflowY = 'auto';
        }
        return layout;
    }

}

const __MDA_AntChartRender = {

    build: function (chartType) {
        switch (chartType) {
            case 'table_vdp':
                return new __MDA_AntChartTableVdp();
                break;
        }
    },
    render: function (params) {
        var chart = this.build(params.chartType);
        chart.render(params);
    }
};

