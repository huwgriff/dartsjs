class ScoreBoard {

  constructor(sf=1.5) {

    this.BLACK = 1;
    this.WHITE = 2;
    this.DEBUG = 1;

  }

  init(starting) {

    /* chalk boards either side */ 

    this.sideBoardsDisplay();

    /* leg count display */

    this.legCountDisplay();

    this.setThrowIndicator(starting) 
    
  }

  getThrowIndicator(team) {

    document.querySelector('.team#' +team+ '.throw_indicator' )
  }

  setThrowIndicator(throwing) {

    // var firstlegstart
    this.debug ("setThrowIndicator()");

    document.querySelector (".team#"+throwing+ " .throw_indicator").classList.add("hasthrow");

  }

  setNextPlayer() {

    this.debug ("setNextPlayer()");

    var got_throw = window.thismatch.current_game.getGotThrow();

    var ht = document.querySelector('.team#home  .throw_indicator' )
    var at = document.querySelector('.team#away  .throw_indicator' )

    var tally = document.getElementById(got_throw+ "tally" );
    var newrow = document.createElement("div");

    newrow.classList.add("tallyrow");
    tally.appendChild( newrow );


    if(got_throw == "home" ) {

       ht.classList.add("hasthrow");
       at.classList.remove("hasthrow");

    } else {

       at.classList.add("hasthrow");
       ht.classList.remove("hasthrow");

    }
  }

  sideBoardsDisplay() {

    this.debug ("clearSideBoardsDisplay func()");

    //console.log("Trace " + arguments.callee.name );

    var first_leg_start = window.thismatch.current_game.getGotThrow();

    /* 
     * Clear side scoreboards 
    */

    this.clearSideBoardsDisplay();

    /*
    var hometally = document.getElementById("hometally");
    hometally.innerHTML = "";
    var awaytally = document.getElementById("awaytally");
    awaytally.innerHTML = "";
    */

    /*
     * add first scoring row to whoever's off first 
    */

    // TO DOC SOME MORE 
    var newrow = document.createElement("div");
    newrow.classList.add("tallyrow");
 
    if(first_leg_start == "home") {
      hometally.appendChild( newrow );
    } else {
      awaytally.appendChild( newrow );
    }

  }


  clearSideBoardsDisplay() {

    this.debug ("clearSideBoardsDisplay func()");

    var hometally = document.getElementById("hometally");
    hometally.innerHTML = "";
    var awaytally = document.getElementById("awaytally");
    awaytally.innerHTML = "";
  }

  clearBoards() {

    this.clearSideBoardsDisplay()

  }

  legCountDisplay() {
  /*
   * Setup the leg count display 
  */

    /* Clear leg display for home and away */
    var homelegs = document.getElementById("homelegs");
    var awaylegs = document.getElementById("awaylegs");
    homelegs.textContent  = '';
    awaylegs.textContent  = '';

    /* 
     * How many legs are we playing ?  One more than  half point in 'best of' number
    */
    var bs_selector = document.getElementById("bestof-selector");
    var bestof = parseInt(bs_selector.options[bs_selector.selectedIndex].text);
    var legs_required = (bestof+1)/2;

    /*
     * Setup divisions in the legs display 
     *
     * -------------------------------
     * |     |     |     |     |     |
     * -------------------------------
     *
    */
    for (let i = 0; i < (bestof+1)/2; i += 1) {

      var hDiv = document.createElement('div'),
          aDiv = document.createElement('div');
      hDiv.className = 'leg';
      aDiv.className = 'leg';
      hDiv.id = 'homeleg'+(i+1);
      aDiv.id = 'awayleg'+(i+1);
      homelegs.appendChild(hDiv);
      awaylegs.appendChild(aDiv);

    };

    /* 
     * add style so that divions are equal 
    */
    homelegs.style.gridTemplateColumns  = 'repeat('+legs_required+', 1fr)';
    awaylegs.style.gridTemplateColumns  = 'repeat('+legs_required+', 1fr)';

  }

  displayLegWon( dartthrow, leg_number )
  {
    // DOCUMENT THIS 

    //var got_throw = window.newmatch.getGotThrow();
    var got_throw = window.thismatch.current_game.getGotThrow();

    this.debug ("displayLegWon " + got_throw );
    //this.debug ("displayLegWon nleg  " + leg_number );
    //this.debug ("gETID   " + got_throw+"leg"+leg_number );

    var ldiv = document.getElementById(got_throw+"leg"+leg_number);
    ldiv.classList.add("legwon");

  }

  displayDartThrown(dartthrow) 
  {

    this.debug ("displayDartThrown(" + dartthrow + ")" );

    // DOCUMENT THIS 
    var index = dartthrow.index;
    //var got_throw = window.newmatch.getGotThrow();
    var got_throw = window.thismatch.current_game.getGotThrow();

    this.debug ("dartthrow.scores.dart"+index+".score" );

    var score = eval ("dartthrow.scores.dart"+index+".score" );

    var tally = document.getElementById(got_throw+ "tally" );
    var tallyrow = document.getElementById(got_throw+ "tally" ).lastChild;
    var iDiv = document.createElement('div');

    if(parseInt(score) == 0) { score = "-"; }

    iDiv.innerHTML = score;
    tallyrow.appendChild(iDiv);

    if(index == 3) {
     /* update total (of 3 darts) field */

      iDiv = document.createElement('div');
      iDiv.innerHTML = window.thismatch.current_game.getTotalThrown();
      tallyrow.appendChild(iDiv);
    }

  }


  highlightWinningThrow(dart_throw) {

    this.debug ("highlightWinningThrow(" + dart_throw + ")" );
  }

  displayWinner(winner) {

    this.debug ("displayWinner(" + winner + ")" );
  }

  debug(s) {

    if(this.DEBUG) { console.log(s) }

  }

}

