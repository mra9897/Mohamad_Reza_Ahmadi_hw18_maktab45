const router = require('express').Router();

const {accessControl, loginChecker} = require('../tools/generalTools');

router.get('/', loginChecker, (req,res)=>{
    res.render('index')
});
router.get('/login', loginChecker, (req,res)=>{
    res.render('login');
});
router.get('/dashboard', accessControl, (req,res)=>{
    console.log(req.session.user);
    res.render('dashboard', {user: req.session.user});
});

module.exports = router;