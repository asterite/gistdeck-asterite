if (typeof(GISTDECK_CSS_URL) == "undefined")
    var GISTDECK_CSS_URL="https://gistdeck.herokuapp.com/gistdeck.css"
$("head").append('<link rel="stylesheet" href="' + GISTDECK_CSS_URL + '" type="text/css" />');

var slides = $(".markdown-body h1, .markdown-body h2");

function getCurrentSlideIdx() {
  var idx = 0;
  var viewportBottom = $(window).scrollTop() + window.innerHeight;

  for (var i=0; i < slides.length; i++) {
    if (slides.eq(i).offset().top > viewportBottom) break;
    idx = i;
  }

  return idx;
}

function displaySlide(n) {
  n = Math.min(n, slides.length-1);
  n = Math.max(n, 0);

  console.log(n);

  var s = slides.eq(n);
  var top = s.offset().top;

  var padding = {
    "ARTICLE": s.offset().top,
    "H1":  150,
    "H2":  20
  }[slides[n].tagName];

  console.log(top - padding);

  $(document).scrollTop(top - padding);

  if ($tortoise) drawTortoise();
  if ($hare) drawHare()
}

var tickInterval = 1;

var timerInterval;
var totalTime;
var currentTime;
var $tortoise;
var $hare;
var tortoiseWidth;
var hareWidth;

function askTime() {
  currentTime = prompt("How much time the presentation will last, in minutes?");
  currentTime = parseInt(currentTime);

  if (timerInterval) clearInterval(timerInterval);

  if (currentTime <= 0) {
    if ($tortoise) $tortoise.remove();
    if ($hare) $hare.remove();
    if ($startFlag) $startFlag.remove()
    if ($goalFlag) $goalFlag.remove()
    $tortoise = null;
    $hare = null;
    return;
  }

  currentTime *= 60;
  currentTime -= 1;
  totalTime = currentTime;

  $(document.body).append(
    '<div class="start-flag"></div>' +
    '<div class="goal-flag"></div>' +
    '<div class="tortoise"></div>' +
    '<div class="hare"></div>'
  )

  $tortoise = $('.tortoise');
  $hare = $('.hare');
  $startFlag = $('.start-flag');
  $goalFlag = $('.goal-flag');
  tortoiseWidth = $tortoise.width();
  hareWidth = $hare.width();

  drawTortoise();
  drawHare();
  timerInterval = setInterval(drawTortoiseAndAdvance, tickInterval * 1000);
}

function drawTortoiseAndAdvance() {
  currentTime -= 1;
  drawTortoise();
  if (currentTime == 0) {
    clearInterval(timerInterval);
  }
}

function drawTortoise() {
  var width = $(window).width() - 40 - tortoiseWidth;
  var progress = width - (currentTime * width / totalTime);
  $tortoise.css('left', (progress + 20) + 'px');
}

function drawHare() {
  var width = $(window).width() - 40 - hareWidth;
  var progress = getCurrentSlideIdx() * width / (slides.length - 1);
  $hare.css('left', (progress + 20) + 'px');
}

$(document).keydown(function(e) {
  if (e.which == 37)      displaySlide(getCurrentSlideIdx()-1);
  else if (e.which == 39) displaySlide(getCurrentSlideIdx()+1);
  else if (e.which == 84) askTime();
});

$(window).resize(function() {
  if ($hare) drawHare();
  if ($tortoise) drawTortoise();
});

setTimeout(function() { displaySlide(0) }, 100);