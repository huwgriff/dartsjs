class DartsGame {

//class DartsMatch {

/* 
 * TODO!!
 * This is not a 'Match' , just a 'Game' with a number of legs. 
 * Need to expand this to have a match that can have a number of different 
 * games e.g 801 team, 601 3's,  501 singels etc. .
*/

  static straight_games = {
    301 : 1,
    401 : 2,
    501 : 3,
    601 : 4,
    701 : 5,
    801 : 6,
    901 : 7,
    1001 : 8
  }

  static bestof = [1,3,5,7,9,11,13,15,17,19,21]

  constructor( {
               hometeam="Home", 
               awayteam="Away", 
               type="501", 
               nlegs=5,
               double_in=1
               }
             )
  {

    this.DEBUG = 1;

    this.hometeam = {
      teamname : hometeam,
      scores : [],
      //remaining : type,
      nlegs: 0,
      going : (double_in) ? false : true 
    }
    this.awayteam = {
      teamname : awayteam,
      scores : [],
      //remaining : type,
      nlegs: 0,
      going : (double_in) ? false : true 
    }

    this.current_throw = { 
                           team : "", 
                           total : 0, 
                           index : 1, 
                           remaining : 0, 
                           scores : { 
                                    dart1 : {
                                      sector: 7,
                                      number: 0,
                                      score: 0
                                    },
                                    dart2 : {
                                      sector: 7,
                                      number: 0,
                                      score: 0
                                    },
                                    dart3 : {
                                      sector: 7,
                                      number: 0,
                                      score: 0
                                    }
                           }
                         }

    this.current_score_legs = { home:0, away:0 }
    
    this.type = type
    this.double_in = double_in
    this.nlegs = nlegs
    this.inplay = 0;

    //this.got_throw = "hometeam"
    this.got_throw = "home"
    //this.current_throw.team = "hometeam"
    this.current_throw.team = "home"

  }


  initCurrentThrow(team) { 
    this.current_throw = { 
                           team : team,
                           total : 0, 
                           index : 1, 
                           remaining : 0,   // What current throwing team has left, updated with eachdart thrown
                           scores : { 
                                    dart1 : {
                                      sector: 7,
                                      number: 0,
                                      score: 0
                                    },
                                    dart2 : {
                                      sector: 7,
                                      number: 0,
                                      score: 0
                                    },
                                    dart3 : {
                                      sector: 7,
                                      number: 0,
                                      score: 0
                                    }
                           }
                         }
  }

  isDoubleIn() { return this.double_in; }

  getHomeTeam() { return this.hometeam.teamname; }
  setHomeTeam(ht) { this.hometeam.teamname = ht; }

  getAwayTeam() { return this.awayteam.teamname; }
  setHomeTeam(at) { this.hometeam.teamname = at; }

  getGameType() { return this.type; }
  setGameType(gt) { this.type = gt; }

  getNoLegs() { return this.nlegs; }
  setNoLegs(l) { this.nlegs = n; }

  getLegsRequired() { return ((this.nlegs+1)/2); }

  getInPlay() { return this.inplay; }
  setInPlay(ip) { this.inplay = ip; }

  getGotThrow() { return this.got_throw; }
  setGotThrow(team) { this.got_throw = team; }

  //getCurrentTeamOff() { return this.current_throw.going; }
  //setCurrentTeamOff() { this.current_throw.going = true; }

  getTeamOff(team) { return( eval ( "this."+team+"team.going" ) ); }
  setTeamOff(team) { eval ( "this."+team+"team.going" + " = " + true  ); }

  getTeamLegs(team) { return( eval ( "this."+team+"team.nlegs" ) ); }
  setTeamLegs(team,n) { eval ( "this."+team+"team.nlegs" + " = " + n  ); }

  addTeamLegs(team) { 

    //var current_score = eval ( "this."+team+"team.nlegs" ); 
    eval ( "this."+team+"team.nlegs" + "++"  ); 
  }

  getRemaining() { 
    //console.log("Trace " + arguments.callee.name );
    return this.current_throw.remaining; 
  }
  setRemaining(total) { 
    this.debug("setRemaining : " + total );
    return this.current_throw.remaining = total; 
  }

  getCurrentTeam() { 
    //console.log("Trace " + arguments.callee.name );
    return this.current_throw.team; 
  }
  setCurrentTeam(teamname) { 
    //console.log("Trace " + arguments.callee.name );
    eval ( "this.current_throw.team" + " = " + teamname  ); 
  }

  getTotalThrown() { return this.current_throw.scores.total; }

  setTotalThrown() {

    //console.log("Trace " + arguments.callee.name );
    /* need to set total incrementally based on cirumstances - e.g scored but not off etc ? */

    this.current_throw.scores.total = parseInt(this.current_throw.scores.dart1.score) 
                                    + parseInt(this.current_throw.scores.dart2.score)
                                    + parseInt(this.current_throw.scores.dart3.score);

  }

  setLegOver() {

    this.debug("setLegOver func()");

    var nlegs = this.getTeamLegs(this.current_throw.team);

    nlegs = nlegs + 1;

    this.setTeamLegs(this.current_throw.team,nlegs);

    /* 
     * Set winner display 
    */

    // a) Trad. Mark leg won above teamname 
    window.scoreboard.displayLegWon(this.current_throw, nlegs);

    // b) Clear boards 

    window.scoreboard.clearBoards();
    // c) Reset remaining


    /* 
     * Reset data 
    */

    // a) Increment legs won by winning team.

    this.addTeamLegs(this.current_throw.team);

    // b) Reset remaining ??

    /*
     * Check if this leg clinched the game.
    */
    var lreq = this.getLegsRequired();

    if( nlegs == lreq ) {
    
      this.debug( "setLegOver() no legs " + nlegs + " Wins the game " );

      this.setGameOver();

    } else { 

      this.debug.console.log( "setLegOver() nlegs " + nlegs + " keep going legs req == " + lreq );

      this.initNextLeg();

    }
   
  }

  initNextLeg( ) {

    this.debug("initNextLeg func() - TODO!");
    // Reset remaining scores
    console.log("Change current_game " + JSON.stringify(window.thismatch.current_game) );

    // clear sideboards
    // Reset starting scores 
    // Init data storage , write previous leg data to staorage ?

  }

  setGameOver() {

    this.debug( "setGameOver func() - TODO!");
    /*
     * Game is over - are we part of Match?

    1) Highlight the Winner
    2) Reset-init everything
    3) Nothing happens until 'New Game clicked' ?
    */

  }

  setBust() {

    this.debug( "setBust func ()");
    console.log("Change current_game " + JSON.stringify(window.thismatch.current_game) );

    // Set darts thrown to 0
    // Set total  = 0

    this.current_throw.scores.dart1.score = 0;
    this.current_throw.scores.dart2.score = 0;
    this.current_throw.scores.dart3.score = 0;
    //this.current_throw.scores.total = 0;

    // Flip next player
    this.initNextThrow();
  }


  initNextThrow( ) {

    this.debug( "Trace initNextThrow func()");

      /* Flip the got throw team */

      window.thismatch.current_game.got_throw = (window.thismatch.current_game.got_throw == "home") ? "away" : "home";
  
      this.debug("Change display got throw to " + window.thismatch.current_game.getGotThrow() );

      window.scoreboard.setNextPlayer();

      /* INITIALISE current_throw !! */
      //this.initCurrentThrow( window.newmatch.got_throw );
      this.initCurrentThrow( window.thismatch.current_game.got_throw );

  }

  processThrow( event ) {

    this.debug("processThrow func()");

    var dart_thrown = window.board.dartInBoard( d3.pointer(event)[0], d3.pointer(event)[1]);

    this.debug("processThrow: RING: " + dart_thrown.ring + " NUMBER: " + dart_thrown.number + " SCORE: " + dart_thrown.score );

    var current_throw = window.thismatch.current_game.current_throw;
    var current_dart = current_throw.index;
    var got_throw = this.getGotThrow();
    var started = this.getTeamOff(got_throw); 
    var double_in = this.isDoubleIn();
    var scoreboard;
    var tally;

    if( got_throw == "home" ) {
       scoreboard = "homescore"; 
       tally = "hometally"; 
    } else {
       scoreboard = "awayscore"; 
       tally = "awaytally"; 
    }

    if ( current_dart == 1 ) {

     /* 
      * Store what player has remaining before start throw 
     */

      var remaining = document.getElementById(scoreboard).innerHTML;  

      this.debug("processThrow: current_dart==1, setRemaining("+remaining+")");
      window.thismatch.current_game.setRemaining(remaining)
    }

    if ( ! started ) {

     /*
      * Player not yet off  - might need a double
     */

      if ( double_in ) {

        this.debug( "**** Still need double in ****" );

        /* 
         * It is double in, have we hit a double (or bull) ? 
        */

        if( dart_thrown.ring == window.board.DOUBLE ||
            dart_thrown.ring == window.board.BULLSEYE ) {

          /*
           * Yes we hit a double 
          */

          this.setTeamOff(got_throw); 

          this.debug("processThrow: current_dart=="+current_dart+" got a double");

          this.setRemaining( this.getRemaining() - dart_thrown.score );

          this.debug("Temp remaining  " + this.getRemaining());


        } else {

          // No double 
          this.debug("Missed Double ");
          //  Set score to zero to total for round does not include what we have hit 
          dart_thrown.score = 0;

        }

      } else {

        // Don't need double so set started

        this.setTeamOff(got_throw); 

        // We cant be bust onfirst dart thrown so subtract score and set remaining 

        this.setRemaining( this.getRemaining() - dart_thrown.score );
        console.log("Temp remaining  " + this.getRemaining());

      }

    } else {

      /*
       *  We are already off
      */
      this.debug("**** Already OFF ****" );
      
      /* 
       * Dart will either be:
       * a) exact remainder - a double normally required.                       
       * b) less than remaining (including a miss),  !! Legit score !!
       * c) more than remaining or		     !! Definite Bust !! 
       * - Will probably have option to override double out - for noobs !!
      */


      if( this.getRemaining() == dart_thrown.score ) {

        /*
         *  a) Exact remainder case - Winner if go it with a double
        */

        if( dart_thrown.ring == window.board.DOUBLE ||
            dart_thrown.ring == window.board.BULLSEYE ) {

          this.debug( "Winner - Got remaining with a double" );

          //window.scoreboard.highlightWinningThrow(dart_thrown);

          this.setRemaining( 0 );
          this.setLegOver()
          return;
    

        } else {

          this.debug( "BUST - Got remaining but not double" );
          this.setBust()

        }

      } else {
   
        /*
         * b or c ) Not a winner, so either bust or not. 
        */
        if( this.getRemaining() < dart_thrown.score ) {

          this.debug( "BUST - Got too many" );

        } else {

          this.debug("Temp remaining  " + this.getRemaining() + " - " + dart_thrown.score );      // ??
          this.debug("Not sure about this in processScore dart no : " + current_dart );
      
          this.setRemaining( this.getRemaining() - dart_thrown.score ); // ??
        }
      }

    }

    window.thismatch.current_game.storeThrow(dart_thrown);

    window.scoreboard.displayDartThrown(this.current_throw);


      // => Is it double in and am I off => 
      // Am I on a finish, Am I bust etc... 
      // On finish == 170 or less
      // => Am i on a finish -N-> am I bust -N-> continue --storescore--
      // => Am i on a finish -N-> am I bust -Y-> store zero and Next player (store and mark as bust ? - dont subtract)
      // => Am i on a finish -Y-> am I bust -N-> continue store score
      // => Am i on a finish -Y-> did I get exact with double -y- Game over!!
      // => Am i on a finish -Y-> am I bust -Y-> store zero and Next player (store and mark as bust ? - dont subtract)
      // => Am i NOT on a finish -N-> am I bust -N-> continue --storescore--


    /* is it */

    this.current_throw.index = (this.current_throw.index%3)+1;

    console.log( "* Throw "+ JSON.stringify(dart_thrown) );
  
    if( current_dart == 3 ) {

      console.log("CURRENT DART IS 3 " + current_dart );

      /*
       * Update the team's score only after the last last has been thrown
       */
  
      this.updateScore( );


      this.initNextThrow();
  
    }
  }

  updateScore ( ) {

    this.debug("updateScore func()");

      // - Who had the throw , away or home ?
    var got_throw = this.getGotThrow();
    var scoreboard = got_throw+"score"; 

      //var got_throw = window.thismatch.current_game.getGotThrow();
  
      // - what did they score ?

      var total = this.getTotalThrown();

      // - what did they have to start with ?
    
      var remaining = document.getElementById(scoreboard).innerHTML;  

      this.debug( "* deduct from " + got_throw +  " * they got " + total  + " they did have "+  remaining + " remaining" );

      var newscore = remaining - this.getTotalThrown();

      document.getElementById(scoreboard).innerHTML = newscore;

  }


  storeThrow( dart_thrown ) {

    this.debug("storeThrow func()");
    /*
     * Explain!
    */
    eval ( "this.current_throw.scores.dart"+this.current_throw.index + " = " + JSON.stringify(dart_thrown)  );

  
    if( this.current_throw.index == 3 ) {

      /* Thrown 3rd dart => End of throw */

      /*
       * Explain!
       * store the 3 dart scores for count back/history
      */

      //eval( "this."+ this.got_throw +".scores.push(this.current_throw.scores)" );
      eval( "this."+ this.got_throw +"team.scores.push(this.current_throw.scores)" );

      this.setTotalThrown(); /* Sum 3 dart scores */
    }

  }

  debug(s) {

    if(this.DEBUG) {
      console.log("dartsgame.js dbg: " +s);
    }
  }


}

