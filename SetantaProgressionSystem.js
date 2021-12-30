var Imported = Imported || {};
Imported.Setanta = true;

var Setanta = Setanta || {};
Setanta.PS = Setanta.PS || {};
Setanta.PS.pluginName = "SetantaProgressionSystem";

/*:
 * @plugindesc This is a Plug in used for a Character Based Progression System
 * @author Setanta 
 * @url There is none, if you found this, good job
 * 
 * @param Progression Levels
 * @text Progression Levels
 * @desc This is a List of the Needed Points to Progress to the Next Level
 * @type string
 * @default 0,10,20,30,45,75
 * 
 * @param Level Labels
 * @text Level Labels
 * @desc Optional Labels to Each Level
 * @type string
 * @default Level 0,Level 1,Level 2,Level 3,Level 4,Level 5
 * 
 * @param Max Progression Level
 * @text Max Progression Level
 * @desc This is the Highest level a character can currently achieve
 * @type number
 * @default 5
 * 
 * 
 * @param Default Outfit
 * @text Default Outfit
 * @desc This is the Default Outfit Name
 * @type string
 * @default default
 * 
 * @param Enable Level Outfits
 * @text Enable Level Outifts
 * @desc Set this to true if you have an Outfit at each level
 * @type boolean
 * @default true
 * 
 * @param Level Outfits
 * @text Level Outfits
 * @desc A list of Outfit Names that correspond with the levels given
 * @type string
 * @default default,lvl1,lvl2,lvl3,lvl4,lvl5
 * 
 * @param Default State
 * @text Default State
 * @desc This is the Default Actor State Name
 * @type string
 * @default default
 * 
 * @param Enable States
 * @text Enable States
 * @desc Enable if a character can have more than their default state
 * @type boolean
 * @default true
 * 
 * @param States Labels
 * @text States Labels
 * @desc A list of possible character states
 * @type string
 * @default default,wet,cum
 * 
 * 
 * 
 * @command Add Actor
 * @text Add Actor
 * @desc Adds an Actor to the Progression System
 * 
 * @arg actor_id
 * @type number
 * 
 * 
 * @arg max_level
 * @type number
 * @default -1
 * 
 * @arg has_level_outfits
 * @type boolean
 * @default false
 * 
 * 
 * @command Level Up
 * @text Level Up
 * @desc Increase the Level of an Actor
 * 
 * @arg actor_id
 * @type number
 * 
 * @arg forceLevel
 * @type boolean
 * @default false
 * 
 * @command Add Exp
 * @text Add Exp
 * @desc Add an amount of Exp to an Actor
 * 
 * @arg actor_id
 * @type number
 * 
 * @arg exp
 * @type number
 * 
 * 
 * @command Add Outfit
 * @text Add Outift
 * @desc Adds an Outfit to an Actor
 * 
 * @arg actor_id
 * @type number
 * 
 * @arg outfit
 * @type string
 * 
 * @arg outfit_index
 * @type number
 * 
 * 
 * @command Add State
 * @text Add State
 * @description Add a state to an Actor
 * 
 * @arg actor_id
 * @type number
 * 
 * @arg state
 * @type string
 * 
 * 
 * @command Change Outfit
 * @text Change Outfit
 * @desc Change an Actors Outfit
 * 
 * @arg actor_id
 * @type number
 * 
 * @arg outfit
 * @type string
 * 
 * 
 * @command Change State
 * @text Change State
 * @desc Changes the State of an Actor
 * 
 * @arg actor_id
 * @type number
 * 
 * @arg state
 * @type string
 * 
 * 
 */


//=================================================================================================================================
//                                           Plugin Parameters
//=================================================================================================================================
Setanta.PS.maxLevel = parseInt(PluginManager.parameters(Setanta.PS.pluginName)['Max Progression Level']);
Setanta.PS.defaultOutfit = PluginManager.parameters(Setanta.PS.pluginName)['Default Outfit'];
Setanta.PS.defaultState = PluginManager.parameters(Setanta.PS.pluginName)['Default State'];
Setanta.PS.levelLabels = PluginManager.parameters(Setanta.PS.pluginName)['Level Labels'].split(',');
Setanta.PS.levelOutfitsEnabled = PluginManager.parameters(Setanta.PS.pluginName)['Enable Level Outfits'];
Setanta.PS.outfitLabels = PluginManager.parameters(Setanta.PS.pluginName)['Level Outfits'].split(',');
Setanta.PS.statesEnabled = PluginManager.parameters(Setanta.PS.pluginName)['Enable States'];
Setanta.PS.stateLabels = PluginManager.parameters(Setanta.PS.pluginName)['States Labels'].split(',');

//=================================================================================================================================
//                                           AUTO RUN CODE
//=================================================================================================================================
(() => {

    Setanta.PS.processProgressionLevelParam = function(){
        var stringList = PluginManager.parameters(Setanta.PS.pluginName)['Progression Levels'].split(',');
        var levels = [];
        for(str of stringList){
            levels.push(parseInt(str));
        }
        return levels;
    };

    Setanta.PS.setProgressionLevels = function(){
        Setanta.PS.progressionLevels = Setanta.PS.processProgressionLevelParam();
    };

    Setanta.PS.setUp = function(){
        Setanta.PS.setProgressionLevels();
    }();

})();


//=================================================================================================================================
//                                           Registered Commands
//=================================================================================================================================

//add actor
PluginManager.registerCommand(Setanta.PS.pluginName, 'Add Actor', args => {
    if(args.max_level != -1){
        args.max_level = Setanta.PS.maxLevel;
    }
    $gameSystem._progressionSystem.addActor(args.actor_id, args.max_level, args.has_level_outfits);
});
//level up actor
PluginManager.registerCommand(Setanta.PS.pluginName, 'Level Up', args => {
    $gameSystem._progressionSystem.levelUp(args.actor_id, args.forceLevel);
});

//add exp to actor
PluginManager.registerCommand(Setanta.PS.pluginName, 'Add Exp', args => {
    $gameSystem._progressionSystem.addExp(args.actor_id, args.exp);
});

//add outfit
PluginManager.registerCommand(Setanta.PS.pluginName, 'Add Outfit', args => {
    $gameSystem._progressionSystem.addOutfit(args.actor_id, args.outfit, args.outfit_index);
});

//add state
PluginManager.registerCommand(Setanta.PS.pluginName, 'Add State', args => {    
    $gameSystem._progressionSystem.addState(args.actor_id, args.state);
});

//change outfit
PluginManager.registerCommand(Setanta.PS.pluginName, 'Change Outfit', args => {
    $gameSystem._progressionSystem.changeOutfit(args.actor_id, args.outfit);
});

//change state
PluginManager.registerCommand(Setanta.PS.pluginName, 'Change State', args => {
    $gameSystem._progressionSystem.changeState(args.actor_id, args.state);
});


//=================================================================================================================================
//                                           Game System Fuckery
//=================================================================================================================================
Setanta.PS.GameSysInit = Game_System.prototype.initialize;
Game_System.prototype.initialize = function(){
    Setanta.PS.GameSysInit.call(this);
    if(!this._progressionSystem){
        this._progressionSystem = new Game_ProgressionSystem();
    }
};



//=================================================================================================================================
//                                           Game Progression System Fuckery
//=================================================================================================================================
function Game_ProgressionSystem(){
    this.initialize(...arguments);
};

Game_ProgressionSystem.prototype.constructor = Game_ProgressionSystem;
Game_ProgressionSystem.prototype.initialize = function(){
    this._actors = [];
    this._maxProgressionLevel = Setanta.PS.maxLevel;
};

Game_ProgressionSystem.prototype.setMaxLevel = function(maxLevel){
    if(this._maxProgressionLevel != maxLevel && !isNaN(maxLevel)){
        this._maxProgressionLevel = maxLevel;
    }
};

Game_ProgressionSystem.prototype.getActor = function(actor_id){
    var index = this.getActorIndex(actor_id);
    if(index != -1){
        return this._actors[index];
    }
    return null;
};

Game_ProgressionSystem.prototype.getActorIndex = function(actor_id){

    return this._actors.findIndex(actor => actor.getId() == actor_id);
};

Game_ProgressionSystem.prototype.getActorLevel = function(actor_id){
    var index = this.getActorIndex(actor_id);
    if(index != -1){
        return this._actors[index].getLevel();
    }  
};

Game_ProgressionSystem.prototype.getActorOutfit = function(actor_id){
    var index = this.getActorIndex(actor_id);
    if(index != -1){
        return this._actors[index].getOutfit();
    }  
};

Game_ProgressionSystem.prototype.getActorOutfitIndex = function(actor_id){
    var index = this.getActorIndex(actor_id);
    if(index != -1){
        return this._actors[index].getOutfitIndexNumber(this._actors[index].getOutfit());
    }

}
Game_ProgressionSystem.prototype.getActorState = function(actor_id){
    var index = this.getActorIndex(actor_id);
    if(index != -1){
        return this._actors[index].getState();
    }  
};

Game_ProgressionSystem.prototype.addActor = function(actor_id, maxLevel = this._maxProgressionLevel, hasLevelOutfits = false){
    var index = this.getActorIndex(actor_id);
    if(index == -1){
        this._actors.push(new Game_ActorProgression(actor_id, maxLevel, hasLevelOutfits));
    }  
};


Game_ProgressionSystem.prototype.addExp = function(actor_id, expToAdd){
    var index = this.getActorIndex(actor_id);
    if(index != -1){
        this._actors[index].addExp(expToAdd);
    }
};

Game_ProgressionSystem.prototype.levelUp = function(actor_id, force_level = false){
    var index = this.getActorIndex(actor_id);
    if(index != -1){
        this._actors[index].levelUp(force_level);
    }    
};

Game_ProgressionSystem.prototype.addOutfit = function(actor_id, outfitLabel, outfitIndex){
    var index = this.getActorIndex(actor_id);
    if(index != -1){
        this._actors[index].addOutfit(outfitLabel, outfitIndex);
    }
};

Game_ProgressionSystem.prototype.addState = function(actor_id, stateLabel){
    var index = this.getActorIndex(actor_id);
    if(index != -1){
        this._actors[index].addState(stateLabel);
    }
};

Game_ProgressionSystem.prototype.changeOutfit = function(actor_id, outfitLabel){
    var index = this.getActorIndex(actor_id);
    if(index != -1){
        this._actors[index].changeOutfit(outfitLabel);
    }
};

Game_ProgressionSystem.prototype.changeState = function(actor_id, stateLabel){
    var index = this.getActorIndex(actor_id);
    if(index != -1){
        this._actors[index].changeState(stateLabel);
    }
};

function Game_ActorProgression(){
    this.initialize(...arguments);
};

Game_ActorProgression.prototype.constructor = Game_ActorProgression;
Game_ActorProgression.prototype.initialize = function(actor_id, maxLevel, hasLevelOutfits = false){

    this._actor_id = actor_id;
    this._level = 0;
    this._maxLevel = maxLevel;
    this._exp = 0;
    this._outfit = Setanta.PS.defaultOutfit;
    this._state = Setanta.PS.defaultState;
    this._hasLevelOutfits = hasLevelOutfits;
    this._outfits = (Setanta.PS.levelOutfitsEnabled) ? Setanta.PS.outfitLabels : [this._outfit];
    this._states = Setanta.PS.statesEnabled ? Setanta.PS.stateLabels : [this._state] ;

};

Game_ActorProgression.prototype.getId = function(){
    return this._actor_id;
}
Game_ActorProgression.prototype.getLevel = function(){
    return this._level;
};

Game_ActorProgression.prototype.getOutfit = function(){
    return this._outfit;
};

Game_ActorProgression.prototype.getState = function(){
    return this._state;
};

// Add Exp
Game_ActorProgression.prototype.addExp = function(expToAdd){
    var exp_points = this._exp;
    var level_cap = Setanta.PS.progressionLevels[this._level];
    if(exp_points + expToAdd >= level_cap){
        this._exp = level_cap;
    }
    else{
        this._exp += expToAdd;
    }
};

// Level Up
Game_ActorProgression.prototype.levelUp = function(forceLevelUp = false){
    if(forceLevelUp || this.abletoLevelUp()){
       this._level += 1;
       if(this._level > this._maxLevel) this._level = this._maxLevel;
    }
};

// Check If Able To Level Up
Game_ActorProgression.prototype.abletoLevelUp = function(){
    if(this._level < this._maxLevel){
        var level_cap = Setanta.PS.progressionLevels[this._level];
        return this._exp == level_cap
    }
    return false;
};


//Change Outfit
Game_ActorProgression.prototype.addOutfit = function(outfit_label, index_number){
    if(index_number > 0){
        this._outfits[index_number] = outfit_label;
    }
};

Game_ActorProgression.prototype.getOutfitIndexNumber = function(outfit_label){
    if(this._outfits){
        return this._outfits.indexOf(outfit_label);
    }
};

Game_ActorProgression.prototype.changeOutfit = function(outfit_label){
    if(this._outfits){
        var index = this._outfits.indexOf(outfit_label);
        if(index >= 0){
            this._outfit = this._outfits[index];
        }
    }
};

//Change State
Game_ActorProgression.prototype.changeState = function(state){
    if(this._states.indexOf(state) != -1){
            this._state = state; 
    }
};

Game_ActorProgression.prototype.addState = function(state){
    var index = this._states.indexOf(state);
    if(index == -1){
        this._states.push(state);
    }
};