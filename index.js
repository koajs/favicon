
/**
 * Bounce favicon requests.
 */

module.exports = function(){
  return function(next){
    return function *(){
      if ('/favicon.ico' == this.path) this.error(404);
      yield next;
    }
  }
}