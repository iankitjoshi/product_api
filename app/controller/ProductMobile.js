const Product = require('../model/products')

module.exports.list = (req,res) => {
    Product.find()
    .then((product) => {
        res.json(product)
    })
    .catch((err) => {
        res.json(err)
    })
}

module.exports.create = (req,res) => {
    const body = req.body
    const products =  new Product(body)
    products.save()
    .then((product) => {
        res.json(product)
    })
    .catch((err) => {
        res.json(err)
    })
}

module.exports.update = (req,res) => {
    const body = req.body
    const id = req.params.id
    Product.findByIdAndUpdate(id,body , {new : true , runValidators : true})
    .then((product) => {
        res.json(product)
    })
    .catch((err) => {
        res.json(err)
    })
}

module.exports.show = (req,res) => {
    const id = req.params.id
    Product.findById(id)
    .then((product) => {
        res.json(product)
    })
    .catch((err) => {
        res.json(err)
    })
}

module.exports.destroy = (req,res) => {
    const id = req.params.id
    Product.findByIdAndDelete(id)
    .then((product) => {
        res.json(product)
    })
    .catch((err) => {
        res.json(err)
    })
}