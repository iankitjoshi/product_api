const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username : { 
        type : String,
        required : true,
        unique : true ,
        minlength : 5
    },
    email : {
        type : String,
        required: true,
        unique : true,
        validate : {
            validator : function(value){
                return validator.isEmail(value)
            },
            message : function(){
                return 'Invalid Email Format'
            }
        }
        // Check the format of the email -- npm install --save validator
    },
    password : {
        type : String,
        required : true,
        unique : true,
        minlength : 6,
        maxlength : 100
    },
    tokens : [
        {
            token: {
                type : String
            },
            createdAt: {
                type : Date,
                default : Date.now
            }
        }
    ]
})

// Pre hooks -Model Middleware //

userSchema.pre('save',function(next){
    const user = this   /// the value of this user is from controller user 
    if(user.isNew){
        bcryptjs.genSalt(10)
        .then(function(salt){
            bcryptjs.hash(user.password,salt)
                .then(function(encryptPassword){
                    user.password = encryptPassword
                    next()
                })
        })
    } else {
        next()
    }  
})


// Own instance Method
userSchema.methods.generateToken = function(){
    const user = this
    const tokenData = {
        _id: user._id,
        username : user.username,
        createdAt : Number(new Date())
    }
    const token = jwt.sign(tokenData, 'jwt@123')
    user.tokens.push({
        token
})

return user.save()
    .then(function(user){
        return Promise.resolve(token)
    })
    .catch(function(err){
        return Promise.reject(err)
    })
}

//Own static Method
userSchema.statics.findByCredentials = function(email, password){
    const User = this
    return User.findOne({email})
        .then(function(user){   
            if(!user){
                return Promise.reject('Invalid Email OR Password')
            }

            return bcryptjs.compare(password , user.password)
                .then(function(result){
                    if(result){
                        return Promise.resolve(user)
                    } else {
                        return Promise.reject('Invalid Email OR Password')
                    }
                })
        })
        .catch(function(err){
            return Promise.reject(err)
        })
}


userSchema.statics.findByToken = function(token){
    const User = this
    let tokenData
    try{
        tokenData = jwt.verify(token, 'jwt@123')
    }catch(err){
        return Promise.reject(err)
    }

    return User.findOne({
        _id: tokenData._id,
        'tokens.token' : token
    })
}


const User = mongoose.model('User',userSchema)

module.exports ={ User}