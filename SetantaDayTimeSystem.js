//Day Time System
var Imported = Imported || {};
Imported.Setanta = true;

var Setanta = Setanta || {};
Setanta.DT = Setanta.DT || {};
Setanta.DT.pluginName = "SetantaDayTimeSystem";


/*:
 * @plugindesc This Plug-in enables a Day/Time System
 * @author Setanta
 * @target MZ
 * 
 * @param Enable Gabs
 * @text Enable Gabs
 * @desc Enable automatic gab message updates
 * @type boolean
 * @default true
 * 
 * @param Default Start Date
 * @text Default Start Date
 * @desc An optional Default Start Date for your game, format as day-month-year
 * @type string
 * @default 1-1-2016
 * 
 * @param Message Format
 * @text Message Format
 * @desc The Default format of the Message output
 * @type multiline_string
 * @default %FD %TD
 * 
 * 
 * @param Times Of Day
 * @text Times of Day
 * @desc These are your defined times of day
 * @type string
 * @default Morning,Noon,Afternoon,Evening,Night
 * 
 * @param Enable Screen Tint
 * @text Enable Screen Tint
 * @desc Enable automatic screen tinting
 * @type boolean
 * @default true
 * 
 * 
 * @param Tint Value Type
 * @text Tint Value Type
 * @desc The type of value used to define the screen tints
 * @type select
 * @option RGBG
 * @option 8 Char Hex
 * @option 4 Char Hex
 * @default RGBG
 * 
 * 
 * @param Tint Values
 * @text Tint Values
 * @desc Include frameCount_ColorOptions
 * @type string
 * @default 60_0_0_0_0,60_27_27_0_0,60_-50_-50_0_25,60_-75_-100_0_75,60_-125_-125_0_125
 * 
 * 
 * @param Game Variables
 * @text Game Variables
 * @desc In order, define vars for Day,Month,Year,Time of Day
 * @type string
 * 
 * @param Day Name Variable
 * @text Day Name Variable
 * @desc This variable holds the name of the Weekday
 * @type number
 * 
 * @param Month Name Variable
 * @text Month Name Variable
 * @desc This holds the name of the the month
 * @type number
 *  
 * 
 * @param Game Switches
 * @text Game Switches
 * @desc Use these Switches to denote times of day, in same order as times of day
 * @type string
 * 
 * 
 * @param Common Events
 * @text Common Events
 * @desc Common events for advancing Period,Day,Month,Year
 * @type string
 * 
 * 
 * @command Advance Period
 * @text Advance Period
 * @desc Advance the period to the next one
 * 
 * @command Set Period
 * @text Set Period
 * @desc Set the Period Directly
 * 
 * @arg period
 * @type string
 * 
 * @command Advance Day
 * @text Advance Day
 * @desc Advance the Day to the Next one
 * 
 * @command Set Day
 * @text Set Day
 * @desc Sets the Day to the specified Day
 * 
 * @arg day
 * @type string
 * 
 * @command Advance Month
 * @text Advance Month
 * @desc Advances the Month by 1
 * 
 * @command Set Month
 * @text Set Month
 * @desc Set the Month the specified month
 * 
 * @arg month
 * @type string
 * 
 * 
 * @command Advance Year
 * @text Advance Year
 * @desc Advances the year by 1
 * 
 * 
 * @command Set Year
 * @text Set Year
 * @desc Sets the year to the specified year, 4 digits or more pls
 * 
 * @arg year
 * @type number
 * 
 * @command Enable Gabs
 * @text Enable Gabs
 * @desc Turn the gabs on or off
 * 
 * @args enable
 * @type boolean
 * 
 * @command Enable Tints
 * @text Enable Tints
 * @desc Enables the tints
 * 
 * @arg enable
 * @type boolean
 * 
 * 
 * s
 * @help
 * 
 * 
 * Tint Values:
 * When specifying tint values, the format is as follows:
 * 
 * ===========================================================================
 * RGBG
 * 
 * Red Green Blue Grey
 * First you specify the number of frames, then separate each value using "_"
 * 
 * Example:  
 * 60_-50_-50_0_25
 * 
 * Where 60 is the frame count, the first -50 is the Red value, the second
 * -50 is the green value, 0 is blue and 25 is the grey value.
 * 
 * ===========================================================================
 * 8 Char Hex
 * 
 * As opposed to the usual 6 Character hex, something like #FF18AB, 
 * this uses an 8 Char hex to accomodate the grey value.
 * As above, specify the frame count, then separate everything using "_"
 * Alternatively, if you want to express a negaive value, preceed the value
 * by '-0x', e.g. 60_-0xFF_-0x09_FF_14
 * Example:
 * 60_FF_FF_00_14
 * 
 * ===========================================================================
 * 4 Char Hex
 * 
 * 4 Char hex uses a similar extenstion to its definition that the 
 * 8 Char hex uses, and thats for accomodating the grey value.
 * Note that every hex char in this string is that value
 * multiplied by 17, aka the character is doubled, so F is FF
 * A is AA, 4 is 44 etc 
 * Specify the Frames and separate using "_"
 * 
 * Example:
 * 60_F_A_4_1
 * or
 * 60_-0xF_-0xA_4_1
 * 
 * 
 */

Setanta.DT.gabsEnabled = PluginManager.parameters(Setanta.DT.pluginName)['Enable Gabs'] == 'true';
Setanta.DT.defaultStartDate = PluginManager.parameters(Setanta.DT.pluginName)['Default Start Date'];
Setanta.DT.outputMessage = PluginManager.parameters(Setanta.DT.pluginName)['Message Format'];
Setanta.DT.timesOfDay = PluginManager.parameters(Setanta.DT.pluginName)['Times Of Day'].split(",");
Setanta.DT.tintEnabled = PluginManager.parameters(Setanta.DT.pluginName)['Enable Screen Tint'] == 'true';
Setanta.DT.tintValType = PluginManager.parameters(Setanta.DT.pluginName)['Tint Value Type'];
Setanta.DT.tintVals = PluginManager.parameters(Setanta.DT.pluginName)['Tint Values'].split(",");
Setanta.DT.gameVars = PluginManager.parameters(Setanta.DT.pluginName)['Game Variables'].split(",");
Setanta.DT.gameSwitches = PluginManager.parameters(Setanta.DT.pluginName)['Game Switches'].split(",");
Setanta.DT.commonEvents = PluginManager.parameters(Setanta.DT.pluginName)['Common Events'].split(",");
Setanta.DT.dayNameVar = parseInt(PluginManager.parameters(Setanta.DT.pluginName)['Day Name Variable']);
Setanta.DT.MonthNameVar = parseInt(PluginManager.parameters(Setanta.DT.pluginName)['Month Name Variable']);



//=================================================================================================================================
//                                      Plugin Commands
//=================================================================================================================================

PluginManager.registerCommand(Setanta.DT.pluginName, 'Advance Period', args => {
    $gameSystem._dayTime.advancePeriod();
});

PluginManager.registerCommand(Setanta.DT.pluginName, 'Set Period', args => {
    $gameSystem._dayTime.setPeriod(args.period);
});

PluginManager.registerCommand(Setanta.DT.pluginName, 'Advance Day', args => {
    $gameSystem._dayTime.advanceDay();
});

PluginManager.registerCommand(Setanta.DT.pluginName, 'Set Day', args => {
    if(!isNaN(args.day)){
        args.day = $gameSystem._dayTime.daysOfWeek[parseInt(args.day)];
    }
    if(args.day) $gameSystem._dayTime.setDay(args.day);
});

PluginManager.registerCommand(Setanta.DT.pluginName, 'Advance Month', args => {
    $gameSystem._dayTime.advanceMonth();
});

PluginManager.registerCommand(Setanta.DT.pluginName, 'Set Month', args => {
    $gameSystem._dayTime.setMonth(args.month);
});

PluginManager.registerCommand(Setanta.DT.pluginName, 'Advance Year', args => {
    $gameSystem._dayTime.advanceYear();
});

PluginManager.registerCommand(Setanta.DT.pluginName, 'Set Year', args => {
    $gameSystem._dayTime.setYear(parseInt(args.year))
});

PluginManager.registerCommand(Setanta.DT.pluginName, 'Enable Gabs', args => {
    Setanta.DT.gabsEnabled = args.enabled;
});

PluginManager.registerCommand(Setanta.DT.pluginName, 'Enable Tints', args => {
    Setanta.DT.tintEnabled = args.enabled;
});
//=================================================================================================================================
//                                           Game System Fuckery
//=================================================================================================================================
//Add System to Game_System
Setanta.DT.GameSysInit = Game_System.prototype.initialize;
Game_System.prototype.initialize = function(){
    Setanta.DT.GameSysInit.call(this);
    if(!this._dayTime){
        this._dayTime = new Game_DayTimeSystem();
    }
};

//Set Game Vars on Load
Setanta.DT.GameVarInit = Game_Variables.prototype.initialize;
Game_Variables.prototype.initialize = function(){
    Setanta.DT.GameVarInit.call(this);
    if($gameSystem._dayTime._dayVar) this._data[$gameSystem._dayTime._dayVar] = $gameSystem._dayTime._day;
    if($gameSystem._dayTime._dayNameVar){
        var day = $gameSystem._dayTime.getDayOfWeek($gameSystem._dayTime._day, $gameSystem._dayTime.monthsOfYear[$gameSystem._dayTime._month], $gameSystem._dayTime._year);
        this._data[$gameSystem._dayTime._dayNameVar] = $gameSystem._dayTime.daysOfWeek[day];
    } 
    if($gameSystem._dayTime._monthVar) this._data[$gameSystem._dayTime._monthVar] = $gameSystem._dayTime._month;
    if($gameSystem._dayTime._monthNameVar) this._data[$gameSystem._dayTime._monthNameVar] = $gameSystem._dayTime.monthsOfYear[$gameSystem._dayTime._month];
    if($gameSystem._dayTime._yearVar) this._data[$gameSystem._dayTime._yearVar] = $gameSystem._dayTime._stringYear;
    if($gameSystem._dayTime._todVar) this._data[$gameSystem._dayTime._todVar] = $gameSystem._dayTime._tod;

};


//Set Switches on Load
Setanta.DT.GameSwitchInit = Game_Switches.prototype.initialize;
Game_Switches.prototype.initialize = function(){
    Setanta.DT.GameSwitchInit.call(this);
    if($gameSystem._dayTime){
       var index = Setanta.DT.timesOfDay.indexOf($gameSystem._dayTime._tod);
       if(index != 1){
           var varToSet = ($gameSystem._dayTime.tod_switches[index]) ? $gameSystem._dayTime.tod_switches[index] : null;
           if(varToSet == null) return;

           this._data[varToSet] = true;
       }
    }
};


//=================================================================================================================================
//                                           Day/Time System Fuckery
//=================================================================================================================================
function Game_DayTimeSystem(){
    this.initialize(...arguments);
}

Game_DayTimeSystem.prototype.initialize = function(){
    //System wide Calendar Reference Objects
    this.monthsOfYear = ["", "January", "February","March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.shortMonthsOfYear = ["", "Jan", "Feb","Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.daysOfMonth = [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //Current Date Values
    this._tod = Setanta.DT.timesOfDay[0];
    this._day = 0;
    this._month = 0;
    this._year = 0;
    this._stringYear = "";
    
    //System Variables
    this._dayVar = null;
    this._dayNameVar = Setanta.DT.dayNameVar;
    this._monthVar = null;
    this._monthNameVar = Setanta.DT.MonthNameVar;
    this._yearVar = null;
    this._todVar = null;

    //System Switches
    this.tod_switches = [];

    //Common Event Ids
    this._onAdvancePeriod = null;
    this._onAdvanceDay = null;
    this._onAdvanceMonth = null;
    this._onAdvanceYear = null;

    //Screen Tint Values
    this.screen_tints = [];

    //Fill everything in
    this.parseDefaultDate();
    this.setGameVariables();
    this.setGameSwitches();
    this.setCommonEvents();
    this.setTints();
};

Game_DayTimeSystem.prototype.isGabEnabled = function(){
    return Setanta.DT.gabsEnabled;
};

Game_DayTimeSystem.prototype.isTintEnabled = function(){
    return Setanta.DT.tintEnabled;
}

Game_DayTimeSystem.prototype.parseDefaultDate = function(){
    var vals = Setanta.DT.defaultStartDate.split("-");
    this._day = parseInt(vals[0]);
    this._month = parseInt(vals[1]);
    this._year = parseInt(vals[2]);
    this._stringYear = this.parseYear(vals[2]);
};

//This is to get rid of the pesky ',' that shows up otherwise
Game_DayTimeSystem.prototype.parseYear = function(year){
    if(year.length < 4) return year;
    return year.charAt(0) + year.charAt(1) + "\u200B" + year.charAt(2) + year.charAt(3)
};


Game_DayTimeSystem.prototype.setGameVariables = function(){
    var gameVars = Setanta.DT.gameVars;
    if(gameVars.length != 0){
        var gameVarsLen = gameVars.length;
        if(isNaN(parseInt(gameVars[0]))){
            this._dayVar = null;
        }
        else{
            this._dayVar = parseInt(gameVars[0]);
        }
        if(gameVarsLen > 1){
            if(isNaN(parseInt(gameVars[1]))){
                this._monthVar = null;
            }
            else{
                this._monthVar = parseInt(gameVars[1]);
            }
        }
        if(gameVarsLen > 2){
            if(isNaN(parseInt(gameVars[2]))){
                this._yearVar = null;
            }
            else{
                this._yearVar = parseInt(gameVars[2]);
            }
        }
        if(gameVarsLen > 3){
            if(isNaN(parseInt(gameVars[3]))){
                this._todVar = null;
            }
            else{
                this._todVar = parseInt(gameVars[3]);
            }
        }        
    }
};

Game_DayTimeSystem.prototype.setTimeOfDayVariables = function(){
    if(this._dayVar){
        $gameVariables._data[this._dayVar] = this._day;
        if(this._dayNameVar) {
            var day = this.getDayOfWeek(this._day, this.monthsOfYear[this._month], this._year);
            $gameVariables._data[this._dayNameVar] = this.daysOfWeek[day];
        }
    }
    if(this._monthVar){
        $gameVariables._data[this._monthVar] = this._month;
        if(this._monthNameVar) $gameVariables._data[this._monthNameVar] = this.monthsOfYear[this._month];
    }
    if(this._yearVar){
        //Always set it to the stringYear for display purposes
        $gameVariables._data[this._yearVar] = this._stringYear;
    }
    if(this._todVar){
        $gameVariables._data[this._todVar] = this._tod;
    }
};

Game_DayTimeSystem.prototype.setGameSwitches = function() {
    var tods = Setanta.DT.timesOfDay;
    this.tod_switches = [];
    for(tod in tods){
        //If theres more times of day than switches, break
        if((parseInt(tod) + 1) > Setanta.DT.gameSwitches.length){
            break;
        } 
        //Get Switch Value
        var tod_switch = parseInt(Setanta.DT.gameSwitches[tod]);
        //If it is a number, set add the switch, otherwise push null
        (isNaN(tod_switch)) ? this.tod_switches.push(null) : this.tod_switches.push(tod_switch);
    };
   
};

Game_DayTimeSystem.prototype.setTimeOfDaySwitches = function(){
    var indexOfLocalSwitchValue = Setanta.DT.timesOfDay.indexOf(this._tod);
    for(switchNum of this.tod_switches){
        $gameSwitches._data[switchNum] = false;
    }

    var switchNum = this.tod_switches[indexOfLocalSwitchValue];
    $gameSwitches._data[switchNum] = true;
};

Game_DayTimeSystem.prototype.setCommonEvents = function(){
    var events = Setanta.DT.commonEvents;
    if(events.length != 0){
        var eventsLen = events.length;
        if(isNaN(parseInt(events[0]))){
            this._onAdvancePeriod = null;
        }
        else{
            this._onAdvancePeriod = parseInt(events[0]);
        }
        if(eventsLen > 1){
            if(isNaN(parseInt(events[1]))){
                this._onAdvanceDay = null;
            }
            else{
                this._onAdvanceDay = parseInt(events[1]);
            }
        }
        if(eventsLen > 2){
            if(isNaN(parseInt(events[2]))){
                this._onAdvanceMonth = null;
            }
            else{
                this._onAdvanceMonth = parseInt(events[2]);
            }
        }
        if(eventsLen > 3){
            if(isNaN(parseInt(events[3]))){
                this._onAdvanceYear = null;
            }
            else{
                this._onAdvanceYear = parseInt(events[3]);
            }
        }
    }
};


Game_DayTimeSystem.prototype.setTints = function(){
    for(val of Setanta.DT.tintVals){
        var tempVals = val.split("_");
        var container = [];
        for(tVal of tempVals){
            //Parse Delay Separately
            if(tVal == tempVals[0]){
                container.push(parseInt(tVal));
            }
            else{
                container.push(this.parseTintVal(tVal));
            }
           
        }
        this.screen_tints.push(container);
    }
};

Game_DayTimeSystem.prototype.parseTintVal = function(tintVal){
    switch(Setanta.DT.tintValType){
        case "RGBG":
            return parseInt(tintVal);
        case "8 Char Hex":
            return parseInt(tintVal, 16);
        case "4 Char Hex":
            return parseInt(tintVal, 16) * 16 + parseInt(tintVal, 16);
        default:
            return parseInt(tintVal);
        
    }
};

Game_DayTimeSystem.prototype.advancePeriod = function(){
    
    var index = Setanta.DT.timesOfDay.indexOf(this._tod);
   
    index += 1;
    if(index >= Setanta.DT.timesOfDay.length){
        index = 0;
        this._tod = Setanta.DT.timesOfDay[index];
        this.advanceDay(); 
        if(this._onAdvancePeriod) $gameTemp._commonEventQueue.push(this._onAdvancePeriod);
    } 
    else{
        this._tod = Setanta.DT.timesOfDay[index];
        this.setTimeOfDaySwitches();
        this.setTimeOfDayVariables();
        if(this._onAdvancePeriod) $gameTemp._commonEventQueue.push(this._onAdvancePeriod);
    };
    this.updateEffects();
};

Game_DayTimeSystem.prototype.advanceDay = function(){
    this._day += 1;
    if(this._day > this.daysOfMonth[this._month]){
        this._day = 1;
        this.advanceMonth();
        if(this._onAdvanceDay) $gameTemp._commonEventQueue.push(this._onAdvanceDay);
    }
    else{
        this.setTimeOfDaySwitches();
        if(this._onAdvanceDay) $gameTemp._commonEventQueue.push(this._onAdvanceDay);
    };
    this.updateEffects();
};

Game_DayTimeSystem.prototype.advanceMonth = function(){
    this._month += 1;
    if(this._month >= this.monthsOfYear.length){
        this._month = 1;
        this.advanceYear();
        if(this._onAdvanceMonth) $gameTemp._commonEventQueue.push(this._onAdvanceMonth);
    }
    else{
        this.setTimeOfDaySwitches();
        this.setTimeOfDayVariables();
        if(this._onAdvanceMonth) $gameTemp._commonEventQueue.push(this._onAdvanceMonth);
    };
    this.updateEffects();
};

Game_DayTimeSystem.prototype.advanceYear = function(){
    this._year += 1;
    this._stringYear = this.parseYear(this._year.toString());
    if(this.isLeapYear(this._yearVar)){
        this.daysOfMonth[2] = 29;
    }
    else{
        this.daysOfMonth[2] = 28;
    }
    this.setTimeOfDaySwitches();
    this.setTimeOfDayVariables();
    if(this._onAdvanceYear) $gameTemp._commonEventQueue.push(this._onAdvanceYear);
    this.updateEffects();
};

Game_DayTimeSystem.prototype.incrementDayTimeVals = function(){
    var index = Setanta.DT.timesOfDay.indexOf(this._tod);
   
    index += 1;
    if(index >= Setanta.DT.timesOfDay.length){
        index = 0;
        this.advanceDay(); 
    } 
    this._tod = Setanta.DT.timesOfDay[index];
};

Game_DayTimeSystem.prototype.isLeapYear = function(year){
    if(year % 100 == 0){
        return year % 400 == 0;
    }
     return (year % 4 == 0);
};

Game_DayTimeSystem.prototype.getDayOfWeek = function(day = this._day, month = this.monthsOfYear[this._month], year = this._year) {
    let months = ["", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February"];
    let monthCode = [0, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5, 0, 3]; 
    let yearCode = ((year % 100) + Math.floor((year % 100) / 4)) % 7;
    let centuries = [17,18,19,20,21,22,23];
    let centuryCodes = [4,2,0,6,4,2,0];
    var dayVal = yearCode + monthCode[months.indexOf(month)] + centuryCodes[centuries.indexOf(Math.floor(year / 100))] + day;
    //if (Game_DayTimeSystem.prototype.isLeapYear(year)) dayVal -= 1;
    dayVal = dayVal % 7;
    return dayVal;
};

Game_DayTimeSystem.prototype.setPeriod = function(period){
    var index = Setanta.DT.timesOfDay.indexOf(period);

    if(index != -1){
        while(this._tod != period){
            this.advancePeriod();
        };
    }
};

Game_DayTimeSystem.prototype.setDay = function(day){
    var indexOfDayToSet = this.daysOfWeek.indexOf(day);
    
    if(indexOfDayToSet != -1){
        var advanceDayCount = (this.daysOfWeek.length - this.getDayOfWeek() + indexOfDayToSet) % this.daysOfWeek.length;
        if(advanceDayCount == 0){
            advanceDayCount = this.daysOfWeek.length;
        };
        while(advanceDayCount > 0){
            this.advanceDay();
            advanceDayCount--;
        }
    }
};

Game_DayTimeSystem.prototype.setMonth = function(month){
    var indexOfMonthToSet = this.monthsOfYear.indexOf(month);

    if(indexOfMonthToSet != -1){
        var advanceMonthCount = (this.monthsOfYear.length - this._month + indexOfMonthToSet) % this.monthsOfYear.length;
        if(advanceMonthCount == 0){
            advanceMonthCount = this.monthsOfYear.length;
        };

        while(advanceMonthCount > 0){
            this.advanceMonth();
            advanceMonthCount--;
        }
    }
};

Game_DayTimeSystem.prototype.setYear = function(year){
    this._year = year;
    this._stringYear = this.parseYear(this._year.toString());
    if(this.isLeapYear(this._year)){
        this.daysOfMonth[2] = 29
    }
    else{
        this.daysOfMonth[2] = 28;
    }
    this.setTimeOfDaySwitches();
    this.setTimeOfDayVariables();
    $gameTemp._commonEventQueue.push(this._onAdvanceYear);
};

Game_DayTimeSystem.prototype.getPeriod = function(){
    return this._tod;
};

Game_DayTimeSystem.prototype.getDay = function(){
    return this._day;
};

Game_DayTimeSystem.prototype.getDayName = function(){
    return this.daysOfWeek[this.getDayOfWeek(this._day, this.monthsOfYear[this._month], this._year)];
};

Game_DayTimeSystem.prototype.getMonth = function(){
    return this._month;
};

Game_DayTimeSystem.prototype.getMonthName = function(){
    return this.monthsOfYear[this._month];
};

Game_DayTimeSystem.prototype.getYear = function(){
    return this._year;
};

Game_DayTimeSystem.prototype.getStringYear = function(){
    return this._stringYear;
};

//===========================================================================
//                       Show Gab and Tint Screen
//===========================================================================

Game_DayTimeSystem.prototype.updateEffects = function(){
    if(this.isGabEnabled()){
        //Show Gab
        var displayMessage = Setanta.DT.outputMessage;
        displayMessage = this.parseGabMessage(displayMessage);
        $gameMap.showGab(displayMessage);
    };

    if(this.isTintEnabled()){
        //show tint
        var indexOfTint = Setanta.DT.timesOfDay.indexOf(this._tod);
        var tintVals = [...this.screen_tints[indexOfTint]];
        var delayVal = tintVals.shift();
        try{
            $gameMap._interpreter.command223([tintVals, delayVal]);
        }catch(exception){

        }
        
    }
};

Game_DayTimeSystem.prototype.parseGabMessage = function(message){
    for(const prop in this.symbolMapper()){
        message = message.replaceAll(`${prop}`, `${this.symbolMapper()[prop]}`);
    }
    return message;
};

Game_DayTimeSystem.prototype.symbolMapper = function(){
    var dayOfWeek = this.getDayName();
    
    return {
        '%FM': this.monthsOfYear[this._month],
        '%SM': this.monthsOfYear[this._month].substring(0,3),
        '%DM': this._month,
        '%FD': dayOfWeek,
        '%SD': dayOfWeek.substring(0,3),
        '%ND': this._day,
        '%YYYY': this._stringYear,
        '%YY': this._stringYear.slice(-2),
        '%TD': this._tod,
        }
};