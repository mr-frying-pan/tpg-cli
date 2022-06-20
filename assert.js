let assertResults = []

function assertEqual(x,y) {
    if (x==y) assertResults.push('PASS');
    else assertResults.push(`FAIL: ${x} should be ${y}`);
}

function assert(x) {
    if (x) assertResults.push('PASS');
    else assertResults.push('FAIL');
}

function resetAsserts() {
    assertResults = [];
}

module.exports = {
    assertEqual,
    assert,
    assertResults,
    resetAsserts
}
