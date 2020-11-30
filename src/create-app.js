const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || '';
const bodyParser = require('body-parser')

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

    // get products list
    app.get('/products/list', async (req, res) => {
        const products = await Product.find({}).exec();

        res.json(products)
    })

    // get product by ID
    app.get('/products/:productId', async(req, res) => {
        const product = await Product.findById(req.params.productId).exec();

        res.json(product);
    });

    // create new product
    app.post('/products', (req, res) => {
        const product = new Product();
        const {title, price} = req.body;

        product.title = title;
        product.price = price;

        product.save((err, document) => {
            res.json(document);
        })
    });

    // update existing product
    app.put('/products/:productId', async(req, res) => {
        const product = await Product.findById(req.params.productId).exec();
        const {title, price} = req.body;

        if (!product) {
            res.status(404);
            res.end()
        }
        else {
            product.title = title;
            product.price = price;

            product.save((err, document) => {
                res.json(document);
            })
        }
    });

    // delete a product
    app.delete('/products/:productId', async(req, res) => {
        Product.deleteOne({
            _id: req.params.productId
        }, err => {
            if ( err ) {
                res.status(500);
                res.end()
            }
            else {
                res.json();
            }
        })
    });

    return app
}

module.exports = createApp;
