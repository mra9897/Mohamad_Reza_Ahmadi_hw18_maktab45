const router = require('express').Router();

const validator = require('../controller/Validation');
const {accessControl} = require('../tools/generalTools');
const UserController = require('../controller/UserController');

router.post('/create', validator.userValidationRules(), validator.validate, UserController.create);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);
router.put('/update-me', accessControl, validator.updateValidationRules(), validator.validate, UserController.update);
router.patch('/update-password', accessControl, validator.updatePasswordValidation(), validator.validate, UserController.password);
router.delete('/delete', UserController.delete);

module.exports = router;