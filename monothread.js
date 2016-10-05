// jquery in one line:
var $ = document.getElementById.bind(document);

var domWithout  = $('without'),
    domWith     = $('with'),
    domSpeedup  = $('speedup'),
    domLog      = $('log');

function Log(x) {
    domLog.innerHTML += x + '\n';
}

function RenderStats(stats) {
    if (stats.updateSpeedup)
        domSpeedup.innerHTML = stats.speedups[stats.speedups.length-1] + '%';
    domWith.innerHTML = stats.withAverage;
    domWithout.innerHTML = stats.withoutAverage;
}

// Stats object
function Stats() {
    this.with = [];
    this.without = [];

    this.withAverage = 0;
    this.withoutAverage = 0;

    this.updateSpeedup = true;
    this.speedups = [];
}

Stats.prototype.addResult = function(which, value) {
    var array = this[which];
    array.push(value);

    var avg = this[which + 'Average'];
    avg *= (array.length - 1);
    avg += value;
    avg /= array.length;
    this[which + 'Average'] = avg;

    this.updateSpeedup = !this.updateSpeedup;
    if (this.updateSpeedup) {
        var speedup = (stats.withoutAverage - stats.withAverage) / stats.withoutAverage;
        speedup = Math.round(10000 * speedup) / 100;
        this.speedups.push(speedup);
    }
    RenderStats(this);
}

function SendResult(data) {
    Log('Result received: ' + data.which + ' - ' + data.value + 'ms');
    stats.addResult(data.which, data.value);
}

function UpdateInfos(title, description) {
    $('title').innerHTML = title;
    $('description').innerHTML = description;
}

function HasDependency() {
    // stub
}

var stats = new Stats();

$('discard').onclick = function() {
    stats = new Stats();
    domSpeedup.innerHTML = 'no results yet';
    domWith.innerHTML = 'no results yet';
    domWithout.innerHTML = ' no results yet';
    domLog.innerHTML = '';
}

var log = typeof window !== 'undefined' ? Log
                                        : console.log.bind(console);

