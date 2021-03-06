const request = require('supertest');
const mongoose = require('mongoose');
const MockMongoose = require('mock-mongoose').MockMongoose;
const createApp = require('../create-app');

const mockMongoose = new MockMongoose(mongoose);

let app;

beforeAll(function (done) {
    // await mockMongoose.prepareStorage();
    // await mongoose.connect('mongodb://example.com/TestingDB');
    // app = await createApp();
    //
    // done();

  mockMongoose.prepareStorage().then(function() {
    mongoose.connect('mongodb://example.com/TestingDB', async function(err) {
      app = await createApp();

      done(err);
    });
  });
});

afterAll(async function (done) {
    await mongoose.connection.close()

    done();
})

describe('GET /', function () {
    it('returns a "Hello world" string', async function (done) {
        const res = await request(app)
            .get('/')
            .expect(200);

        expect(res.text).toEqual("Hello world");

        done();
    });
});


describe('Products Endpoint', function () {
    let product;

    it('create a product',function (done) {
      request(app)
        .post('/products')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .send({title: 'test', price: '100'})
        .expect(200)
        .then(function (res) {
            product = res.body;

            expect(product).toHaveProperty("title", "test")
            expect(product).toHaveProperty("price", 100)
            done();
        });
    });

    it('returns product list', function (done) {
      request(app)
        .get('/products/list')
        .expect(200)
        .then(function (res) {
          const products = res.body;

          expect(products.length).toBe(1)
          expect(products[0]).toEqual(product)
          done();
        });
    });

    it('return the product', function (done) {
        request(app)
            .get('/products/' + product._id)
            .expect(200)
            .then(function (res) {
                expect(res.body).toEqual(product);
                done();
            });
    });

    it('update the product', function (done) {
      request(app)
        .put('/products/' + product._id)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .send({title: 'updated title', price: '200'})
        .expect(200)
        .then(function (res) {
          product = res.body;

          expect(product).toHaveProperty("title", "updated title")
          expect(product).toHaveProperty("price", 200)
          done();
        });
    });

    it('delete the product', function (done) {
      request(app)
        .delete('/products/' + product._id)
        .expect(200)
        .then(function (res) {
          expect(res.body).toBe('');

          done();
        });
    });
});
