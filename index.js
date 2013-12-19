
/**
 * Bounce favicon requests.
 */

module.exports = function(){
  return function *(next){
    if ('/favicon.ico' == this.path) this.throw(404);
    yield next;
  }
}
