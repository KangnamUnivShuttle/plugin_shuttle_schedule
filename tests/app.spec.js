const request = require("supertest");
const http = require('http');
const app = require('../src/app');
// https://stackoverflow.com/questions/38062689/how-do-i-get-the-http-server-from-the-express-app

let agent;
let server;

beforeAll((done) => {
  server = http.createServer(app);
  agent = request.agent(server);
  done();
});

afterAll((done) => {
  server && server.close();
  done();
});

describe("Test the root path", () => {
  test("Get available route list", async () => {
    const response = await agent.post('/chat')
      .type('application/json')
      .send({
        dev: true,
        method: 'route',
      })
    expect(response.statusCode).toBe(200);
    const data = response.body
    expect(data).toEqual({
      "version": "2.0",
      "template": {
        "outputs": [
          {
            "carousel": {
              "type": "basicCard",
              "items": [
                {
                  "title": "셔틀 버스 행선지 선택",
                  "description": "이동하려는 행선지를 선택하세요",
                  "thumbnail": {
                    "imageUrl": ""
                  },
                  "buttons": [
                    {
                      "action": "message",
                      "label": "12시 방향",
                      "messageText": "12시 방향"
                    },
                  ]
                }
              ]
            }
          }
        ],
        "quickReplies": [
          {
            "messageText": "홈 으로",
            "action": "message",
            "label": "홈"
          },
          {
            "messageText": "뒤로 가기",
            "action": "message",
            "label": "↩"
          }
        ]
      }
    })
  });
  test("Get available station list in not exist route", async () => {
    const response = await agent.post('/chat')
      .type('application/json')
      .send({
        dev: true,
        method: 'stations',
        route: 'Not exist route',
      })
    expect(response.statusCode).toBe(200);
    const data = response.body
    console.log('data', JSON.stringify(data))
    expect(data).toEqual({
      "version": "2.0",
      "template": {
        "outputs": [
          {
            "simpleText": {
              "text": "존재하지 않는 경로 입니다."
            }
          }
        ],
        "quickReplies": [
          {
            "messageText": "홈 으로",
            "action": "message",
            "label": "홈"
          },
          {
            "messageText": "뒤로 가기",
            "action": "message",
            "label": "↩"
          }
        ]
      }
    })
  });
  // test("Get available station list in route", async () => {
  //   const response = await agent.post('/chat')
  //     .type('application/json')
  //     .send({
  //       dev: true,
  //       method: 'stations',
  //       route: 'Not enough minerals',
  //     })
  //   expect(response.statusCode).toBe(200);
  //   const data = response.body
  //   expect(data).toEqual({
  //     "version": "2.0",
  //     "template": {
  //       "outputs": [
  //         {
  //           "carousel": {
  //             "type": "listCard",
  //             "items": [
  //               {
  //                 "header": {
  //                   "title": "12시 방향 행 경로"
  //                 },
  //                 "items": [
  //                   {
  //                     "title": "햄치즈",
  //                     "description": "memo 1",
  //                   },
  //                   {
  //                     "title": "삼연벙",
  //                     "description": "memo 3",
  //                   },
  //                   {
  //                     "title": "사연벙",
  //                     "description": "memo 4",
  //                   },
  //                   {
  //                     "title": "오연벙",
  //                     "description": "memo 5",
  //                   },
  //                 ],
  //                 "buttons": [
  //                   {
  //                     "label": "더보기",
  //                     "action": "webLink",
  //                     "webLinkUrl": "https://web.kangnam.ac.kr/menu/4990be9bdd4defbf92dde49a31ad1a3b.do"
  //                   }
  //                 ]
  //               },
  //             ]
  //           }
  //         }
  //       ],
  //       "quickReplies": [
  //         {
  //           "messageText": "홈 으로",
  //           "action": "message",
  //           "label": "홈"
  //         },
  //         {
  //           "messageText": "뒤로 가기",
  //           "action": "message",
  //           "label": "↩"
  //         }
  //       ]
  //     }
  //   })
  // });
  // test("Should not return station list in disabled route", async () => {
  //   const response = await agent.post('/chat')
  //     .type('application/json')
  //     .send({
  //       dev: true,
  //       method: 'stations',
  //       route: 'Spawn more overlords',
  //     })
  //   expect(response.statusCode).toBe(200);
  //   const data = response.body
  //   expect(data).toEqual({
  //     "version": "2.0",
  //     "template": {
  //       "outputs": [
  //         {
  //           "simpleText": {
  //             "text": "비활성화된 경로 입니다."
  //           }
  //         }
  //       ],
  //       "quickReplies": [
  //         {
  //           "messageText": "홈 으로",
  //           "action": "message",
  //           "label": "홈"
  //         },
  //         {
  //           "messageText": "뒤로 가기",
  //           "action": "message",
  //           "label": "↩"
  //         }
  //       ]
  //     }
  //   })
  // });
  // test("Get nearest time in station", async () => {
  //   const response = await agent.post('/chat')
  //     .type('application/json')
  //     .send({
  //       dev: true,
  //       method: 'neartime',
  //       time: '09:20:00',
  //       route: 'Not enough minerals',
  //     })
  //   expect(response.statusCode).toBe(200);
  //   const data = response.body
  //   expect(data).toEqual({
  //     "version": "2.0",
  //     "template": {
  //       "outputs": [
  //         {
  //           "carousel": {
  //             "type": "listCard",
  //             "items": [
  //               {
  //                 "header": {
  //                   "title": "12시 방향 경로"
  //                 },
  //                 "items": [
  //                   {
  //                     "title": "일연벙",
  //                     "description": "10분 후 출발 / 다음 20:40:00",
  //                   },
  //                   {
  //                     "title": "삼연벙",
  //                     "description": "운행종료 / 첫차 09:00:00",
  //                   },
  //                   {
  //                     "title": "사연벙",
  //                     "description": "운행종료 / 첫차 00:00:00",
  //                   },
  //                   {
  //                     "title": "오연벙",
  //                     "description": "운행 정보 없음",
  //                   },
  //                 ],
  //                 "buttons": [
  //                   {
  //                     "label": "더보기",
  //                     "action": "webLink",
  //                     "webLinkUrl": "https://web.kangnam.ac.kr/menu/4990be9bdd4defbf92dde49a31ad1a3b.do"
  //                   }
  //                 ]
  //               },
  //             ]
  //           }
  //         }
  //       ],
  //       "quickReplies": [
  //         {
  //           "messageText": "홈 으로",
  //           "action": "message",
  //           "label": "홈"
  //         },
  //         {
  //           "messageText": "뒤로 가기",
  //           "action": "message",
  //           "label": "↩"
  //         }
  //       ]
  //     }
  //   })
  // });
  // test("if station time == current time", async () => {
  //   const response = await agent.post('/chat')
  //     .type('application/json')
  //     .send({
  //       dev: true,
  //       method: 'neartime',
  //       time: '09:00:00',
  //       route: 'Not enough minerals',
  //     })
  //   expect(response.statusCode).toBe(200);
  //   const data = response.body
  //   expect(data).toEqual({
  //     "version": "2.0",
  //     "template": {
  //       "outputs": [
  //         {
  //           "carousel": {
  //             "type": "listCard",
  //             "items": [
  //               {
  //                 "header": {
  //                   "title": "12시 방향 경로"
  //                 },
  //                 "items": [
  //                   {
  //                     "title": "일연벙",
  //                     "description": "잠시후 출발 / 다음 09:30:00",
  //                   },
  //                   {
  //                     "title": "삼연벙",
  //                     "description": "잠시후 출발 / 첫차 09:00:00",
  //                   },
  //                   {
  //                     "title": "사연벙",
  //                     "description": "운행종료 / 첫차 00:00:00",
  //                   },
  //                   {
  //                     "title": "오연벙",
  //                     "description": "운행 정보 없음",
  //                   },
  //                 ],
  //                 "buttons": [
  //                   {
  //                     "label": "더보기",
  //                     "action": "webLink",
  //                     "webLinkUrl": "https://web.kangnam.ac.kr/menu/4990be9bdd4defbf92dde49a31ad1a3b.do"
  //                   }
  //                 ]
  //               },
  //             ]
  //           }
  //         }
  //       ],
  //       "quickReplies": [
  //         {
  //           "messageText": "홈 으로",
  //           "action": "message",
  //           "label": "홈"
  //         },
  //         {
  //           "messageText": "뒤로 가기",
  //           "action": "message",
  //           "label": "↩"
  //         }
  //       ]
  //     }
  //   })
  // });
  // test("if station time passed", async () => {
  //   const response = await agent.post('/chat')
  //     .type('application/json')
  //     .send({
  //       dev: true,
  //       method: 'neartime',
  //       time: '09:01:00',
  //       route: 'Not enough minerals',
  //     })
  //   expect(response.statusCode).toBe(200);
  //   const data = response.body
  //   expect(data).toEqual({
  //     "version": "2.0",
  //     "template": {
  //       "outputs": [
  //         {
  //           "carousel": {
  //             "type": "listCard",
  //             "items": [
  //               {
  //                 "header": {
  //                   "title": "12시 방향 경로"
  //                 },
  //                 "items": [
  //                   {
  //                     "title": "일연벙",
  //                     "description": "이번 09:30:00 / 다음 20:40:00",
  //                   },
  //                   {
  //                     "title": "삼연벙",
  //                     "description": "운행종료 / 첫차 09:00:00",
  //                   },
  //                   {
  //                     "title": "사연벙",
  //                     "description": "운행종료 / 첫차 00:00:00",
  //                   },
  //                   {
  //                     "title": "오연벙",
  //                     "description": "운행 정보 없음",
  //                   },
  //                 ],
  //                 "buttons": [
  //                   {
  //                     "label": "더보기",
  //                     "action": "webLink",
  //                     "webLinkUrl": "https://web.kangnam.ac.kr/menu/4990be9bdd4defbf92dde49a31ad1a3b.do"
  //                   }
  //                 ]
  //               },
  //             ]
  //           }
  //         }
  //       ],
  //       "quickReplies": [
  //         {
  //           "messageText": "홈 으로",
  //           "action": "message",
  //           "label": "홈"
  //         },
  //         {
  //           "messageText": "뒤로 가기",
  //           "action": "message",
  //           "label": "↩"
  //         }
  //       ]
  //     }
  //   })
  // });
  // test("if station time is O'oclock", async () => {
  //   const response = await agent.post('/chat')
  //     .type('application/json')
  //     .send({
  //       dev: true,
  //       method: 'neartime',
  //       time: '23:50:00',
  //       route: 'Not enough minerals',
  //     })
  //   expect(response.statusCode).toBe(200);
  //   const data = response.body
  //   expect(data).toEqual({
  //     "version": "2.0",
  //     "template": {
  //       "outputs": [
  //         {
  //           "carousel": {
  //             "type": "listCard",
  //             "items": [
  //               {
  //                 "header": {
  //                   "title": "12시 방향 경로"
  //                 },
  //                 "items": [
  //                   {
  //                     "title": "일연벙",
  //                     "description": "9분 후 출발 / 첫차 09:00:00",
  //                   },
  //                   {
  //                     "title": "삼연벙",
  //                     "description": "운행종료 / 첫차 09:00:00",
  //                   },
  //                   {
  //                     "title": "사연벙",
  //                     "description": "운행종료 / 첫차 00:00:00",
  //                   },
  //                   {
  //                     "title": "오연벙",
  //                     "description": "운행 정보 없음",
  //                   },
  //                 ],
  //                 "buttons": [
  //                   {
  //                     "label": "더보기",
  //                     "action": "webLink",
  //                     "webLinkUrl": "https://web.kangnam.ac.kr/menu/4990be9bdd4defbf92dde49a31ad1a3b.do"
  //                   }
  //                 ]
  //               },
  //             ]
  //           }
  //         }
  //       ],
  //       "quickReplies": [
  //         {
  //           "messageText": "홈 으로",
  //           "action": "message",
  //           "label": "홈"
  //         },
  //         {
  //           "messageText": "뒤로 가기",
  //           "action": "message",
  //           "label": "↩"
  //         }
  //       ]
  //     }
  //   })
  // });
});