const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const defaultSetting = {
    type: String,
    required: true,
    trim: true
};

const UserSchema = new schema({
    name: {
        ...defaultSetting,
        minlength: 3,
    },
    gender: defaultSetting,
    email: {
        ...defaultSetting,
        minlength: 7
    },
    username: {
        ...defaultSetting,
        unique: true,
        minlength: 4,
    },
    password: {
        ...defaultSetting,
        minlength: 8,
        maxlength: 32
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            return next();
        });
    });
});

module.exports = mongoose.model('User', UserSchema);