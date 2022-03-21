const express = require('express')
require('dotenv').config()
const app = express()
const axios = require('axios');
const port = 15000
const {errorResponse, carouselTemplate, 
    listTemplate, listItem, basicCardTemplate, 
    buttonItem, successResponse } = require('./lib');

const {ERROR_UNEXPECTED_METHOD} = require('./global');


app.post('/chat', (req, res) => {

    console.log('body', req.body)

    if (!req.body['method'] || !['route', 'stations', 'listCard'].includes(req.body['method'])) {
        errorResponse.template.outputs[0].simpleText.text = ERROR_UNEXPECTED_METHOD
        res.send(errorResponse)
        return
    }

    


    res.send(successResponse)
})

module.exports = app;