function $(x) { return document.getElementById(x); }

// If you want to render the charts, set to true
var RENDER_CHARTS = false;

var worker = new Worker(scriptName);

var withoutElem = $('without');
var withElem = $('with');
var speedupElem = $('speedup');

var ctxs = {
    'with': $("withChart").getContext("2d"),
    'without': $("withoutChart").getContext("2d"),
    'speedup': $("speedupChart").getContext("2d")
}

function draw(array, name) {
    var al = last5 = array.length;
    if (last5 >= 5) last5 = 5;
    var data = {
        labels: ['5th', '4th', '3rd', '2nd', '1st'],
        datasets: [{
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : array.slice(al - last5, al)
        }]
    }
    new Chart(ctxs[name]).Line(data, {
        animation: false
    });
}

function renderCharts(stats) {
    draw(stats.with, 'with');
    draw(stats.without, 'without');
    if (stats.updateSpeedup)
        draw(stats.speedups, 'speedup');
}

function renderText(stats) {
    if (stats.updateSpeedup)
        speedupElem.innerHTML = 'Speedup: '  + stats.speedups[stats.speedups.length-1] + '%';
    withElem.innerHTML = 'With: ' + stats.withAverage;
    withoutElem.innerHTML = 'Without: ' + stats.withoutAverage;
}

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
    if (RENDER_CHARTS) renderCharts(this);
    renderText(this);
}

var stats = new Stats();

var logArea = $('log');
function log(x) {
    logArea.innerHTML += x + '\n';
}

worker.onerror = function(error) {
    log('Worker error: ' + error.message);
    log('Line: ' + error.lineno);
}

worker.onmessage = function(e) {
    var data = e.data;
    if (data.type === 'result') {
        log('Result received: ' + data.content.which + ' - ' + data.content.value + 'ms');
        stats.addResult(data.content.which, data.content.value);
    } else if (data.type === 'info') {
        $('title').innerHTML = data.content.title;
        $('description').innerHTML = data.content.description;
    }
}

worker.postMessage('ping');

