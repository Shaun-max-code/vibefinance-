const express = require('express');
const router = express.Router();
const researchController = require('../controllers/research_controller');

router.get('/agents', (req, res) => researchController.getAgents(req, res));
router.get('/suggestions', (req, res) => researchController.getSuggestions(req, res));
router.post('/ask', (req, res) => researchController.askAgent(req, res));
router.get('/corpus', (req, res) => researchController.getCorpus(req, res));
router.get('/search', (req, res) => researchController.searchCorpus(req, res));

module.exports = router;
