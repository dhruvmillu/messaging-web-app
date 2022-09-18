const mongoose = require('mongoose')

const User = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    dob: {type: Date, required: true},
    password: {type: String, required: true},
    profile: {type: String},
    friends:[
        {
            profile:{type: String},
            username:{type: String},
            count:{type:Number,default:0},
            chat:[
                {id : {type:String},
                type:{type:String},
                message:{type:Object},
                date:{type:Date,default:Date.now}
            }
            ]
        }
    ],
    groups:[
        {
            profile:{type:String},
            groupName:{type:String}
        }
    ],
    requests:[
        {
            profile:{type:String},
            username:{type:String}
        }
    ],
    bookmarks:[
        {
            type:{type:String},
            value: {type:Object}
        }
    ]
},
{collection: 'user-profile'}
)

const model = mongoose.model('UserData',User)

module.exports = model