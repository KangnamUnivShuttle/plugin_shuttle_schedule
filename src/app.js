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
})

module.exports = app;