var audio = document.getElementById('audio');

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();

var source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);

var oscilloscope = document.getElementById("oscilloscope");
var frequency_bar = document.getElementById("frequency_bar");

var canvasOsCtx = oscilloscope.getContext("2d");
var canvasFBCtx = frequency_bar.getContext("2d");

var WIDTH   = 500,
    HEIGHT  = 200;

//a waveform/oscilloscope
analyser.fftSizeOs = 2048;
var bufferLengthOs = analyser.frequencyBinCount;
var dataArrayOs = new Uint8Array(bufferLengthOs);

canvasOsCtx.clearRect(0, 0, WIDTH, HEIGHT);

function draw_oscilloscope() {
    drawVisualOs = requestAnimationFrame(draw_oscilloscope);
    analyser.getByteFrequencyData(dataArrayOs);

    canvasOsCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasOsCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasOsCtx.lineWidth = 2;
    canvasOsCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasOsCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLengthOs;
    var x = 0;

    for(var i = 0; i < bufferLengthOs; i++) {

        var v = dataArrayOs[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
            canvasOsCtx.moveTo(x, y);
        } else {
            canvasOsCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasOsCtx.lineTo(oscilloscope.width, oscilloscope.height/2);
    canvasOsCtx.stroke();
};

// a frequency bar graph
analyser.fftSizeFB = 256;
var bufferLengthFB = analyser.frequencyBinCount;
var dataArrayFB = new Uint8Array(bufferLengthFB);

canvasFBCtx.clearRect(0, 0, WIDTH, HEIGHT);

function draw_frequency_bar() {
    drawVisualFB = requestAnimationFrame(draw_frequency_bar);
    analyser.getByteFrequencyData(dataArrayFB);

    canvasFBCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasFBCtx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = (WIDTH / bufferLengthFB) * 0.5; // ширина полосы
    var barHeight;
    var x = 0;

    canvasFBCtx.beginPath();

    for(var i = 0; i < bufferLengthFB; i++) {
        barHeight = dataArrayFB[i];

        canvasFBCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        canvasFBCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

        x += barWidth + 0.25; // растояние
    }
};

draw_oscilloscope();
draw_frequency_bar();
