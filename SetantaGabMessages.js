//Import Statements
var Imported = Imported || {};
Imported.Setanta_Gab_Messages = true;

var Setanta = Setanta || {};
Setanta.GAB = Setanta.GAB || {};
Setanta.GAB.pluginName = "SetantaGabMessages";

/*:
 * @plugindesc A small message window for notifications, lays over the Game Map
 * @author Setanta
 * @target MZ
 * 
 * @param font_size
 * @text Font Size
 * @desc The font size of the display message
 * @type Int
 * @default 14
 * 
 * 
 * @param font_color
 * @text Font Color
 * @desc Color of the Displayed Text as a Hex value: #ffffff
 * @type String
 * @default #ffffff
 * 
 * 
 * @param win_bg_color
 * @text Window Background Color
 * @desc Color of the Background Window for the Message as an rbga value
 * @type String
 * @default rgba(0, 0, 0, 0.6)
 * 
 * 
 * @param gab_enabled
 * @text Enable
 * @desc This turns the plug-in on or off, changeable from in game
 * @type boolean
 * @default true
 * 
 * 
 * 
 * 
 * @command Set
 * @text Turn Gabs On/Off
 * @desc 'true' turns on, 'false' turns off
 * 
 * @arg status
 * @type boolean
 * @text 'true' turns on, 'false' turns off
 * @default true
 * 
 * 
 * @command Show
 * @text Shows the Gab Message
 * @desc Shows Gab Message
 * 
 * @arg message
 * @type multiline_string
 * @default none
 * 
 * 
 * 
 * @help
 * Setanta Gab Messages v(1.0.2)
 * -------------------------------------------------------------
 * Gab Messages display a small 1 or 2 line message on the main
 * game screen. You can call gab messages through the plug-in 
 * manager by the command 'Show' and setting the message parameter.
 * 
 * Alternatively you can set the message by a call to 
 * $gameMap.showGab(message). This allows for use with other scripts
 * 
 * You can enable and disable messages from in game by use 
 * of the 'Set' command. Or you can disable the entirely by changing
 * the Enabled parameter.
 * 
 * The default font size is 14, and the messages are designed to work 
 * with that size originally. However, you are free to change this
 * but I can not guarantee that the result will look nice.
 * 
 * The Color Parameters change the general color scheme of the window
 * Make sure you use the right color format.  
 * 
 * Thank you for choosing my plug-in!
 */

Setanta.GAB.fontSize = parseInt(PluginManager.parameters(Setanta.GAB.pluginName)['font_size']);
Setanta.GAB.fontColor = PluginManager.parameters(Setanta.GAB.pluginName)['font_color'];
Setanta.GAB.windowColor = PluginManager.parameters(Setanta.GAB.pluginName)['win_bg_color'];
Setanta.GAB.gabEnabled = PluginManager.parameters(Setanta.GAB.pluginName)['gab_enabled'].toLowerCase() == 'on';

// Setting Plug-in Commands
PluginManager.registerCommand(Setanta.GAB.pluginName, 'Set', args => {
    Setanta.GAB.setGabStatus(args.status);
});

PluginManager.registerCommand(Setanta.GAB.pluginName, 'Show', args => {
    Setanta.GAB.showGab(args.message);
});


// Set Operation Functions

Setanta.GAB.setGabStatus = function(status){
    status = status =='true';
    if($gameSystem){
        $gameSystem._gabEnabled = status;
    }
};

Setanta.GAB.isGabEnabled = function(){
    if($gameSystem){
        return $gameSystem._gabEnabled;
    }
    else{
        return false;
    }
};

// Ensure the Scene is at a point where it has a gab window and gabs are active
Setanta.GAB.showGab = function(message){
    var enabled = !!Setanta.GAB.isGabEnabled();
    if(enabled){
        if(!!SceneManager._scene._gabWindow){
            SceneManager._scene.showGab(message);
        } 
    }
};


// Add Function to Game Map object to work with Game Interpreter
Game_Map.prototype.showGab = function(message){
    var enabled = !!Setanta.GAB.isGabEnabled();
    if(enabled) {
        Setanta.GAB.showGab(message);
    }
};

// Add _gabEnabled field to Game System object
Setanta.GAB.Game_System_Initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function(){
    Setanta.GAB.Game_System_Initialize.call(this);
    this._gabEnabled = Setanta.GAB.gabEnabled;
};


// Add Window_Gab to Scene_Map by overriding the "createAllWindows" function
Setanta.GAB.Create_Windows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function(){
    Setanta.GAB.Create_Windows.call(this);

    //To properly build window, we need some Scene_Map functions, 
    //so we define a function for this class instead of our own function
    const gabRect = this.getGabWindowRect();
    //Define a field for gabWindow, we will call on this later
    this._gabWindow = new Window_Gab(gabRect);
    this.addWindow(this._gabWindow);
};

Scene_Map.prototype.getGabWindowRect = function(){
    const wx = 0;
    // Make sure to start this window BELOW the Window_MapName
    const wy = this.calcWindowHeight(1, false);
    //Arbitary Max Width, Generally a larger window blocks too much
    const ww = 360;
    //Ensure it is tall enough to capture at least 2 lines up to font 24 or less
    const wh = this.calcWindowHeight(2, false); 

    return new Rectangle(wx, wy, ww, wh);
};

// Define showGab function so SceneManager._scene can call it
Scene_Map.prototype.showGab = function(message){
    var enabled = !!Setanta.GAB.isGabEnabled();
    if(enabled){
        this._gabWindow.showGab(message);
    }
};


//Window_Gab Object, Used Window_MapName as a referenec and copied some display functions
function Window_Gab(){
    this.initialize(...arguments);
};

// Define with Window_Base as the base
Window_Gab.prototype = Object.create(Window_Base.prototype);
Window_Gab.prototype.constuctor = Window_Gab;

Window_Gab.prototype.initialize = function(rect){
    //Build base window with rect
    Window_Base.prototype.initialize.call(this, rect);
    //Copied from Window_MapName
    this.opacity = 0;
    this.contentsOpacity = 0;
    this._showCount = 0;
    this.refresh();
};

// Set the Message, open the window, and start the Animation process
Window_Gab.prototype.showGab = function(message){
    this._gabMessage = message.split(/\r\n|\n|\r/);
    this.open();
    this.refresh();

};

//Define the Display Parameters
Window_Gab.prototype.refresh = function(){
    this.contents.clear();
    if(this._gabMessage){
        this.setStyling();
        this.drawContents();
    }

};

// Set the Font Size, Font Color and The Background Color
Window_Gab.prototype.setStyling = function() {
    this.contents.fontSize = Setanta.GAB.fontSize;
    this.contents.fontColor = Setanta.GAB.fontColor;
    this._color = Setanta.GAB.windowColor;
};

Window_Gab.prototype.drawContents = function(){
    const width = this.gabWidth();
    this.drawBackground(0, 0, width);
    this.drawMessage(0, 0, width);

};

Window_Gab.prototype.gabWidth = function(){
    if(this._gabMessage){
        var lines = [...this._gabMessage];
        var longest = lines.sort(function(a,b)  {return b.length - a.length;})[0];
        // Setanta.GAB.fontSize/2 is hapharzard way of averaging the texts general width
        // Then Add on the Padding on each side
        return longest.length * (Setanta.GAB.fontSize/2) + 2 * this.padding;
    }
};

Window_Gab.prototype.drawBackground = function(x, y, width){
    const gabHeight = this.gabHeight();
    this.contents.fillRect(x,y, width, gabHeight, this._color);
};

Window_Gab.prototype.gabHeight = function(){
    var lines = this._gabMessage;
    var offset = 0;
    // Actual Line Height is GabLineHeight + upper and lower padding
    // Multiply this by the total amount of lines
    // for each additional line above one, account of one of the 2
    // paddings between lines to be removed
    if(lines.length > 1){
        offset =  (lines.length - 1) * this.padding;
    }
    return lines.length * (this.gabLineHeight() + (2 * this.padding)) - offset;
};

//Determine the Line height for Gab window, based on font size
Window_Gab.prototype.gabLineHeight = function(){

    //If fontSize is invalid, replace with regular line height, approx 36
    return Setanta.GAB.fontSize ? Setanta.GAB.fontSize : this.lineHeight()
};

//Due to Window Padding, drawText will already start at an offset from the top
//You can start at y = 0
Window_Gab.prototype.drawMessage = function (x, y, width){
    
    for(line of this._gabMessage){
        //If the message is too big, left align it
        if(this.getLineWidth(line) > 360){
            this.drawText(line, this.padding, y, width, "left")
        }
        else{
            this.drawText(line, x, y, width, "center");
        }
        y += this.gabLineHeight() + this.padding;
    }
};

// Im not 100% sure why this works, but it was through trial and error
// And it seems to work
Window_Gab.prototype.getLineWidth = function(line){
    return line.length * (Setanta.GAB.fontSize - 2) + this.padding;
};

//Update Functions for Animation, copied from Window_MapName
Window_Gab.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    var enabled = !!Setanta.GAB.isGabEnabled();
    if (this._showCount > 0 && enabled) {
        this.updateFadeIn();
        this._showCount--;
    } else {
        this.updateFadeOut();
    }
};

Window_Gab.prototype.isGabEnabled = function(){
    return this._gabEnabled;
};

Window_Gab.prototype.updateFadeIn = function() {
    this.contentsOpacity += 16;
};

Window_Gab.prototype.updateFadeOut = function() {
    this.contentsOpacity -= 16;
};

Window_Gab.prototype.open = function() {
    this.refresh();
    this._showCount = 150;
};

Window_Gab.prototype.close = function() {
    this._showCount = 0;
};
