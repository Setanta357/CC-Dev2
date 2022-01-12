/**
 * This plug in will override the main menu scene to not include the Status Window, and instead override the "Status" option in the main menu to 
 * open a new scene "Scene_Status"
 * 
 * The main menu will appear like the options or preferences menu, to do this, the Scene_Menu will be overridden for its creation function
 * The status window will be traversable from left to right, or up and down based. There will be a small list on the left hand side to help
 * scroll through the entries, but the player will also be able to select 'left' or 'right' to traverse the list
 */

var Imported = Imported || {};
Imported.Setanta = true;

var Setanta = Setanta || {};
Setanta.SW = Setanta.SW || {};
Setanta.SW.pluginName = "SetantaStatusWindow";

/*:
 * @plugindesc Overrides the Default Status Window to work with Progression System
 * @author Setanta
 * @target MZ
 * 
 * 
 * @param Folder
 * @text Folder
 * @desc Folder Profile.json is stored in
 * @type string
 * @default data
 * 
 * @param File 
 * @text File
 * @desc the filename of the Profile.json file
 * @type string
 * @default Profiles
 * 
 */
//Load Actor Profile from Profiles.json in data folder
(function () {

    Setanta.SW.file = {};
    Setanta.SW.file.getProfiles = function (filePath) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", filePath);
        xhr.overrideMimeType("application/json");
        xhr.onload = function () {
            if (xhr.status == 200) {
                Setanta.SW.onLoad(xhr);
            }
        };
        xhr.send();
    };

    Setanta.SW.onLoad = function (xhr) {
        Setanta.SW.profiles = JSON.parse(xhr.response);

        if ($gameSystem && $gameSystem._progressionSystem) {
            Setanta.SW.checkProfilesForUpdates();
        }

    };

    //Check for new Profiles added to the system
    Setanta.SW.checkProfilesForUpdates = function () {

        var updated = false;
        for (profile of Setanta.SW.profiles) {
            var profile_id = profile.actor_id;
            var profile_index = $gameSystem._progressionSystem._profiles.findIndex(p => p.actor_id === profile_id);
            if (profile_index !== -1) {
                var oldProfile = $gameSystem._progressionSystem._profiles[profile_index];
                if (!Setanta.SW.areProfilesEqual(oldProfile, profile)) {
                    $gameSystem._progressionSystem._profiles[profile_index] = profile;
                    if (!updated) updated = true;
                }
            }
            else {
                $gameSystem._progressionSystem._profiles.push(profile);
                if (!updated) updated = true;
            }
        }
    };

    Setanta.SW.areProfilesEqual = function (profile_1, profile_2) {
        return profile_1.actor_id == profile_2.actor_id
            && Setanta.SW.identicalLocations(profile_1.locations, profile_2.locations)
            && profile_1.description == profile_2.description
            && profile_1.fast_travel_event_id == profile_2.fast_travel_event_id;
    }

    Setanta.SW.identicalLocations = function (arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (var i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    };

    Setanta.SW.fileName = function () {
        if (!Setanta.SW.profiles) {
            var fileName = PluginManager.parameters(Setanta.SW.pluginName)['File'];
            var folder = PluginManager.parameters(Setanta.SW.pluginName)['Folder'];
            if (!folder.contains("/")) {
                folder += "/";
            };
            Setanta.SW.file.getProfiles(folder + fileName + '.json');
        }
    }();
})();

//Add Quests for New Game
Setanta.SW.SetupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function () {
    Setanta.SW.SetupNewGame.call(this);
    Setanta.SW.checkProfilesForUpdates();
};



Game_ProgressionSystem.prototype.constructor = Game_ProgressionSystem;
Game_ProgressionSystem.prototype.initialize = function () {
    this._actors = [];
    this._maxProgressionLevel = Setanta.PS.maxLevel;
    this._profiles = [];
};

//====================================================================================
//                        Scene_Status
//====================================================================================
Setanta.SW.createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    Setanta.SW.createCommandWindow.apply(this);
    this._commandWindow.setHandler("status", this.onStatusOk.bind(this));
};

Scene_Menu.prototype.onStatusOk = function(){
    this._statusWindow.setFormationMode(false);
    SceneManager.push(Scene_Status);
}

Scene_Status.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createListWindow();
    this.createProfileWindow();
    this.createTravelWindow();
    this.updateImg();
    this._listWindow.refresh();
};

Scene_Status.prototype.createListWindow = function () {
    const rect = this.listWindowRect();
    this._listWindow = new Window_ProfileList(rect);
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this._listWindow.setHandler('ok', this.onActorOk.bind(this));

    this.addWindow(this._listWindow);

    this._listWindow.activate();
    this._listWindow.select(0);
};

Scene_Status.prototype.listWindowRect = function () {
    var ww = this.listWindowWidth();
    var wh = Graphics.boxHeight - this.helpAreaTop();
    var wx = 0;
    var wy = this.helpAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Status.prototype.listWindowWidth = function () {
    return 250;
};


//Instead of "Party" this chooses based on Setanta.SW.profiles
//On actor change, reload the profile window

//On ok, activate the transfer window
Scene_Status.prototype.onActorOk = function () {
    this._listWindow.activate();
    this._listWindow.reselect();

};

Scene_Status.prototype.createProfileWindow = function () {
    const rect = this.profileWindowRect();
    this._profileWindow = new Window_Help(rect);
    const spriteRect = this._listWindow.createBustRect();
    const spriteImg = new Sprite_Status(spriteRect);
    this._profileWindow._bustImg = spriteImg;
    this._profileWindow.addChild(this._profileWindow._bustImg);
    this.addWindow(this._profileWindow);
    this._listWindow.setProfileWindow(this._profileWindow);

    this.updateImg();
};

Scene_Status.prototype.updateImg = function () {
    var actor = $gameSystem._progressionSystem.getActor(this._listWindow.item(this._listWindow.index()).actor_id);
    this._profileWindow._bustImg.controlBitmap(actor)
}
Scene_Status.prototype.profileWindowRect = function () {
    var ww = Graphics.boxWidth - this.listWindowWidth();
    var wh = Graphics.boxHeight - this.helpAreaTop() - this.travelWindowHeight();
    var wy = this.helpAreaTop();
    var wx = this.listWindowWidth();
    return new Rectangle(wx, wy, ww, wh);

};

Scene_Status.prototype.travelWindowHeight = function () {
    return this.calcWindowHeight(1, true);
};

Scene_Status.prototype.createTravelWindow = function () {
    const rect = this.travelWindowRect();
    this._travelWindow = new Window_Travel(rect);
    this._travelWindow.setHandler("summon", this.onTravelOk.bind(this));
    this._travelWindow.setHandler("travel", this.onTravelOk.bind(this));
    this.addWindow(this._travelWindow);
    this._travelWindow.select(-1);
    this._travelWindow.deactivate();

};

Scene_Status.prototype.travelWindowRect = function () {
    var ww = Graphics.boxWidth - this.listWindowWidth();
    var wh = this.travelWindowHeight()
    var wx = this.listWindowWidth();
    var wy = Graphics.boxHeight - this.travelWindowHeight();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Status.prototype.onTravelOk = function () {

};

Scene_Status.prototype.needsPageButtons = function () {
    return false;
};

Scene_Status.prototype.refreshActor = function () {

};

//====================================================================================
//                          Window_Travel
//====================================================================================

function Window_Travel() {
    this.initialize.apply(this, arguments);
}

Window_Travel.prototype = Object.create(Window_HorzCommand.prototype);
Window_Travel.prototype.initialize = function (rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
    this._canRepeat = true;
};

Window_Travel.prototype.makeCommandList = function (enableSummon = false, enableTravel = false) {
    this.addCommand("Summon", 'summon', enableSummon);
    this.addCommand("Go to", 'travel', enableTravel);
};

Window_Travel.prototype.itemWidth = function () {
    return Math.floor(this.innerWidth / 2);
};



//====================================================================================
//                        Window_Profile List
//====================================================================================


function Window_ProfileList() {
    this.initialize.apply(this, arguments);
};

Window_ProfileList.prototype = Object.create(Window_ItemList.prototype);
Window_ProfileList.prototype.constructor = Window_ProfileList;

Window_ProfileList.prototype.initialize = function (rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this._data = Setanta.SW.profiles;
    this._canRepeat = true;

};


Window_ProfileList.prototype.isCurrentItemEnabled = function () {

    var actor_id = this._data[this._index].actor_id;
    if ($gameSystem._progressionSystem.getActor(actor_id)) {
        return true;
    }
    return false;
};

//Make Item List
Window_ProfileList.prototype.makeItemList = function () {
    this._data = Setanta.SW.profiles;
};

Window_ProfileList.prototype.refresh = function () {
    this.makeItemList();
    this.createContents();
    this.setStyling();
    this.drawAllItems();
};

Window_ProfileList.prototype.setStyling = function () {
    this.contents.fontSize = 24;
};

Window_ProfileList.prototype.item = function (index) {
    var index = index == undefined ? this.index() : index;
    var obj = isNaN(this._data[index]) ? this._data[index] : Setanta.SW.profiles[this._data[index]];

    return this._data && index >= 0 ? obj : null;
};

//Define the Draw Item
Window_ProfileList.prototype.drawItem = function (index) {
    //Get item
    var item = this.item(index);
    if (item) {
        //Get the Item Rect
        var rect = this.itemRect(index);
        //adjust for padding
        rect.width -= this.itemPadding();
        var txt = this.getName(item.actor_id);
        var text_x = rect.x + this.itemPadding();
        var text_y = rect.y + Math.round(this.itemPadding() / 2);
        //  txt = this.convertEscapeCharacters(txt);
        this.drawText(txt, text_x, text_y, rect.width);
    }
};

Window_ProfileList.prototype.getName = function (actor_id) {
    if ($gameSystem._progressionSystem.getActor(actor_id)) {
        return $gameActors.actor(actor_id).name();
    }
    else {
        return "Locked";
    }
}

//Define a Draw Item and Draw All Items functions
Window_ProfileList.prototype.maxCols = function () {
    return 1;
};

Window_ProfileList.prototype.itemWidth = function () {
    return this.innerWidth;
};

Window_ProfileList.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
    }
    this.refresh();
}

Window_ProfileList.prototype.processCursorMove = function () {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated("down")) {
            this.cursorDown(Input.isTriggered("down"));
        }
        if (Input.isRepeated("up")) {
            this.cursorUp(Input.isTriggered("up"));
        }
        if (Input.isRepeated("right")) {
            this.cursorRight(Input.isTriggered("right"));
        }
        if (Input.isRepeated("left")) {
            this.cursorLeft(Input.isTriggered("left"));
        }
        if (!this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
            this.cursorPagedown();
        }
        if (!this.isHandled("pageup") && Input.isTriggered("pageup")) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            this.playCursorSound();
        }
        this.updateProfileWindow();
    }
};

Window_ProfileList.prototype.setProfileWindow = function (window) {
    this._profileWindow = window;
}

Window_ProfileList.prototype.updateProfileWindow = function () {

    this._displayProfile = this.item(this.index());
    this.populateProfileFields(this._displayProfile);
    this.paintBust(this._displayProfile.actor_id);
};

//====================================================================================
//                      Drawing Functions
//====================================================================================
Window_ProfileList.prototype.populateProfileFields = function (profile) {


    this._profileWindow.contents.clear();
    var name = "Locked"
    var location = "Unknown";
    var status = "Unknown"
    var desc = "Unknown"
    var curExp = "Unknown";
    var expToNextLevel = "Unknown";
    if ($gameSystem._progressionSystem.getActor(profile.actor_id)) {
        name = $gameActors.actor(profile.actor_id).name();
        var actor = $gameSystem._progressionSystem.getActor(profile.actor_id);
        var tod_index = Setanta.DT.timesOfDay.indexOf($gameSystem._dayTime.getPeriod());
        var day_index = $gameSystem._dayTime.getDayOfWeek();
        location = profile.locations[tod_index][day_index];
        status = this.getActorStatus(actor);
        desc = profile.description;
        curExp = actor.getExp();
        expToNextLevel = Setanta.PS.progressionLevels[actor.getLevel()] - curExp;
    }

    this.drawName(name);
    this.drawStatusAndLocation(status, location);
    this.drawDescription(desc);
    this.drawExp(curExp, expToNextLevel);


};

Window_ProfileList.prototype.getActorStatus = function (actor) {
    //"Level Labels"
    const level_labels = ["Normal", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
    return level_labels[actor.getLevel()];
}

Window_ProfileList.prototype.drawHorzLine = function (y) {
    var lineY = y + this.padding / 2;
    this._profileWindow.contents.paintOpacity = 48;
    this._profileWindow.contents.fillRect(0, lineY, this._profileWindow.contentsWidth() - this.bustWidth(), 2, ColorManager.normalColor());
    this._profileWindow.contents.paintOpacity = 255;
    return lineY + 8;
};

Window_ProfileList.prototype.bustWidth = function () {
    return 300;
}

Window_ProfileList.prototype.nameY = function () {
    return this.padding;
};

Window_ProfileList.prototype.statusY = function () {
    return (2 * this.padding) + this.nameFontSize() + 8;
};

Window_ProfileList.prototype.descriptionY = function () {
    return (2 * this.padding) + this.nameFontSize() + 140;
};

Window_ProfileList.prototype.expY = function () {
    return this.descriptionY() + 200;
}

Window_ProfileList.prototype.nameFontSize = function () {
    return 48;
};

Window_ProfileList.prototype.statusFontSize = function () {
    return 24;
};

Window_ProfileList.prototype.locationFontSize = function () {
    return 24;
};

Window_ProfileList.prototype.descriptionLabelFontSize = function () {
    return 28;
};

Window_ProfileList.prototype.descriptionFontSize = function () {
    return 20;
};

Window_ProfileList.prototype.expFontSize = function () {
    return 24;
};

Window_ProfileList.prototype.drawName = function (name) {

    this._profileWindow.contents.fontSize = this.nameFontSize();
    var y = this.nameY();
    this._profileWindow.drawText(name, this.padding, y, this._profileWindow.contentsWidth() - this.bustWidth(), 'left');

    this.drawHorzLine(y + this.nameFontSize());

};

Window_ProfileList.prototype.drawStatusAndLocation = function (status, location) {
    var y = this.statusY();
    this._profileWindow.contents.fontSize = this.statusFontSize();
    this._profileWindow.drawText("Status: " + status, this.padding, y, this._profileWindow.contentsWidth() - this.bustWidth(), 'left');

    y += 24 + this.padding;
    if (location === '-' || location === "") location = "Unknown";
    this._profileWindow.drawText("Location: " + location, this.padding, y, this._profileWindow.contentsWidth() - this.bustWidth(), 'left');

};

Window_ProfileList.prototype.drawDescription = function (desc) {
    var y = this.descriptionY();

    this._profileWindow.contents.fontSize = this.descriptionLabelFontSize();
    this._profileWindow.drawText("Description", this.padding, y, this._profileWindow.contentsWidth() - this.bustWidth(), 'left');

    y += 36;
    this._profileWindow.contents.fontSize = this.descriptionFontSize();
    var lines = this.convertEscapeCharacters(desc).split("\n");
    for (line of lines) {
        this._profileWindow.drawText(line, this.padding, y, this._profileWindow.contentsWidth() - this.bustWidth(), 'left');
        y += 18 + this.padding;
    }
};

Window_ProfileList.prototype.drawExp = function (curExp, expToNextLevel) {
    var y = this.expY();
    this._profileWindow.contents.fontSize = this.expFontSize();
    this._profileWindow.drawText("Current Exp: " + curExp, this.padding, y, this._profileWindow.contentsWidth() - this.bustWidth(), 'left');

    y += 48 + this.padding;
    this._profileWindow.drawText("Exp to Next Level: " + expToNextLevel, this.padding, y, this._profileWindow.contentsWidth() - this.bustWidth(), 'left');

}

Window_ProfileList.prototype.paintBust = function (actor_id) {
    var actor = $gameSystem._progressionSystem.getActor(actor_id);
    this._profileWindow._bustImg.update(actor, false);
}

Window_ProfileList.prototype.createBustRect = function () {
    var rw = this.bustWidth();
    var rh = Graphics.boxHeight - (this.nameY() + this.padding / 2 + this.nameFontSize());
    var rx = Graphics.boxWidth - this.width - this.bustWidth() - 200;
    var ry = this.nameY() + 2 * this.padding + this.nameFontSize();

    return new Rectangle(rx, ry, rw, rh);

}
//====================================================================================
//                      Bust Image Functions
//====================================================================================

function Sprite_Status() {
    this.initialize.apply(this, arguments);
};

Sprite_Status.prototype = Object.create(Sprite.prototype);
Sprite_Status.prototype.constructor = Sprite_Status;

Sprite_Status.prototype.initialize = function (rect) {
    Sprite.prototype.initialize.call(this);
    this.name = "";
    this.update();
    this.x = (Graphics.boxWidth - 100);
    this.y = rect.y;
    this.width = 535;
    this.height = rect.height;
    this.actor = null;
};

Sprite_Status.prototype.update = function (newActor = null, automaticCall = true) {
    Sprite.prototype.update.call(this);
    this.controlBitmap(newActor, automaticCall);
};

Sprite_Status.prototype.loadBitmap = function (actor) {
    
    var img_name = this.getBustName(actor)

    var img;
    img = ImageManager.loadPicture(img_name);
    if (img.isReady()) {
        if (this.bitmap) {
            this.bitmap = null;
        };
        this.bitmap = img;
        this.name = img_name;
        this.opacity = 255;
        // //Mirror Image
        this.x = (Graphics.boxWidth - 100);
        this.scale.x = -1;
    }
};

Sprite_Status.prototype.getBustName = function (actor) {

    var name = "silhouette";
    if (actor) {
        var outfit = actor.getOutfit();
        var state = actor.getState();
        var index = 1;
        var actor_name = $gameActors.actor(actor._actor_id).name().toLowerCase();

        name = actor_name + '_base' + '/' + outfit + '/' + state + '/' + index;
    }

    return name;
};

Sprite_Status.prototype.controlBitmap = function (actor, callFromUpdate = false) {

    if (!callFromUpdate) {
        this.actor = actor;
    }

    if (this.name !== this.getBustName(actor)) this.loadBitmap(this.actor);

};

/**
 * TODO: Implement Travel and Summon Switches
 *  
 * To do this, a number of things have to be present and known. Firstly, If the player has the 'Summon' or 'Travel' powers
 * unlocked. Second, for Travel, the Characters location MUST be known
 * 
 * This is done per character, so the checks will be made on an update call.
 * Those powers have not been defined yet, so I am leaving it un-finished for now.
 * 
 * 
 */