high performance javascript

----

... or how to write you own
    query language interpreter :)

----

in javascript!

----

@mafintosh

----

what is performance?

----

given a program - make it run faster

----

how do we messure performance?

----

function sum (nums) {
  var result = 0
  for (var i = 0; i < nums.length; i++) {
    result += nums[i]
  }
  console.log(result)
}

----

function sum (nums) {
  var result = 0, len = nums.length
  for (var i = 0; i < len; i++) {
    result += nums[i]
  }
  console.log(result)
}

----

write a benchmark

----

function sum (nums) {
  var result = 0, len = nums.length
  for (var i = 0; i < nums.length; i++) {
    result += nums[i]
  }
  return result
}

var nums = []
for (var i = 0; i < 1000; i++) nums.push(i)

var then = Date.now()
for (var i = 0; i < 1000; i++) sum(nums)

console.log('adding 1.000.000 numbers took ' + (Date.now() - then) + 'ms')

----

:(

----

so how can we write fast javascript?

----

real world example:
lets create a JSON query language interpreter.

----

examples:

mongodb query language:

{
  foo: {
    $gt: 42,
    $lt: 100
  }
}

----

json schema:

{
  type: 'object',
  properties: {
    aProperty: {
      type: 'string'
    }
  }
}

----

our language:

{
  $eq: value,
  $gt: value,
  $lt: value,
  $not: (negate this expression)
}

----

goal: our intepreter should be as fast as possible

----

(coding time)

----

thanks!