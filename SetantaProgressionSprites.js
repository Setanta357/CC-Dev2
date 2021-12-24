//This plug-in is designed to work on top of SetantaProgressionSystem

var Imported = Imported || {};
Imported.Setanta = true;

var Setanta = Setanta || {};
Setanta.SPS = Setanta.SPS || {};
Setanta.SPS.pluginName = "SetantaProgressionSprites";



/*:
 * @plugindesc This plug-in changes character sprites that are related to outfits.
 * @author Setanta 
 * @url There is none, if you found this, good job
 *                                                     
 * 
 * @command Add Outfit
 * @text Add Outfit
 * @desc Add an outfit, to an actor, and specify if it has a corresponding sprite
 * 
 * @arg actor_id
 * @type number
 * 
 * @arg outfit_label
 * @type string
 * 
 * @arg outfit_index
 * @type number
 * 
 * @arg has_sprite
 * @type boolean
 * @default false
 * 
 * 
 * 
 * @command Change Base Sprite
 * @text Change Base Sprtie
 * @desc This allows the user to change the base sprite sheet associated with a character
 * 
 * @arg actor_id
 * @type number
 * 
 * @arg sheet_name
 * @type string
 * 
 * @arg refresh_now
 * @type boolean
 * 
 */

PluginManager.registerCommand(Setanta.SPS.pluginName, "Add Outfit", args => {
    $gameSystem._progressionSystem.addOutfit(args.actor_id, args.outfit_label, args.outfit_index, args.has_sprite);
});

PluginManager.registerCommand(Setanta.SPS.pluginName, "Change Base Sprite", args =>{
    if($gameSystem._progressionSystem.getActor(args.actor_id)){
        $gameSystem._progressionSystem.getActor(args.actor_id).setActorSpriteName(args.sheet_name);
        var index = $gameSystem._progressionSystem.getActorIndex(args.actor_id);
        $gameActors.actor(args.actor_id)._characterName = args.sheet_name;
           
        if(args.refresh_now){
            var actor = $gameSystem._progressionSystem.getActor(args.actor_id);
            $gameSystem._progressionSystem.changeOutfit(actor._actor_id, actor._outfit);
        }
        
    } 
    
})


//Allow Sprite Changing on Map Load
Setanta.SPS.CreateDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function(){

    Setanta.SPS.updateDataMapEvents(); 
    Setanta.SPS.CreateDisplayObjects.call(this);
};

Setanta.SPS.updateDataMapEvents = function(){
    if(!Setanta.PS) return;   
    Setanta.SPS.changeEventSprites();
};

Setanta.SPS.changeEventSprites = function(){
    if($gameSystem && $dataMap){
        for(event_data of $dataMap.events){
            event_data = Setanta.SPS.processEventData(event_data);
        }
        if($gameMap && $gameMap._events){
            for(map_event of $gameMap._events){
                if(!!map_event) map_event.setupPage();
            }
        }
    }

    
};

Setanta.SPS.processEventData = function(event_data){
    //If event data is not empty
    if(!!event_data){
        var notes = event_data.note.split(",");
        notes = notes.filter(function(value){return value != ""});
        return Setanta.SPS.processNotes(event_data, notes);
    }
    return event_data;
};


Setanta.SPS.processNotes = function(event_data, notes){
    if(!!event_data && notes.length > 0){
        for(note of notes){
            var page = note.split("_")[0];
            var actor_id = note.split("_")[1];
            event_data.pages[page] = Setanta.SPS.changePageImage(event_data.pages[page], actor_id);
        }
    }
    return event_data;
};


Setanta.SPS.changePageImage = function(page, actor_id){
    if(!!page){

        var spriteNumber = (!!$gameSystem._progressionSystem.getActor(actor_id)) ? $gameSystem._progressionSystem.getActor(actor_id).getActorSpriteNumber() : page.image.characterIndex;
        var spriteName = (!!$gameSystem._progressionSystem.getActor(actor_id)) ? $gameSystem._progressionSystem.getActor(actor_id).getActorSpriteName() : page.image.characterName;
        page.image.characterIndex = spriteNumber;
        page.image.characterName = spriteName;
    }
    return page;
};



Setanta.SPS.reloadEventSprites = function(){
    Setanta.SPS.updateDataMapEvents();

}
//===================================================================================================
//                                  Functions to Overwrite
//===================================================================================================


Game_ProgressionSystem.prototype.addOutfit = function(actor_id, outfitLabel, outfitIndex, hasSprite){
    var index = this.getActorIndex(actor_id);
    if(index != -1){
        this._actors[index].addOutfit(outfitLabel, outfitIndex, hasSprite);
    }
};

Setanta.SPS.InitActor = Game_ActorProgression.prototype.initialize;
Game_ActorProgression.prototype.initialize = function(actor_id, maxLevel, hasLevelOutfits = false){
    Setanta.SPS.InitActor.call(this, actor_id, maxLevel, hasLevelOutfits);
    this._hasSprite = [];
    for(outfit in this._outfits){
        this._hasSprite[outfit] = true;
    };
    this._actorSpriteName = ($gameActors) ? $gameActors.actor(actor_id)._characterName : null;
    console.log(this._actorSpriteName);
};

Game_ActorProgression.prototype.getActorSpriteNumber = function(){
    return (this._outfits.indexOf(this._outfit) != -1) ? this._outfits.indexOf(this._outfit) : 0; 
};

Game_ActorProgression.prototype.getActorSpriteName = function(){
    return this._actorSpriteName;
};

Game_ActorProgression.prototype.setActorSpriteName = function(spriteName){
    $gameActors.actor(this._actor_id)._characterIndex = (!!spriteName) ? spriteName : $gameActors.actor(this._actor_id)._characterIndex;
    this._actorSpriteName = (!!spriteName) ? spriteName : this._actorSpriteName;
    console.log(this._actorSpriteName);
};

Game_ActorProgression.prototype.addOutfit = function(outfit_label, index_number, hasSprite){
   if(index_number >= 0){
       this._outfits[index_number] = outfit_label;
       this._hasSprite[index_number] = hasSprite;
   }
};


Game_ActorProgression.prototype.changeOutfit = function(outfit_label){
   
    var index = this._outfits.indexOf(outfit_label);
    if(index != -1){
        this._outfit = this._outfits[index];
        if(this._hasSprite[index]){
            this.changeSprite(index);
        }
   }
};

//Set change sprite number from current to index of outfit
Game_ActorProgression.prototype.changeSprite = function(index){
    //Change Party Sprite
    $gameActors.actor(this._actor_id)._characterIndex = index;
    //Refresh sprites
    $gamePlayer.refresh();
    //Change Event Sprites
    Setanta.SPS.reloadEventSprites();
    
};

// Level Up
Game_ActorProgression.prototype.levelUp = function(forceLevelUp = false){
    if(forceLevelUp || this.abletoLevelUp()){
       this._level += 1;
       if(this._level > this._maxLevel) this._level = this._maxLevel;
       if(this._hasLevelOutfits){
           this.changeOutfit(this._outfits[this._level]);
       }
    }
};