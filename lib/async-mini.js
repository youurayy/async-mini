
// Common patterns for asynchronous code, minimalistic version (async-mini)
//
// Copyright (c) 2012 Juraj Vitko <http://github.com/ypocat>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

exports.series = function(funcs, cb) {
	funcs = funcs.slice(0);
	var ress = [];

	function run(funcs, cb) {
		if(funcs.length) {
			var f = funcs.shift();
			f(function(err, res) {
				if(err)
					cb(err, ress);
				else {
					ress.push(res);
					run(funcs, cb);
				}
			});
		}
		else
			cb(null, ress);
	}

	run(funcs, cb);
};

exports.parallel = function(funcs, cb) {
	var c = typeof(funcs) === 'object' ? 
		Object.keys(funcs).length : funcs.length;
	var errs = {};
	var has_errs = false;
	var ress = {};
	if(!c)
		cb(null, ress);
	for(var k in funcs) {
		(function() {
			var f = funcs[k];
			var id = k;
			process.nextTick(function() {
				f(function(err, res) {
					if(err) {
						errs[id] = err;
						has_errs = true;
					}
					if(res)
						ress[id] = res;
					c--;
					if(c == 0)
						cb(has_errs ? errs : null, ress);
				});
			});
		})();
	}
};
