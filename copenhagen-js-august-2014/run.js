var add = function(n) {
  var a = eval('(function(n) { return '+n+'+n })')
  return a
}

var fn = add('console.log("LOL")')

console.log(fn(10))