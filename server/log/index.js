var Log = require('./log');
var l = new Log();

module.exports = l.log;

for(var k in l) {
	if(typeof l[k] === 'function') {
		module.exports[k] = l[k].bind(l);
	}
}
