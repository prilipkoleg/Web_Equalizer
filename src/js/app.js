var canva = document.createElement('canvas');
var ctx = canva.getContext('2d');

//Делаем наш холст на всю страницу
canva.width = window.innerWidth;
canva.height = window.innerHeight;
//Добавляем его на страницу
document.body.appendChild(canvas);


var particles = [];//Тут будут храниться все созданные частицы
var createParticles = function () {
    var particle = null, audio = null;
    for (var i = 0; i < 50; i++) {
        particle = new Particle();
        particles.push(particle);
    }
    //Создаем анализатор
    elem = new Analyse();
    //Добавляем элемент audio на страницу
    document.body.appendChild(elem.audio);
    //Добавляем данные полученные анализатором к созданным частицам
    audio.update = function (bands) {
        var ln = 50;
        while (ln--) {
            var loc = particles[ln];
            loc.pulse = bands[loc.band] / 256;
        }
    };
    //Тут запускаем непосредственно функцию отрисовки
    setInterval(draw,33);
}


var draw = function () {
    //Очищаем холст перед новой отрисовкой
    ctx.clearRect(0, 0, canva.width, canva.height);
    for (var i = 0; i < 50; i++) {
        var loc = particles[i];
        loc.draw();
    }
}

var Particle = function () {
    this.init();
};

Particle.prototype = {
    init: function () {
        this.x = random(canva.width);
        this.y = random(canva.height);
        this.level = 1 * random(4);
        this.speed = random(0.2, 1);
        this.radius = random(10, 70); //радиус частиц
        this.color = random(['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423']); //цвет частицы
        this.opacity = random(0.2, 1);
        this.band = Math.floor(random(128));
    },
    draw: function () {
        var pulsar, scale;
        pulsar = Math.exp(this.pulse);
        scale = pulsar * this.radius || this.radius;
        ctx.save();
        ctx.beginPath(); //Начинает отрисовку фигуры
        ctx.arc(this.x, this.y, scale, 0, Math.PI * 2);
        ctx.fillStyle = this.color; //цвет
        ctx.globalAlpha = this.opacity / this.level; //прозрачность
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = this.color; //цвет рамки
        ctx.stroke();
        ctx.restore();

        this.move();
    },
    move: function () {
        this.y -= this.speed * this.level;

        //Возвращаем в начало частицы которые ушли за пределы холста
        if (this.y < -100) {
            this.y = canva.height;
        }
    }
};

//И напишем вспомогательные ф-и
var random: function( min, max ) {
    if (this.isArray( min )) {
        return min[ ~~( Math.random() * min.length ) ];
    }
    if (!this.isNumber(max)) {
        max = min || 1, min = 0;
    }
    return min + Math.random() * ( max - min );
},
//Проверка на массив
var isArray: function(object) {
    return Object.prototype.toString.call( object ) == '[object Array]';
},
//Проверка на число
var isNumber: function(object) {
    return typeof object == 'number';
}


var AudioContext = w.AudioContext || w.webkitAudioContext;
var context = new AudioContext ();

var Analyse = function () {
    var an= this,
        AudioContext = w.AudioContext || w.webkitAudioContext;

    //Создание источника
    this.audio = new Audio();
    this.audio.src = "test1.ogg";
    this.controls = true;
    //Создаем аудио-контекст
    this.context = new AudioContext();
    this.node = this.context.createScriptProcessor(2048, 1, 1);
    //Создаем анализатор
    this.analyser = this.context.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.analyser.fftSize = 512;
    this.bands = new Uint8Array(this.analyser.frequencyBinCount);
    //Подписываемся на событие
    this.audio.addEventListener('canplay', function () {
        //отправляем на обработку в  AudioContext
        an.source = an.context.createMediaElementSource(an.audio);
        //связываем источник и анализатором
        an.source.connect(an.analyser);
        //связываем анализатор с интерфейсом, из которого он будет получать данные
        an.analyser.connect(an.node);
        //Связываем все с выходом
        an.node.connect(an.context.destination);
        an.source.connect(an.context.destination);
        //подписываемся на событие изменения входных данных
        an.node.onaudioprocess = function () {
            an.analyser.getByteFrequencyData(an.bands);
            if (!an.audio.paused) {
                if (typeof an.update === "function") {
                    return an.update(an.bands);
                } else {
                    return 0;
                }
            }
        };
    });

    return this;
};
