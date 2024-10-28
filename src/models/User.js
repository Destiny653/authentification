const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        unique:true
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

module.exports = mongoose.model('User', userSchema);