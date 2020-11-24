const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || '';
var bodyParser = require('body-parser')


async function database() { 
    // Set up Mongoose and connect to DB
    mongoose.set('useFindAndModify', false);

    if (dbUser && dbPassword && dbName) {
        try {
            const db = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.010pa.mongodb.net/${dbName}?retryWrites=true&w=majority`)
        } catch (e) { 
            console.log(e)
        }
    }
}


async function createApp() { 
    // init express server
    const app = express();

    app.use(bodyParser.json());

    // connect to db
    await database()

    app.get('/', (req, res) => {
        res.send('Hello world');
    });

    // REST for Product: GET, POST, PUT, DELETE
    app.get('/products/:productId', async(req, res) => {
        const product = await Product.findById(req.params.productId).exec();

        res.json(product);
    });

    app.post('/products', (req, res) => {
        const product = new Product();
        const {title, price} = req.body;

        product.title = title;
        product.price = price;

        product.save((err, document) => {
            res.json(document);
        })
    });

    app.put('/products/:productId', async(req, res) => {
        const product = await Product.findById(req.params.productId).exec();
        const {title, price} = req.body;

        if (!product) {
            res.status(404);
            res.end()
        }else {
            product.title = title;
            product.price = price;

            product.save((err, document) => {
                res.json(document);
            })
        }
    });

    // TODO: Finish this one
    app.delete('/products/:productId', async(req, res) => {
        const product = await Product.findById(req.params.productId).exec();

        res.json(product);
    });

    // TODO: add product/list


    return app
}






module.exports = createApp;
