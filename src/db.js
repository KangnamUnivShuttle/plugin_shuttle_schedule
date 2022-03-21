const moment = require('moment');

const SHUTTLE_DATA = {
    '-LXcJzZkD2g9OG50q5pt': {
        name: '이공관 행',
        status: true,
        order: 1,
        stations: {
            'Ah7lO0GS9M': {
                name: '기흥역 4번출구',
                status: true,
                order: 1,
                schedule: []
            },
            'VOF5o1gUfn': {
                name: '사훈 프라자 앞',
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
        return result
    }

    const stations = SHUTTLE_DATA[route].stations

    for(let key in stations) {
        if (stations.status) {
            result.push({
                name: stations[key].name,
                order: stations[key].order,
                schedule: stations[key].schedule,
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

    // calc nearest
    for(let i = idx; i < schedule.length; i++) {
        const diff = moment(schedule[i], 'HHMMSS').diff(moment(time, 'HHMMSS'))
        if (60000 <= diff && dif <= 600000) { // 1 ~ 10분 전
            return {
                msg: `${Math.ceil(diff / 60000)}분 후 출발`,
                idx: i
            }
        } else if (diff < 60000) {// 잠시후
            return {
                msg: '잠시후 출발',
                idx: i
            }
        } else if (0 < i && schedule[i - 1] < time && time < schedule[i]) { // 통상 시간 범위
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
        } else {
            return {
                msg: '시간표 확인 요망',
                idx: 0
            }
        }
    }
    return `첫차 ${schedule[0]}`
}

const calcNearestTimeSummary = function(time, schedule) {
    const {nearMsg, nearIdx} = calcNearestTime(time, schedule)
    const {nextMsg, _} = calcNearestTime(time, schedule, nearIdx + 1)
    return `${nearMsg} / ${nextMsg}`
}

const getNearestShuttleData = function(route, time, isDev = false) {
    const stations = getShuttleStationList(route, isDev)
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
}

module.exports = {
    SHUTTLE_DATA,
    getShuttleRouteData,
    getShuttleStationList,
    getNearestShuttleData
}