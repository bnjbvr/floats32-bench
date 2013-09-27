var print = print || function(x) { postMessage({type:'log', content:x}) }
Math.fround = Math.fround || function(x){return x;};

var WARMUPS = 3;
var EPSILON = 1e-20;
var TOTAL_ATTEMPTS = 1 / EPSILON;

var NUM_VECTORS, SIZE, vecf, random;
var success = false;

NUM_VECTORS = 100000000;
while (!success) {
    try {
        SIZE = NUM_VECTORS * 3;
        vecf = new Float32Array(SIZE);
        random = new Float32Array(SIZE);
        success = true;
    } catch(e) {
        NUM_VECTORS = Math.round(NUM_VECTORS / 2);
        success = false;
    }
}

var title = "Markov Chains";
var description = "Generates a random irreducible 3x3 matrix and then computes its steady state. Then multiplies this matrix by a set of N initial 3-vectors, where N is big enough accordingly to what your browser allows to allocate (N has been dynamically chosen to be " + NUM_VECTORS + "). Makes " + WARMUPS + " warm-up runs before showing results.";

var matrix = new Float32Array(9);

var intf = new Float32Array(9);
var steadyf = new Float32Array(9);
var difff = new Float32Array(9);

var SIZE = NUM_VECTORS * 3;
var vec3f = new Float32Array(3);

function mulvecf(out, a, b) {
    var f32 = Math.fround;
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        x1 = b[0], x2 = b[1], x3 = b[2];

    out[0] = f32(f32(a00 * x1) + f32(a01 * x2)) + f32(a02 * x3);
    out[1] = f32(f32(a10 * x1) + f32(a11 * x2)) + f32(a12 * x3);
    out[2] = f32(f32(a20 * x1) + f32(a21 * x2)) + f32(a22 * x3);
}

function markovFloat() {
    // Step 1: intf = matrix;
    for(var i = 0; i < 9; ++i) {
        intf[i] = matrix[i];
    }
    var prec = 0.99, attempts = TOTAL_ATTEMPTS;
    // Step 2: While precision is not reached, do steadyf = intf, intf *= matrix, prec = norm(steadfy - intf)
    while (prec > EPSILON && prec < 1 && attempts-- > 0) {
        // Step 2.1: steadyf = intf
        for(var i = 0; i < 9; ++i) steadyf[i] = intf[i];

        // Step 2.2: matrix multiplication
        var a00 = intf[0], a01 = intf[1], a02 = intf[2],
            a10 = intf[3], a11 = intf[4], a12 = intf[5],
            a20 = intf[6], a21 = intf[7], a22 = intf[8],

            b00 = matrix[0], b01 = matrix[1], b02 = matrix[2],
            b10 = matrix[3], b11 = matrix[4], b12 = matrix[5],
            b20 = matrix[6], b21 = matrix[7], b22 = matrix[8];

        intf[0] = Math.fround(Math.fround(b00 * a00) + Math.fround(b01 * a10)) + Math.fround(b02 * a20);
        intf[1] = Math.fround(Math.fround(b00 * a01) + Math.fround(b01 * a11)) + Math.fround(b02 * a21);
        intf[2] = Math.fround(Math.fround(b00 * a02) + Math.fround(b01 * a12)) + Math.fround(b02 * a22);

        intf[3] = Math.fround(Math.fround(b10 * a00) + Math.fround(b11 * a10)) + Math.fround(b12 * a20);
        intf[4] = Math.fround(Math.fround(b10 * a01) + Math.fround(b11 * a11)) + Math.fround(b12 * a21);
        intf[5] = Math.fround(Math.fround(b10 * a02) + Math.fround(b11 * a12)) + Math.fround(b12 * a22);

        intf[6] = Math.fround(Math.fround(b20 * a00) + Math.fround(b21 * a10)) + Math.fround(b22 * a20);
        intf[7] = Math.fround(Math.fround(b20 * a01) + Math.fround(b21 * a11)) + Math.fround(b22 * a21);
        intf[8] = Math.fround(Math.fround(b20 * a02) + Math.fround(b21 * a12)) + Math.fround(b22 * a22);

        // Step 2.3
        prec = Math.fround(prec);
        for(var i = 0, prec = 0; i < 9; ++i) {
            difff[i] = intf[i] - steadyf[i];
            prec = Math.fround(prec + Math.fround(difff[i] * difff[i]));
        }
        prec = Math.fround(Math.sqrt(prec));
    }

    if (prec < 1) {
        for(var i = 0; i < NUM_VECTORS; i += 3) {
            vec3f[0] = vecf[i], vec3f[1] = vecf[i+1], vec3f[2] = vecf[i+2];
            mulvecf(vec3f, intf, vec3f);
        }
    }
}

// Benchmark
function makeDate() {
    return +new Date();
}

function computeWith() {
    var before = makeDate();
    markovFloat();
    return makeDate() - before;
}

function runTestWith() {
    var diff = computeWith();
    if(run < WARMUPS)
        return;

    postMessage({
        type: 'result',
        content: {
            which: 'with',
            value: diff
        }
    });
};

function mulvec(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        x1 = b[0], x2 = b[1], x3 = b[2];

    out[0] = a00 * x1 + a01 * x2 + a02 * x3;
    out[1] = a10 * x1 + a11 * x2 + a12 * x3;
    out[2] = a20 * x1 + a21 * x2 + a22 * x3;
}

function markovDouble() {
    // Step 1: intf = matrix;
    for(var i = 0; i < 9; ++i) {
        intf[i] = matrix[i];
    }
    var prec = 0.99, attempts = TOTAL_ATTEMPTS;
    // Step 2: While precision is not reached, do steadyf = intf, intf *= matrix, prec = norm(steadfy - intf)
    while (prec > EPSILON && prec < 1 && attempts-- > 0) {
        // Step 2.1: steadyf = intf
        for(var i = 0; i < 9; ++i) steadyf[i] = intf[i];

        // Step 2.2: matrix multiplication
        var a00 = intf[0], a01 = intf[1], a02 = intf[2],
            a10 = intf[3], a11 = intf[4], a12 = intf[5],
            a20 = intf[6], a21 = intf[7], a22 = intf[8],

            b00 = matrix[0], b01 = matrix[1], b02 = matrix[2],
            b10 = matrix[3], b11 = matrix[4], b12 = matrix[5],
            b20 = matrix[6], b21 = matrix[7], b22 = matrix[8];

        intf[0] =b00 * a00 + b01 * a10 + b02 * a20;
        intf[1] =b00 * a01 + b01 * a11 + b02 * a21;
        intf[2] =b00 * a02 + b01 * a12 + b02 * a22;

        intf[3] =b10 * a00 + b11 * a10 + b12 * a20;
        intf[4] =b10 * a01 + b11 * a11 + b12 * a21;
        intf[5] =b10 * a02 + b11 * a12 + b12 * a22;

        intf[6] =b20 * a00 + b21 * a10 + b22 * a20;
        intf[7] =b20 * a01 + b21 * a11 + b22 * a21;
        intf[8] =b20 * a02 + b21 * a12 + b22 * a22;

        // Step 2.3
        for(var i = 0, prec = 0; i < 9; ++i) {
            difff[i] = intf[i] - steadyf[i];
            prec += difff[i] * difff[i];
        }
        prec = Math.sqrt(prec);
    }

    if (prec < 1) {
        for(var i = 0; i < NUM_VECTORS; i += 3) {
            vec3f[0] = vecf[i], vec3f[1] = vecf[i+1], vec3f[2] = vecf[i+2];
            mulvec(vec3f, intf, vec3f);
        }
    }
}

function computeWithout() {
    var before = makeDate();
    markovDouble();
    return makeDate() - before;
}

function runTestWithout() {
    var diff = computeWithout();
    if(run < WARMUPS)
        return;

    postMessage({
        type: 'result',
        content: {
            which: 'without',
            value: diff
        }
    });
};

var run = 0;
function runBenchmark() {

    for(var i = 0; i < SIZE; ++i)
        random[i] = Math.random();
    var last = 0;

    for (;;) {
        var sum = 0;
        for(var i = 0; i < 9; ++i)
            sum += matrix[i] = random[last = ((last + 1)%SIZE)];
        for(var i = 0; i < 9; ++i)
            matrix[i] /= sum;
        for(var i = 0; i < SIZE; ++i)
            vecf[i] = random[last = ((last + 1)%SIZE)];

        runTestWithout();
        runTestWith();
        run += 1;
    }
}

if (typeof onmessage !== 'undefined') {
    onmessage = function(x) {
        postMessage({type: 'info', content: {
            title: title,
            description: description
        }});
        runBenchmark();
    }
}


