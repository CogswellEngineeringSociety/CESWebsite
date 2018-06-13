//Move this to util later and fix rest of stuff to use this.
var object = {
    key: function(n) {
      return this[ Object.keys(this)[n] ];
    }
  };
  
  function key(obj, idx) {
    return object.key.call(obj, idx);
  }

  export default key;