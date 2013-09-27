var log = print;
var print = function(x) { postMessage({type:'log', content: x}); };

var postMessage = function(data) {
    if (data.type === 'log')
        log('log - ' + data.content);
    else if (data.type === 'result')
        log('result: ' + data.content.which + ' - ' + data.content.value + 'ms');
}

var results = {
    exp: [],
    expf: []
}

function run(filename) {
    load(filename);
    if (typeof description !== 'undefined')
        log(description);
    runBenchmark();
}

var arg = scriptArgs[0];
if (typeof arg === 'undefined')
    print('Missing argument: filename');
else
    run(arg);

