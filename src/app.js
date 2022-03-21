const express = require('express')
require('dotenv').config()
const app = express()
const axios = require('axios');
const port = 15000

app.post('/chat', (req, res) => {

    const errorResponse = {
    }

    const successResponse = {
    }

    console.log('body', req.body)

    const shuttleData = {
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

    res.send(successResponse)
})

module.exports = app;