const test_equality = require('./test_equality.js');
const test_formula = require('./test_formula.js');
const test_modelfinder = require('./test_modelfinder.js');
const test_parser = require('./test_parser.js');
const test_prover = require('./test_prover.js');
const test_sentree = require('./test_sentree.js');

let logLevel = 1;

function log(level, msg) {
    if (level <= logLevel)
	console.log(msg);
}

function run(group, tests) {
    let failureOccured = false;
    let passedCount = 0;
    log(0, `${group}${logLevel > 0 ? ':' : ''}`);
    for (let k in tests) {
	let testResult = `\t${k}: `;
	try {
	    tests[k]();
	    testResult += 'PASS';
	    passedCount += 1;
	} catch (failure) {
	    testResult += failure;
	    failureOccured = true;
	}
	log(1, testResult);
    }
    log(0, `Passed ${passedCount}/${Object.keys(tests).length}`);
    console.log('--------------------');
}

if (process.argv.length > 2)
    logLevel = Number(process.argv[2]);

const failureOccured =
      run('Equality', test_equality) ||
      run('Formula', test_formula) ||
      run('Modelfinder', test_modelfinder) ||
      run('Parser', test_parser) ||
      run('Prover', test_prover) ||
      run('Sentree', test_sentree);

console.log(
    `====================
  Tests ${failureOccured ? 'failed' : 'successful'}
====================`);
