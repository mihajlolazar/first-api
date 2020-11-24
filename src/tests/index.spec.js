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
    it('creates a new product', async function (done) {
        const res = await request(app)
            .get('/')
            .expect(200);
        
        expect(res.text).toEqual("Hello world");

    });
});

 

