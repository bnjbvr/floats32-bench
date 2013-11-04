/**
 * Operates graphics operations by the CPU, like matrix multiplication, translation,
 * rotation and scaling. Computes stats that are usefu for doing something with the
 * results.
 */

var TITLE = 'Matrix Graphics';
var DESCRIPTION = "This benchmarks creates a bunch of matrixes and applies them some operations that are frequently used in graphics: translation, rotation, scaling, etc. This one uses a lot of basic operations and more complex operations (like calls to Math.cos and Math.sin for the rotation). Thus, it shows great improvements when the Float32 equivalent forms of these functions are faster. Once more, it uses the adapted version of gl-matrix";
UpdateInfos(TITLE, DESCRIPTION);

HasDependency('gl-matrix/glmatrix-f32.js')
HasDependency('gl-matrix/glmatrix-reg.js')

var ITERATIONS = 200000;

var NUM_OP = 5;
var WARMUPS = 2;
var LAST_INDEX = 0;

var out32 = f32mat3.create();
var fixed32 = f32mat3.create();
var vscale32 = new Float32Array([23.10, 19.89]);
var vtrans32 = new Float32Array([13.37, -4.2]);

// Initial generation of random numbers
function init() {
    NUM_RANDOM = ITERATIONS;
    RANDOM = new Float32Array(NUM_RANDOM);
    for (var i = 0; i < NUM_RANDOM; ++i)
        RANDOM[i] = Math.random();
}
function generateNextMatrix(out) {
    for(var i = 0; i < 9; ++i) {
        out[i] = RANDOM[ LAST_INDEX = (LAST_INDEX+1)%NUM_RANDOM ];
    }
}
function generateNextScalar() {
    return 3.141592653 * RANDOM[ LAST_INDEX = (LAST_INDEX+1)%NUM_RANDOM ];
}

function makeDate() { return +new Date() }

function benchmark32() {
    var now = 0, before = 0;
    print('float32 - start');
    before = makeDate();
    for (var n = ITERATIONS; n; --n) {
        generateNextMatrix(out32);

        for (var i = 0; i < NUM_OP; ++i) {
            f32mat3.multiply(out32, out32, fixed32);
            f32mat3.scale(out32, out32, vscale32);
            f32mat3.rotate(out32, out32, generateNextScalar());
            f32mat3.translate(out32, out32, vtrans32);
        }
    }
    now = makeDate() - before;
    print('float32 - end');
    return now;
}

function runFloat32() {
    fixed32 = f32mat3.random(fixed32);
    var diff = benchmark32();
    SendResult({
        which:'with',
        value: diff
    });
}

var out = mat3.create();
var fixed = mat3.create();
var vscale = new Float32Array([23.10, 19.89]);
var vtrans = new Float32Array([13.37, -4.2]);

function benchmarkreg() {
    var now = 0, before = 0;
    print('regular - start');
    before = makeDate();
    for (var n = ITERATIONS; n; --n) {
        generateNextMatrix(out32);

        for (var i = 0; i < NUM_OP; ++i) {
            mat3.multiply(out, out, fixed);
            mat3.scale(out, out, vscale);
            mat3.rotate(out, out, generateNextScalar());
            mat3.translate(out, out, vtrans);
        }
    }
    now = makeDate() - before;
    print('regular - end');
    return now;
}

function runReg() {
    fixed = mat3.random(fixed);
    var diff = benchmarkreg();

    SendResult({
        which: 'without',
        value: diff
    });
}

function runBenchmark() {
    init();
    for(var n = 3; n; --n) {
        runReg();
        runFloat32();
    }
}
