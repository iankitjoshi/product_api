const express = require('express')
const setupDB = require('./config/database')
const { usersRouter } = require('./app/controller/UserController')
const router = require('./config/routes')
const app = express()

const port = process.env.PORT || 3010


app.use(express.json())

setupDB()


app.get('/',(req,res) => {
    res.json('Welcome')
})

app.use('/user', usersRouter)
app.use('/',router)


app.listen(port,() => {
    console.log('Listening on Port',port)
})