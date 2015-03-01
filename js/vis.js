/*
	Jake's Visualizer 2015 - MIT license.
*/
var audioCtx;
var source;
var analyser;
var bufferLength;
var dataArray;
var canvas = document.querySelector('.visualizer');
canvas.style.width=getScreenWidth()+"px";
canvas.style.height=getScreenHeight()+"px";
var canvasCtx = canvas.getContext("2d");
canvasCtx.fillStyle = 'rgb(0, 0, 0)';
canvasCtx.fillRect(0, 0, canvas.width,  canvas.height);
var play = document.querySelector('.play');
var stop = document.querySelector('.stop');
var version = document.querySelector('.version');
version.innerHTML = "("+buildInfo+")";
var dataLoaded = 0;
var drawInitalized = 0;

function varReset(){
	delete audioCtx;
	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	analyser = audioCtx.createAnalyser();
}

function getData() {
	stop.setAttribute('disabled', 'disabled');
	source = audioCtx.createBufferSource();
	request = new XMLHttpRequest();
	request.open('GET', 'music/Proximity.ogg', true);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		var audioData = request.response;
		audioCtx.decodeAudioData(
			audioData
			,function(buffer) {
				debug("Audio Loaded");
				stop.removeAttribute('disabled');
				source.buffer = buffer;
				source.connect(audioCtx.destination);
				source.loop = true;
			}
			,function(e){"Error with decoding audio data" + e.err}
		);
	}
	request.send();
	debug("Loading Audio (~2mb)...");
}
play.onclick = function() {
	varReset();
	getData();
	initVisualizer();
	source.start(0);
	play.setAttribute('disabled', 'disabled');
}
stop.onclick = function() {
	source.stop(0);
		source.disconnect(audioCtx.destination);
		source.disconnect(analyser);
	debug("Audio Stopped");
	play.removeAttribute('disabled');
}

function debug(text){
	document.querySelector('.debug').innerHTML = text;
}

function initVisualizer(){

	source.connect(analyser);
	analyser.fftSize = 128; //must be power of 2
	bufferLength = analyser.fftSize;
	dataArray = new Uint8Array(bufferLength);

	if(drawInitalized == 0){
		drawInitalized =1;
		draw();
	}
}

function smoothMove(from,to){
	var temp;
	if(from<to)
	temp=(from+(0.1*Math.abs(from-to)));
	else
	temp=(from-(0.1*Math.abs(from-to)));
	return Math.ceil(temp);
}

function getScreenWidth(){
	var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth;
	return x;
}
function getScreenHeight(){
	var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	return y;
}

var size = 0;
var goalSize = 0;
var boxX = 0;
var sinCounter = 0;

function draw() {

	drawVisual = requestAnimationFrame(draw);
	analyser.getByteTimeDomainData(dataArray);
	canvasCtx.fillStyle = 'rgba(0, 0, 0,0.05)';
	canvasCtx.fillRect(0, 0, canvas.width,  canvas.height);

	var avg = 0;
	for(var i=0;i<bufferLength;i++){
		avg+=dataArray[i]-128
	}
	avg /= bufferLength;

	sinCounter+=0.05;
	if(sinCounter>Math.PI*2){
		sinCounter=0;
	}

	var tempcanvas = canvasCtx;
	//canvasCtx.drawImage(tempcanvas.canvas, Math.floor(Math.abs(avg))+10,0);
	var fadeIntoBackSpeed = (Math.abs(avg))+20;
	canvasCtx.drawImage(tempcanvas.canvas,fadeIntoBackSpeed/2,fadeIntoBackSpeed/2,canvas.width-fadeIntoBackSpeed,canvas.height-fadeIntoBackSpeed);


	var colorAdjust = Math.floor(Math.abs(avg)*6);

	var rgb = 'rgb('+colorAdjust+',0,'+(255-colorAdjust)+')';
	var rgba = 'rgba('+colorAdjust+',0,'+(255-colorAdjust)+',0.08)';

	
		goalSize = Math.abs(avg);
	size = smoothMove(size,goalSize);

	
	//boxX=Math.sin(sinCounter)*500+canvas.width/2
	boxX+=40;
	boxX=boxX%canvas.width;
	canvasCtx.beginPath();
	for(var i=1;i<=20;i++){
		drawCenteredSquare(canvasCtx,(boxX+20*i)%canvas.width,(i%2)*(canvas.height), 10+size*2, 10+size*2);	
		drawCenteredSquare(canvasCtx,(i%2)*(canvas.width),(boxX+20*i)%canvas.height, 10+size*2, 10+size*2);	
	}
	canvasCtx.fillStyle = rgba;
	canvasCtx.fill();


	
		canvasCtx.strokeStyle = rgb;
		canvasCtx.lineWidth = 10;
	canvasCtx.beginPath();
	var sliceWidth = canvas.width * 1 / bufferLength;
	var x = 0;
	for(var i = 0; i < bufferLength; i++) {
		var v = dataArray[i] / 128.0;
		var y = v *  canvas.height/2;

		if(i === 0) {
			canvasCtx.moveTo(x, y);
		} else {
			canvasCtx.lineTo(x, y);
		}
		x += sliceWidth;
	}
	canvasCtx.lineTo(canvas.width, canvas.height/2);
	canvasCtx.stroke();
	
	
}

function drawCenteredSquare(ctx,x,y,width,height){
	ctx.rect(x-width/2,y-height/2,width,height)
}