const request = require('supertest');
var mongoose = require('mongoose');
var MockMongoose = require('mock-mongoose').MockMongoose;
const createApp = require('../create-app');

const mockMongoose = new MockMongoose(mongoose);

// jest.setTimeout(5000);


let app;

beforeAll(async function (done) {
    await mockMongoose.prepareStorage();
    await mongoose.connect('mongodb://example.com/TestingDB');
    app = await createApp();
    done()
});

afterAll(async function (done) { 
    await mongoose.connection.close()
    done()
})

describe('GET /', function () {
    it('creates a new product', async function () {
        const res = await request(app)
            .get('/')
            .expect(200);
        
        expect(res.text).toEqual("Hello world");

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

    it('return the product', function (done) {
        request(app)
            .get('/products/' + product._id)
            .expect(200)
            .then(function (res) {
                expect(res.body).toEqual(product);
                done();
            });
    });
});