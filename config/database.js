const mongoose = require('mongoose')

const setupDB = () => {
    mongoose.connect('mongodb://localhost:27017/chinese-product',{useNewUrlParser:true, useUnifiedTopology:true})
    .then(() => {
        console.log('Connected to db')
    })
    .catch((err) => {
        console.log('error',err)
    })
}

module.exports = setupDB