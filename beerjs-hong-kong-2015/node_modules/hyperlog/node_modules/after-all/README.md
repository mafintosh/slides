# after-all

[![build status](https://secure.travis-ci.org/sorribas/after-all.png)](http://travis-ci.org/sorribas/after-all)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/after-all.svg)](https://saucelabs.com/u/after-all)

Call several asynchronous functions and invoke a callback 'after all' of them are done.

## Installation

You can install it with npm.

```
npm install after-all
```

## Simple example

```js
var afterAll = require('after-all');

var next = afterAll(function(err) {
	if (err) return console.log(err); // one of the asynchronous calls had an error
	console.log('Yay! Everything is done');
});

// The above inner function will only be called when all of these asynchronous calls are done

someAsynchronousCall1({foo:'bar'}, next());
someAsynchronousCall2({val:2}, next(function(err, res) {
	// If you want to do something with the returned value, you can pass a function
	if (err) return;
	console.log('This was returned: '+res);
}));
```

## More complex example and sample use case

Imagine you have to create a dashboard page which has a list of customers
a list products, the total amount of sales and some more information.

Now, the queries to get this information are independent, yet we tend to wait for
one to be finished to start the next. We may be able to increase the performance
by starting some of this queries at the same time and waiting for the callbacks.

We can use after-all to do something like this.

```js

app.get('/dashboard.json', function(req, res) {
  var resp = {};
  var next = afterAll(function() {
    res.end(resp);
  });

  db.findCustomers(next(function(err, docs) {
    resp.customers = docs;
  }));

  var cb = next(); // wrapping the callback is optional
  db.findProducts(function(err, docs) {
    db.findProductsSales(function(sales) {
      resp.products = docs;
      resp.productsSales = sales;
      cb();
    });
  });

  db.findTodaySalesAmount(next(function(err, amount) {
    resp.todaySales = amount;
  }));

  db.findLastMonthSalesAmount(next(function(err, amount) {
    resp.lastMonthSales = amount;
  }));
});
```

As you can see, passing a callback to the `next` function is optional and it can be
useful to not pass any when you are doing more than one sequetial async operations as
in the example above.

Also notice that all the calls to `next` must be done on the same tick.

## Error handling

If an error is passed as the first parameter to the `next` callback, the 
final callback will be called immediately and the error will be passed to
it as the first argument.

## License

MIT
