var title = "Exponential";
var description = "This benchmark fills a big Float32Array with predictable values and then computes the exponential of each element by using the first elements of the exponential's power series. The main purpose of this benchmark is just to make additions and multiplications."
UpdateInfos(title, description);

var SIZE = 40000000;
var f32 = new Float32Array(SIZE);

// Benchmark
Math.fround = Math.fround || function(x){return x;};

function expf(x) {
    x = Math.fround(x);
    var e = Math.fround(x / 120);
    e = Math.fround(e + Math.fround(0.04167)); // 1/24
    e = Math.fround(e * x);
    e = Math.fround(e + Math.fround(0.16667)); // 1/6
    e = Math.fround(e * x);
    e = Math.fround(e + .5);           // 1/2
    e = Math.fround(e * x);
    e = Math.fround(e + 1);            // 1
    e = Math.fround(e * x);
    e = Math.fround(e + 1);
    return e;
}

function exp(x) {
    var e = (x / 120);
    e = (e + (0.04167)); // 1/24
    e = (e * x);
    e = (e + (0.16667)); // 1/6
    e = (e * x);
    e = (e + .5);        // 1/2
    e = (e * x);
    e = (e + 1);         // 1
    e = (e * x);
    e = (e + 1);
    return e;
}

function makeDate() {
    return +new Date();
}

function computeExpf() {
    for(var i = 0; i < SIZE; ++i)
        f32[i] = (i % 100) / 100.;

    var before = makeDate();
    for(var i = 0, s = SIZE; i < s; ++i) {
        f32[i] = expf(f32[i]);
    }
    return makeDate() - before;
}

function runTestExpf() {
    var diff = computeExpf();
    SendResult({
        which: 'with',
        value: diff
    });
}

function computeExp() {
    for(var i = 0; i < SIZE; ++i)
        f32[i] = (i % 100) / 100.;

    var before = makeDate();
    for(var i = 0, s = SIZE; i < s; ++i) {
        f32[i] = exp(f32[i]);
    }
    return makeDate() - before;
}

function runTestExp() {
    var diff = computeExp();
    SendResult({
        which: 'without',
        value: diff
    });
}

function runBenchmark() {
    for (var n = 3; n; --n) {
        runTestExp();
        runTestExpf();
    }
}
