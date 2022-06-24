/**
 * Assert functions, return when pass, throw when fail
 */

let assertResults = []

function assertEqual(x,y) {
    if (x==y) return;
    else throw new AssertError(`FAIL: ${x} should be ${y}`);
}

function assert(x) {
    if (x) return;
    else throw new AssertError('FAIL');
}

class AssertError extends Error {}

module.exports = {
    assertEqual,
    assert,
    AssertError
}
