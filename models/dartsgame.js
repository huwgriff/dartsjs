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

  addTeamLeg(team) { 

    //var current_score = eval ( "this."+team+"team.nlegs" ); 
    eval ( "this."+team+"team.nlegs" + "++"  ); 
  }

  getRemaining() { 
    //console.log("Trace " + arguments.callee.name );
    return this.current_throw.remaining; 
  }
  setRemaining(total) { 
    //console.log("Trace " + arguments.callee.name );
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

  getTotal() { return this.current_throw.scores.total; }

  setTotal() {

    //console.log("Trace " + arguments.callee.name );
    /* need to set total incrementally based on cirumstances - e.g scored but not off etc ? */

    this.current_throw.scores.total = parseInt(this.current_throw.scores.dart1.score) 
                                    + parseInt(this.current_throw.scores.dart2.score)
                                    + parseInt(this.current_throw.scores.dart3.score);

  }

  setLegOver() {

    console.log("Trace setLegOver()" + JSON.stringify(this.current_throw.team) );

    //var nlegs = this.getTeamLegs(this.current_throw.team);
    //nlegs = nlegs + 1;
    //this.setTeamLegs(this.current_throw.team,nlegs);

    /* 
     * Set winner display 
    */

    // a) Trad. Mark leg won above teamname 
    window.displayLegWon(this.current_throw, nlegs);

    // b) Clear boards 

    // c) Reset remaining



    /* 
     * Reset data 
    */

    // a) Increment legs won by winning team.
    this.addTeamLegs(this.current_throw.team);

    // b) Reset remaining

    /*
     * Check if this leg clinched the game.
    */
    var lreq = this.getLegsRequired();

    if( nlegs == lreq ) {
    
      console.log( "no legs " + nlegs + " Wins the game " );

      this.setGameOver();

    } else { 

      console.log( "nlegs " + nlegs + " keep going legs req == " + lreq );

      this.initNextLeg();

    }
   
  }

  initNextLeg( ) {

    console.log("Trace initNextLeg() - TODO!");
    // Reset remaining scores
    console.log("Change current_game " + JSON.stringify(window.thismatch.current_game) );

    // clear sideboards
    // Reset starting scores 
    // Init data storage , write previous leg data to staorage ?

  }

  setGameOver() {

    //console.log("Trace " + arguments.callee.name );
    /*
     * Game is over - are we part of Match?
    */
    console.log( "Trace setGameOver() - TODO!");
    console.log("Change current_game " + JSON.stringify(window.thismatch.current_game) );


  }
  setBust() {

    console.log("Trace setBust()");
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

    console.log("Trace initNextThrow() !");
    console.log("Change current_game " + JSON.stringify(window.thismatch.current_game) );
      /* Flip the got throw team */

      //window.newmatch.got_throw = (window.newmatch.got_throw == "home") ? "away" : "home";
      window.thismatch.current_game.got_throw = (window.thismatch.current_game.got_throw == "home") ? "away" : "home";
  
      console.log("Change display got throw to " + window.thismatch.current_game.getGotThrow() );

      window.setNextPlayer();

      /* INITIALISE current_throw !! */
      //this.initCurrentThrow( window.newmatch.got_throw );
      this.initCurrentThrow( window.thismatch.current_game.got_throw );

  }

  processScore( dartthrow ) {

    //if( ! ("newmatch" in window) ) {
        //console.log( "Start a newmatch ");
        //return;
    //}

    //var current_throw = window.newmatch.current_throw;
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

      /* Get remaining at start of throw */

      var remaining = document.getElementById(scoreboard).innerHTML;  
      window.thismatch.current_game.setRemaining(remaining)
    }

    /**
    console.log("CURRENT DART IS " + current_dart );
    console.log("CURRENT RMAINING IS " + window.thismatch.current_game.getRemaining() );
    **/

    if ( ! started ) {

     // Not off yet 

      console.log( "**** Not Started ****" );

      if ( double_in ) {

        console.log( "**** Need double in ****" );

        // It's double in, have we hit a double ? 

        if( dartthrow.sector == window.board.DOUBLE ||
            dartthrow.sector == window.board.BULLSEYE ) {

          // Yes we hit a double 
          console.log("Got Double ");
          this.setTeamOff(got_throw); 

          this.setRemaining( this.getRemaining() - dartthrow.score );

          console.log("Temp remaining  " + this.getRemaining());


        } else {

          // No double 
          console.log("Missed Double ");
          //  Set score to zero to total for round does not include waht we have hit 
          dartthrow.score = 0;

        }

      } else {

        // Don't need double so set started
        this.setTeamOff(got_throw); 

        // We cant be bust onfirst dart thrown so subtract score and set remaining 

        this.setRemaining( this.getRemaining() - dartthrow.score );
        console.log("Temp remaining  " + this.getRemaining());

      }

    } else {

      // We are already off

      console.log( "**** Already OFF ****" );
      
      /* Dart will either be :
       * i) less than remaining (including a miss),  !! Legit score !!
       * ii) more than remaining or		     !! Definite Bust !! 
       * iii) exact remainder                        !! Double out need to be a double else Bust
       * - Will probably have option to override double out - for noobs !!
      */


      // iii ) Exact remainder case

      if( this.getRemaining() == dartthrow.score ) {

        // Did we get it with a double?
        if( dartthrow.sector == window.board.DOUBLE ||
            dartthrow.sector == window.board.BULLSEYE ) {

          console.log( "Winner - Got remaining with a double" );

          this.setRemaining( 0 );
          this.setLegOver()
    

        } else {

          console.log( "BUST - Got remaining but not double" );
          this.setBust()

        }

      } else {

        this.setRemaining( this.getRemaining() - dartthrow.score ); // ??
        console.log("Temp remaining  " + this.getRemaining() + " - " + dartthrow.score );      // ??
      }

    }

    

    //document.getElementById(scoreboard).innerHTML = newscore;
    //window.displayDartThrown(dartthrow);

    window.thismatch.current_game.storeThrow(dartthrow);

    window.displayDartThrown(this.current_throw);


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

    console.log( "* Throw "+ JSON.stringify(dartthrow) );
  
    if( current_dart == 3 ) {
  
      console.log("CURRENT DART IS 3 " + current_dart );

      // - Who had the throw ?
      var got_throw = window.thismatch.current_game.getGotThrow();
      console.log( "* deduct from " + got_throw );
  
      // - what did they score ?

      var total = this.getTotal();
      console.log( "** they got " + total );

      // - what did they have to start with ?
    
      var remaining = document.getElementById(scoreboard).innerHTML;  
      console.log( "*** remain " + remaining );

      var newscore = remaining - this.getTotal();

      document.getElementById(scoreboard).innerHTML = newscore;

      this.initNextThrow();
  
    }
  }


  storeThrow( dartthrow ) {

    //console.log ( "StoreThrow() Params Object is  " + JSON.stringify(dartthrow)  );
    //console.log ( "this.current_throw.scores.dart"+this.current_throw.index + " = " + JSON.stringify(dartthrow)  );
    //console.log ( "this.current_throw.scores.dart"+this.current_throw.index );

    /*
     * Explain!
    */
    eval ( "this.current_throw.scores.dart"+this.current_throw.index + " = " + JSON.stringify(dartthrow)  );

    //console.log( "storedThrow " + dartthrow.number + " in "+ JSON.stringify(this.current_throw) );
  
    if( this.current_throw.index == 3 ) {

      /* Thrown 3rd dart => End of throw */

      //console.log( "PUSH  " +  "this."+ this.got_throw + "team.scores.push(this.current_throw.scores )" );
      //console.log( "pushed " + JSON.stringify(this.current_throw.scores) );

      /*
       * Explain!
       * store the 3 dart scores for count back/history
      */

      //eval( "this."+ this.got_throw +".scores.push(this.current_throw.scores)" );
      eval( "this."+ this.got_throw +"team.scores.push(this.current_throw.scores)" );

      this.setTotal(); /* Sum 3 dart scores */
    }

    //this.current_throw.index = (this.current_throw.index%3)+1;
    
  }


}

