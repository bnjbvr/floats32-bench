function HasDependency(name) {
    load(name);
}

function SendResult (what) {
    print(what.which, ' - ', what.value, 'ms');
}

function UpdateInfos(title, description) {
    print(title);
    print(description);
}

function run(filename) {
    load(filename);
    for(;;)
        runBenchmark();
}

var arg = scriptArgs[0];
if (typeof arg === 'undefined')
    print('Missing argument: filename');
else
    run(arg);

