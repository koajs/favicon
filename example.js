
var koa = require('koa');
var favicon = require('./');

var app = koa();

app.use(favicon());

app.use(function(next){
  return function *(){
    yield next;
    this.body = 'Hello World';
  }
});

app.listen(3000);