/**
 * Assert functions, return when pass, throw when fail
 */

let assertResults = []

function assertEqual(x,y) {
    if (x==y) return;
    else throw `FAIL: ${x} should be ${y}`;
}

function assert(x) {
    if (x) return;
    else throw 'FAIL';
}

module.exports = {
    assertEqual,
    assert,
}
