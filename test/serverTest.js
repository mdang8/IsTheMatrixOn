const server = require('../src/server/index');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
chai.use(chaiHttp);

/* eslint-disable prefer-arrow-callback, no-unused-expressions */
describe('Test Server', function () {
  it('requests the home page', function (done) {
    chai.request(server)
      .get('/')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });
});

describe('Test Shows API', function () {
  it('requests all of the shows', function (done) {
    chai.request(server)
      .get('/api/v1/shows')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  });

  it('requests a single show', function (done) {
    chai.request(server)
      .get('/api/v1/shows/search?show=Dateline')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  });

  it('requests the channel shows', function (done) {
    chai.request(server)
      .get('/api/v1/shows/channel-shows')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });

  it('requests the show names', function (done) {
    chai.request(server)
      .get('/api/v1/shows/show-names')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  });

  it('creates a new show', function (done) {
    const newShow = [{
      name: 'Test_Show',
      channel: 'Test_Channel',
      startTime: new Date('May 30, 2018 12:00:00'),
      endTime: new Date('May 30, 2018 01:00:00'),
    }];

    chai.request(server)
      .post('/api/v1/shows')
      .send(newShow)
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('ops');
        res.body.ops.length.should.equal(1);
        res.body.ops[0].should.have.property('name');
        res.body.ops[0].should.have.property('channel');
        res.body.ops[0].should.have.property('startTime');
        res.body.ops[0].should.have.property('endTime');
        res.body.ops[0].should.have.property('_id');
        done();
      });
  });

  it('updates all old current shows', function (done) {
    chai.request(server)
      .put('/api/v1/shows')
      .send({})
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });

  it('deletes all shows of a channel', function (done) {
    chai.request(server)
      .delete('/api/v1/shows')
      .send({ channel: 'Test_Channel' })
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });
});

describe('Test Users API', function () {
  it('requests all of the users', function (done) {
    chai.request(server)
      .get('/api/v1/users')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.string;
        done();
      });
  });
});
