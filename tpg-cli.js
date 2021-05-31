const Parser = require('./parser.js');
const { Prover, Node } = require('./prover.js');
const SenTree = require('./sentree.js');
const XmlPainter = require('./xmlpainter.js');

function renderSymbols(str) {
    str = str.replace(/&|\^| and/ig, '∧');
    str = str.replace(/ v | or/ig, ' ∨ '); // 'v' letter => or symbol
    str = str.replace(/~| not/ig, '¬');
    str = str.replace(/<->| iff/ig, '↔');
    str = str.replace(/->/g, '→');
    str = str.replace(/\[\]/g, '□');
    str = str.replace(/<>|◊/g, '◇');
    str = str.replace(/\(A([s-z])\)/, '∀$1'); // (Ax) => ∀x
    str = str.replace(/\(E([s-z])\)/, '∃$1'); // (Ex) => ∃x
    str = str.replace(/(?:^|\W)\(([s-z])\)/, '∀$1'); // (x) => ∀x, but not f(x) => f∀x
    str = str.replace(/\\?forall[\{ ]?\}?/g, '∀');
    str = str.replace(/\\?exists[\{ ]?\}?/g, '∃');
    str = str.replace(/(\\neg|\\lnot)[\{ ]?\}?/g, '¬');
    str = str.replace(/(\\vee|\\lor)[\{ ]?\}?/g, '∨');
    str = str.replace(/(\\wedge|\\land)[\{ ]?\}?/g, '∧');
    str = str.replace(/(\\to|\\rightarrow)[\{ ]?\}?/g, '→');
    str = str.replace(/\\leftrightarrow[\{ ]?\}?/g, '↔');
    str = str.replace(/\\[Bb]ox[\{ ]?\}?/g, '□');
    str = str.replace(/\\[Dd]iamond[\{ ]?\}?/g, '◇');
    return str;
}

function translateAccessibility(constraints) {
    return constraints.map(c => {
	if (c == 'u') return "universality"; // { id: "universality", value: "∀v∀uRvu" };
	if (c == 'r') return "reflexivity";  // { id: "reflexivity",  value: "∀vRvv" };
	if (c == 'm') return "symmetry";     // { id: "symmetry",     value: "∀v∀u(Rvu→Ruv)" };
	if (c == 't') return "transitivity"; // { id: "transitivity", value: "∀v∀u∀t(Rvu→(Rut→Rvt))" };
	if (c == 'e') return "euclidity";    // { id: "euclidity",    value: "∀v∀u∀t(Rvu→(Rvt→Rut))" };
	if (c == 's') return "seriality";    // { id: "seriality",    value:"∀v∃uRvu" };
    });
}

var prover = null;
var painter = null;
function startProof(input, constraints) {
    var parser = new Parser();
    try {
	var parsedInput = parser.parseInput(input);
	var premises = parsedInput[0];
	var conclusion = parsedInput[1];
	var initFormulas = premises.concat([conclusion.negate()]);
    }
    catch (e) {
	console.error(e);
	return false;
    }
    // Now a free-variable tableau is created. When the proof is finished,
    // prover.finished() is called.
    var accessibilityConstraints = [];
    if (parser.isModal) {
	// do the accessibility constraints
	accessibilityConstraints = translateAccessibility(constraints);
    }
    prover = new Prover(initFormulas, parser, accessibilityConstraints);
    prover.onfinished = function(treeClosed) {
	let status, proof;
	// The prover has finished. Show result:
	if (treeClosed) {
	    status = "Theorem";
	    const sentree = new SenTree(this.tree, parser);
	    if (parser.isModal)
		sentree.modalize();
	    
	    const painter = new XmlPainter(sentree);
	    proof = painter.paintTree();
	    process.exitCode = 0;
	}
	else {
	    status = "Non-Theorem"
	    for(let k in this.countermodel) { console.log(k); }
	    proof = this.counterModel.toXML();
	    process.exitCode = 1
	}
	// output result and proof
	console.log(`STATUS: ${status}`);
	console.log('PROOF START');
	console.log(proof);
	console.log('PROOF END');
    }
    prover.status = function(txt) {
	// console.error(`[INFO] Status: ${txt}`);
    }
    prover.start();
    return false;
}

function parseArgs(argv) {
    const help = `
Usage: ${argv[0]} ${argv[1]} FORMULA [ACCESSIBILITY]

For FORMULA syntax see https://www.umsu.de/trees/, its the same as if you'd put it there.

ACCESSIBILITY is a string of the following characters and their meanings:
\tu\t universal (S5)
\tr\t reflexive
\tm\t symmetric
\tt\t transitive
\te\t euclidean
\ts\t serial

These correspond to checkboxes in https://www.umsu.de/trees/. E.g. use 'rmt' if you want accessibility to be reflexive, symmetric and transitive, order does not matter, 'mrt' will have the same effect.

ACCESSIBILITY parameter is optional.

For more information about proof process and parameter semantics see https://www.umsu.de/trees/.
`;

    // remove node and filename
    argv.shift()
    argv.shift()

    // help prints
    if (argv.length === 0 || argv[0] === '-h' || argv[0] === '--help') {
	console.error(help);
	process.exitCode = 2;
	return { formula: undefined, accessibility: undefined };
    }
    else if (argv.length === 1) { // only formula passed
	return { formula: argv[0], accessibility: [] };
    }
    else { // two or more params passed
	return { formula: argv[0], accessibility: argv[1].split("") };
    }
}

// random value to know what happens
process.exitCode = 10;
const { formula, accessibility } = parseArgs(process.argv);
if (formula !== undefined) {
    try {
	startProof(formula, accessibility);
    }
    catch (e) {
	console.error(e);
	process.exitCode = 2;
    }
}
