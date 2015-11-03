'use strict';

const request = require('supertest');
const join = require('path').join;
const favicon = require('..');
const Koa = require('koa');
const fs = require('fs');

describe('favicon()', function(){
  const path = join(__dirname, 'fixtures', 'favicon.ico');

  it('should only respond on /favicon.ico', function(done){
    const app = new Koa();

    app.use(favicon(path));

    app.use((ctx, next) => {
      (ctx.body == null).should.be.true;
      (ctx.get('Content-Type') == '').should.be.true;
      ctx.body = 'hello';
    });

    request(app.listen())
    .get('/')
    .expect('hello', done);
  });

  it('should 404 if `path` is missing', function(done){
    const app = new Koa();
    app.use(favicon());
    request(app.listen())
    .post('/favicon.ico')
    .expect(404, done);
  });

  it('should not accept POST requests', function(done){
    const app = new Koa();
    app.use(favicon(path));

    request(app.listen())
    .post('/favicon.ico')
    .expect('Allow', 'GET, HEAD, OPTIONS')
    .expect(405, done);
  });

  it('should send the favicon', function(done){
    const body = fs.readFileSync(path);

    const app = new Koa();
    app.use(favicon(path));

    request(app.listen())
    .get('/favicon.ico')
    .expect('Content-Type', 'image/x-icon')
    .expect(200, body, done);
  });

  it('should set cache-control headers', function(done){
    const app = new Koa();
    app.use(favicon(path));
    request(app.listen())
    .get('/favicon.ico')
    .expect('Cache-Control', 'public, max-age=86400')
    .expect(200, done);
  });

  describe('options.maxAge', function(){
    it('should set max-age', function(done){
      const app = new Koa();
      app.use(favicon(path, { maxAge: 5000 }));
      request(app.listen())
      .get('/favicon.ico')
      .expect('Cache-Control', 'public, max-age=5')
      .expect(200, done);
    });

    it('should accept 0', function(done){
      const app = new Koa();
      app.use(favicon(path, { maxAge: 0 }));
      request(app.listen())
      .get('/favicon.ico')
      .expect('Cache-Control', 'public, max-age=0')
      .expect(200, done);
    });

    it('should be valid delta-seconds', function(done){
      const app = new Koa();
      app.use(favicon(path, { maxAge: 1234 }));
      request(app.listen())
      .get('/favicon.ico')
      .expect('Cache-Control', 'public, max-age=1')
      .expect(200, done);
    });

    it('should floor at 0', function(done){
      const app = new Koa();
      app.use(favicon(path, { maxAge: -4000 }));
      request(app.listen())
      .get('/favicon.ico')
      .expect('Cache-Control', 'public, max-age=0')
      .expect(200, done);
    });

    it('should ceil at 31556926', function(done){
      const app = new Koa();
      app.use(favicon(path, { maxAge: 900000000000 }));
      request(app.listen())
      .get('/favicon.ico')
      .expect('Cache-Control', 'public, max-age=31556926')
      .expect(200, done);
    });

    it('should accept Infinity', function(done){
      const app = new Koa();
      app.use(favicon(path, { maxAge: Infinity }));
      request(app.listen())
      .get('/favicon.ico')
      .expect('Cache-Control', 'public, max-age=31556926')
      .expect(200, done);
    });
  })
})
