var test = require('tape');
var afterAll = require('../index');

test('should call the callback "after all" the functions are done', function(t) {
  var a,b,c,d;
  var next = afterAll(function() {
    t.equal(a, 2);
    t.equal(b, 4);
    t.equal(c, 6);
    t.equal(d, 8);
    t.end();
  });

  setTimeout(next(function() {
    a = 2;
  }, 400));

  setTimeout(next(function() {
    b = 4;
  }, 100));

  setTimeout(next(function() {
    c = 6;
  }, 300));

  setTimeout(next(function() {
    d = 8;
  }, 200));
});

test('should work with non-asynchronous functions', function(t) {
  var a,b,c,d;
  var next = afterAll(function() {
    t.equal(a, 2);
    t.equal(b, 4);
    t.equal(c, 6);
    t.equal(d, 8);
    t.end();
  });

  (next(function() { a = 2; }))();

  setTimeout(next(function() {
    b = 4;
  }, 100));

  setTimeout(next(function() {
    c = 6;
  }, 300));

  setTimeout(next(function() {
    d = 8;
  }, 200));
});

test('should pass the arguments to the original callbacks', function(t) {
  var next = afterAll(function() {
    t.end();
  });

  (next(function(a) { t.equal(a, 2)}))(2);
  (next(function(b) { t.equal(b, 'hi')}))('hi');
});

test('should work if the callback is not passed', function(t) {
  var next = afterAll(function() {
    t.end();
  });

  setTimeout(next(), 300);
});

test('should throw an error if the "next" function is called after the final callback is called', function(t) {
  var next = afterAll(function() {});
  next()();

  process.nextTick(function() {
    try {
      next();
    } catch(e) {
      t.end();
    }
  });
});

test('should call the callback if the "next" function is never called in the same tick', function(t) {
  var next = afterAll(t.end.bind(t));
  process.nextTick(function() {});
});

test('should catch errors and pass it to the final callback', function(t) {
  var next = afterAll(function(err) {
    t.ok(err);
    t.end();
  });

  var n1 = next();
  var n2 = next();

  setTimeout(function() {
    n1(new Error('Some error'));
  }, 100);
  setTimeout(n2, 500);
});

test('should only call the final callback once in the case of an error', function(t) {
  var count = 0;
  var next = afterAll(function(err) {
    t.equal(err.message, 'Oops!');
    t.equal(++count, 1);
    t.end();
  });

  var n1 = next();
  var n2 = next();
  var n3 = next();

  n1();
  n2(new Error('Oops!'));
  n3(new Error('Oops! 2'));

});

test('should call all the callbacks even in case of error', function(t) {
  var count = 0;
  var next = afterAll(function() {
    t.equal(count, 3);
    t.end();
  });
  
  var countup = function() {
    count++;
  };

  var n1 = next(countup);
  var n2 = next(countup);
  var n3 = next(countup);

  n1();
  n2(new Error('Oops!'));
  n3(new Error('Oops!'));

});


test('should not require the final callback', function(t) {
  var next = afterAll();

  var n1 = next();
  var n2 = next();
  var n3 = next();

  n1();
  n2();
  n3();

  setTimeout(function() {
    t.end();
  }, 250);

});
