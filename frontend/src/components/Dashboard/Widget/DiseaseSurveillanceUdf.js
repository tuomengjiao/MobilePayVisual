export const DiseaseSurveillanceUdf = `function(t1, t2, t3, t4, t5, t6, t7) {
    const XIAMEN_POINTS = [
        ['思明区', '', 118.089277, 24.451917],
        ['思明区', '夏港街道', 118.099486, 24.44608],
        ['思明区', '中华街道', 118.084804, 24.461753],
        ['思明区', '滨海街道', 118.130481, 24.433833],
        ['思明区', '鹭江街道', 118.08535, 24.46613],
        ['思明区', '开元街道', 118.101216, 24.47373],
        ['思明区', '梧村街道', 118.121681, 24.476536],
        ['思明区', '筼筜街道', 118.12278, 24.492689],
        ['思明区', '莲前街道', 118.158146, 24.483281],
        ['思明区', '嘉莲街道', 118.132087, 24.490314],
        ['思明区', '鼓浪屿街道', 118.073104, 24.450589],
        ['海沧区', '', 118.039392, 24.490264],
        ['海沧区', '新沧街道', 117.99022, 24.467723],
        ['海沧区', '新阳街道', 118.016879, 24.528695],
        ['海沧区', '嵩屿街道', 118.044684, 24.460866],
        ['海沧区', '东孚街道', 117.942299, 24.572121],
        ['湖里区', '', 118.153318, 24.518701],
        ['湖里区', '湖里街道', 118.111541, 24.518005],
        ['湖里区', '殿前街道', 118.11241, 24.528329],
        ['湖里区', '禾山街道', 118.160268, 24.517677],
        ['湖里区', '江头街道', 118.138506, 24.504222],
        ['湖里区', '金山街道', 118.160861, 24.506524],
        ['集美区', '', 118.103976, 24.582213],
        ['集美区', '集美街道', 118.105895, 24.578734],
        ['集美区', '侨英街道', 118.119222, 24.60721],
        ['集美区', '杏林街道', 118.047845, 24.567041],
        ['集美区', '杏滨街道', 118.047575, 24.569195],
        ['集美区', '灌口镇', 118.005189, 24.62573],
        ['集美区', '后溪镇', 118.048052, 24.635461],
        ['同安区', '', 118.158328, 24.728367],
        ['同安区', '大同街道', 118.155037, 24.736119],
        ['同安区', '祥平街道', 118.140889, 24.733713],
        ['同安区', '莲花镇', 118.078509, 24.748579],
        ['同安区', '新民镇', 118.142205, 24.718733],
        ['同安区', '洪塘镇', 118.205963, 24.716912],
        ['同安区', '西柯镇', 118.169701, 24.670474],
        ['同安区', '汀溪镇', 118.144985, 24.783129],
        ['同安区', '五显镇', 118.172793, 24.748395],
        ['翔安区', '', 118.254587, 24.624349],
        ['翔安区', '大嶝街道', 118.327355, 24.558112],
        ['翔安区', '马巷镇', 118.257574, 24.66294],
        ['翔安区', '新圩镇', 118.265528, 24.739961],
        ['翔安区', '新店镇', 118.253699, 24.614739],
        ['翔安区', '内厝镇', 118.281817, 24.670944],
        ['翔安区', '大帽山农场', 118.31197, 24.777073],
    ];
    const benchmark = {
        month: ${global.benchmarkMonth ? global.benchmarkMonth : 10},
        week: ${global.benchmarkWeek ? global.benchmarkWeek : 5},
        day: ${global.benchmarkDay ? global.benchmarkDay : 2},
    }
    function getNow() {
        return moment('${global.mockDate ? global.mockDate : ''}');
    }
    function createMockRows(type) {
        let diseases = ['支气管肺炎', '足扭伤', '冠心病', '病毒性感冒', '慢性支气管炎', '胃溃疡', '腰肌劳损', '盲肠炎', '胆囊炎', '肩周炎'];
        let rows = [];
        if (type === 'month') {
            let times = [];
            let curMonth = getNow().subtract(12, 'months');
            for (let i = 0; i < 12; i++) {
                let monthStr = curMonth.format('YYYY-MM');
                times.push(monthStr);
                curMonth.add(1, 'months');
            }
            for (let i = 0; i < diseases.length; i++) {
                for (let k = 0; k < times.length; k++) {
                    rows.push([diseases[i], Math.round(Math.random() * 15 * 30), times[k]]);
                }
            }
        } else if (type === 'day') {
            let times = [];
            let curDay = getNow().subtract(50, 'days');
            for (let i = 0; i < 50; i++) {
                let dayStr = curDay.format('YYYY-MM-DD');
                times.push(dayStr);
                curDay.add(1, 'days');
            }
            for (let i = 0; i < diseases.length; i++) {
                for (let k = 0; k < times.length; k++) {
                    rows.push([diseases[i], Math.round(Math.random() * 15), times[k]]);
                }
            }
        } else if (type === 'week') {
            let times = [];
            let curDay = getNow().subtract(7 * 6, 'days');
            for (let i = 0; i < 6; i++) {
                let dayInt = curDay.isoWeek();
                times.push(dayInt);
                curDay.add(7, 'days');
            }
            for (let i = 0; i < diseases.length; i++) {
                for (let k = 0; k < times.length; k++) {
                    rows.push([diseases[i], Math.round(Math.random() * 15 * 7), times[k]]);
                }
            }
        }
        return rows;
    }
    function createMockRows2(type) {
        let diseases = ['支气管肺炎', '足扭伤', '冠心病', '病毒性感冒', '慢性支气管炎', '胃溃疡', '腰肌劳损', '盲肠炎', '胆囊炎', '肩周炎'];
        let rows = [];
        if (type === 'month') {
            let times = [];
            let curMonth = getNow().subtract(12, 'months');
            for (let i = 0; i < 12; i++) {
                let monthStr = curMonth.format('YYYY-MM');
                times.push(monthStr);
                curMonth.add(1, 'months');
            }
            for (let i = 0; i < diseases.length; i++) {
                for (let j = 0; j < XIAMEN_POINTS.length; j++) {
                    for (let k = 0; k < times.length; k++) {
                        rows.push([diseases[i], Math.round(Math.random() * 15 * 30), times[k], '厦门市', XIAMEN_POINTS[j][0], XIAMEN_POINTS[j][1]]);
                    }
                }
            }
        } else if (type === 'day') {
            let times = [];
            let curDay = getNow().subtract(50, 'days');
            for (let i = 0; i < 50; i++) {
                let dayStr = curDay.format('YYYY-MM-DD');
                times.push(dayStr);
                curDay.add(1, 'days');
            }
            for (let i = 0; i < diseases.length; i++) {
                for (let j = 0; j < XIAMEN_POINTS.length; j++) {
                    for (let k = 0; k < times.length; k++) {
                        rows.push([diseases[i], Math.round(Math.random() * 15), times[k], '厦门市', XIAMEN_POINTS[j][0], XIAMEN_POINTS[j][1]]);
                    }
                }
            }
        } else if (type === 'week') {
            let times = [];
            let curDay = getNow().subtract(7 * 6, 'days');
            for (let i = 0; i < 6; i++) {
                let dayInt = curDay.isoWeek();
                times.push(dayInt);
                curDay.add(7, 'days');
            }
            for (let i = 0; i < diseases.length; i++) {
                for (let j = 0; j < XIAMEN_POINTS.length; j++) {
                    for (let k = 0; k < times.length; k++) {
                        rows.push([diseases[i], Math.round(Math.random() * 15 * 7), times[k], '厦门市', XIAMEN_POINTS[j][0], XIAMEN_POINTS[j][1]]);
                    }
                }
            }
        }
        return rows;
    }
    function mockInput() {
        return {
            dataByDay: { rows: createMockRows('day') },
            dataByMonth: { rows: createMockRows('month') },
            dataByWeek: { rows: createMockRows('week') },
        };
    }
    function mockInput2() {
        return {
            dataByDay: { rows: createMockRows2('day') },
            dataByMonth: { rows: createMockRows2('month') },
            dataByWeek: { rows: createMockRows2('week') },
        };
    }
    // t2 = createMockRows('month');
    // t3 = createMockRows('week');
    // t4 = createMockRows('day');
    // t5 = createMockRows2('month');
    // t6 = createMockRows2('week');
    // t7 = createMockRows2('day');

    // return [t1,t2,t3,t4,t5,t6,t7]

    t3 = fixWeekData(t3);

    let diseases = {
        month: getDiseasesByTime(t2, 5, 'month'),
        week: getDiseasesByTime(t3, 5, 'week'),
        day: getDiseasesByTime(t4, 5, 'day'),
    }

    // return [getCompareTimeRange('month'), getCompareTimeRange('week'), getCompareTimeRange('day'),]

    let r2 = _.filter(t2, (o) => {
        return diseases.month.indexOf(o[0]) > -1;
    });
    let r3 = _.filter(t3, (o) => {
        return diseases.week.indexOf(o[0]) > -1;
    });
    let r4 = _.filter(t4, (o) => {
        return diseases.day.indexOf(o[0]) > -1;
    });

    let pointsMap = initPointsMap();
    let preMonth = getPreTime('month');
    let preDay = getPreTime('day');
    let preWeek = getPreTime('week');

    let r5 = {};
    let r6 = {};
    let r7 = {};

    let mapDataByMonth = _.filter(t5, (o) => {
        return diseases.month.indexOf(o[0]) > -1 && o[2] === preMonth;
    });

    let mapDataByWeek = _.filter(t6, (o) => {
        return diseases.week.indexOf(o[0]) > -1 && o[2] === preWeek;
    });

    let mapDataByDay = _.filter(t7, (o) => {
        return diseases.day.indexOf(o[0]) > -1 && o[2] === preDay;
    });

    _.map(mapDataByMonth,(o) => {
        let item = [];
        let key = o[5] ? o[4] + '_' + o[5] : o[4];
        let point = pointsMap[key];
        if (point) {
            item = item.concat(point);
            item.push(o[1]);
        } else {
            item = item.concat(['','']);
            item.push(o[1]);
        }
        if (r5[o[0]]) {
            r5[o[0]].push(item);
        } else {
            r5[o[0]] = [item];
        }
    });

    _.map(mapDataByWeek,(o) => {
        let item = [];
        let key = o[5] ? o[4] + '_' + o[5] : o[4];
        let point = pointsMap[key];
        if (point) {
            item = item.concat(point);
            item.push(o[1]);
        } else {
            item = item.concat(['','']);
            item.push(o[1]);
        }
        if (r6[o[0]]) {
            r6[o[0]].push(item);
        } else {
            r6[o[0]] = [item];
        }
    });

    _.map(mapDataByDay,(o) => {
        let item = [];
        let key = o[5] ? o[4] + '_' + o[5] : o[4];
        let point = pointsMap[key];
        if (point) {
            item = item.concat(point);
            item.push(o[1]);
        } else {
            item = item.concat(['','']);
            item.push(o[1]);
        }
        if (r7[o[0]]) {
            r7[o[0]].push(item);
        } else {
            r7[o[0]] = [item];
        }
    });

    return {
        pointsMap: pointsMap,
        diseases: diseases,
        lineData: {
            month: r2,
            week: r3,
            day: r4,
        },
        mapData: {
            month: r5,
            week: r6,
            day: r7,
        },
    }

    // fix week data,
    function fixWeekData(orgData) {
        let rst = [];
        let yearLastWeek = null;
        let yearFirstWeek = null;
        _.map(orgData, (o) => {
            if (o[2] === 1) {
                yearFirstWeek = o;
            } else if (o[2] === 53) {
                yearLastWeek = o;
            } else {
                rst.push(o);
            }
        });
        if (yearFirstWeek && yearLastWeek) {
            let weekRange = createTimeRange('week');
            if (weekRange.indexOf(1) > -1){
                yearFirstWeek[1] += yearLastWeek[1];
                rst.push(yearFirstWeek);
            } else if (weekRange. indexOf(53) > -1) {
                yearLastWeek[1] += yearFirstWeek[1];
                rst.push(yearLastWeek);
            }
        } else if (yearFirstWeek && !yearLastWeek) {
            rst.push(yearFirstWeek);
        } else if (!yearFirstWeek && yearLastWeek) {
            rst.push(yearLastWeek);
        }
        return rst;
    }

    function getCompareTimeRange(type) {
        let rst = [];
        switch (type) {
        case 'month':
            let curMonth = getNow();
            rst.push(curMonth.subtract(2,'months').format('YYYY-MM'));
            rst.push(curMonth.add(1,'months').format('YYYY-MM'));
            break;
        case 'day':
            let curDay = getNow();
            rst.push(curDay.subtract(2,'days').format('YYYY-MM-DD'));
            rst.push(curDay.add(1,'days').format('YYYY-MM-DD'));
            break;
        case 'week':
            let curDay2 = getNow();
            rst.push(curDay2.subtract(14,'days').isoWeek());
            rst.push(curDay2.add(7,'days').isoWeek());
            break;
        }
        return rst;
    }

    function getPreTime(type) {
        let rst = ''
        switch (type) {
            case 'month':
                let curMonth = getNow();
                rst = curMonth.subtract(1,'months').format('YYYY-MM');
                break;
            case 'day':
                let curDay = getNow();
                rst = curDay.subtract(1,'days').format('YYYY-MM-DD');
                break;
            case 'week':
                let curDay2 = getNow();
                rst = curDay2.subtract(7,'days').isoWeek();
                break;
        }
        return rst;
    }

    //按时间获取top5 疾病
    function getDiseasesByTime (orgiData,count,type) {
        let diseases = [];
        let times = getCompareTimeRange(type);
        // 过滤可以排序的疾病
        let timeData = _.filter(orgiData,(o) => {
            return times.indexOf(o[2]) > -1 && o[0];
        });
        // 按疾病名称分组
        let diseaseGroup = _.groupBy(timeData,(o) => {
            return o[0];
        });
        // 疾病的增长率数组，[疾病名称，疾病增长率=(现数据-原数据)/原数据]
        let diseaseRate= [];
        _.map(diseaseGroup, (o,disease) => {
            let d1 = _.find(o,(p) => {
                return p[2] === times[0]
            });
            let d2 = _.find(o,(p) => {
                return p[2] === times[1];
            })
            let c1 = d1 ? d1[1] : 0;
            let c2 = d2 ? d2[1] : 0;
            ///超过基准值的数据才进行计算
            if (c1 >= benchmark[type]) {
                let rate = 0;
                if (c1 === 0 && c2 !==0) {
                    rate = 1;
                } else {
                    rate = (c2-c1) / c1;
                }
                diseaseRate.push({
                    name: disease,
                    rate: rate
                });
            }

        });
        diseaseRate = _.orderBy(diseaseRate,['rate'],['desc']);
        diseaseRate = _.take(diseaseRate,count);
        ///过滤掉负增长的数据
        // diseaseRate = _.filter(diseaseRate,(o) => {
        //     return o.rate > 0;
        // })

        ///mock疾病名称
        // let mockDiseaseNames = {
        //     'month': ['流行性感冒','水痘','手足口病','猩红热','急性腮腺炎'],
        //     'week': ['疱疹性咽峡炎','流行性感冒','水痘','手足口病','猩红热'],
        //     'day': ['流行性感冒','手足口病','水痘','急性腮腺炎','肠病毒感染'],
        // }
        // if (global.mockDiseases) {
        //     for (let i=0; i<diseaseRate.length; i++ ) {
        //         this.mockDiseaseDics[type][diseaseRate[i].name] = mockDiseaseNames[type][i];
        //     }
        // }
        diseases = _.map(diseaseRate,'name');
        return diseases;
    }

    function initPointsMap() {
        let pointsMap = {};
        let town = '';
        _.map(t1, (o) => {
            let key = o[1] ? o[0] + '_' + o[1] : o[0];
            if (!pointsMap[key]) {
                pointsMap[key] = [o[2], o[3]];
            }
        });
        return pointsMap;
    }

    function createTimeRange(type, count) {
        let timeRange = [];
        let curMonth = null;
        let curDay = null;
        switch (type) {
        case 'month':
            curMonth = this.mockDate().subtract(count, 'months');
            for (let i = 0; i < count; i += 1) {
                let monthStr = curMonth.format('YYYY-MM');
                timeRange.push(monthStr);
                curMonth.add(1, 'months');
            }
            break;
        case 'day':
            curDay = this.mockDate().subtract(count, 'days');
            for (let i = 0; i < count; i += 1) {
                let dayStr = curDay.format('YYYY-MM-DD');
                timeRange.push(dayStr);
                curDay.add(1, 'days');
            }
            break;
        case 'week':
            curDay = this.mockDate().subtract(7 * count, 'days');
            for (let i = 0; i < count; i += 1) {
                let dayInt = curDay.isoWeek();
                timeRange.push(dayInt);
                curDay.add(7, 'days');
            }
            break;
        default:
            break;
        }
        return timeRange;
    }
}`;
