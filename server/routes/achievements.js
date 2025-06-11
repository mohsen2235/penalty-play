const express = require('express');
const { jwtMiddleware } = require('../auth');
const { getAchievementsForUser } = require('../models/achievement');
const router = express.Router();
router.use(jwtMiddleware);
router.get('/', async (req, res) => { res.json(await getAchievementsForUser(req.user.telegram_id)); });
module.exports = router;
