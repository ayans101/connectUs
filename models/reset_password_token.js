const mongoose = require('mongoose');

const resetPasswordTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accessToken: {
        type: String
    },
    isValid: {
        type: Boolean
    }
},{
    timestamps: true
});

const resetPasswordToken = mongoose.model('ResetPasswordToken', resetPasswordTokenSchema);

module.exports = resetPasswordToken;