/**
 * This benchmarks creates a random 3x3 matrix and inverts it if the determinant
 * is non zero. In this case, it will multiply the inverted matrix by the original
 * matrix and accumulates the precision loss.
 */

var TITLE = 'Matrix inversions';
var DESCRIPTION = 'Applies a big amount of times the following process: creates a random matrix, inverts it and then multiplies the initial matrix by the original, accumulating the precision loss.';
UpdateInfos(TITLE, DESCRIPTION);

HasDependency('gl-matrix/glmatrix-f32.js')
HasDependency('gl-matrix/glmatrix-reg.js')

// Possible iterations values
var ITERATIONS = 20000;
var INVERSIONS = 100;

function makeDate() { return +new Date() }

// Float32 version
var out32 = f32mat3.create();
var inv32 = f32mat3.create();
var identity32 = f32mat3.create();

function benchmark32() {
    var now = 0, before = 0;
    print('float32 - start');
    before = makeDate();
    for (var n = ITERATIONS; n; --n) {
        out32 = f32mat3.random(out32)
        if (f32mat3.determinant(out32) !== 0) {
            for(var i = 0; i < INVERSIONS; ++i)
                inv32 = f32mat3.invert(inv32, out32);
            identity32 = f32mat3.multiply(identity32, inv32, out32);
        }
    }
    now += makeDate() - before;
    print('float32 - end');
    return now;
}

function runFloat32() {
    var diff = benchmark32();
    SendResult({
        which:'with',
        value: diff
    });
}

// Float64 version
var outreg = mat3.create();
var invreg = mat3.create();
var identityreg = mat3.create();

function benchmarkreg() {
    var now = 0, before = 0;
    print('regular - start');
    before = makeDate();
    for (var n = ITERATIONS; n; --n) {
        outreg = mat3.random(outreg);
        if (mat3.determinant(outreg) !== 0) {
            for(var i = 0; i < INVERSIONS; ++i)
                invreg = mat3.invert(invreg, outreg);
            identityreg = mat3.multiply(identityreg, invreg, outreg);
        }
    }
    now += makeDate() - before;
    print('regular - end');
    return now;
}

function runReg() {
    var diff = benchmarkreg();
    SendResult({
        which: 'without',
        value: diff
    });
}

// Run benchmark
function runBenchmark() {
    for(var i = 3; i--;) {
        runReg();
        runFloat32();
    }
};


