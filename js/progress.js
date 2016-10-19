(function(anchorSelect, sectionsSelect) {
  "use strict";
  
  var progressBarClass = 'progress';
  var progressSegmentClass = 'progress-segment';
  var activeClass = 'active';
  
  var position = 0; 
  var timeToScroll = 100;
  var anchor = (typeof anchorSelect == typeof "") ? document.querySelector(anchorSelect) : anchorSelect;
  var sections = (typeof sectionsSelect == typeof "") ? document.querySelectorAll(sectionsSelect) : sectionsSelect;
  
  
  var setupScrollListener = function setupScrollListener() {
    var startHeight = sections[0].getBoundingClientRect().top;
    var positionHeight = [];

    var determinateHeights = function determinateHeights() {
      var accumelativeHeight = startHeight;
      for(var i = 0; i < sections.length; i++){
        var height = sections[i].offsetHeight;
        var adjust = height / 2;
        positionHeight[i] = {
          height: height,
          previous: accumelativeHeight - adjust,
          next: (accumelativeHeight + height) - adjust
        };

        accumelativeHeight += height;
      }
    }    
      
    /**
     * Calculate which position should be marked based on current scroll
     */ 
    var calcPosition = function calcPosition(force) {

      force = force || false;
      var scroll = anchor.scrollTop;

      if (scroll >= positionHeight[position].next || scroll < positionHeight[position].previous || force === true){

        for (var i = 0; i < sections.length; i++) {
          if (scroll < positionHeight[i].next && scroll >= positionHeight[i].previous){

            setPosition(i);

            return;
          }
        }
      }
    }

    determinateHeights();
    calcPosition(true);
    
    window.addEventListener('keydown', function onKeyUpOrDown(event){
      var UP = 38;
      var DOWN = 40;
      
      if (event.keyCode == UP) {
        previous();
        event.preventDefault();
      } else if (event.keyCode == DOWN) {
        next();
        event.preventDefault();
      }
    });
      
    window.addEventListener('resize', function resizeWindow() {
      determinateHeights();
      calcPosition();
    });
      
    window.addEventListener('scroll', calcPosition);
  };
  
  var setPosition = function(newPosition) {
    document.getElementsByClassName(progressSegmentClass)[position].classList.remove('active');

    document.getElementsByClassName(progressSegmentClass)[newPosition].classList.add('active');

    position = newPosition;
  };
  
  var scroll = function scroll(toPosition, duration){
    anchor.scrollTop = sections[toPosition].getBoundingClientRect().top;
    return; // TODO add animation
      
    var toScroll = position > toPosition ? position - toPosition : toPosition - position;
    var duration = timeToScroll * toScroll;
    var to = sections[toPosition].offsetTop;
    
    var timePerTick = 10;
    
    var animate = setInterval((function(to, duration) {
      return function animate() {
        var perTick = (to - anchor.scrollTop) / duration * timePerTick;
        anchor.scrollTop = anchor.scrollTop + perTick;
        if (anchor.scrollTop === to){
          window.clearInterval(animate);
        } 
        duration = duration - timePerTick;
      }
    })(to, duration), timePerTick);
  };
  
  var previous = function(){
    position > 0 ? scroll(position - 1) : scroll(sections.length - 1);
  };
  
  var next = function(){
    position < sections.length -1 ? scroll(position + 1) : this.scroll(0);
  }
  
  var createProgressSegment = function createProgressSegment(elementType, classToAdd, append, pos) {
    var elem = document.createElement(elementType);

    elem.classList.add(classToAdd);

    elem.addEventListener('click', function() {
      scroll(pos);
    }, true);
    var appendAnchor = (typeof append == typeof "") ? document.querySelector(append) : append;
    appendAnchor.appendChild(elem);
  }
  
  var createProgressBar = function createProgressBar(){
    var bar = document.createElement('nav');
    bar.classList.add(progressBarClass);
    anchor.appendChild(bar);
    
    
    for(var i = 0, l = sections.length; i < l; i++){
      createProgressSegment('div', progressSegmentClass, bar, i);
    }
  };
  
  createProgressBar();
  setupScrollListener();
  
})(document.body, '.step');