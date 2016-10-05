function HasDependency(name) {
    load(name);
}

function SendResult (what) {
    log(what.which, ' - ', what.value, 'ms');
}

function UpdateInfos(title, description) {
    log(title);
    log(description);
}

function run(filename) {
    load(filename);
    for(;;)
        runBenchmark();
}

var arg = scriptArgs[0];
if (typeof arg === 'undefined')
    log('Missing argument: filename');
else
    run(arg);

