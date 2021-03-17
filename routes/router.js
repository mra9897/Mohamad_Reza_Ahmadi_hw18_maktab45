const router = require('express').Router();

const userRouter = require('./userRouter');
const viewRouter = require('./viewRouter');

router.use('/user', userRouter);
router.use('/', viewRouter);

module.exports = router;