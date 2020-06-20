const express =  require('express')
const _ = require('lodash')
const router = express.Router()
const { User } = require('../model/User')
const authenticateUser = require('../middleware/authentication')


// localhost:3000/users/register

// 

// router.post('/register' , (req,res) => {
//     const body = req.body
//     const user = new User(body)
//     user.save()
//         .then(user => {
//             res.send(_.pick(user, ['_id' , 'username', 'email']))
//         })
//         .catch(err => {
//             res.send(err)
//         })
// })

// localhost:3000/users/login
router.post('/login',function(req,res) {
    const body = req.body
    User.findByCredentials(body.email, body.password)
        .then(function(user){
            return user.generateToken()
        })
        .then(function(token){
            res.setHeader('x-auth',token).send({})
        })
        .catch(function(err){
            res.send(err)
        })
    // User.findOne({email: body.email})
    //     .then(function(user) {
    //         if(!user){
    //             res.status('404').send('Invalid Email OR Password')
    //         } 

    //         bcryptjs.compare(body.password, user.password)
    //             .then(function(result) {
    //                 if(result){
    //                     res.send(user)
    //                 }else{
    //                     res.status('404').send('Invalid Email OR Password')
    //                 }
    //             })
    //     })
    //     .catch(err => {
    //         res.send(err)
    //     })
})


// localhost:3000/users/account
router.get('/account', authenticateUser ,function(req, res){
    const {user} = req
    res.send(_.pick(user , ['_id', 'username','email']))  
})

// localhost:3000/users/logout

router.delete('/logout' , authenticateUser , function(req,res){
    const {user , token } = req
    console.log('a',user)
    User.findByIdAndUpdate(user._id , { $pull : { tokens : { token : token }}})
    .then(function(){
        res.send({notice : 'Successfully logged out'})
    })
    .catch(function(err){
        res.send(err)
    })
})

module.exports = {
    usersRouter : router
}