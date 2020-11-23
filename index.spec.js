const request = require('supertest');
const app = require('./create-app');

describe('GET /', function () {
    it('responds with hello world', function (done) {
        request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
                expect(res.text).toEqual("Hello world ");
                if (err) throw err;
                done();
            });
    });
});
