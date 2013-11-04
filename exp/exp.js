var title = "Exponential";
var description = "This benchmarks computes the exponential of several float values, using the approximation of Taylor series. This means it just applies additions and multiplications to some float values. The recent Ion optimizations for Float32 can enhance performance of such computations. Here is a page that shows you the difference: exp is the classic version without the usage of Float32 optimizations, expf is the one that uses all Float32 optimizations. The speedup is an indication of how faster the float exponential is: the higher, the better. If it's negative, there is something going wrong. Don't forget to use the latest Firefox Nightly!";
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
