const moment = require('moment');

const SHUTTLE_DATA = {
    '-LXcJzZkD2g9OG50q5pt': {
        name: '이공관 행',
        status: true,
        order: 1,
        stations: {
            'Ah7lO0GS9M': {
                name: '기흥역 4번출구',
                descript: 'memo 1',
                status: true,
                order: 1,
                schedule: []
            },
            'VOF5o1gUfn': {
                name: '사훈 프라자 앞',
                descript: 'memo 1',
                status: true,
                order: 2,
                schedule: []
            }
        }
    },
    'LXcMXSvfscGRDynikKK': {
        name: '기흥역 행',
        status: true,
        order: 2,
        stations: {
            'zbIclI1pzD': {
                name: '이공관 (기흥역)',
                descript: 'memo 1',
                status: true,
                order: 1,
                schedule: []
            }
        }
    },
    'LngYBAM1VGgvR7hrTYf': {
        name: '기흥역 행',
        status: true,
        order: 3,
        stations: {
            'rIowOloH4l': {
                name: '이공관 (사훈 프라자)',
                descript: 'memo 1',
                status: true,
                order: 1,
                schedule: []
            }
        }
    },
    'Not enough minerals': {
        name: '12시 방향',
        status: true,
        order: 4,
        dev: true,
        stations: {
            'Bunker1': {
                name: '일연벙',
                descript: 'memo 1',
                status: true,
                order: 1,
                schedule: ['09:00:00', '09:30:00', '20:40:00', '23:59:59']
            },
            'Bunker2': {
                name: '이연벙',
                descript: 'memo 2',
                status: false,
                order: 2,
                schedule: ['00:00:00']
            },
            'Bunker3': {
                name: '삼연벙',
                descript: 'memo 3',
                status: true,
                order: 3,
                schedule: ['09:00:00']
            },
            'Bunker4': {
                name: '사연벙',
                descript: 'memo 4',
                status: true,
                order: 4,
                schedule: ['00:00:00']
            },
            'Bunker5': {
                name: '오연벙',
                descript: 'memo 5',
                status: true,
                order: 5,
                schedule: []
            }
        }
    },
    'Spawn more overlords': {
        name: '6시 방향',
        status: false,
        order: 5,
        dev: true,
        stations: {
            'Hatchery': {
                name: '해처리',
                descript: 'memo 5',
                status: true,
                order: 1,
                schedule: []
            }
        }
    }
}

const getShuttleRouteData = function (isDev = false) {
    const result = []
    for (let key in SHUTTLE_DATA) {
        if (SHUTTLE_DATA[key].status && SHUTTLE_DATA[key].dev == isDev) {
            result.push({
                name: SHUTTLE_DATA[key].name,
                order: SHUTTLE_DATA[key].order,
                key
            })
        }
    }
    return result
}

const getShuttleStationList = function(route, isDev = false) {
    const result = []
    if (!SHUTTLE_DATA.hasOwnProperty(route) || !SHUTTLE_DATA[route].stations || !SHUTTLE_DATA[route].status || SHUTTLE_DATA[route].dev !== isDev) {
        return null
    }

    const stations = SHUTTLE_DATA[route].stations

    for(let key in stations) {
        if (stations[key].status) {
            result.push({
                name: stations[key].name,
                order: stations[key].order,
                schedule: stations[key].schedule,
                descript: stations[key].descript,
                key
            })
        }
    }
    return result
}

const calcNearestTime = function (time, schedule, idx = 0) {
    if (!/^([\d]{2}[\:]?){3}$/g.exec(time) || !schedule) {
        return {
            msg: 'NA',
            idx: 0
        }
    }
    if (schedule.length <= 0) {
        return {
            msg: '운행 정보 없음',
            idx: 0
        }
    }

    // console.log('calc', time, idx, schedule)

    // calc nearest
    for(let i = idx; i < schedule.length; i++) {
        const diff = moment(schedule[i], 'HH:mm:ss').diff(moment(time, 'HH:mm:ss'))
        // console.log('diff', schedule[i], time, diff, moment(time, 'HH:mm:ss'), moment(time, 'HH:mm:ss').diff(moment(schedule[i], 'HH:mm:ss')))
        // console.log('range', schedule[i - 1], time, schedule[i])

        if (60000 <= Math.abs(diff) && Math.abs(diff) <= 600000 && diff > 0) { // 1 ~ 10분 전
            return {
                msg: `${Math.floor(Math.abs(diff) / 60000)}분 후 출발`,
                idx: i
            }
        } else if (0 <= diff && Math.abs(diff) < 60000) {// 잠시후
            return {
                msg: '잠시후 출발',
                idx: i
            }
        } else if (0 < i && ((schedule[i - 1] || '00:00:00') < time && time < schedule[i])
                        || (idx !== 0 && time < schedule[i])) { // 통상 시간 범위
            return {
                msg: `${idx === 0 ? '이번' : '다음'} ${schedule[i]}`,
                idx: i
            }
        } else if (i === 0 && time < schedule[i]) { // 첫차 전
            return {
                msg: `첫차 ${schedule[i]}`,
                idx: i
            }
        } else if (i === schedule.length && schedule[i] < time) { // 막차 놓침
            return {
                msg: `첫차 ${schedule[0]}`,
                idx: i
            }
        }
    }
    return {
        msg: idx === 0 ? '운행종료' : `첫차 ${schedule[0]}`,
        idx: 0
    }
}

const calcNearestTimeSummary = function(time, schedule) {
    const {msg: nearMsg, idx: nearIdx} = calcNearestTime(time, schedule)
    // console.log('near', nearMsg, nearIdx)
    const {msg: nextMsg, idx: _} = calcNearestTime(time, schedule, nearIdx + 1)
    // console.log('next', nextMsg, _)
    return `${nearMsg} / ${nextMsg}`
}

const getNearestShuttleData = function(route, time, isDev = false) {
    const stations = getShuttleStationList(route, isDev)
    // console.log(stations)
    const result = []
    if (!/^([\d]{2}[\:]?){3}$/g.exec(time)) {
        return result
    }

    stations.forEach(station => {
        result.push({
            name: station.name,
            order: station.order,
            msg: calcNearestTimeSummary(time, station.schedule)
        })
    })
    return result
}

const getRouteNameFromKey = function(key) {
    if (!SHUTTLE_DATA.hasOwnProperty(key)) {
        return 'NA'
    }
    return SHUTTLE_DATA[key].name
}

module.exports = {
    SHUTTLE_DATA,
    getShuttleRouteData,
    getShuttleStationList,
    getNearestShuttleData,
    getRouteNameFromKey
}