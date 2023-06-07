const express = require('express')
const PromptController = require('../controllers/PromptController')
const router = express.Router()

//connect OpenAI
router.post('/generate', PromptController.connectOpenAI);

module.exports = router