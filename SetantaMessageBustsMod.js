var Imported = Imported || {};
Imported.Setanta = true;

var Setanta = Setanta || {};
Setanta.MBM = Setanta.MBM || {};
Setanta.MBM.pluginName = "SetantaMessageBustsMod";

/*:
 * @plugindesc A Mod on Galv_MessageBustsMZ that let's it utilize SetantaProgressionSystem data
 * @author Setanta
 * @target MZ
 * 
 * 
 * @param Actors
 * @text Actors
 * @desc This is a comma separated list of Character Names, order by actor_id
 * @type string
 * @default none,Reid,priscilla,Gale,Michell,Albert,Kasey,Eliot,Roza
 * 
 */

Setanta.MBM.actors = PluginManager.parameters(Setanta.MBM.pluginName)['Actors'].split(',');

Sprite_GalvBust.prototype.loadBitmap = function() {
    const name = Setanta.MBM.getBustFilePath();
    let img;
    if ($gameSystem.isBustDisabled()) {
        img = ImageManager.loadPicture('');
    } else {
        img = ImageManager.loadPicture(name + Galv.MB.f);
    };
    if (img.isReady()) {
        if (this.bitmap) {
            //this._destroyCachedSprite();
            this.bitmap = null;
        };
        this.bitmap = img;
        this.name = name;
	    this.hasBust = true;
    };
};


Sprite_GalvBust.prototype.controlBitmap = function() {
	if (this.hasSpriteChanged()) {
    	this.loadBitmap();  // If image changed, reload bitmap
	};
	
	if (Galv.MB.msgWindow.openness <= 0 || !this.hasBust || $gameSystem.isBustDisabled()) {
		this.opacity = 0;
		this.name = "";
		this.hasBust = false;
		return;
	};
	
	

	this.opacity = $gameMessage.faceName() ? Galv.MB.msgWindow._openness : this.opacity - 32;
	
	// Y POSITION
	switch (Galv.MB.msgWindow.tempPosType) {
	case 0:
		this.y = this.baseY() + Galv.MB.bY;
		break;
	case 1:
	//top and middle
		this.y =  this.baseY() - Galv.MB.msgWindow.y + Galv.MB.bY;
		break;
	case 2:
	//bottom
		if (Galv.MB.prio == 1) {
			this.y = Galv.MB.msgWindow.height - this.bitmap.height;
		} else if (Galv.MB.pos === 1) {
			this.y = this.baseY();
		} else {
			this.y = this.baseY() - Galv.MB.msgWindow.height;
		};
		
		this.y += Galv.MB.bY; // modify by plugin setting offset Y
		break;
	};
	
	// X POSITION
	let offset = 0;
	if ($gameSystem.bustMirror) {
		this.scale.x = -1;
		offset = this.bitmap.width;
	} else {
		this.scale.x = 1;
		offset = 0;
	};
	
	if ($gameSystem.bustPos == 1) {
		// if on the right
		offset -= Galv.MB.bX; // modify by offset in plugin settings
		
		if (Galv.MB.prio == 1) {
			this.x = Galv.MB.msgWindow.width - this.bitmap.width + offset;
		} else {
			this.x = Galv.MB.msgWindow.x + Galv.MB.msgWindow.width - this.bitmap.width + offset;
		};
	} else {
		// else on the left
		offset += Galv.MB.bX; // modify by offset in plugin settings
		
		if (Galv.MB.prio == 1) {
			this.x = 0 + offset;
		} else {
			this.x = Galv.MB.msgWindow.x + offset;
		};
	};
};

Sprite_GalvBust.prototype.hasSpriteChanged = function(){

    var isDefault = $gameMessage.faceName() && this.name !== $gameMessage.faceName() + "_" + ($gameMessage.faceIndex() + 1);
	var actor = Setanta.MBM.getCurrentActor();
	var isMod = true;
	var name = "";
	if(!!actor){
		var outfit = actor.getOutfit();
		var state = actor.getState();
		var index = $gameMessage.faceIndex() + 1;
		name = $gameMessage.faceName() + '/' + outfit + '/' + state + '/' + index;
		isMod = $gameMessage.faceName() && (this.name !== name); //Change this to reflext what the modded name should be based on who's loaded
	}
	return isDefault && isMod;

}

Setanta.MBM.getBustFilePath = function(){
    //IF progression system, then do progression system, otherwise do default
    //if progression system, but not in progression system, do default
    var name = $gameMessage.faceName() + "_" + ($gameMessage.faceIndex() + 1);

    if(!Setanta.MBM.needDefault()){

        var actor = Setanta.MBM.getCurrentActor();
        var outfit = actor.getOutfit();
        var state = actor.getState();
        var index = $gameMessage.faceIndex() + 1;

        name = $gameMessage.faceName() + '/' + outfit + '/' + state + '/' + index;
    };

    return name;
}

//If an actor cant be found, this means that
//1. They aren't in the system, therefore needs default
//2. The system isnt present, therefore needs default
Setanta.MBM.needDefault = function(){
    return !(Setanta.MBM.getCurrentActor());
};

//If they arent in the system, or the system isnt present, then return null
//Otherwise return the actor
Setanta.MBM.getCurrentActor = function(){
	var actor_name = "";
	if($gameMessage.faceName().contains('-')){
    	actor_name = $gameMessage.faceName().split('-')[0];
	}
	else{
		actor_name = $gameMessage.faceName().split("_")[0];
	}
    var actor_id = Setanta.MBM.actors.indexOf(actor_name);
    var actor = null;
    if($gameSystem._progressionSystem && actor_id != -1){
        actor = $gameSystem._progressionSystem.getActor(actor_id);
    }
    return actor;
};