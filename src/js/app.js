$( document ).ready(function(){
    var audio = document.getElementById('audio');

    var audio_list = $('.audio-list');

    audio_list.on('click', 'li', function(){
        var me = $(this),
            src = me.data('src');

        //say(me.data('src'));
        audio_list.find('li').removeClass('active');
        me.addClass('active');

        $(audio).attr('src', src);

        audio.play();
    });

    /*var is_playing = false;

    $(audio).on('play', function(){
        //alert('play');
        step();
        is_playing = true;

    });

    $(audio).on('pause', function(){
        setTimeout(function(){

            if(!is_playing){
                alert('stop');
            }
        }, 2000)
        is_playing = false;
    })



    var fps = 0.5;
    function step() {
        setTimeout(function() {
            requestAnimationFrame(step);
        // Drawing code goes here
            say('is playing = ' + is_playing + '!!!' );
        }, 1000 / fps);
    }

    function say_playing(){

        var say_RAP = requestAnimationFrame(say_playing());
        setTimeout(say("is playing"), 3000)
    }*/

    function say( word ){
        console.log( word );
    }
});



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

analyser.fftSizeOs = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

//a waveform/oscilloscope
canvasOsCtx.clearRect(0, 0, WIDTH, HEIGHT);

function draw_oscilloscope() {
    drawVisualOs = requestAnimationFrame(draw_oscilloscope);
    analyser.getByteFrequencyData(dataArray);

    canvasOsCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasOsCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasOsCtx.lineWidth = 2;
    canvasOsCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasOsCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/5;

        if(i === 0) {
            canvasOsCtx.moveTo(0, 100);
        } else {
            canvasOsCtx.lineTo(x+2, y+100);
        }

        x += sliceWidth;
    }

    canvasOsCtx.lineTo(oscilloscope.width, oscilloscope.height/2);
    canvasOsCtx.stroke();
};

// a frequency bar graph
/*analyser.fftSizeFB = 256;*/
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

canvasFBCtx.clearRect(0, 0, WIDTH, HEIGHT);

function draw_frequency_bar() {
    drawVisualFB = requestAnimationFrame(draw_frequency_bar);
    analyser.getByteFrequencyData(dataArray);

    canvasFBCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasFBCtx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = (WIDTH / bufferLength) * 0.6; // ширина полосы
    var barHeight;
    var x = 0;

    canvasFBCtx.beginPath();

    for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        //one colour:
        //canvasFBCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';

        //rainbow:
        var hue = i/bufferLength * 360;
        canvasFBCtx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        canvasFBCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

        x += barWidth + 0.25; // растояние
    }
};

draw_oscilloscope();
draw_frequency_bar();