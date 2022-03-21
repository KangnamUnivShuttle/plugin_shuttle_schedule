const errorResponse = {
    "version": "2.0",
    "template": {
        "outputs": [
            {
                "simpleText": {
                    "text": ""
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
}

const carouselTemplate = {
    "carousel": {
        "type": "", //listCard or basicCard
        "items": []
    }
}

const listTemplate = {
    "header": {
        "title": ""
    },
    "items": [
    ],
    "buttons": [
        {
            "label": "더보기",
            "action": "webLink",
            "webLinkUrl": "https://web.kangnam.ac.kr/menu/4990be9bdd4defbf92dde49a31ad1a3b.do"
        }
    ]
}

const listItem = {
    "title": "",
    "description": "",
}

const basicCardTemplate = {
    "title": "",
    "description": "",
    "thumbnail": {
        "imageUrl": ""
    },
    "buttons": []
}

const buttonItem = {
    "action": "message",
    "label": "",
    "messageText": ""
}

const successResponse = {
    "version": "2.0",
    "template": {
        "outputs": [
            {
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
}

module.exports = {
    errorResponse, carouselTemplate, 
    listTemplate, listItem, basicCardTemplate, 
    buttonItem, successResponse
}