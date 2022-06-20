const test_equality = require('./test_equality.js');
const test_formula = require('./test_formula.js');
const test_modelfinder = require('./test_modelfinder.js');
const test_parser = require('./test_parser.js');
const test_prover = require('./test_prover.js');
const test_sentree = require('./test_sentree.js');
const { assertResults, resetAsserts } = require('./assert.js');

function run(group, tests) {
    console.log(`${group}:`)
    for (let k in tests) {
	console.log(`\t${k}:`);
	tests[k]();
	// print assertion results
	for (let r of assertResults)
	    console.log(`\t\t${r}`);
	resetAsserts();
    }
}

run('Equality', test_equality);
run('Formula', test_formula);
run('Modelfinder', test_modelfinder);
run('Parser', test_parser);
run('Prover', test_prover);
run('Sentree', test_sentree);
