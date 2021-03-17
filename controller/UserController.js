const bcrypt = require('bcrypt');

const User = require('../models/User');

exports.create = (req, res) => new User(req.body).save(err => {
    if (err) return res.status(500).json({error: err.message});
    res.json({result: true});
});
exports.login = (req, res) => User.findOne({username: req.body.username}, (err, user) => {
    if (err) {
        console.log(err.message);
        return res.status(500).json({error: "server error -_-"});
    }
    if (!user) return res.json({error: "User Not Found x-x"});

    bcrypt.compare(req.body.password, user.password, (error, isMatch) => {
        if (err) {
            console.log(error.message);
            return res.status(500).json({error: "server error -_-"});
        }
        if (!isMatch) return res.json({error: "User Not Found x-x"});

        req.session.user = user;
        res.json({result: true});
    });
});
exports.logout = (req, res) => {
    req.session.destroy();
    res.json({result: true});
}
exports.update = (req, res) => User.findOneAndUpdate({_id: req.session.user._id}, req.body, {
    new: true,
    rawResult: true
}, (err, update) => {
    if (err) {
        console.log(err.message);
        return res.status(500).json({error: "Server Error"});
    }
    console.log(update);
    if (update.ok) {
        req.session.user = update.value;
        return res.json({result: true});
    }
    res.json({result: false});
})
exports.password = (req, res) => {
    bcrypt.compare(req.body.oldPassword, req.session.user.password, (err, isMatch) => {
        if (err) return res.status(500).json({error: "Server Error"});
        if (!isMatch) return res.json({error: "current password is not match with user password"});
        User.findOneAndUpdate({_id: req.session.user._id}, {password: req.body.newPassword}, {
            new: true,
            upsert: true,
            rawResult: true
        }, (err, update) => {
            console.log(update);
            if (err) {
                console.log(err);
                return res.status(500).json({error: "Server Error"});
            }
            if (update.ok) {
                update.value.save();
                req.session.destroy();
                return res.json({result: true});
            }
        });
    });
}
exports.delete = (req,res) => {
    User.deleteOne({_id: req.session.user._id}, (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json({error: "Server Error"});
        }
        if(!result.deletedCount)
            return res.status(404).json({error: "You are not exist my friend"});
        req.session.destroy();
        res.json({result: true});
    })
}