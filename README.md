# Common patterns for asynchronous code, minimalistic version (async-mini)

If you only need async.series and async.parallel in the most simplest form, then this module is for you.

## Usage

	npm install async-mini.js

```js
var async = require('/Users/ypocat/Github/async-mini');

var funcs = [
	function(cb) {
		cb(null, 'done 1');
	},
	function(cb) {
		cb(null, 'done 2');
	}
];

var funcs2 = {
	one: function(cb) {
		cb(null, 'done 1');
	},
	two: function(cb) {
		cb(null, 'done 2');
	}
};

var cb = function(err, res) {
	console.log(arguments);
};

async.series(funcs, cb);

async.parallel(funcs, cb);

async.parallel(funcs2, cb);
```

The above code will print:

	{ '0': null, '1': [ 'done 1', 'done 2' ] }
	{ '0': null, '1': { '0': 'done 1', '1': 'done 2' } }
	{ '0': null, '1': { one: 'done 1', two: 'done 2' } }
