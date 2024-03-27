class Board {

/**
Sectors = {

  BULLSEYE : 1,
  TWENTYFIVE : 2,
  SMALL_SECTOR : 3,
  TREBLE : 4,
  BIG_SECTOR : 5,
  DOUBLE : 6,
  MISS : 7,
  ERROR : 8
}
**/


  constructor(sf=1.5) {


    this.BLACK = 1;
    this.WHITE = 2;
    this.BULLSEYE = 1,
    this.TWENTYFIVE = 2,
    this.SMALL_SECTOR = 3,
    this.TREBLE = 4,
    this.BIG_SECTOR = 5,
    this.DOUBLE = 6,
    this.MISS = 7,
    this.ERROR = 8

    this.standard_sectors_rad = [

      { "20": [-0.15708, 0.15708, this.BLACK ] },
      { "1" : [0.15708,  0.47123, this.WHITE ] },
      { "18": [0.471239, 0.78539, this.BLACK ] },
      { "4" : [0.785398, 1.09956, this.WHITE ] },
      { "13": [1.09956,  1.41372, this.BLACK ] },
      { "6" : [1.41372,  1.72788, this.WHITE ] },
      { "10": [1.72788,  2.04204, this.BLACK ] },
      { "15": [2.04204,  2.35619, this.WHITE ] },
      { "2" : [2.35619,  2.67035, this.BLACK ] },
      { "17": [2.67035,  2.98451, this.WHITE ] },
      { "3" : [2.98451,  3.29867, this.BLACK ] },
      { "19": [3.29867,  3.61283, this.WHITE ] },
      { "7" : [3.61283,  3.92699, this.BLACK ] },
      { "16": [3.92699,  4.24115, this.WHITE ] },
      { "8" : [4.24115,  4.55531, this.BLACK ] },
      { "11": [4.55531,  4.86947, this.WHITE ] },
      { "14": [4.86947,  5.18363, this.BLACK ] },
      { "9" : [5.18363,  5.49779, this.WHITE ] },
      { "12": [5.49779,  5.81195, this.BLACK ] },
      { "5" : [5.81195,  6.12611, this.WHITE ]}
    ]

    this.scale_factor = sf;
    this.border = 55 * this.scale_factor;
    this.double_outer= 170 * this.scale_factor;
    this.treble_outer= 107 * this.scale_factor;
    this.ring_width = 8 * this.scale_factor;
    this.wire_width = 0.5 * this.scale_factor;
    this.twentyfive_outer = 16 * this.scale_factor;
    this.twentyfive_dia = 32 * this.scale_factor;
    this.bull_outer = 6.35 * this.scale_factor;
    this.bull_dia = 12.7 * this.scale_factor

    /* 
     * not scaling wire width, just repositioning ? 
     * need to understand this!
    */

    //this.double_inner = (this.double_outer - (this.ring_width+(this.wire_width*2))) * scale_factor;
    this.double_inner = (this.double_outer - (this.ring_width+(this.wire_width*2)));
    this.treble_inner = (this.treble_outer - (this.ring_width+(this.wire_width*2)));
    this.width = ((this.double_outer + this.border)* 2);

    this.dartsRed = "rgb(227,41,46, 255)" //Darts Red
    this.dartsGreen = "rgb(48,159,106, 255)"  //Darts Green
    this.dartsBlack = "rgb(0,0,0, 255)"  //Darts Black
    this.dartsWhite = "rgb(249,223,188, 255)"  //Darts Whitish
    this.dartsWire = "rgb(165,169,180, 255)"  //Darts wire
    this.wireWidth = 1
    //this.BLACK  = 1;
    //this.WHITE = 2;




  }

  getScaleFactor() { return this.scale_factor; }
  getDoubleOuter() { return this.double_outer; }
  getDoubleInner() { return this.double_inner; }
  getTrebleOuter() { return this.treble_outer; }
  getTrebleInner() { return this.treble_inner; }
  getTwentyFiveOuter() { return this.twentyfive_outer; }
  //getTwentyFiveInner() { return this.twentyfive_inner; }
  getBullOuter() { return this.bull_outer; }
  getBorder() { return this.border; }
  getWidth() { return this.width; }

  setOrigin(x,y) { this.x_origin = x; this.y_origin = y; }
  getOrigin(x,y) { return (this.x_origin , this.y_origin) }

  getSectors() { return this.standard_sectors_rad; }


  dartInBoard(eventx,eventy) {

    var x = eventx - this.x_origin;
    var y = (eventy - this.y_origin) * -1;

    //console.log(" Dart in board x,y = " + x + ', ' +y)

    var radial = Math.sqrt(x*x +  y*y);

    //console.log(" sqrt " + x + ', ' +y + ' = ' + radial )

    //var angle_radians = Math.atan2( y,x );
    var angle_radians = Math.atan2( x, y );

    if(angle_radians < 0) { 
      angle_radians +=  (Math.PI*2);
    }

    // console.log("Distance from centre " + radial )
    //console.log("Angle from YAxis rads: " + angle_radians + " degrees: " + ( angle_radians * (180/ Math.PI)) )

    var poc = this.pointOnCircle(angle_radians, radial)

    //console.log(" Point on Circle x, y " + poc.x + ', ' +poc.y );

    var sector = this.whichPie(angle_radians)
    var ring = this.whichRing( radial );
    var number,score;


    if( ring == this.MISS ) { 
      number = 0; score = 0;
    } else if( ring == this.TWENTYFIVE ) { 
      number = 25; score = 25;
    } else if( ring == this.BULLSEYE ) { 
      number = 50; score = 50;
    } else if( ring == this.DOUBLE ) { 
      number = Object.keys(sector)[0]
      score =  number * 2;
    } else if( ring == this.TREBLE ) { 
      number = Object.keys(sector)[0]
      score =  number * 3;
    } else { 
      number = Object.keys(sector)[0]
      score =  number;
    }

 //   highlight_contact(sector, ring );

    return ( { "ring": ring, "number" : number, "score" : score } );

  }

  pointOnCircle(angle_rads,radius) {

    var  poc = {};
    poc.x = radius * Math.cos(angle_rads);
    poc. y = radius * Math.sin(angle_rads);
    return (poc);

  }

  whichPie( angle_rads ) { 

    let board_sectors = this.getSectors();

    var sector;

    if( angle_rads > 6.12611 ) {
     // Its a 20
      return ({ "20": [-0.15708, 0.15708, this.BLACK ] })


    } else {

      for( sector of board_sectors )  {

        var start_rad = sector[Object.keys(sector)[0]][0];
        var end_rad = sector[Object.keys(sector)[0]][1];

        //console.log("Which Pie -sector " + Object.keys(sector)[0] + " ? angle rads " + angle_rads + " Start angle " + start_rad + " End angle " + end_rad +"(" + start_rad*(180/Math.PI) + " : " + end_rad*(180/Math.PI) + ")");


        if( angle_rads > start_rad && angle_rads < end_rad ) {

          return sector;

        }
      }
    }

  }

  whichRing( radial ) {

    if( radial > this.double_outer ) {

      return this.MISS;

    } else if ( radial > this.double_inner ) {

      return this.DOUBLE;

    } else if ( radial > this.treble_outer ) {

      return this.BIG_SECTOR;

    } else if ( radial > this.treble_inner ) {

      return this.TREBLE;

    } else if ( radial > this.twentyfive_outer ) {

      return this.SMALL_SECTOR;

    } else if ( radial > this.bull_outer ) {

      return this.TWENTYFIVE;

    } else {

      return this.BULLSEYE;
    }


  }



/*
  standard_sectors_deg = [

    { "20" : [ 261,  279 ] },
    { "1": [ 279,  297 ] },
    { "18": [ 297,  315 ] },
    { "4" : [ 315,  333 ] },
    { "13": [ 333,  351 ] },
    { "6" : [ -9,  9 ] },
    { "10": [ 9,  27 ] },
    { "15" : [ 27,  45 ] },
    { "2": [ 45,  63 ] },
    { "17" : [ 63,  81 ] },
    { "3": [ 81,  99 ] },
    { "19": [ 99,  117 ] },
    { "7" : [ 117,  135 ] },
    { "16": [ 135,  153 ] },
    { "8" : [ 153,  171 ] },
    { "11": [ 171,  189 ] },
    { "14" : [ 189,  207 ] },
    { "9": [ 207,  225 ] },
    { "12" : [ 225,  243 ] },
    { "5": [ 243,  261 ] }
  ]

struct Sector BoardSectorDefs[NBOARD_SECTORS] = {
                             { 6, -9,  9 },
                             { 10, 9,  27 },
                             { 15, 27,  45 },
                             { 2, 45,  63 },
                             { 17, 63,  81 },
                             { 3, 81,  99 },
                             { 19, 99,  117 },
                             { 7, 117,  135 },
                             { 16, 135,  153 },
                             { 8, 153,  171 },
                             { 11, 171,  189 },
                             { 14, 189,  207 },
                             { 9, 207,  225 },
                             { 12, 225,  243 },
                             { 5, 243,  261 },
                             { 20, 261,  279 },
                             { 1, 279,  297 },
                             { 18, 297,  315 },
                             { 4, 315,  333 },
                             { 13, 333,  351 }
                             };

*/

}


