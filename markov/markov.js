Math.fround = Math.fround || function(x){return x;};

var EPSILON = 1e-10;
var TOTAL_ATTEMPTS = 100;

var NUM_VECTORS, SIZE, vecf, random;
var success = false;

var NUM_VECTORS = 5000000,
    SIZE = NUM_VECTORS * 3,
    vecf = new Float32Array(SIZE),
    random = new Float32Array(SIZE);

/*
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
*/

var title = "Markov Chains";
var description = "Generates a random irreducible 3x3 matrix and then computes its steady state. N initial states (3-vectors) are generated. Once the steady state is computed, each initial state is multiplied by the initial matrix 3 times, and then the steady state vector is compared with the obtained vector (which corresponds to the state after applying 3 moves). N is big enough accordingly to what your browser allows to allocate. Don't forget to use Firefox Nightly to see nice speedups!";
UpdateInfos(title, description);

var matrix = new Float32Array(9);

var intf = new Float32Array(9);
var steadyf = new Float32Array(9);
var difff = new Float32Array(9);

var vec3f = new Float32Array(3);

function id(x) { return x }

function mulvecf(out, a, b) {
    var f32 = Math.fround;
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        r1 = b[0], r2 = b[1], r3 = b[2];

    r1 = f32(f32(f32(a00 * r1) + f32(a01 * r2)) + f32(a02 * r3));
    r2 = f32(f32(f32(a10 * r1) + f32(a11 * r2)) + f32(a12 * r3));
    r3 = f32(f32(f32(a20 * r1) + f32(a21 * r2)) + f32(a22 * r3));

    r1 = f32(f32(f32(a00 * r1) + f32(a01 * r2)) + f32(a02 * r3));
    r2 = f32(f32(f32(a10 * r1) + f32(a11 * r2)) + f32(a12 * r3));
    r3 = f32(f32(f32(a20 * r1) + f32(a21 * r2)) + f32(a22 * r3));

    r1 = f32(f32(f32(a00 * r1) + f32(a01 * r2)) + f32(a02 * r3));
    r2 = f32(f32(f32(a10 * r1) + f32(a11 * r2)) + f32(a12 * r3));
    r3 = f32(f32(f32(a20 * r1) + f32(a21 * r2)) + f32(a22 * r3));

    out[0] = r1;
    out[1] = r2;
    out[2] = r3;
}

function markovFloat() {
    var f32 = Math.fround;
    // Step 1: intf = matrix;
    for(var i = 0; i < 9; ++i) {
        intf[i] = matrix[i];
    }
    var prec = 0.99, attempts = TOTAL_ATTEMPTS;
    // Step 2: While precision is not reached, do steadyf = intf, intf *= matrix, prec = norm(steadfy - intf)
    //
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

        intf[0] = f32(f32(b00 * a00) + f32(b01 * a10)) + f32(b02 * a20);
        intf[1] = f32(f32(b00 * a01) + f32(b01 * a11)) + f32(b02 * a21);
        intf[2] = f32(f32(b00 * a02) + f32(b01 * a12)) + f32(b02 * a22);

        intf[3] = f32(f32(b10 * a00) + f32(b11 * a10)) + f32(b12 * a20);
        intf[4] = f32(f32(b10 * a01) + f32(b11 * a11)) + f32(b12 * a21);
        intf[5] = f32(f32(b10 * a02) + f32(b11 * a12)) + f32(b12 * a22);

        intf[6] = f32(f32(b20 * a00) + f32(b21 * a10)) + f32(b22 * a20);
        intf[7] = f32(f32(b20 * a01) + f32(b21 * a11)) + f32(b22 * a21);
        intf[8] = f32(f32(b20 * a02) + f32(b21 * a12)) + f32(b22 * a22);

        // Step 2.3
        prec = f32(prec);
        for(var i = 0, prec = 0; i < 9; ++i) {
            var diff = f32(intf[i] - steadyf[i]);
            prec = f32(prec + f32(diff * diff));
        }
        prec = f32(Math.sqrt(prec));
    }

    if (prec < 1) {
        for(var i = 0; i < NUM_VECTORS; i += 3) {
            vec3f[0] = vecf[i], vec3f[1] = vecf[i+1], vec3f[2] = vecf[i+2];
            mulvecf(vec3f, matrix, vec3f);

            prec = f32(0); // reusing prec
            for(var j = 0; j < 3; ++j) {
                var diff = f32(intf[j] - vec3f[j]);
                prec = f32(prec + f32(diff * diff));
            }
            prec = f32(Math.sqrt(prec));
            if (i >= NUM_VECTORS - 3) print('precision: ' + f32(prec));
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
    SendResult({
        which: 'with',
        value: diff
    });
};

function mulvec(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        r1 = b[0], r2 = b[1], r3 = b[2];

    r1 = a00 * r1 + a01 * r2 + a02 * r3;
    r2 = a10 * r1 + a11 * r2 + a12 * r3;
    r3 = a20 * r1 + a21 * r2 + a22 * r3;

    r1 = a00 * r1 + a01 * r2 + a02 * r3;
    r2 = a10 * r1 + a11 * r2 + a12 * r3;
    r3 = a20 * r1 + a21 * r2 + a22 * r3;

    r1 = a00 * r1 + a01 * r2 + a02 * r3;
    r2 = a10 * r1 + a11 * r2 + a12 * r3;
    r3 = a20 * r1 + a21 * r2 + a22 * r3;

    out[0] = r1;
    out[1] = r2;
    out[2] = r3;
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
            var diff = intf[i] - steadyf[i];
            prec += diff * diff;
        }
        prec = Math.sqrt(prec);
    }

    if (prec < 1) {
        for(var i = 0; i < NUM_VECTORS; i += 3) {
            vec3f[0] = vecf[i], vec3f[1] = vecf[i+1], vec3f[2] = vecf[i+2];
            mulvec(vec3f, matrix, vec3f);

            prec = 0; // reusing prec
            for(var j = 0; j < 3; ++j) {
                var diff = intf[j] - vec3f[j];
                prec += diff * diff;
            }
            prec = Math.sqrt(prec);
            if (i >= NUM_VECTORS - 3) print('precision: ' + prec);
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
    SendResult({
        which: 'without',
        value: diff
    });
};

function runBenchmark() {
    for(var i = 0; i < SIZE; ++i)
        random[i] = Math.random();
    var last = 0;

    for (var n = 3; n; --n) {
        var sum = 0;
        for(var i = 0; i < 9; ++i)
            sum += matrix[i] = random[last = ((last + 1)%SIZE)];
        for(var i = 0; i < 9; ++i)
            matrix[i] /= sum;
        for(var i = 0; i < SIZE; ++i)
            vecf[i] = random[last = ((last + 1)%SIZE)];

        runTestWithout();
        runTestWith();
    }
}

