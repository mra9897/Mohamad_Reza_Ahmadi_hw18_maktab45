const {check, body, validationResult} = require('express-validator');

exports.userValidationRules = () => [
    check('name', "Name must have more than 3 character")
        .isLength({min: 3}).notEmpty().trim().escape(),
    check('email')
        .notEmpty().isEmail().normalizeEmail().trim().escape(),
    check('username', 'user name must have more than 3 character')
        .notEmpty().isLength({min: 4}).trim().escape(),
    check('password', 'password must have more than 5 character')
        .notEmpty().isLength({min: 4}).trim().escape()
];
exports.updateValidationRules = () => [
    check('name', "Name must have more than 3 character")
        .isLength({min: 3}).notEmpty().trim().escape().optional(),
    check('email')
        .notEmpty().isEmail().normalizeEmail().trim().escape().optional(),
    check('username', 'user name must have more than 3 character')
        .notEmpty().isLength({min: 4}).trim().escape().optional(),
    check('password', 'password must have more than 5 character')
        .notEmpty().isLength({min: 4}).trim().escape().optional()
];
exports.updatePasswordValidation = () => [
    check('newPassword').custom((val, {req}) => {
        if (val !== req.body.reNewPassword)
            throw new Error("Password confirmation does not match password");
        return true;
    }),
    check('newPassword', 'password must have more than 7 character')
        .notEmpty().isLength({min: 8}).trim().escape().optional()
]
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push(`${err.param}: ${err.msg}`));
    return res.status(422).json({
        errors: extractedErrors
    });
}