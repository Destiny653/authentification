const mongoose = require('mongoose');
const {Schema} = mongoose;

const userOTPSchema = new Schema({
    code:{
        type: String,
        required: true
    },
    expired_at:{
        type: Date,
        required: true
    },
    id_user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    create_at:{
        type: Date,
        require:false,
        default: Date.now
    }
},{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('UserOTP', userOTPSchema);